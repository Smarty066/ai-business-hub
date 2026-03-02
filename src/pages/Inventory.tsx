import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Package, AlertTriangle, TrendingUp, Plus, Search,
  ShoppingCart, BarChart3, Sparkles, CalendarIcon, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  cost_price: number;
  selling_price: number;
  reorder_level: number;
  supplier: string;
  last_restocked: string;
}

export default function Inventory() {
  const { user } = useAuth();
  const { symbol, formatAmount, formatCompact, convertFromNGN } = useCurrency();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "", category: "", quantity: "", costPrice: "",
    sellingPrice: "", reorderLevel: "", supplier: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetchInventory = async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Failed to load inventory");
      } else {
        setInventory(data || []);
      }
      setLoading(false);
    };
    fetchInventory();
  }, [user]);

  const getStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return "out-of-stock";
    if (item.quantity <= item.reorder_level) return "low-stock";
    return "in-stock";
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(inventory.map(i => i.category).filter(Boolean))];

  // All amounts stored in NGN, convert for display
  const totalStockValue = convertFromNGN(inventory.reduce((sum, item) => sum + item.quantity * item.cost_price, 0));
  const totalRetailValue = convertFromNGN(inventory.reduce((sum, item) => sum + item.quantity * item.selling_price, 0));
  const potentialProfit = totalRetailValue - totalStockValue;
  const lowStockCount = inventory.filter((i) => getStatus(i) === "low-stock" || getStatus(i) === "out-of-stock").length;

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newItem.name) return;

    const { error } = await supabase.from("inventory").insert({
      user_id: user.id,
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity) || 0,
      cost_price: parseFloat(newItem.costPrice) || 0,
      selling_price: parseFloat(newItem.sellingPrice) || 0,
      reorder_level: parseInt(newItem.reorderLevel) || 10,
      supplier: newItem.supplier,
    });

    if (error) {
      toast.error("Failed to add item");
      return;
    }

    toast.success(`"${newItem.name}" added to inventory!`);
    setNewItem({ name: "", category: "", quantity: "", costPrice: "", sellingPrice: "", reorderLevel: "", supplier: "" });
    setShowAddForm(false);
    // Refetch
    const { data } = await supabase.from("inventory").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setInventory(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("inventory").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete item");
      return;
    }
    setInventory(prev => prev.filter(i => i.id !== id));
    toast.success("Item removed");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
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
              <Badge className="bg-warning/10 text-warning">
                {totalStockValue > 0 ? ((potentialProfit / totalStockValue) * 100).toFixed(0) : 0}%
              </Badge>
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

      {/* Add Item Form */}
      {showAddForm && (
        <Card className="glass-strong border-primary/30 animate-fade-in mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add New Inventory Item</CardTitle>
            <CardDescription>Prices are stored in Naira (₦). They will be converted when viewing in USD.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Item Name</Label>
                <Input placeholder="e.g., iPhone 15 Case" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
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
                <Input type="number" placeholder="0" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cost Price (₦)</Label>
                <Input type="number" placeholder="0" value={newItem.costPrice} onChange={(e) => setNewItem({ ...newItem, costPrice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Selling Price (₦)</Label>
                <Input type="number" placeholder="0" value={newItem.sellingPrice} onChange={(e) => setNewItem({ ...newItem, sellingPrice: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input type="number" placeholder="Minimum stock before alert" value={newItem.reorderLevel} onChange={(e) => setNewItem({ ...newItem, reorderLevel: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input placeholder="Supplier name" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" variant="hero" className="flex-1">Add to Inventory</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card className="glass-strong border-0 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg">Inventory</CardTitle>
              <CardDescription>Track all your products and stock levels</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search items..." className="pl-9 w-48" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading inventory...</p>
          ) : filteredInventory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {inventory.length === 0 ? "No items yet. Click 'Add Item' to get started!" : "No items match your search."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Last Restocked</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getStatus(item);
                    const margin = item.selling_price > 0
                      ? (((item.selling_price - item.cost_price) / item.selling_price) * 100).toFixed(0)
                      : "0";
                    const stockPercent = Math.min((item.quantity / (item.reorder_level * 3)) * 100, 100);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}{item.supplier ? ` • ${item.supplier}` : ""}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span className="font-medium text-sm">{item.quantity}</span>
                            <Progress value={stockPercent} className="h-1.5 w-16" />
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{formatAmount(convertFromNGN(item.cost_price))}</TableCell>
                        <TableCell className="text-sm">{formatAmount(convertFromNGN(item.selling_price))}</TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success">{margin}%</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.last_restocked ? format(new Date(item.last_restocked), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Restock Alerts */}
      {lowStockCount > 0 && (
        <Card className="glass-strong border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Restock Alerts
            </CardTitle>
            <CardDescription>Items that need restocking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventory
              .filter((i) => getStatus(i) !== "in-stock")
              .map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${getStatus(item) === "out-of-stock" ? "bg-destructive/10 border-destructive/30" : "bg-warning/10 border-warning/30"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <Badge className={getStatus(item) === "out-of-stock" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}>
                      {getStatus(item) === "out-of-stock" ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} units remaining (reorder level: {item.reorder_level})
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
