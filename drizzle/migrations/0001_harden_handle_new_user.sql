CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _phone text;
BEGIN
  _phone := COALESCE(NEW.raw_user_meta_data ->> 'phone', '');

  BEGIN
    INSERT INTO public.profiles (id, phone, full_name, property_name, area)
    VALUES (
      NEW.id,
      _phone,
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'property_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'area', '')
    );
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  _role := COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'role', ''), 'host')::public.app_role;
  IF _role = 'admin' THEN
    _role := 'host';
  END IF;

  BEGIN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  RETURN NEW;
END;
$$;