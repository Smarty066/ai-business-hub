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
import { format, startOfDay } from "date-fns";
import {
  useBooking,
  services,
  morningSlots,
  afternoonSlots,
} from "@/hooks/useBooking";

export default function Booking() {
  const {
    selectedDate,
    setSelectedDate,
    formData,
    errors,
    activeBookings,
    todayBookings,
    avgWait,
    updateField,
    validateForm,
    addBooking,
    cancelBooking,
    rescheduleBooking,
  } = useBooking(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = validateForm();
    if (!data) return;

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    addBooking(data, selectedDate);
    toast.success(
      `Booking confirmed for ${format(selectedDate, "MMM d")} at ${data.time}!`
    );
  };

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success("Booking cancelled");
  };

  const handleReschedule = (booking: Parameters<typeof rescheduleBooking>[0]) => {
    rescheduleBooking(booking);
    toast.info("Fill in a new time to reschedule");
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
