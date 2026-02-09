import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type CurrencyCode = "NGN" | "USD";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  symbol: string;
  formatAmount: (amount: number) => string;
  formatCompact: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_KEY = "preferred-currency";

const currencyConfig: Record<CurrencyCode, { symbol: string; locale: string }> = {
  NGN: { symbol: "₦", locale: "en-NG" },
  USD: { symbol: "$", locale: "en-US" },
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const stored = localStorage.getItem(CURRENCY_KEY);
    return stored === "USD" ? "USD" : "NGN";
  });

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem(CURRENCY_KEY, code);
  }, []);

  const config = currencyConfig[currency];

  const formatAmount = useCallback(
    (amount: number) => `${config.symbol}${amount.toLocaleString(config.locale)}`,
    [config]
  );

  const formatCompact = useCallback(
    (amount: number) => {
      if (Math.abs(amount) >= 1_000_000) {
        return `${config.symbol}${(amount / 1_000_000).toFixed(1)}M`;
      }
      if (Math.abs(amount) >= 1_000) {
        return `${config.symbol}${(amount / 1_000).toFixed(0)}K`;
      }
      return `${config.symbol}${amount.toLocaleString(config.locale)}`;
    },
    [config]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, symbol: config.symbol, formatAmount, formatCompact }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

/** Fixed pricing amounts for each currency */
export const PRICING = {
  NGN: { monthly: 2500, annual: 25000 },
  USD: { monthly: 3, annual: 30 },
} as const;
