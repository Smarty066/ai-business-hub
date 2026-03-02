import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wallet, TrendingUp, TrendingDown, Plus, Sparkles, DollarSign,
  PieChart, ArrowUpRight, ArrowDownRight, Loader2, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell,
} from "recharts";
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  marketing: "hsl(173, 80%, 40%)",
  operations: "hsl(199, 89%, 48%)",
  salaries: "hsl(142, 71%, 45%)",
  software: "hsl(38, 92%, 50%)",
  services: "hsl(262, 83%, 58%)",
  other: "hsl(215, 20%, 65%)",
};

export default function Budget() {
  const { user } = useAuth();
  const { symbol, formatAmount, formatCompact } = useCurrency();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("transaction_date", { ascending: false })
        .limit(100);
      return (data as Transaction[]) || [];
    },
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      if (!formData.description.trim() || !formData.amount || !formData.category) {
        throw new Error("Please fill all fields");
      }
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        transaction_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
      toast.success("Transaction added successfully!");
      setFormData({ description: "", amount: "", type: "expense", category: "" });
    },
    onError: (err: any) => toast.error(err.message || "Failed to add transaction"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
      toast.success("Transaction deleted");
    },
  });

  // Compute stats from real data
  const totalIncome = useMemo(() =>
    transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );
  const totalExpenses = useMemo(() =>
    transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
    [transactions]
  );
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : "0.0";

  // Monthly chart data from real transactions
  const monthlyData = useMemo(() => {
    const months: { month: string; income: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const start = startOfMonth(d);
      const end = endOfMonth(d);
      const monthTx = transactions.filter((t) => {
        const td = new Date(t.transaction_date);
        return td >= start && td <= end;
      });
      months.push({
        month: format(d, "MMM"),
        income: monthTx.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
        expenses: monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
      });
    }
    return months;
  }, [transactions]);

  // Category breakdown from real data
  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      const cat = t.category || "other";
      cats[cat] = (cats[cat] || 0) + Number(t.amount);
    });
    return Object.entries(cats).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.other,
    }));
  }, [transactions]);

  // Recent transactions (last 10)
  const recentTransactions = transactions.slice(0, 10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-warning" />
            </div>
            <h1 className="text-3xl font-bold">Budget & Finance</h1>
          </div>
          <CurrencySelector />
        </div>
        <p className="text-muted-foreground mt-2">
          Track expenses, analyze spending patterns, and get AI-powered insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-strong border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-2xl font-bold">{formatCompact(totalIncome)}</p>
            <p className="text-sm text-muted-foreground">Total Income</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-2xl font-bold">{formatCompact(totalExpenses)}</p>
            <p className="text-sm text-muted-foreground">Total Expenses</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{formatCompact(netSavings)}</p>
            <p className="text-sm text-muted-foreground">Net Savings</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <PieChart className="h-5 w-5 text-warning" />
              <Badge className="bg-warning/10 text-warning">{savingsRate}%</Badge>
            </div>
            <p className="text-2xl font-bold">{savingsRate}%</p>
            <p className="text-sm text-muted-foreground">Savings Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Charts */}
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Income vs Expenses</CardTitle>
              <CardDescription>6-month trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {transactions.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Add transactions to see your trend chart
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                        formatter={(value: number) => formatAmount(value)}
                      />
                      <Line type="monotone" dataKey="income" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)" }} />
                      <Line type="monotone" dataKey="expenses" stroke="hsl(0, 63%, 51%)" strokeWidth={2} dot={{ fill: "hsl(0, 63%, 51%)" }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No transactions yet</p>
                  <p className="text-sm">Add your first transaction to start tracking finances.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 group">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                          {transaction.type === "income" ? (
                            <ArrowUpRight className="h-5 w-5 text-success" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.category} • {format(new Date(transaction.transaction_date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>
                          {transaction.type === "income" ? "+" : "-"}{formatAmount(Math.abs(Number(transaction.amount)))}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteMutation.mutate(transaction.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Add Transaction */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Tabs value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="e.g., Office supplies" maxLength={200} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({symbol})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{symbol}</span>
                    <Input id="amount" type="number" placeholder="0.00" className="pl-10" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="salaries">Salaries</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={addMutation.isPending}>
                  {addMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Transaction
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          {categoryData.length > 0 && (
            <Card className="glass-strong border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(value: number) => formatAmount(value)} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-muted-foreground">{formatAmount(category.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
