-- 1. Replace referred_phone with masked version using a view approach
-- Create a secure view that masks phone numbers
CREATE OR REPLACE VIEW public.referrals_safe AS
SELECT 
  id, referrer_id, referred_id, referral_code, 
  referred_name, 
  public.mask_phone(referred_phone) as referred_phone,
  signup_earned, subscription_earned, total_earned, withdrawn,
  status, created_at
FROM public.referrals;

-- 2. Prevent users from modifying/deleting activity logs
CREATE POLICY "Nobody can update activity logs"
  ON public.activity_log
  FOR UPDATE
  USING (false);

CREATE POLICY "Nobody can delete activity logs"
  ON public.activity_log
  FOR DELETE
  USING (false);