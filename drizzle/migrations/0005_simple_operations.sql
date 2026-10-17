ALTER TABLE public.bookings
  ADD COLUMN payment_method text NOT NULL DEFAULT 'cash'
    CHECK (payment_method IN ('cash', 'transfer')),
  ADD COLUMN payment_status text NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'reported', 'paid'));

CREATE TABLE public.service_pricing (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  standard_price integer NOT NULL DEFAULT 120000 CHECK (standard_price >= 0),
  kitchen_price integer NOT NULL DEFAULT 150000 CHECK (kitchen_price >= 0),
  urgent_fee_1_2 integer NOT NULL DEFAULT 20000 CHECK (urgent_fee_1_2 >= 0),
  urgent_fee_3_4 integer NOT NULL DEFAULT 35000 CHECK (urgent_fee_3_4 >= 0),
  urgent_fee_5_plus integer NOT NULL DEFAULT 50000 CHECK (urgent_fee_5_plus >= 0),
  bank_name text NOT NULL DEFAULT '',
  bank_account text NOT NULL DEFAULT '',
  bank_account_holder text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.service_pricing (id) VALUES (true);
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.service_pricing TO anon, authenticated;
GRANT UPDATE ON public.service_pricing TO authenticated;

CREATE POLICY "Anyone can view service pricing" ON public.service_pricing
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can update service pricing" ON public.service_pricing
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_booking_price()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  pricing public.service_pricing%ROWTYPE;
  urgent_fee integer := 0;
BEGIN
  SELECT * INTO STRICT pricing FROM public.service_pricing WHERE id = true;

  IF NEW.urgency = 'urgent' THEN
    urgent_fee := CASE
      WHEN NEW.rooms <= 2 THEN pricing.urgent_fee_1_2
      WHEN NEW.rooms <= 4 THEN pricing.urgent_fee_3_4
      ELSE pricing.urgent_fee_5_plus
    END;
  END IF;

  NEW.price := (CASE
    WHEN NEW.room_type = 'kitchen' THEN pricing.kitchen_price
    ELSE pricing.standard_price
  END * GREATEST(NEW.rooms, 1)) + urgent_fee;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_booking_price
  BEFORE INSERT OR UPDATE OF rooms, room_type, urgency, price ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_booking_price();

CREATE OR REPLACE FUNCTION public.guard_booking_payment_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.payment_status <> 'pending' THEN
      RAISE EXCEPTION 'Payment status must start as pending';
    END IF;
  ELSE
    IF NEW.payment_method IS DISTINCT FROM OLD.payment_method
      AND (auth.uid() <> OLD.host_id OR OLD.payment_status <> 'pending')
      AND NOT public.has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only the host can change a pending payment method';
    END IF;

    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status
      AND NOT public.has_role(auth.uid(), 'admin')
      AND NOT (
        auth.uid() = OLD.host_id
        AND OLD.payment_method = 'transfer'
        AND NEW.payment_method = 'transfer'
        AND OLD.payment_status = 'pending'
        AND NEW.payment_status = 'reported'
      ) THEN
      RAISE EXCEPTION 'Only an admin can confirm a payment';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_booking_payment_status
  BEFORE INSERT OR UPDATE OF payment_status, payment_method ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.guard_booking_payment_status();

CREATE POLICY "Admin can update all bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.cleaner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  work_experience text NOT NULL DEFAULT '',
  availability text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cleaner_applications ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.cleaner_applications TO authenticated;

CREATE POLICY "Users can view own cleaner application" ON public.cleaner_applications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can submit own cleaner application" ON public.cleaner_applications
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'pending'
    AND reviewed_by IS NULL
    AND reviewed_at IS NULL
  );
CREATE POLICY "Admin can view all cleaner applications" ON public.cleaner_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role text;
BEGIN
  INSERT INTO public.profiles (id, phone, full_name, property_name, area)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'property_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'area', '')
  )
  ON CONFLICT (id) DO NOTHING;

  requested_role := NEW.raw_user_meta_data ->> 'role';

  IF requested_role = 'cleaner' THEN
    INSERT INTO public.cleaner_applications (user_id, work_experience, availability)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'work_experience', ''),
      COALESCE(NEW.raw_user_meta_data ->> 'availability', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'host')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.review_cleaner_application(_application_id uuid, _approve boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  application_user_id uuid;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can review cleaner applications';
  END IF;

  SELECT user_id INTO application_user_id
  FROM public.cleaner_applications
  WHERE id = _application_id AND status = 'pending'
  FOR UPDATE;

  IF application_user_id IS NULL THEN
    RAISE EXCEPTION 'Pending cleaner application not found';
  END IF;

  UPDATE public.cleaner_applications
  SET status = CASE WHEN _approve THEN 'approved' ELSE 'rejected' END,
      reviewed_by = auth.uid(),
      reviewed_at = now()
  WHERE id = _application_id;

  IF _approve THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (application_user_id, 'cleaner')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.review_cleaner_application(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_cleaner_application(uuid, boolean) TO authenticated;
