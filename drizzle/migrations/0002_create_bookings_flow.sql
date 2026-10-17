CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  host_id uuid NOT NULL,
  cleaner_id uuid,
  cleaner_name text,
  property_name text NOT NULL,
  property_type text NOT NULL DEFAULT 'homestay',
  area text NOT NULL DEFAULT 'trung_tam',
  address text NOT NULL,
  phone text NOT NULL,
  rooms integer NOT NULL DEFAULT 1,
  room_type text NOT NULL DEFAULT 'standard',
  service_date date NOT NULL DEFAULT CURRENT_DATE,
  time_slot text NOT NULL DEFAULT '13-14',
  urgency text NOT NULL DEFAULT 'normal',
  addons text[] NOT NULL DEFAULT '{}',
  note text,
  price integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'searching',
  checklist_done text[] NOT NULL DEFAULT '{}',
  photo_before text,
  photo_after text,
  accepted_at timestamptz,
  photo_sent_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Host can insert own bookings" ON public.bookings
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host can view own bookings" ON public.bookings
  FOR SELECT TO authenticated USING (auth.uid() = host_id);
CREATE POLICY "Host can update own bookings" ON public.bookings
  FOR UPDATE TO authenticated USING (auth.uid() = host_id) WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Cleaner can view open and own jobs" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'cleaner') AND (cleaner_id = auth.uid() OR (cleaner_id IS NULL AND status = 'searching')));
CREATE POLICY "Cleaner can claim and update own jobs" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'cleaner') AND (cleaner_id = auth.uid() OR (cleaner_id IS NULL AND status = 'searching')))
  WITH CHECK (public.has_role(auth.uid(), 'cleaner') AND cleaner_id = auth.uid());

CREATE INDEX bookings_host_idx ON public.bookings (host_id, created_at DESC);
CREATE INDEX bookings_open_idx ON public.bookings (status, created_at DESC);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  host_id uuid NOT NULL,
  cleaner_id uuid,
  rating integer NOT NULL DEFAULT 5,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Host can insert own reviews" ON public.reviews
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host can view own reviews" ON public.reviews
  FOR SELECT TO authenticated USING (auth.uid() = host_id);
CREATE POLICY "Cleaner can view reviews about them" ON public.reviews
  FOR SELECT TO authenticated USING (auth.uid() = cleaner_id);
