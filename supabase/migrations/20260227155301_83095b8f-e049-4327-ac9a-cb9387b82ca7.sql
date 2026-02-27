-- 1. Add admin audit logging for profile access
CREATE OR REPLACE FUNCTION public.log_admin_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin') THEN
    INSERT INTO public.activity_log (user_id, user_email, action, details)
    SELECT auth.uid(), 
           (SELECT email FROM auth.users WHERE id = auth.uid()),
           'admin_profile_view',
           'Admin accessed user profiles';
  END IF;
  RETURN NULL;
END;
$$;

-- 2. Create a function to mask phone numbers
CREATE OR REPLACE FUNCTION public.mask_phone(phone text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF phone IS NULL OR length(phone) < 4 THEN
    RETURN '****';
  END IF;
  RETURN repeat('*', length(phone) - 4) || right(phone, 4);
END;
$$;

-- 3. Allow users to view their own activity logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own activity logs' AND tablename = 'activity_log'
  ) THEN
    CREATE POLICY "Users can view own activity logs"
      ON public.activity_log
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END;
$$;