import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  User,
  Mail,
  Phone,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { format, startOfDay } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  useBooking,
  services,
  morningSlots,
  afternoonSlots,
} from "@/hooks/useBooking";

export default function PublicBooking() {
  const [submitted, setSubmitted] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState<{ date: string; time: string; service: string } | null>(null);

  const {
    selectedDate,
    setSelectedDate,
    formData,
    errors,
    activeBookings,
    avgWait,
    updateField,
    validateForm,
    addBooking,
  } = useBooking(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = validateForm();
    if (!data) return;

    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    addBooking(data, selectedDate);
    const serviceLabel = services.find((s) => s.value === data.service)?.label || data.service;
    setConfirmedDetails({
      date: format(selectedDate, "EEEE, MMMM d, yyyy"),
      time: data.time,
      service: serviceLabel,
    });
    setSubmitted(true);
    toast.success("Appointment booked successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary glow-sm">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-gradient">Smart AI Suite</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">Admin Login</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <CalendarIcon className="h-4 w-4" />
            Online Booking
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Book Your Appointment
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Schedule a session with us in just a few clicks. Pick your preferred date, time, and service below.
          </p>
        </div>

        {submitted && confirmedDetails ? (
          /* Confirmation Screen */
          <Card className="max-w-lg mx-auto glass-strong border-0 animate-fade-in">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground">
                  Your appointment has been scheduled. We'll send a confirmation to your email.
                </p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-5 space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{confirmedDetails.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{confirmedDetails.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{confirmedDetails.service}</span>
                </div>
              </div>
              <Button
                variant="hero"
                className="w-full"
                onClick={() => {
                  setSubmitted(false);
                  setConfirmedDetails(null);
                }}
              >
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Booking Form */
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-strong border-0">
              <CardHeader>
                <CardTitle className="text-lg">Your Details</CardTitle>
                <CardDescription>
                  Fill in your information and choose a time
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
                        <Label htmlFor="pub-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pub-name"
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
                        <Label htmlFor="pub-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pub-email"
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
                        <Label htmlFor="pub-phone">Phone (Optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="pub-phone"
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
                    Confirm Booking
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Availability */}
              <Card className="glass-strong border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current queue</span>
                    <span className="font-medium">{activeBookings.length} appointments</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. wait time</span>
                    <span className="font-medium">~{avgWait} min</span>
                  </div>
                </CardContent>
              </Card>

              {/* Services Overview */}
              <Card className="glass-strong border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Our Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.value}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <span className="text-sm font-medium">{service.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {service.duration}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="glass-strong border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Call us at <span className="text-foreground font-medium">+234 801 000 0000</span></p>
                  <p>Email <span className="text-foreground font-medium">bookings@smartaisuite.com</span></p>
                  <p className="text-xs pt-2">Mon–Fri, 9:00 AM – 5:00 PM WAT</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Smart AI Suite. All rights reserved.</p>
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
