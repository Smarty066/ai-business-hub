import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Check, X, Zap, Crown, Sparkles, ArrowRight, Users,
  Calendar, Wallet, BookOpen, Shield, Package, FileText, Gift,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useCurrency, PRICING } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";

const getPlans = (symbol: string, monthly: number, annual: number) => [
  {
    id: "free",
    name: "Starter",
    description: "Perfect for getting started with your business",
    price: `${symbol}0`,
    period: "Free forever",
    icon: Zap,
    highlight: false,
    cta: "Register Free",
    features: [
      { name: "Currency Converter", included: true },
      { name: "Quick Notes", included: true },
      { name: "Business Calculator", included: true },
      { name: "Affiliate Program", included: true },
      { name: "Unlimited inventory & restock alerts", included: false },
      { name: "Advanced AI insights", included: false },
      { name: "Unlimited sales reports", included: false },
      { name: "PDF export", included: false },
      { name: "Priority support", included: false },
    ],
  },
  {
    id: "premium",
    name: "Paid Plan",
    description: "Everything you need to scale your business",
    monthlyPrice: monthly,
    annualPrice: annual,
    icon: Crown,
    highlight: true,
    cta: "Upgrade to Paid Plan",
    features: [
      { name: "Unlimited AI generations", included: true },
      { name: "Full budget & finance suite", included: true },
      { name: "Unlimited customers & CRM", included: true },
      { name: "Unlimited bookings", included: true },
      { name: "Full inventory with restock alerts", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced AI insights & tips", included: true },
      { name: "Inventory forecasting", included: true },
      { name: "Unlimited sales reports", included: true },
      { name: "PDF & report exports", included: true },
      { name: "Custom branding", included: true },
      { name: "Affiliate earnings tracking", included: true },
    ],
  },
];

const testimonials = [
  {
    name: "Adaeze O.",
    business: "Fashion Boutique, Lagos",
    quote: "Since upgrading, my customer follow-ups increased sales by 40%. The CRM and booking tools saved me hours every week.",
  },
  {
    name: "Tunde A.",
    business: "Electronics Store, Abuja",
    quote: "The restock alerts help me never run out of fast-selling items. My inventory is always organized now!",
  },
  {
    name: "Blessing E.",
    business: "Catering Service, Port Harcourt",
    quote: "I was doing everything manually before. Now I manage bookings, finances, and sales reports from one place. Game changer!",
  },
];

const faqs = [
  {
    q: "How does the subscription work?",
    a: "Your subscription renews automatically every month. You get uninterrupted access to all Paid Plan features without needing to manually renew.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept card payments via Paystack (supports Nigerian and international cards) and cryptocurrency payments via NowPayments.io (Bitcoin, USDT, and more).",
  },
  {
    q: "Can I switch between free and paid?",
    a: "Your data is always safe. Free features (Converter, Notes, Calculator, Affiliate) are always available. Subscribe to unlock premium features like CRM, inventory, sales reports, and more.",
  },
  {
    q: "Is there a yearly discount?",
    a: "Yes! Pay annually and get 2 months free.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const { currency, symbol, formatAmount } = useCurrency();
  const pricing = PRICING[currency];
  const plans = getPlans(symbol, pricing.monthly, pricing.annual);

  const handleSubscribe = (planId: string) => {
    if (planId === "free") {
      toast.success("You're already on the free plan! Start exploring.");
    } else {
      toast.info("Redirecting to payment...");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="bg-primary/10 text-primary mb-4">Simple Pricing</Badge>
        <h1 className="text-4xl font-bold mb-3">
          Grow your business, <span className="text-gradient">not your expenses</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Start with a 7-day free trial. Upgrade when you're ready. Everything you need to run and grow your business.
        </p>

        {/* Currency + Annual toggle */}
        <div className="flex flex-col items-center gap-4 mt-6">
          <CurrencySelector />
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground">Monthly</Label>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <Label className="text-sm text-muted-foreground">
              Annually
              <Badge className="ml-2 bg-success/10 text-success text-xs">Save 17%</Badge>
            </Label>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
        {plans.map((plan, index) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden animate-fade-in ${
              plan.highlight ? "glass-strong border-primary/50 glow" : "glass-strong border-0"
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {plan.highlight && (
              <div className="absolute top-0 inset-x-0 h-1 gradient-primary" />
            )}
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.highlight ? "gradient-primary" : "bg-secondary"
                }`}>
                  <plan.icon className={`h-6 w-6 ${
                    plan.highlight ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                </div>
                {plan.highlight && (
                  <Badge className="bg-primary/10 text-primary">Most Popular</Badge>
                )}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {plan.id === "premium"
                    ? formatAmount(annual ? (plan as any).annualPrice : (plan as any).monthlyPrice)
                    : plan.price}
                </span>
                <span className="text-muted-foreground ml-1">
                  {plan.id === "premium"
                    ? annual ? "/year" : "/month"
                    : plan.period}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={plan.highlight ? "hero" : "outline"}
                className="w-full"
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
              <div className="space-y-3 pt-4 border-t border-border">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      feature.included ? "text-foreground" : "text-muted-foreground/50"
                    }`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* What's Included */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Everything in one <span className="text-gradient">powerful suite</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Users, title: "Customer CRM", desc: "Track leads, follow-ups, and never lose a customer" },
            { icon: Calendar, title: "Smart Bookings", desc: "Manage appointments with queue predictions" },
            { icon: Wallet, title: "Budget Tracker", desc: "Monitor income, expenses & get AI savings tips" },
            { icon: Package, title: "Inventory", desc: "Track stock levels, manage items & get restock alerts" },
            { icon: FileText, title: "Sales Reports", desc: "Log daily sales and generate branded PDF reports" },
            { icon: Gift, title: "Affiliate Program", desc: "Earn ₦1,000 per referral signup and ₦250 per subscription" },
          ].map((feature, index) => (
            <Card key={feature.title} className="glass-strong border-0 animate-fade-in" style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
              <CardContent className="p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Trusted by <span className="text-gradient">business owners</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, index) => (
            <Card key={t.name} className="glass-strong border-0 animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
              <CardContent className="p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles key={i} className="h-3.5 w-3.5 text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.business}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently asked <span className="text-gradient">questions</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card key={index} className="glass-strong border-0 animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.05}s` }}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-1">{faq.q}</p>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <Card className="glass-strong border-0 glow animate-fade-in max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Ready to grow your business?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of businesses already using OjaLink to scale smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" onClick={() => handleSubscribe("premium")}>
              <Crown className="h-5 w-5 mr-2" />
              Start Paid Plan
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/dashboard">Try Free First</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
