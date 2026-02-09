import { useState, useMemo } from "react";
import { isSameDay } from "date-fns";
import { z } from "zod";

export interface Booking {
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

export const services = [
  { value: "consultation", label: "Initial Consultation", duration: "30 min" },
  { value: "strategy", label: "Strategy Session", duration: "60 min" },
  { value: "review", label: "Review Meeting", duration: "45 min" },
  { value: "workshop", label: "Workshop", duration: "120 min" },
];

export const serviceLabels: Record<string, string> = Object.fromEntries(
  services.map((s) => [s.value, s.label])
);

export const morningSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
];

export const afternoonSlots = [
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

export const bookingSchema = z.object({
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

export type BookingFormData = z.infer<typeof bookingSchema>;
export type FormErrors = Partial<Record<keyof BookingFormData, string>>;

export const emptyForm: BookingFormData = { name: "", email: "", phone: "", service: "", time: "" };

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

export function useBooking(withInitialData = true) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(withInitialData ? initialBookings : []);
  const [formData, setFormData] = useState<BookingFormData>({ ...emptyForm });
  const [errors, setErrors] = useState<FormErrors>({});

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

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return null;
    }
    setErrors({});
    return result.data;
  };

  const addBooking = (data: BookingFormData, date: Date) => {
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      service: serviceLabels[data.service] || data.service,
      date,
      time: data.time,
      status: "pending",
      queuePosition: activeBookings.length + 1,
      estimatedWait: activeBookings.length * 15,
    };
    setBookings((prev) => [...prev, newBooking]);
    setFormData({ ...emptyForm });
    return newBooking;
  };

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
  };

  const rescheduleBooking = (booking: Booking) => {
    setFormData({
      name: booking.name,
      email: booking.email,
      phone: booking.phone || "",
      service: services.find((s) => s.label === booking.service)?.value || booking.service,
      time: "",
    });
    setSelectedDate(new Date());
    cancelBooking(booking.id);
  };

  return {
    selectedDate,
    setSelectedDate,
    bookings,
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
  };
}
