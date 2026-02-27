-- Fix security definer view by dropping it and using SECURITY INVOKER
DROP VIEW IF EXISTS public.referrals_safe;

CREATE VIEW public.referrals_safe 
WITH (security_invoker = true)
AS
SELECT 
  id, referrer_id, referred_id, referral_code, 
  referred_name, 
  public.mask_phone(referred_phone) as referred_phone,
  signup_earned, subscription_earned, total_earned, withdrawn,
  status, created_at
FROM public.referrals;