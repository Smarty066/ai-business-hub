
-- Add referred_name and referred_phone to referrals table
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS referred_name text DEFAULT '';
ALTER TABLE public.referrals ADD COLUMN IF NOT EXISTS referred_phone text DEFAULT '';

-- Create trigger function to handle referral tracking on new user signup
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  ref_code text;
  referrer_user_id uuid;
BEGIN
  -- Get referral code from the auth.users metadata
  SELECT raw_user_meta_data->>'referral_code' INTO ref_code
  FROM auth.users WHERE id = NEW.user_id;
  
  IF ref_code IS NOT NULL AND ref_code != '' THEN
    -- Find referrer by code (code is first 8 chars of user_id uppercased)
    SELECT id INTO referrer_user_id
    FROM auth.users
    WHERE UPPER(LEFT(id::text, 8)) = UPPER(ref_code)
    LIMIT 1;
    
    IF referrer_user_id IS NOT NULL THEN
      INSERT INTO public.referrals (
        referrer_id, referred_id, referral_code, referred_name, referred_phone,
        signup_earned, total_earned, status
      ) VALUES (
        referrer_user_id, NEW.user_id, ref_code, NEW.full_name, NEW.phone,
        1000, 1000, 'confirmed'
      ) ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles insert
DROP TRIGGER IF EXISTS on_profile_created_referral ON public.profiles;
CREATE TRIGGER on_profile_created_referral
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_signup();
