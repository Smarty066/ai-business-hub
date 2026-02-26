import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO } from "date-fns";

interface SalesRecord {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  sale_date: string;
  notes: string;
}

export default function SalesReport() {
  const { user, profile } = useAuth();
  const { formatAmount, symbol } = useCurrency();
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [form, setForm] = useState({
    item_name: "",
    category: "",
    quantity: "1",
    unit_price: "",
    sale_date: format(new Date(), "yyyy-MM-dd"),
    notes: "",
  });

  const fetchRecords = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("sales_records")
      .select("*")
      .eq("user_id", user.id)
      .order("sale_date", { ascending: false });
    setRecords((data as SalesRecord[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const filteredRecords = useMemo(() => {
    const date = parseISO(selectedDate);
    return records.filter((r) => {
      const rd = parseISO(r.sale_date);
      if (period === "daily") return r.sale_date === selectedDate;
      if (period === "weekly") {
        const ws = startOfWeek(date, { weekStartsOn: 1 });
        const we = endOfWeek(date, { weekStartsOn: 1 });
        return rd >= ws && rd <= we;
      }
      const ms = startOfMonth(date);
      const me = endOfMonth(date);
      return rd >= ms && rd <= me;
    });
  }, [records, selectedDate, period]);

  const totalRevenue = filteredRecords.reduce((s, r) => s + Number(r.total_amount), 0);
  const totalItems = filteredRecords.reduce((s, r) => s + r.quantity, 0);
  const businessName = profile?.business_name || "My Business";

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.item_name || !form.unit_price) {
      toast.error("Please fill in item name and unit price");
      return;
    }
    const qty = parseInt(form.quantity) || 1;
    const price = parseFloat(form.unit_price) || 0;
    await supabase.from("sales_records").insert({
      user_id: user.id,
      item_name: form.item_name,
      category: form.category,
      quantity: qty,
      unit_price: price,
      total_amount: qty * price,
      sale_date: form.sale_date,
      notes: form.notes,
    });
    toast.success("Sale recorded!");
    setForm({ item_name: "", category: "", quantity: "1", unit_price: "", sale_date: format(new Date(), "yyyy-MM-dd"), notes: "" });
    setShowForm(false);
    fetchRecords();
  };

  const getPeriodLabel = () => {
    const date = parseISO(selectedDate);
    if (period === "daily") return format(date, "MMMM d, yyyy");
    if (period === "weekly") {
      const ws = startOfWeek(date, { weekStartsOn: 1 });
      const we = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(ws, "MMM d")} – ${format(we, "MMM d, yyyy")}`;
    }
    return format(date, "MMMM yyyy");
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(businessName, 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${period.charAt(0).toUpperCase() + period.slice(1)} Sales Report — ${getPeriodLabel()}`, 20, y);
    y += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Item", 20, y);
    doc.text("Qty", 90, y);
    doc.text("Unit Price", 110, y);
    doc.text("Total", 150, y);
    y += 6;
    doc.setFont("helvetica", "normal");

    filteredRecords.forEach((r) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(r.item_name.slice(0, 30), 20, y);
      doc.text(String(r.quantity), 90, y);
      doc.text(`${symbol}${Number(r.unit_price).toLocaleString()}`, 110, y);
      doc.text(`${symbol}${Number(r.total_amount).toLocaleString()}`, 150, y);
      y += 5;
    });

    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Revenue: ${symbol}${totalRevenue.toLocaleString()}`, 20, y);
    y += 6;
    doc.text(`Total Items Sold: ${totalItems}`, 20, y);

    doc.save(`${businessName.replace(/\s+/g, "-").toLowerCase()}-sales-report.pdf`);
    toast.success("PDF downloaded!");
  };

  const handleShare = async () => {
    const text = `${businessName} — ${period} Sales Report\n${getPeriodLabel()}\n\nTotal Revenue: ${formatAmount(totalRevenue)}\nItems Sold: ${totalItems}\n\n${filteredRecords.map(r => `• ${r.item_name} x${r.quantity} = ${formatAmount(Number(r.total_amount))}`).join("\n")}`;

    if (navigator.share) {
      await navigator.share({ title: `${businessName} Sales Report`, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Report copied to clipboard!");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sales Report</h1>
              <p className="text-muted-foreground">Track and share your daily, weekly & monthly sales.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={exportPdf}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="hero" onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Record Sale
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div className="space-y-2">
          <Label>Period</Label>
          <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-44"
          />
        </div>
        <Badge variant="secondary" className="h-10 px-4 flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          {getPeriodLabel()}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <TrendingUp className="h-5 w-5 text-success mb-2" />
            <p className="text-2xl font-bold">{formatAmount(totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <BarChart3 className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-sm text-muted-foreground">Items Sold</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <FileText className="h-5 w-5 text-warning mb-2" />
            <p className="text-2xl font-bold">{filteredRecords.length}</p>
            <p className="text-sm text-muted-foreground">Transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="glass-strong border-primary/30 mb-6 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Record a Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name *</Label>
                <Input placeholder="e.g. Power Bank" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g. Electronics" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Unit Price ({symbol}) *</Label>
                <Input type="number" placeholder="5000" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sale Date</Label>
                <Input type="date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input placeholder="Optional notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" variant="hero" className="flex-1">Record Sale</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className="glass-strong border-0">
        <CardHeader>
          <CardTitle className="text-lg">Sales Records</CardTitle>
          <CardDescription>{getPeriodLabel()}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sales recorded for this period.</p>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{r.item_name}</p>
                      {r.category && <p className="text-xs text-muted-foreground">{r.category}</p>}
                    </TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell>{formatAmount(Number(r.unit_price))}</TableCell>
                    <TableCell className="font-medium">{formatAmount(Number(r.total_amount))}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(parseISO(r.sale_date), "MMM d")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
