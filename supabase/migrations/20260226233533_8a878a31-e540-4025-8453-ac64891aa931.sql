CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_full_name TEXT;
  v_business_name TEXT;
  v_phone TEXT;
BEGIN
  v_full_name := COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'full_name', 1, 255), '');
  v_business_name := COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'business_name', 1, 255), '');
  v_phone := COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'phone', 1, 20), '');

  -- Validate phone format if provided
  IF v_phone != '' AND v_phone !~ '^[0-9+\-\s()]*$' THEN
    v_phone := '';
  END IF;

  INSERT INTO public.profiles (user_id, full_name, business_name, phone)
  VALUES (NEW.id, v_full_name, v_business_name, v_phone);

  RETURN NEW;
END;
$$;