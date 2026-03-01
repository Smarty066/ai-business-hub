
-- 1. Add input validation to SECURITY DEFINER functions

-- Harden handle_new_user with stricter validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_full_name TEXT;
  v_business_name TEXT;
  v_phone TEXT;
BEGIN
  -- Validate input exists
  IF NEW.raw_user_meta_data IS NULL THEN
    v_full_name := '';
    v_business_name := '';
    v_phone := '';
  ELSE
    v_full_name := COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'full_name', 1, 255), '');
    v_business_name := COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'business_name', 1, 255), '');
    v_phone := COALESCE(SUBSTRING(NEW.raw_user_meta_data->>'phone', 1, 20), '');
  END IF;

  -- Strip any HTML/script tags from text inputs
  v_full_name := regexp_replace(v_full_name, '<[^>]*>', '', 'g');
  v_business_name := regexp_replace(v_business_name, '<[^>]*>', '', 'g');

  -- Validate phone format if provided
  IF v_phone != '' AND v_phone !~ '^[0-9+\-\s()]*$' THEN
    v_phone := '';
  END IF;

  INSERT INTO public.profiles (user_id, full_name, business_name, phone)
  VALUES (NEW.id, v_full_name, v_business_name, v_phone);

  RETURN NEW;
END;
$function$;

-- Harden handle_referral_signup with input validation
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  ref_code text;
  referrer_user_id uuid;
  v_full_name text;
  v_phone text;
BEGIN
  -- Get referral code from the auth.users metadata
  SELECT raw_user_meta_data->>'referral_code' INTO ref_code
  FROM auth.users WHERE id = NEW.user_id;
  
  -- Validate referral code format (alphanumeric, max 8 chars)
  IF ref_code IS NULL OR ref_code = '' OR length(ref_code) > 8 OR ref_code !~ '^[A-Za-z0-9]+$' THEN
    RETURN NEW;
  END IF;

  -- Find referrer by code
  SELECT id INTO referrer_user_id
  FROM auth.users
  WHERE UPPER(LEFT(id::text, 8)) = UPPER(ref_code)
  LIMIT 1;
  
  IF referrer_user_id IS NOT NULL THEN
    -- Sanitize inputs
    v_full_name := COALESCE(SUBSTRING(regexp_replace(NEW.full_name, '<[^>]*>', '', 'g'), 1, 255), '');
    v_phone := COALESCE(SUBSTRING(NEW.phone, 1, 20), '');
    
    IF v_phone != '' AND v_phone !~ '^[0-9+\-\s()]*$' THEN
      v_phone := '';
    END IF;

    INSERT INTO public.referrals (
      referrer_id, referred_id, referral_code, referred_name, referred_phone,
      signup_earned, total_earned, status
    ) VALUES (
      referrer_user_id, NEW.user_id, ref_code, v_full_name, v_phone,
      1000, 1000, 'confirmed'
    ) ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 2. Add RLS policies to affiliate-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('affiliate-images', 'affiliate-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Allow authenticated users to upload to affiliate-images
CREATE POLICY "Authenticated users can upload affiliate images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'affiliate-images');

-- Allow public read access to affiliate images  
CREATE POLICY "Public read access for affiliate images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'affiliate-images');

-- Only owners or admins can delete affiliate images
CREATE POLICY "Users can delete own affiliate images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'affiliate-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Add server-side admin check via RLS on admin-only tables
-- Create a policy that restricts activity_log reads to admins only
CREATE POLICY "Only admins can read activity logs"
ON public.activity_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Ensure admin page data is protected at DB level
CREATE POLICY "Only admins can read user roles"
ON public.user_roles FOR SELECT
USING (
  user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')
);
