import { Megaphone, Calendar, Wallet, CalendarDays, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Marketing Funnel Generator",
    description:
      "Generate sales copy, ad variations, email sequences, and landing page drafts with AI — tuned for the Nigerian market.",
    icon: Megaphone,
    href: "/marketing",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Smart Booking System",
    description:
      "Create public booking pages, manage queues, and let AI predict wait times. No more WhatsApp chaos.",
    icon: Calendar,
    href: "/booking",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Content Calendar",
    description:
      "Plan and schedule posts across Instagram, Facebook, WhatsApp, Twitter, and TikTok with AI-generated templates.",
    icon: CalendarDays,
    href: "/content-calendar",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Customer Follow-Up CRM",
    description:
      "Track leads, set follow-up reminders, and never let a potential customer slip through the cracks again.",
    icon: Users,
    href: "/customers",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Budget & Finance",
    description:
      "Track income and expenses, get AI-powered financial insights, and manage your business finances with clarity.",
    icon: Wallet,
    href: "/budget",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Everything You Need
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Five Modules. <span className="text-gradient">One Platform.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Run marketing, bookings, content, customers, and finances from a single dashboard — no more juggling 10 different tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group relative overflow-hidden glass-strong border-0 hover:scale-[1.02] hover:glow-sm transition-all duration-300",
                "animate-fade-in",
                index >= 3 && "md:col-span-1"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 gradient-card opacity-50" />
              <CardHeader className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                    feature.bgColor
                  )}
                >
                  <feature.icon className={cn("h-6 w-6", feature.color)} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <Button variant="ghost" className="group/btn p-0" asChild>
                  <Link to={feature.href}>
                    <span className="text-primary font-medium">Explore</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-primary transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
