import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isSameDay, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users, UserPlus, Search, Phone, Mail, MessageCircle,
  Clock, Star, MoreVertical, Calendar as CalendarIcon,
  TrendingUp, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  channel: "whatsapp" | "phone" | "email" | "walk-in";
  status: "new" | "contacted" | "interested" | "converted" | "inactive";
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  totalSpent: number;
  tags: string[];
}

const statusColors: Record<Customer["status"], string> = {
  new: "bg-primary/10 text-primary border-primary/30",
  contacted: "bg-warning/10 text-warning border-warning/30",
  interested: "bg-success/10 text-success border-success/30",
  converted: "bg-accent/10 text-accent border-accent/30",
  inactive: "bg-muted text-muted-foreground border-border",
};

const channelIcons: Record<Customer["channel"], typeof Phone> = {
  whatsapp: MessageCircle,
  phone: Phone,
  email: Mail,
  "walk-in": Users,
};

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Adebayo Johnson",
    phone: "+234 801 234 5678",
    email: "adebayo@email.com",
    channel: "whatsapp",
    status: "interested",
    lastContact: "2026-02-04",
    nextFollowUp: "2026-02-07",
    notes: "Interested in the premium plan. Needs invoice before payment.",
    totalSpent: 0,
    tags: ["premium-lead", "lagos"],
  },
  {
    id: "2",
    name: "Chioma Okafor",
    phone: "+234 809 876 5432",
    email: "chioma@email.com",
    channel: "phone",
    status: "converted",
    lastContact: "2026-02-05",
    nextFollowUp: "",
    notes: "Subscribed to monthly plan. Very happy with the service.",
    totalSpent: 7500,
    tags: ["subscriber", "referral-source"],
  },
  {
    id: "3",
    name: "Emeka Nwosu",
    phone: "+234 703 456 7890",
    email: "",
    channel: "walk-in",
    status: "new",
    lastContact: "2026-02-06",
    nextFollowUp: "2026-02-08",
    notes: "Met at trade fair. Runs a boutique in Ikeja.",
    totalSpent: 0,
    tags: ["retail", "ikeja"],
  },
  {
    id: "4",
    name: "Fatima Ibrahim",
    phone: "+234 812 345 6789",
    email: "fatima@email.com",
    channel: "whatsapp",
    status: "contacted",
    lastContact: "2026-02-03",
    nextFollowUp: "2026-02-06",
    notes: "Sent product catalog. Waiting for response.",
    totalSpent: 0,
    tags: ["food-business", "abuja"],
  },
];

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "", phone: "", email: "",
    channel: "whatsapp" as Customer["channel"],
    notes: "", tags: "",
  });

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesDate = !dateFilter || isSameDay(parseISO(c.lastContact), dateFilter);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = {
    total: customers.length,
    needsFollowUp: customers.filter(
      (c) => c.nextFollowUp && new Date(c.nextFollowUp) <= new Date()
    ).length,
    converted: customers.filter((c) => c.status === "converted").length,
    revenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      channel: newCustomer.channel,
      status: "new",
      lastContact: new Date().toISOString().split("T")[0],
      nextFollowUp: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      notes: newCustomer.notes,
      totalSpent: 0,
      tags: newCustomer.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    setCustomers([customer, ...customers]);
    setNewCustomer({ name: "", phone: "", email: "", channel: "whatsapp", notes: "", tags: "" });
    setIsAddOpen(false);
    toast.success("Customer added!");
  };

  const updateStatus = (id: string, status: Customer["status"]) => {
    setCustomers(
      customers.map((c) =>
        c.id === id
          ? { ...c, status, lastContact: new Date().toISOString().split("T")[0] }
          : c
      )
    );
    toast.success("Status updated!");
  };

  const isOverdue = (date: string) => {
    if (!date) return false;
    return new Date(date) <= new Date();
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Customer Follow-Up</h1>
        </div>
        <p className="text-muted-foreground">
          Track your customers, manage follow-ups, and never lose a lead again.
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Customers", value: stats.total, icon: Users, color: "text-primary" },
          {
            label: "Needs Follow-Up",
            value: stats.needsFollowUp,
            icon: AlertCircle,
            color: "text-warning",
          },
          { label: "Converted", value: stats.converted, icon: TrendingUp, color: "text-success" },
          {
            label: "Revenue",
            value: `₦${stats.revenue.toLocaleString()}`,
            icon: Star,
            color: "text-primary",
          },
        ].map((stat) => (
          <Card key={stat.label} className="glass-strong border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-[160px] justify-start text-left font-normal", !dateFilter && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "MMM d, yyyy") : "Filter date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        {dateFilter && (
          <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)} className="text-xs">
            Clear
          </Button>
        )}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="hero">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter customer details to start tracking.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name <span className="text-destructive">*</span></Label>
                <Input
                  placeholder="e.g., Adebayo Johnson"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+234 8XX XXX XXXX"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    placeholder="email@example.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Contact Channel</Label>
                <Select
                  value={newCustomer.channel}
                  onValueChange={(v) =>
                    setNewCustomer({ ...newCustomer, channel: v as Customer["channel"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Any initial notes about this customer..."
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma-separated)</Label>
                <Input
                  placeholder="e.g., retail, lagos, premium"
                  value={newCustomer.tags}
                  onChange={(e) => setNewCustomer({ ...newCustomer, tags: e.target.value })}
                />
              </div>
              <Button variant="hero" className="w-full" onClick={handleAddCustomer}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {filteredCustomers.length === 0 ? (
          <Card className="glass-strong border-0">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">No customers found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter."
                  : "Add your first customer to get started!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCustomers.map((customer) => {
            const ChannelIcon = channelIcons[customer.channel];
            const overdue = isOverdue(customer.nextFollowUp);

            return (
              <Card
                key={customer.id}
                className={`glass-strong border-0 transition-all hover:scale-[1.005] ${
                  overdue ? "ring-1 ring-warning/40" : ""
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold truncate">{customer.name}</p>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${statusColors[customer.status]}`}
                          >
                            {customer.status}
                          </Badge>
                          {overdue && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-warning/10 text-warning border-warning/30 animate-pulse"
                            >
                              Follow-up due!
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <ChannelIcon className="h-3 w-3" />
                            {customer.phone || customer.email || "No contact"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last: {customer.lastContact}
                          </span>
                          {customer.nextFollowUp && (
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-3 w-3" />
                              Next: {customer.nextFollowUp}
                            </span>
                          )}
                        </div>
                        {customer.notes && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            📝 {customer.notes}
                          </p>
                        )}
                        {customer.tags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {customer.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/5 text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {customer.status !== "converted" && (
                        <Select
                          value={customer.status}
                          onValueChange={(v) => updateStatus(customer.id, v as Customer["status"])}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="interested">Interested</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {customer.totalSpent > 0 && (
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                          ₦{customer.totalSpent.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
