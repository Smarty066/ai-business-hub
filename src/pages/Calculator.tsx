import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalcIcon, Percent, TrendingUp, Receipt, DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

// ─── Standard Calculator ─────────────────────
function StandardCalc() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const inputDigit = (digit: string) => {
    if (resetNext) {
      setDisplay(digit);
      setResetNext(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (resetNext) {
      setDisplay("0.");
      setResetNext(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setResetNext(false);
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const percentCalc = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  const handleOperator = (op: string) => {
    if (previous !== null && operator && !resetNext) {
      const result = calculate(parseFloat(previous), parseFloat(display), operator);
      setDisplay(result.toString());
      setPrevious(result.toString());
    } else {
      setPrevious(display);
    }
    setOperator(op);
    setResetNext(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const equals = () => {
    if (previous === null || operator === null) return;
    const result = calculate(parseFloat(previous), parseFloat(display), operator);
    setDisplay(result.toString());
    setPrevious(null);
    setOperator(null);
    setResetNext(true);
  };

  const buttons = [
    { label: "C", action: clear, className: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
    { label: "±", action: toggleSign, className: "bg-secondary text-foreground hover:bg-secondary/80" },
    { label: "%", action: percentCalc, className: "bg-secondary text-foreground hover:bg-secondary/80" },
    { label: "÷", action: () => handleOperator("÷"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "7", action: () => inputDigit("7") },
    { label: "8", action: () => inputDigit("8") },
    { label: "9", action: () => inputDigit("9") },
    { label: "×", action: () => handleOperator("×"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "4", action: () => inputDigit("4") },
    { label: "5", action: () => inputDigit("5") },
    { label: "6", action: () => inputDigit("6") },
    { label: "-", action: () => handleOperator("-"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "1", action: () => inputDigit("1") },
    { label: "2", action: () => inputDigit("2") },
    { label: "3", action: () => inputDigit("3") },
    { label: "+", action: () => handleOperator("+"), className: "bg-primary/10 text-primary hover:bg-primary/20" },
    { label: "0", action: () => inputDigit("0"), className: "col-span-2" },
    { label: ".", action: inputDecimal },
    { label: "=", action: equals, className: "gradient-primary text-primary-foreground hover:opacity-90" },
  ];

  const formatDisplay = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "0";
    if (val.endsWith(".")) return val;
    if (val.includes(".") && val.endsWith("0")) return val;
    if (Math.abs(num) >= 1e12) return num.toExponential(4);
    return num.toLocaleString(undefined, { maximumFractionDigits: 10 });
  };

  return (
    <Card className="glass-strong border-0 max-w-sm mx-auto">
      <CardContent className="p-5">
        {/* Display */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-4">
          {previous && operator && (
            <p className="text-xs text-muted-foreground text-right mb-1">
              {parseFloat(previous).toLocaleString()} {operator}
            </p>
          )}
          <p className="text-3xl font-bold text-right truncate">{formatDisplay(display)}</p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn.label}
              variant="ghost"
              onClick={btn.action}
              className={`h-14 text-lg font-semibold rounded-xl transition-all ${btn.className || "bg-card hover:bg-secondary/80"}`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Business Calculators ──────────────────
function ProfitMarginCalc() {
  const { symbol } = useCurrency();
  const [cost, setCost] = useState("");
  const [selling, setSelling] = useState("");

  const costNum = parseFloat(cost) || 0;
  const sellingNum = parseFloat(selling) || 0;
  const profit = sellingNum - costNum;
  const margin = sellingNum > 0 ? (profit / sellingNum) * 100 : 0;
  const markup = costNum > 0 ? (profit / costNum) * 100 : 0;

  return (
    <Card className="glass-strong border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-success" />
          Profit Margin Calculator
        </CardTitle>
        <CardDescription>Calculate your profit margin and markup percentage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Cost Price ({symbol})</Label>
            <Input type="number" placeholder="0.00" value={cost} onChange={(e) => setCost(e.target.value)} min="0" />
          </div>
          <div className="space-y-2">
            <Label>Selling Price ({symbol})</Label>
            <Input type="number" placeholder="0.00" value={selling} onChange={(e) => setSelling(e.target.value)} min="0" />
          </div>
        </div>
        {costNum > 0 && sellingNum > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className={`text-lg font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                {symbol}{Math.abs(profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground">{profit >= 0 ? "Profit" : "Loss"}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className={`text-lg font-bold ${margin >= 0 ? "text-success" : "text-destructive"}`}>
                {margin.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Margin</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className={`text-lg font-bold ${markup >= 0 ? "text-primary" : "text-destructive"}`}>
                {markup.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Markup</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DiscountCalc() {
  const { symbol } = useCurrency();
  const [original, setOriginal] = useState("");
  const [discount, setDiscount] = useState("");

  const origNum = parseFloat(original) || 0;
  const discNum = parseFloat(discount) || 0;
  const savings = origNum * (discNum / 100);
  const finalPrice = origNum - savings;

  return (
    <Card className="glass-strong border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Percent className="h-4 w-4 text-warning" />
          Discount Calculator
        </CardTitle>
        <CardDescription>Calculate discounted prices for promotions and sales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Original Price ({symbol})</Label>
            <Input type="number" placeholder="0.00" value={original} onChange={(e) => setOriginal(e.target.value)} min="0" />
          </div>
          <div className="space-y-2">
            <Label>Discount (%)</Label>
            <Input type="number" placeholder="10" value={discount} onChange={(e) => setDiscount(e.target.value)} min="0" max="100" />
          </div>
        </div>
        {origNum > 0 && discNum > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-lg font-bold text-warning">{symbol}{savings.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">You Save</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <p className="text-lg font-bold text-primary">{symbol}{finalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Final Price</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TaxCalc() {
  const { symbol } = useCurrency();
  const [price, setPrice] = useState("");
  const [taxRate, setTaxRate] = useState("7.5");

  const priceNum = parseFloat(price) || 0;
  const rateNum = parseFloat(taxRate) || 0;
  const tax = priceNum * (rateNum / 100);
  const total = priceNum + tax;

  return (
    <Card className="glass-strong border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          Tax Calculator
        </CardTitle>
        <CardDescription>Calculate VAT/tax on goods and services (default: 7.5% Nigeria VAT)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price ({symbol})</Label>
            <Input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} min="0" />
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input type="number" placeholder="7.5" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} min="0" />
          </div>
        </div>
        {priceNum > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-lg font-bold text-warning">{symbol}{tax.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Tax Amount</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-primary/10">
              <p className="text-lg font-bold text-primary">{symbol}{total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Total with Tax</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BulkPricingCalc() {
  const { symbol } = useCurrency();
  const [unitCost, setUnitCost] = useState("");
  const [quantity, setQuantity] = useState("");
  const [marginPct, setMarginPct] = useState("30");

  const unitNum = parseFloat(unitCost) || 0;
  const qtyNum = parseInt(quantity) || 0;
  const marginNum = parseFloat(marginPct) || 0;

  const totalCost = unitNum * qtyNum;
  const sellingPerUnit = unitNum / (1 - marginNum / 100);
  const totalRevenue = sellingPerUnit * qtyNum;
  const totalProfit = totalRevenue - totalCost;

  return (
    <Card className="glass-strong border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-success" />
          Bulk Pricing Calculator
        </CardTitle>
        <CardDescription>Set prices for bulk goods with your desired profit margin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Unit Cost ({symbol})</Label>
            <Input type="number" placeholder="0.00" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} min="0" />
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" placeholder="100" value={quantity} onChange={(e) => setQuantity(e.target.value)} min="0" />
          </div>
          <div className="space-y-2">
            <Label>Target Margin (%)</Label>
            <Input type="number" placeholder="30" value={marginPct} onChange={(e) => setMarginPct(e.target.value)} min="0" max="99" />
          </div>
        </div>
        {unitNum > 0 && qtyNum > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-sm font-bold">{symbol}{totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Total Cost</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-sm font-bold text-primary">{symbol}{sellingPerUnit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Sell Per Unit</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-sm font-bold">{symbol}{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-success/10">
              <p className="text-sm font-bold text-success">{symbol}{totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-muted-foreground">Profit</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ──────────────────
export default function CalculatorPage() {
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalcIcon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Business Calculator</h1>
        </div>
        <p className="text-muted-foreground">
          Quick calculations for pricing, margins, tax, and discounts — built for small businesses.
        </p>
      </div>

      <Tabs defaultValue="standard" className="space-y-6">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-5 h-auto gap-1 bg-secondary/50 p-1 rounded-xl">
          <TabsTrigger value="standard" className="text-xs sm:text-sm">
            <CalcIcon className="h-3.5 w-3.5 mr-1.5" />
            Standard
          </TabsTrigger>
          <TabsTrigger value="profit" className="text-xs sm:text-sm">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            Profit
          </TabsTrigger>
          <TabsTrigger value="discount" className="text-xs sm:text-sm">
            <Percent className="h-3.5 w-3.5 mr-1.5" />
            Discount
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs sm:text-sm">
            <Receipt className="h-3.5 w-3.5 mr-1.5" />
            Tax
          </TabsTrigger>
          <TabsTrigger value="bulk" className="text-xs sm:text-sm">
            <DollarSign className="h-3.5 w-3.5 mr-1.5" />
            Bulk
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="animate-fade-in">
          <StandardCalc />
        </TabsContent>

        <TabsContent value="profit" className="animate-fade-in">
          <ProfitMarginCalc />
        </TabsContent>

        <TabsContent value="discount" className="animate-fade-in">
          <DiscountCalc />
        </TabsContent>

        <TabsContent value="tax" className="animate-fade-in">
          <TaxCalc />
        </TabsContent>

        <TabsContent value="bulk" className="animate-fade-in">
          <BulkPricingCalc />
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="glass-strong border-0 mt-8 animate-fade-in">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm mb-3">💡 Quick Business Tips</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-[10px] mt-0.5 flex-shrink-0">Margin</Badge>
              <span>A 30% margin means for every ₦100 in revenue, you keep ₦30 as profit.</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-[10px] mt-0.5 flex-shrink-0">Markup</Badge>
              <span>Markup is based on cost. 50% markup on ₦100 cost = ₦150 selling price.</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-[10px] mt-0.5 flex-shrink-0">VAT</Badge>
              <span>Nigeria VAT is 7.5%. Always factor this into your pricing for compliance.</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-[10px] mt-0.5 flex-shrink-0">Pricing</Badge>
              <span>Price ending in 99 or 95 can increase perceived value (₦4,999 vs ₦5,000).</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}