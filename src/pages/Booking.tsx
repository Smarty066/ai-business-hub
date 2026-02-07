import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { format, isSameDay, startOfDay } from "date-fns";
import { z } from "zod";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  queuePosition: number;
  estimatedWait: number;
}

const initialBookings: Booking[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    service: "Initial Consultation",
    date: new Date(),
    time: "10:00 AM",
    status: "confirmed",
    queuePosition: 1,
    estimatedWait: 0,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    service: "Strategy Session",
    date: new Date(),
    time: "11:30 AM",
    status: "pending",
    queuePosition: 2,
    estimatedWait: 15,
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike@example.com",
    service: "Review Meeting",
    date: new Date(),
    time: "2:00 PM",
    status: "pending",
    queuePosition: 3,
    estimatedWait: 45,
  },
];

const services = [
  { value: "consultation", label: "Initial Consultation", duration: "30 min" },
  { value: "strategy", label: "Strategy Session", duration: "60 min" },
  { value: "review", label: "Review Meeting", duration: "45 min" },
  { value: "workshop", label: "Workshop", duration: "120 min" },
];

const serviceLabels: Record<string, string> = Object.fromEntries(
  services.map((s) => [s.value, s.label])
);

const morningSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
];

const afternoonSlots = [
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => val === "" || /^(\+234|0)[0-9]{10}$/.test(val.replace(/\s/g, "")),
      "Enter a valid Nigerian number (e.g. +2348012345678 or 08012345678)"
    )
    .optional()
    .or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  time: z.string().min(1, "Please select a time slot"),
});

type FormErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

const emptyForm = { name: "", email: "", phone: "", service: "", time: "" };

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  // Compute queue stats from live data
  const activeBookings = useMemo(
    () => bookings.filter((b) => b.status !== "cancelled" && b.status !== "completed"),
    [bookings]
  );
  const todayBookings = useMemo(
    () => activeBookings.filter((b) => isSameDay(b.date, new Date())),
    [activeBookings]
  );
  const avgWait = useMemo(() => {
    const pending = todayBookings.filter((b) => b.status === "pending");
    if (pending.length === 0) return 0;
    return Math.round(pending.reduce((s, b) => s + b.estimatedWait, 0) / pending.length);
  }, [todayBookings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setErrors({});

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || undefined,
      service: serviceLabels[result.data.service] || result.data.service,
      date: selectedDate,
      time: result.data.time,
      status: "pending",
      queuePosition: activeBookings.length + 1,
      estimatedWait: activeBookings.length * 15,
    };

    setBookings((prev) => [...prev, newBooking]);
    setFormData(emptyForm);
    toast.success(
      `Booking confirmed for ${format(selectedDate, "MMM d")} at ${result.data.time}!`
    );
  };

  const handleCancel = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
    toast.success("Booking cancelled");
  };

  const handleReschedule = (booking: Booking) => {
    // Pre-fill the form with the booking data and cancel the old one
    setFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone || "",
      service:
        services.find((s) => s.label === booking.service)?.value || booking.service,
      time: "",
    });
    setSelectedDate(new Date());
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" as const } : b))
    );
    toast.info("Fill in a new time to reschedule");
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "completed":
        return "bg-muted text-muted-foreground";
      case "cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "";
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-success" />
          </div>
          <h1 className="text-3xl font-bold">Smart Booking System</h1>
        </div>
        <p className="text-muted-foreground">
          Manage appointments with AI-powered scheduling and queue predictions.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <Card className="lg:col-span-2 glass-strong border-0">
          <CardHeader>
            <CardTitle className="text-lg">Book an Appointment</CardTitle>
            <CardDescription>
              Select a service, date, and time to schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Calendar */}
                <div>
                  <Label className="mb-3 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg border border-border"
                    disabled={(date) =>
                      date < startOfDay(new Date()) ||
                      date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Adaeze Okafor"
                        className="pl-10"
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="adaeze@example.com"
                        className="pl-10"
                        maxLength={255}
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+234 801 234 5678"
                        className="pl-10"
                        maxLength={15}
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  {/* Service */}
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => updateField("service", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <span className="flex items-center gap-2">
                              {service.label}
                              <span className="text-muted-foreground text-xs">
                                ({service.duration})
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-xs text-destructive">{errors.service}</p>
                    )}
                  </div>

                  {/* Time Slots — Morning */}
                  <div className="space-y-2">
                    <Label>Morning Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={formData.time === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateField("time", slot)}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots — Afternoon */}
                  <div className="space-y-2">
                    <Label>Afternoon Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={formData.time === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateField("time", slot)}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                    {errors.time && (
                      <p className="text-xs text-destructive">{errors.time}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full">
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Queue Display */}
        <div className="space-y-6">
          {/* Queue Stats */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Today's Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-primary">
                    {todayBookings.length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Queue</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-success">~{avgWait}</p>
                  <p className="text-xs text-muted-foreground">Avg. Wait (min)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeBookings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming appointments
                </p>
              )}
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 rounded-lg bg-secondary/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{booking.name}</p>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(booking.date, "MMM d")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </span>
                    <span>{booking.service}</span>
                  </div>
                  {booking.status === "pending" && (
                    <div className="flex items-center gap-2 text-xs">
                      <AlertCircle className="h-3 w-3 text-warning" />
                      <span className="text-warning">
                        Est. wait: {booking.estimatedWait} min
                      </span>
                    </div>
                  )}
                  {booking.status === "confirmed" && (
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span className="text-success">Ready now</span>
                    </div>
                  )}

                  {/* Cancel & Reschedule */}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                        onClick={() => handleCancel(booking.id)}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-primary"
                        onClick={() => handleReschedule(booking)}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reschedule
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
