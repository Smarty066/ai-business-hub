import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, TrendingUp, CheckCircle2 } from "lucide-react";

const benefits = [
  "No credit card required",
  "Set up in under 2 minutes",
  "Cancel anytime",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-glow" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-[60%] left-[60%] w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Used by 2,400+ Nigerian businesses
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-foreground">Stop Working Hard.</span>
          <br />
          <span className="text-gradient">Start Working Smart.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Marketing funnels, booking management, content scheduling, and financial tracking — 
          all automated with AI so you can focus on growing your business.
        </p>

        {/* Trust bullets */}
        <div
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10 animate-fade-in"
          style={{ animationDelay: "0.25s" }}
        >
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Button variant="hero" size="xl" asChild>
            <Link to="/dashboard">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link to="/pricing">See Pricing</Link>
          </Button>
        </div>

        {/* Feature Pills */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <FeaturePill icon={Zap} text="Marketing Funnels" />
          <FeaturePill icon={TrendingUp} text="Smart Booking" />
          <FeaturePill icon={Sparkles} text="Content Calendar" />
          <FeaturePill icon={Sparkles} text="Budget Insights" />
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full glass">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}
