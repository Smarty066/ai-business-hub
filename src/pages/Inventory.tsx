import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Package,
  AlertTriangle,
  TrendingUp,
  Plus,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ShoppingCart,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  reorderLevel: number;
  supplier: string;
  lastRestocked: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Phone Cases (Assorted)",
    category: "Accessories",
    quantity: 145,
    costPrice: 800,
    sellingPrice: 1500,
    reorderLevel: 50,
    supplier: "China Direct",
    lastRestocked: "2 days ago",
    status: "in-stock",
  },
  {
    id: "2",
    name: "USB-C Cables (1m)",
    category: "Electronics",
    quantity: 23,
    costPrice: 400,
    sellingPrice: 800,
    reorderLevel: 30,
    supplier: "TechZone Supplies",
    lastRestocked: "1 week ago",
    status: "low-stock",
  },
  {
    id: "3",
    name: "Screen Protectors",
    category: "Accessories",
    quantity: 0,
    costPrice: 300,
    sellingPrice: 700,
    reorderLevel: 40,
    supplier: "China Direct",
    lastRestocked: "3 weeks ago",
    status: "out-of-stock",
  },
  {
    id: "4",
    name: "Bluetooth Earbuds",
    category: "Electronics",
    quantity: 67,
    costPrice: 3500,
    sellingPrice: 6000,
    reorderLevel: 20,
    supplier: "AudioMax NG",
    lastRestocked: "5 days ago",
    status: "in-stock",
  },
  {
    id: "5",
    name: "Power Banks (10000mAh)",
    category: "Electronics",
    quantity: 12,
    costPrice: 5000,
    sellingPrice: 8500,
    reorderLevel: 15,
    supplier: "TechZone Supplies",
    lastRestocked: "2 weeks ago",
    status: "low-stock",
  },
  {
    id: "6",
    name: "Ring Lights",
    category: "Accessories",
    quantity: 34,
    costPrice: 4500,
    sellingPrice: 7500,
    reorderLevel: 10,
    supplier: "PhotoGear NG",
    lastRestocked: "4 days ago",
    status: "in-stock",
  },
];

interface SalesRecord {
  id: string;
  item: string;
  quantity: number;
  amount: number;
  date: string;
  type: "sale" | "restock";
}

const mockSales: SalesRecord[] = [
  { id: "1", item: "Phone Cases", quantity: 5, amount: 7500, date: "Today", type: "sale" },
  { id: "2", item: "Bluetooth Earbuds", quantity: 2, amount: 12000, date: "Today", type: "sale" },
  { id: "3", item: "USB-C Cables", quantity: 50, amount: -20000, date: "Yesterday", type: "restock" },
  { id: "4", item: "Power Banks", quantity: 3, amount: 25500, date: "Yesterday", type: "sale" },
  { id: "5", item: "Ring Lights", quantity: 1, amount: 7500, date: "2 days ago", type: "sale" },
];

const aiRestockSuggestions = [
  {
    item: "Screen Protectors",
    urgency: "critical",
    reason: "Out of stock for 3 weeks. You've been losing estimated sales revenue weekly.",
    suggestedQty: 100,
    estimatedCost: 30000,
  },
  {
    item: "USB-C Cables",
    urgency: "high",
    reason: "Only 23 units left (below reorder level of 30). Sells 8-10 units/day on average.",
    suggestedQty: 80,
    estimatedCost: 32000,
  },
  {
    item: "Power Banks",
    urgency: "medium",
    reason: "12 units remaining, approaching reorder level. Popular item on weekends.",
    suggestedQty: 30,
    estimatedCost: 150000,
  },
];

export default function Inventory() {
  const { symbol, formatAmount, formatCompact } = useCurrency();
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    reorderLevel: "",
    supplier: "",
  });

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalStockValue = inventory.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
  const totalRetailValue = inventory.reduce((sum, item) => sum + item.quantity * item.sellingPrice, 0);
  const potentialProfit = totalRetailValue - totalStockValue;
  const lowStockCount = inventory.filter((i) => i.status === "low-stock" || i.status === "out-of-stock").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-success/10 text-success">In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-warning/10 text-warning">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-destructive/10 text-destructive">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-destructive/10 border-destructive/30";
      case "high":
        return "bg-warning/10 border-warning/30";
      case "medium":
        return "bg-primary/10 border-primary/30";
      default:
        return "bg-secondary";
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`"${newItem.name}" added to inventory!`);
    setNewItem({ name: "", category: "", quantity: "", costPrice: "", sellingPrice: "", reorderLevel: "", supplier: "" });
    setShowAddForm(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Inventory</h1>
              <p className="text-muted-foreground">
                Track inventory, manage stock levels & get AI restock alerts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CurrencySelector size="sm" />
            <Button variant="hero" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-strong border-0 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 text-primary" />
              <Badge className="bg-primary/10 text-primary">{inventory.length}</Badge>
            </div>
            <p className="text-2xl font-bold">{formatCompact(totalStockValue)}</p>
            <p className="text-sm text-muted-foreground">Stock Value (Cost)</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 animate-fade-in" style={{ animationDelay: "0.05s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="h-5 w-5 text-success" />
              <Badge className="bg-success/10 text-success">+{formatCompact(potentialProfit)}</Badge>
            </div>
            <p className="text-2xl font-bold">{formatCompact(totalRetailValue)}</p>
            <p className="text-sm text-muted-foreground">Retail Value</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-warning" />
              <Badge className="bg-warning/10 text-warning">{((potentialProfit / totalStockValue) * 100).toFixed(0)}%</Badge>
            </div>
            <p className="text-2xl font-bold">{formatCompact(potentialProfit)}</p>
            <p className="text-sm text-muted-foreground">Potential Profit</p>
          </CardContent>
        </Card>

        <Card className="glass-strong border-0 animate-fade-in" style={{ animationDelay: "0.15s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <Badge className="bg-destructive/10 text-destructive">{lowStockCount} items</Badge>
            </div>
            <p className="text-2xl font-bold">{lowStockCount}</p>
            <p className="text-sm text-muted-foreground">Need Restocking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Item Form */}
          {showAddForm && (
            <Card className="glass-strong border-primary/30 animate-fade-in">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Add New Inventory Item</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddItem} className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Item Name</Label>
                    <Input
                      placeholder="e.g., iPhone 15 Case"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                        <SelectItem value="Food & Drink">Food & Drink</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Beauty">Beauty</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost Price ({symbol})</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.costPrice}
                      onChange={(e) => setNewItem({ ...newItem, costPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Selling Price ({symbol})</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.sellingPrice}
                      onChange={(e) => setNewItem({ ...newItem, sellingPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Reorder Level</Label>
                    <Input
                      type="number"
                      placeholder="Minimum stock before alert"
                      value={newItem.reorderLevel}
                      onChange={(e) => setNewItem({ ...newItem, reorderLevel: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Input
                      placeholder="Supplier name"
                      value={newItem.supplier}
                      onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <Button type="submit" variant="hero" className="flex-1">
                      Add to Inventory
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Inventory Table */}
          <Card className="glass-strong border-0">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <CardTitle className="text-lg">Inventory</CardTitle>
                  <CardDescription>Track all your products and stock levels</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      className="pl-9 w-48"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const margin = ((item.sellingPrice - item.costPrice) / item.sellingPrice * 100).toFixed(0);
                    const stockPercent = Math.min((item.quantity / (item.reorderLevel * 3)) * 100, 100);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category} • {item.supplier}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span className="font-medium text-sm">{item.quantity}</span>
                            <Progress value={stockPercent} className="h-1.5 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{formatAmount(item.costPrice)}</TableCell>
                        <TableCell className="text-sm">{formatAmount(item.sellingPrice)}</TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success">{margin}%</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Sales & Restocks */}
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Sales and restock transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSales.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        record.type === "sale" ? "bg-success/10" : "bg-primary/10"
                      }`}>
                        {record.type === "sale" ? (
                          <ArrowUpRight className="h-5 w-5 text-success" />
                        ) : (
                          <RefreshCw className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{record.item}</p>
                        <p className="text-xs text-muted-foreground">
                          {record.type === "sale" ? "Sold" : "Restocked"} {record.quantity} units • {record.date}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold text-sm ${
                      record.type === "sale" ? "text-success" : "text-primary"
                    }`}>
                      {record.type === "sale" ? "+" : "-"}{formatAmount(Math.abs(record.amount))}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Restock Alerts */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Restock Alerts
              </CardTitle>
              <CardDescription>Smart suggestions based on sales velocity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiRestockSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getUrgencyColor(suggestion.urgency)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{suggestion.item}</p>
                    <Badge className={
                      suggestion.urgency === "critical"
                        ? "bg-destructive/10 text-destructive"
                        : suggestion.urgency === "high"
                        ? "bg-warning/10 text-warning"
                        : "bg-primary/10 text-primary"
                    }>
                      {suggestion.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{suggestion.reason}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>Suggested: <strong>{suggestion.suggestedQty} units</strong></span>
                    <span className="text-muted-foreground">~{formatAmount(suggestion.estimatedCost)}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => toast.success(`Restock order for ${suggestion.item} noted!`)}>
                    <ShoppingCart className="h-3 w-3 mr-2" />
                    Order Restock
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-success/10">
                <p className="font-medium text-sm mb-1">Top Seller This Week</p>
                <p className="text-xs text-muted-foreground">
                  Bluetooth Earbuds — 23 units sold, {formatAmount(138000)} revenue. Consider increasing stock.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10">
                <p className="font-medium text-sm mb-1">Slow Moving Stock</p>
                <p className="text-xs text-muted-foreground">
                  Ring Lights have sold only 3 units in 2 weeks. Consider running a promotion or bundle deal.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <p className="font-medium text-sm mb-1">Profit Tip</p>
                <p className="text-xs text-muted-foreground">
                  Your average margin is 47%. Products above {formatAmount(5000)} sell slower but generate 2x more profit per unit.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
