-- Fix search_path on mask_phone function
CREATE OR REPLACE FUNCTION public.mask_phone(phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF phone IS NULL OR length(phone) < 4 THEN
    RETURN '****';
  END IF;
  RETURN repeat('*', length(phone) - 4) || right(phone, 4);
END;
$$;