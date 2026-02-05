import { Megaphone, Calendar, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Marketing Funnel Generator",
    description: "Generate compelling sales copy, ad variations, email sequences, and landing pages with AI. Perfect your message in seconds.",
    icon: Megaphone,
    href: "/marketing",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Smart Booking System",
    description: "Create public booking pages, manage queues, and let AI predict wait times. Streamline your scheduling workflow.",
    icon: Calendar,
    href: "/booking",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Budget & Finance",
    description: "Track income and expenses, get AI-powered financial insights, and manage your business finances with clarity.",
    icon: Wallet,
    href: "/budget",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Three Powerful Modules
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run your business more efficiently, all in one integrated suite.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={cn(
                "group relative overflow-hidden glass-strong border-0 hover:scale-[1.02] transition-all duration-300",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 gradient-card opacity-50" />
              <CardHeader className="relative">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", feature.bgColor)}>
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
                    <span className="text-primary font-medium">Learn more</span>
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
