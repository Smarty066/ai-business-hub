import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, TrendingUp, Search, Star, StarOff } from "lucide-react";

const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
  { code: "XOF", name: "West African CFA", symbol: "CFA", flag: "🌍" },
  { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬" },
  { code: "RWF", name: "Rwandan Franc", symbol: "FRw", flag: "🇷🇼" },
];

// Approximate rates vs USD (for demo — real app would use live API)
const RATES_VS_USD: Record<string, number> = {
  USD: 1,
  NGN: 1550,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.1,
  ZAR: 18.6,
  GHS: 14.8,
  KES: 153,
  EGP: 30.9,
  AED: 3.67,
  SAR: 3.75,
  BRL: 4.97,
  MXN: 17.15,
  CHF: 0.88,
  SEK: 10.42,
  KRW: 1320,
  SGD: 1.34,
  THB: 35.2,
  TRY: 30.2,
  PLN: 4.02,
  XOF: 603,
  TZS: 2520,
  UGX: 3800,
  RWF: 1260,
};

const POPULAR_PAIRS = [
  { from: "USD", to: "NGN" },
  { from: "GBP", to: "NGN" },
  { from: "EUR", to: "NGN" },
  { from: "USD", to: "EUR" },
  { from: "USD", to: "GBP" },
  { from: "CAD", to: "NGN" },
];

function convert(amount: number, from: string, to: string): number {
  const fromRate = RATES_VS_USD[from] || 1;
  const toRate = RATES_VS_USD[to] || 1;
  return (amount / fromRate) * toRate;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const numericAmount = parseFloat(amount) || 0;
  const converted = useMemo(
    () => convert(numericAmount, fromCurrency, toCurrency),
    [numericAmount, fromCurrency, toCurrency]
  );
  const rate = useMemo(
    () => convert(1, fromCurrency, toCurrency),
    [fromCurrency, toCurrency]
  );
  const inverseRate = useMemo(
    () => convert(1, toCurrency, fromCurrency),
    [fromCurrency, toCurrency]
  );

  const fromInfo = CURRENCIES.find((c) => c.code === fromCurrency)!;
  const toInfo = CURRENCIES.find((c) => c.code === toCurrency)!;

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const filterCurrencies = (search: string) =>
    CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
    );

  const formatConverted = (value: number, code: string) => {
    const info = CURRENCIES.find((c) => c.code === code);
    if (value >= 1000000) return `${info?.symbol}${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${info?.symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `${info?.symbol}${value.toFixed(value < 1 ? 6 : 2)}`;
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Currency Converter</h1>
        </div>
        <p className="text-muted-foreground">
          Check live exchange rates for currencies worldwide. Perfect for international business pricing.
        </p>
      </div>

      {/* Converter Card */}
      <Card className="glass-strong border-0 mb-8 animate-fade-in">
        <CardContent className="p-6 sm:p-8">
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
            {/* From */}
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{fromInfo.flag}</span>
                      <span className="font-medium">{fromCurrency}</span>
                      <span className="text-muted-foreground text-xs hidden sm:inline">
                        — {fromInfo.name}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search currency..."
                        className="pl-8 h-8 text-sm"
                        value={searchFrom}
                        onChange={(e) => setSearchFrom(e.target.value)}
                      />
                    </div>
                  </div>
                  {filterCurrencies(searchFrom).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.code}</span>
                        <span className="text-muted-foreground text-xs">— {c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl font-bold h-14 text-center"
                placeholder="0.00"
                min="0"
              />
            </div>

            {/* Swap */}
            <div className="flex justify-center py-2">
              <Button
                variant="outline"
                size="icon"
                onClick={swap}
                className="rounded-full h-12 w-12 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all"
              >
                <ArrowLeftRight className="h-5 w-5 text-primary" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{toInfo.flag}</span>
                      <span className="font-medium">{toCurrency}</span>
                      <span className="text-muted-foreground text-xs hidden sm:inline">
                        — {toInfo.name}
                      </span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search currency..."
                        className="pl-8 h-8 text-sm"
                        value={searchTo}
                        onChange={(e) => setSearchTo(e.target.value)}
                      />
                    </div>
                  </div>
                  {filterCurrencies(searchTo).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span className="font-medium">{c.code}</span>
                        <span className="text-muted-foreground text-xs">— {c.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="h-14 rounded-lg bg-secondary/50 flex items-center justify-center text-2xl font-bold text-primary">
                {formatConverted(converted, toCurrency)}
              </div>
            </div>
          </div>

          {/* Rate Info */}
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span>
                1 {fromCurrency} = {rate.toFixed(rate < 1 ? 6 : 2)} {toCurrency}
              </span>
            </div>
            <span className="text-border">•</span>
            <span>
              1 {toCurrency} = {inverseRate.toFixed(inverseRate < 1 ? 6 : 2)} {fromCurrency}
            </span>
            <Badge variant="outline" className="ml-auto text-xs">
              Approximate rates
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Popular Pairs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-warning" />
          Popular Conversions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_PAIRS.map((pair) => {
            const r = convert(1, pair.from, pair.to);
            const fromC = CURRENCIES.find((c) => c.code === pair.from)!;
            const toC = CURRENCIES.find((c) => c.code === pair.to)!;
            return (
              <Card
                key={`${pair.from}-${pair.to}`}
                className="glass-strong border-0 cursor-pointer hover:border-primary/30 transition-all"
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                  setAmount("1");
                }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{fromC.flag}</span>
                    <span className="text-sm font-medium">
                      1 {pair.from} → {pair.to}
                    </span>
                    <span className="text-lg">{toC.flag}</span>
                  </div>
                  <span className="font-bold text-primary">
                    {toC.symbol}{r.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Rates vs Selected */}
      <Card className="glass-strong border-0 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg">
            All Rates — 1 {fromCurrency} ({fromInfo.symbol})
          </CardTitle>
          <CardDescription>
            How much is 1 {fromInfo.name} worth in other currencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {CURRENCIES.filter((c) => c.code !== fromCurrency).map((c) => {
              const r = convert(1, fromCurrency, c.code);
              return (
                <div
                  key={c.code}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setToCurrency(c.code);
                    setAmount("1");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span className="text-sm font-medium">{c.code}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {c.symbol}{r.toLocaleString(undefined, { maximumFractionDigits: r < 1 ? 6 : 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}