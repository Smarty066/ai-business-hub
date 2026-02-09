import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Sparkles,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";

const monthlyData = [
  { month: "Jan", income: 8500, expenses: 6200 },
  { month: "Feb", income: 9200, expenses: 5800 },
  { month: "Mar", income: 8800, expenses: 6500 },
  { month: "Apr", income: 9500, expenses: 6100 },
  { month: "May", income: 10200, expenses: 6800 },
  { month: "Jun", income: 11000, expenses: 7200 },
];

const categoryData = [
  { name: "Marketing", value: 2500, color: "hsl(173, 80%, 40%)" },
  { name: "Operations", value: 1800, color: "hsl(199, 89%, 48%)" },
  { name: "Salaries", value: 4500, color: "hsl(142, 71%, 45%)" },
  { name: "Software", value: 800, color: "hsl(38, 92%, 50%)" },
  { name: "Other", value: 600, color: "hsl(215, 20%, 65%)" },
];

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

const recentTransactions: Transaction[] = [
  { id: "1", description: "Client Payment - Project A", amount: 5000, type: "income", category: "Services", date: "Today" },
  { id: "2", description: "Software Subscription", amount: -99, type: "expense", category: "Software", date: "Today" },
  { id: "3", description: "Marketing Campaign", amount: -1500, type: "expense", category: "Marketing", date: "Yesterday" },
  { id: "4", description: "Consulting Fee", amount: 2500, type: "income", category: "Services", date: "Yesterday" },
  { id: "5", description: "Office Supplies", amount: -250, type: "expense", category: "Operations", date: "2 days ago" },
];

const aiInsights = [
  {
    type: "warning",
    title: "Marketing Spend Alert",
    message: "Your marketing expenses are 15% higher than last month. Consider reviewing your ad campaigns for efficiency.",
  },
  {
    type: "success",
    title: "Positive Cash Flow",
    message: "Great job! You've maintained positive cash flow for 6 consecutive months with an average savings rate of 23%.",
  },
  {
    type: "tip",
    title: "Savings Opportunity",
    message: "Based on your spending patterns, you could save 400/month by consolidating your software subscriptions.",
  },
];

export default function Budget() {
  const { symbol, formatAmount, formatCompact } = useCurrency();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Transaction added successfully!");
    setFormData({ description: "", amount: "", type: "expense", category: "" });
  };

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = ((netSavings / totalIncome) * 100).toFixed(1);

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
              <Badge className="bg-success/10 text-success">+12%</Badge>
            </div>
            <p className="text-2xl font-bold">{formatCompact(totalIncome)}</p>
            <p className="text-sm text-muted-foreground">Total Income (6mo)</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <Badge className="bg-destructive/10 text-destructive">-8%</Badge>
            </div>
            <p className="text-2xl font-bold">{formatCompact(totalExpenses)}</p>
            <p className="text-sm text-muted-foreground">Total Expenses (6mo)</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <Badge className="bg-primary/10 text-primary">+18%</Badge>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts */}
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Income vs Expenses</CardTitle>
              <CardDescription>6-month trend analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatAmount(value)}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="hsl(142, 71%, 45%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(142, 71%, 45%)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(0, 63%, 51%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(0, 63%, 51%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
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
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income" ? "bg-success/10" : "bg-destructive/10"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-5 w-5 text-success" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        transaction.type === "income" ? "text-success" : "text-destructive"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : ""}{formatAmount(Math.abs(transaction.amount))}
                    </p>
                  </div>
                ))}
              </div>
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
                  <Tabs
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="expense">Expense</TabsTrigger>
                      <TabsTrigger value="income">Income</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Office supplies"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount ({symbol})</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      {symbol}
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      className="pl-10"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
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

                <Button type="submit" variant="hero" className="w-full">
                  Add Transaction
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatAmount(value)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                    </div>
                    <span className="text-muted-foreground">{formatAmount(category.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    insight.type === "warning"
                      ? "bg-warning/10"
                      : insight.type === "success"
                      ? "bg-success/10"
                      : "bg-primary/10"
                  }`}
                >
                  <p className="font-medium text-sm mb-1">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
