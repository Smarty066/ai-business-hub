import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "freemium_usage";
const FREE_LIMIT = 5;

// Testing mode: set to true to give everyone paid access
const TESTING_MODE = true;

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
  const [usage, setUsage] = useState<UsageData>(getUsageData);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const sync = () => setUsage(getUsageData());
    window.addEventListener("focus", sync);
    return () => window.removeEventListener("focus", sync);
  }, []);

  // In testing mode, everyone has full access
  const remaining = TESTING_MODE ? FREE_LIMIT : Math.max(0, FREE_LIMIT - usage.count);
  const isLimitReached = TESTING_MODE ? false : usage.count >= FREE_LIMIT;

  const tryConsume = useCallback((): boolean => {
    if (TESTING_MODE) return true;
    const current = getUsageData();
    if (current.count >= FREE_LIMIT) {
      setShowUpgrade(true);
      return false;
    }
    const updated = { ...current, count: current.count + 1 };
    saveUsageData(updated);
    setUsage(updated);
    return true;
  }, []);

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
  };
}
