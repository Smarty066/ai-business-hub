import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Booking {
  id: string;
  name: string;
  email: string;
  service: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "completed";
  queuePosition: number;
  estimatedWait: number;
}

const mockBookings: Booking[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    service: "Consultation",
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

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings] = useState<Booking[]>(mockBookings);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking submitted successfully! You'll receive a confirmation email shortly.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "completed":
        return "bg-muted text-muted-foreground";
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
                    disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Smith"
                        className="pl-10"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value })}
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
                  </div>

                  <div className="space-y-2">
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.slice(0, 6).map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={formData.time === slot ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFormData({ ...formData, time: slot })}
                          className="text-xs"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
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
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-xs text-muted-foreground">In Queue</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/50">
                  <p className="text-2xl font-bold text-success">~15</p>
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
              {bookings.map((booking) => (
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
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
