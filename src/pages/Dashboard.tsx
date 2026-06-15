import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Calendar,
  Wallet,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
  Package,
  StickyNote,
  Calculator as CalcIcon,
  Repeat,
  Share2,
  Crown,
  Lock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFreemiumGate } from "@/hooks/useFreemiumGate";

const freeTools = [
  {
    title: "Smart Notes",
    description: "Capture ideas, tasks & business notes",
    icon: StickyNote,
    href: "/notes",
    accent: "from-teal-500/20 to-teal-500/5",
    iconColor: "text-teal-400",
  },
  {
    title: "Calculator",
    description: "Profit margin & VAT calculations",
    icon: CalcIcon,
    href: "/calculator",
    accent: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
  },
  {
    title: "Currency Converter",
    description: "Live NGN ↔ USD conversion",
    icon: Repeat,
    href: "/converter",
    accent: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    title: "Affiliate Program",
    description: "Earn ₦1,000 / $0.50 per referral",
    icon: Share2,
    href: "/affiliate",
    accent: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
];

const premiumTools = [
  { title: "Customer CRM", description: "Track leads & follow-ups", icon: Users, href: "/customers" },
  { title: "Bookings", description: "Manage appointments", icon: Calendar, href: "/booking" },
  { title: "Budget & Finance", description: "Income & expense tracker", icon: Wallet, href: "/budget" },
  { title: "Inventory", description: "Stock & restock alerts", icon: Package, href: "/inventory" },
  { title: "Sales Reports", description: "Revenue insights & PDF export", icon: FileText, href: "/sales-report" },
];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { hasFullAccess, isPaidUser } = useFreemiumGate();

  const { data: salesCount } = useQuery({
    queryKey: ["dashboard-sales-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from("sales_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      return count ?? 0;
    },
    enabled: !!user?.id,
  });

  const { data: notesCount } = useQuery({
    queryKey: ["dashboard-notes-count", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      return count ?? 0;
    },
    enabled: !!user?.id,
  });

  const firstName = profile?.business_name || profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Hero header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/15 via-background to-background p-6 sm:p-8 animate-fade-in">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3 gap-1">
              <Sparkles className="h-3 w-3" />
              {hasFullAccess ? (isPaidUser ? "Premium member" : "Admin access") : "Free explorer"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Welcome back, {firstName} 👋
            </h1>
            <p className="text-muted-foreground max-w-xl">
              {hasFullAccess
                ? "Your full OjaLink toolkit is unlocked. Jump back into your business workflow."
                : "Start exploring your free tools below. Upgrade anytime to unlock premium business features."}
            </p>
          </div>
          {!hasFullAccess && (
            <Button variant="hero" size="lg" asChild className="shrink-0">
              <Link to="/pricing">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
          )}
        </div>

        {/* Inline mini-stats */}
        <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-background/40 backdrop-blur p-4">
            <p className="text-xs text-muted-foreground">Notes</p>
            <p className="text-2xl font-bold">{notesCount ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background/40 backdrop-blur p-4">
            <p className="text-xs text-muted-foreground">Sales logged</p>
            <p className="text-2xl font-bold">{salesCount ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-background/40 backdrop-blur p-4 col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground">Plan</p>
            <p className="text-2xl font-bold">{hasFullAccess ? "Premium" : "Free"}</p>
          </div>
        </div>
      </section>

      {/* Free tools */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h2 className="text-xl font-semibold">Free tools — explore now</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Available on every account. No subscription needed.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {freeTools.map((tool, i) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card/40 backdrop-blur p-5 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-background/60 border border-white/10 flex items-center justify-center">
                    <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                </div>
                <h3 className="font-semibold mb-1">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Premium tools */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-amber-400" />
              <h2 className="text-xl font-semibold">
                Premium tools {hasFullAccess ? "— unlocked" : "— preview"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {hasFullAccess
                ? "Full business suite at your fingertips."
                : "See what you'll unlock with the Premium plan."}
            </p>
          </div>
          {!hasFullAccess && (
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/pricing">View pricing</Link>
            </Button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {premiumTools.map((tool, i) => {
            const locked = !hasFullAccess;
            const Wrapper: any = locked ? "div" : Link;
            const wrapperProps = locked ? {} : { to: tool.href };
            return (
              <Wrapper
                key={tool.title}
                {...wrapperProps}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 animate-fade-in ${
                  locked
                    ? "border-white/5 bg-card/20 backdrop-blur"
                    : "border-white/10 bg-card/40 backdrop-blur hover:border-primary/40 hover:-translate-y-0.5 cursor-pointer"
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  {locked ? (
                    <Badge variant="outline" className="gap-1 border-amber-400/30 text-amber-400">
                      <Lock className="h-3 w-3" />
                      Locked
                    </Badge>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
                  )}
                </div>
                <h3 className="font-semibold mb-1">{tool.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                {locked && (
                  <Button variant="ghost" size="sm" asChild className="px-0 h-auto text-primary hover:text-primary hover:bg-transparent">
                    <Link to="/pricing">
                      Unlock <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                )}
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* Upgrade banner (only for free users) */}
      {!hasFullAccess && (
        <Card className="border-0 overflow-hidden relative animate-fade-in">
          <div className="absolute inset-0 gradient-primary opacity-90" />
          <CardContent className="relative p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="flex-1 text-primary-foreground">
              <h3 className="text-lg sm:text-xl font-bold mb-1">Ready to grow faster?</h3>
              <p className="text-sm text-primary-foreground/90">
                Unlock CRM, Bookings, Budget, Inventory & Sales Reports with one subscription.
              </p>
            </div>
            <Button variant="secondary" size="lg" asChild className="shrink-0">
              <Link to="/pricing">
                <Crown className="h-4 w-4 mr-2" />
                See plans
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
