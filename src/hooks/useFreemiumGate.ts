import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "freemium_usage";
const FREE_LIMIT = 5;

// Testing mode: set to true to give everyone paid access
const TESTING_MODE = false;

// Features available on the free plan
const FREE_FEATURES = ["converter", "notes", "calculator", "affiliate"];

interface UsageData {
  count: number;
  resetMonth: string; // "YYYY-MM"
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function getUsageData(): UsageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: UsageData = JSON.parse(raw);
      if (parsed.resetMonth !== getCurrentMonth()) {
        return { count: 0, resetMonth: getCurrentMonth() };
      }
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return { count: 0, resetMonth: getCurrentMonth() };
}

function saveUsageData(data: UsageData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useFreemiumGate() {
  const { profile, user } = useAuth();
  const [usage, setUsage] = useState<UsageData>(getUsageData);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);

  useEffect(() => {
    const sync = () => setUsage(getUsageData());
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  // Check subscription status from database
  useEffect(() => {
    if (!user?.id) return;
    const checkSubscription = async () => {
      const { data } = await supabase
        .from("subscriptions" as any)
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .in("status", ["active", "trialing"])
        .maybeSingle();
      if (data && (data as any).current_period_end) {
        const endDate = new Date((data as any).current_period_end);
        setIsPaidUser(endDate > new Date());
      } else {
        setIsPaidUser(false);
      }
    };
    checkSubscription();
  }, [user?.id]);

  // Full access: testing mode OR paid subscription
  const hasFullAccess = TESTING_MODE || isPaidUser;

  const remaining = hasFullAccess ? FREE_LIMIT : Math.max(0, FREE_LIMIT - usage.count);
  const isLimitReached = hasFullAccess ? false : usage.count >= FREE_LIMIT;

  const tryConsume = useCallback((): boolean => {
    if (hasFullAccess) return true;
    const current = getUsageData();
    if (current.count >= FREE_LIMIT) {
      setShowUpgrade(true);
      return false;
    }
    const updated = { ...current, count: current.count + 1 };
    saveUsageData(updated);
    setUsage(updated);
    return true;
  }, [hasFullAccess]);

  const closeUpgrade = useCallback(() => setShowUpgrade(false), []);
  const openUpgrade = useCallback(() => setShowUpgrade(true), []);

  return {
    used: usage.count,
    remaining,
    limit: FREE_LIMIT,
    isLimitReached,
    showUpgrade,
    closeUpgrade,
    openUpgrade,
    tryConsume,
    isFreeFeature: (feature: string) => FREE_FEATURES.includes(feature),
    isTestingMode: TESTING_MODE,
    isPaidUser,
    hasFullAccess,
  };
}
