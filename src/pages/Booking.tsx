import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon, Clock, Users, CheckCircle, AlertCircle,
  User, Mail, Phone, XCircle, RotateCcw, Bell,
} from "lucide-react";
import { toast } from "sonner";
import { format, startOfDay, isSameDay, isToday } from "date-fns";
import { useBooking, services, morningSlots, afternoonSlots } from "@/hooks/useBooking";

export default function Booking() {
  const {
    selectedDate, setSelectedDate, formData, errors,
    activeBookings, todayBookings, avgWait,
    updateField, validateForm, addBooking, cancelBooking, rescheduleBooking,
  } = useBooking(true);

  const notifiedRef = useRef<Set<string>>(new Set());

  // Booking time notification system
  useEffect(() => {
    const checkBookingTimes = () => {
      const now = new Date();
      const currentTime = format(now, "h:mm a");

      todayBookings.forEach((booking) => {
        if (notifiedRef.current.has(booking.id)) return;
        if (booking.status === "cancelled" || booking.status === "completed") return;

        // Parse booking time and check if it's within 5 minutes
        const bookingTimeParts = booking.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!bookingTimeParts) return;

        let hours = parseInt(bookingTimeParts[1]);
        const minutes = parseInt(bookingTimeParts[2]);
        const ampm = bookingTimeParts[3].toUpperCase();

        if (ampm === "PM" && hours !== 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        const bookingDate = new Date();
        bookingDate.setHours(hours, minutes, 0, 0);

        const diffMs = bookingDate.getTime() - now.getTime();
        const diffMin = diffMs / 60000;

        // Notify when booking is starting (within 2 minutes)
        if (diffMin >= -2 && diffMin <= 2) {
          notifiedRef.current.add(booking.id);
          toast.info(`🔔 Booking Alert: ${booking.name}'s ${booking.service} is starting now at ${booking.time}!`, {
            duration: 10000,
            action: {
              label: "Got it",
              onClick: () => {},
            },
          });
        }
        // Notify 5 minutes before
        else if (diffMin > 2 && diffMin <= 5) {
          const notifKey = `${booking.id}-5min`;
          if (!notifiedRef.current.has(notifKey)) {
            notifiedRef.current.add(notifKey);
            toast.info(`⏰ Upcoming: ${booking.name}'s ${booking.service} starts in 5 minutes (${booking.time})`, {
              duration: 8000,
            });
          }
        }
      });
    };

    // Check every 30 seconds
    checkBookingTimes();
    const interval = setInterval(checkBookingTimes, 30000);
    return () => clearInterval(interval);
  }, [todayBookings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = validateForm();
    if (!data) return;
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    addBooking(data, selectedDate);
    toast.success(`Booking confirmed for ${format(selectedDate, "MMM d")} at ${data.time}!`);
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
      case "confirmed": return "bg-success/10 text-success";
      case "pending": return "bg-warning/10 text-warning";
      case "completed": return "bg-muted text-muted-foreground";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "";
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-success" />
          </div>
          <h1 className="text-3xl font-bold">Smart Booking System</h1>
        </div>
        <p className="text-muted-foreground">
          Manage appointments with AI-powered scheduling, queue predictions & auto notifications.
        </p>
      </div>

      {/* Notification Banner */}
      {todayBookings.length > 0 && (
        <Card className="glass-strong border-primary/30 mb-6 animate-fade-in">
          <CardContent className="p-4 flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Auto-notifications active</p>
              <p className="text-xs text-muted-foreground">
                You'll be notified 5 minutes before and when each booking starts today ({todayBookings.length} bookings).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <Card className="lg:col-span-2 glass-strong border-0">
          <CardHeader>
            <CardTitle className="text-lg">Book an Appointment</CardTitle>
            <CardDescription>Select a service, date, and time to schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-3 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-lg border border-border pointer-events-auto"
                    disabled={(date) =>
                      date < startOfDay(new Date()) ||
                      date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="name" placeholder="Adaeze Okafor" className="pl-10" maxLength={100} value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
                    </div>
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="adaeze@example.com" className="pl-10" maxLength={255} value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
                    </div>
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" placeholder="+234 801 234 5678" className="pl-10" maxLength={15} value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={formData.service} onValueChange={(value) => updateField("service", value)}>
                      <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            <span className="flex items-center gap-2">
                              {service.label}
                              <span className="text-muted-foreground text-xs">({service.duration})</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && <p className="text-xs text-destructive">{errors.service}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Morning Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {morningSlots.map((slot) => (
                        <Button key={slot} type="button" variant={formData.time === slot ? "default" : "outline"} size="sm" onClick={() => updateField("time", slot)} className="text-xs">
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Afternoon Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {afternoonSlots.map((slot) => (
                        <Button key={slot} type="button" variant={formData.time === slot ? "default" : "outline"} size="sm" onClick={() => updateField("time", slot)} className="text-xs">
                          {slot}
                        </Button>
                      ))}
                    </div>
                    {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
                  </div>
                </div>
              </div>
              <Button type="submit" variant="hero" className="w-full">Book Appointment</Button>
            </form>
          </CardContent>
        </Card>

        {/* Queue Display */}
        <div className="space-y-6">
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
                  <p className="text-2xl font-bold text-primary">{todayBookings.length}</p>
                  <p className="text-xs text-muted-foreground">In Queue</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-success">~{avgWait}</p>
                  <p className="text-xs text-muted-foreground">Avg. Wait (min)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeBookings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
              )}
              {activeBookings.map((booking) => (
                <div key={booking.id} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{booking.name}</p>
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />{format(booking.date, "MMM d")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />{booking.time}
                    </span>
                    <span>{booking.service}</span>
                  </div>
                  {booking.status === "pending" && (
                    <div className="flex items-center gap-2 text-xs">
                      <AlertCircle className="h-3 w-3 text-warning" />
                      <span className="text-warning">Est. wait: {booking.estimatedWait} min</span>
                    </div>
                  )}
                  {booking.status === "confirmed" && (
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-success" />
                      <span className="text-success">Ready now</span>
                    </div>
                  )}
                  {(booking.status === "pending" || booking.status === "confirmed") && (
                    <div className="flex gap-2 pt-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive" onClick={() => handleCancel(booking.id)}>
                        <XCircle className="h-3 w-3 mr-1" />Cancel
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-primary" onClick={() => handleReschedule(booking)}>
                        <RotateCcw className="h-3 w-3 mr-1" />Reschedule
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
