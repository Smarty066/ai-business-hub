import { Megaphone, Calendar, Wallet, CalendarDays, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

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

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn("scroll-reveal", isVisible && "revealed")}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden glass-strong border-0 hover:scale-[1.02] hover:glow-sm transition-all duration-300 h-full"
        )}
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
    </div>
  );
}

export function FeaturesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div
          ref={headerRef}
          className={cn("text-center mb-16 scroll-reveal", headerVisible && "revealed")}
        >
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">
            Everything You Need
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Four Modules. <span className="text-gradient">One Platform.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Run marketing, bookings, customers, and finances from a single dashboard — no more juggling different tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
