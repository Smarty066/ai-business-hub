import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight, CheckCircle2, Sparkles, Zap, Calendar, Users, Wallet,
  Package, FileText, Gift, StickyNote, ArrowLeftRight, Calculator,
  Star, Quote, Shield, ChevronDown, CreditCard, BarChart3, Clock,
  TrendingUp, MessageCircle, Mail, Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useRef, useState } from "react";

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled ? "glass py-3" : "py-5"
    )}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-gradient">OjaLink</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/register">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-16">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-glow" />
      <div className="absolute top-1/4 left-[15%] w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-[15%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Trusted by 2,400+ Nigerian businesses</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <span className="text-foreground">Run Your Business</span>
          <br />
          <span className="text-gradient">From One Dashboard.</span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Bookings, customers, inventory, sales reports, budgets & affiliate earnings — all in one place. Built for Nigerian entrepreneurs.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          {["No credit card required", "Set up in 2 minutes", "Cancel anytime"].map((b) => (
            <div key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span>{b}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button variant="hero" size="xl" asChild>
            <Link to="/register">
              Start Free — No Card Needed
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link to="/pricing">See Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─── Features ─── */
const features = [
  { title: "Smart Booking System", desc: "Let customers book directly from your public page. Manage queues, slots & appointments — no more WhatsApp chaos.", icon: Calendar, color: "text-success", bg: "bg-success/10", href: "/booking" },
  { title: "Customer CRM", desc: "Track every lead, set follow-up reminders, and watch your conversion rate climb. Never lose a customer again.", icon: Users, color: "text-primary", bg: "bg-primary/10", href: "/customers" },
  { title: "Inventory Management", desc: "Track stock levels, cost-to-sale margins, and get AI-powered restock alerts before you run out.", icon: Package, color: "text-warning", bg: "bg-warning/10", href: "/inventory" },
  { title: "Sales Reports", desc: "Log daily sales, generate branded PDF reports, and track revenue by day, week, or month.", icon: FileText, color: "text-primary", bg: "bg-primary/10", href: "/sales-report" },
  { title: "Budget & Finance", desc: "Track income and expenses, get financial insights, and keep your business finances crystal clear.", icon: Wallet, color: "text-success", bg: "bg-success/10", href: "/budget" },
  { title: "Affiliate Program", desc: "Earn ₦1,000 per referral signup and ₦250 for each monthly subscription. Share, earn, repeat.", icon: Gift, color: "text-warning", bg: "bg-warning/10", href: "/affiliate" },
  { title: "Quick Notes", desc: "Pin important ideas, to-dos, and reminders. Color-code and organize everything in seconds.", icon: StickyNote, color: "text-primary", bg: "bg-primary/10", href: "/notes" },
  { title: "Currency Converter", desc: "Convert between ₦ and $ instantly. Always know the real value of your transactions.", icon: ArrowLeftRight, color: "text-success", bg: "bg-success/10", href: "/converter" },
];

function FeaturesSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div ref={headerRef} className={cn("text-center mb-10 scroll-reveal", headerVisible && "revealed")}>
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">Everything You Need</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Eight Powerful Tools. <span className="text-gradient">One Platform.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stop juggling 5 different apps. OjaLink gives you everything to run, grow, and scale your business.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  return (
    <div ref={ref} className={cn("scroll-reveal", isVisible && "revealed")} style={{ transitionDelay: `${index * 60}ms` }}>
      <Card className="group glass-strong border-0 hover:scale-[1.02] hover:glow-sm transition-all duration-300 h-full">
        <CardContent className="p-5">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", feature.bg)}>
            <feature.icon className={cn("h-5 w-5", feature.color)} />
          </div>
          <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{feature.desc}</p>
          <Link to={feature.href} className="text-xs text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Explore <ArrowRight className="h-3 w-3" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── How It Works ─── */
function HowItWorks() {
  const { ref, isVisible } = useScrollReveal();
  const steps = [
    { step: "1", title: "Create Your Free Account", desc: "Sign up in under 2 minutes with your business name, email, and phone.", icon: Shield },
    { step: "2", title: "Set Up Your Tools", desc: "Activate booking pages, add inventory, import customers — or start fresh.", icon: Zap },
    { step: "3", title: "Grow & Scale", desc: "Track sales, manage customers, earn with affiliates. All from one dashboard.", icon: TrendingUp },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div ref={ref} className={cn("text-center mb-10 scroll-reveal", isVisible && "revealed")}>
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">Simple Setup</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Up and Running in <span className="text-gradient">3 Steps</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const { ref: cardRef, isVisible: cardVisible } = useScrollReveal({ threshold: 0.1 });
            return (
              <div key={s.step} ref={cardRef} className={cn("scroll-reveal", cardVisible && "revealed")} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="glass-strong rounded-2xl p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-primary-foreground">{s.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats + Testimonials ─── */
const stats = [
  { value: 2400, suffix: "+", label: "Businesses Using OjaLink" },
  { value: 15, suffix: "hrs", label: "Saved Weekly per User" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 50, suffix: "K+", label: "Sales Tracked" },
];

const testimonials = [
  { name: "Adaeze Okafor", role: "Founder, Ada's Kitchen", text: "I used to spend 3 hours every day managing orders. OjaLink cut that to 30 minutes. My revenue is up 40%.", rating: 5 },
  { name: "Tunde Bakare", role: "CEO, LogiMove Express", text: "The booking system alone saved my dispatch team from drowning in WhatsApp messages. Now customers book directly.", rating: 5 },
  { name: "Ngozi Eze", role: "Owner, GlowUp Beauty", text: "The inventory tracking and sales reports let me see exactly where my money goes. I've never felt more in control.", rating: 5 },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 40;
        const inc = target / steps;
        let cur = 0;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= target) { setCount(target); clearInterval(t); }
          else setCount(Math.floor(cur));
        }, 1500 / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref} className="text-3xl font-bold text-gradient">{count.toLocaleString()}{suffix}</div>;
}

function SocialProofSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => {
            const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
            return (
              <div key={s.label} ref={ref} className={cn("scroll-reveal-scale", isVisible && "revealed")} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="glass-strong rounded-2xl p-5 text-center hover:glow-sm transition-all">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div ref={headerRef} className={cn("text-center mb-8 scroll-reveal", headerVisible && "revealed")}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Trusted by <span className="text-gradient">Growing Businesses</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Real results from entrepreneurs who switched to OjaLink.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => {
            const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
            return (
              <div key={t.name} ref={ref} className={cn("scroll-reveal", isVisible && "revealed")} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="glass-strong rounded-2xl p-5 h-full flex flex-col justify-between hover:scale-[1.01] transition-all">
                  <div>
                    <Quote className="h-6 w-6 text-primary/30 mb-3" />
                    <p className="text-sm text-foreground/90 leading-relaxed mb-4">"{t.text}"</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                      <p className="font-semibold text-xs">{t.name}</p>
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function AboutSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section id="about" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className={cn("scroll-reveal", isVisible && "revealed")}>
          <div className="glass-strong rounded-2xl p-8 sm:p-10">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">About Us</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              What is <span className="text-gradient">OjaLink?</span>
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">OjaLink</strong> is an all-in-one business management platform purpose-built for Nigerian entrepreneurs, small business owners, and hustlers who want to stop juggling multiple apps and start running everything from one clean dashboard.
              </p>
              <p>
                Whether you sell food, run a salon, manage a logistics company, or handle any kind of business — OjaLink brings your <strong className="text-foreground">bookings, customer management, inventory tracking, sales reports, budget planning, notes, and affiliate earnings</strong> into one simple platform. No stress, no wahala.
              </p>
              <p>
                We built OjaLink because Nigerian business owners deserve tools that actually work for them. Instead of spending hours on WhatsApp coordinating bookings, scribbling sales in notebooks, or losing track of inventory — OjaLink automates and organizes everything so you can focus on what matters: <strong className="text-foreground">growing your business</strong>.
              </p>
              <p>
                With OjaLink, you can let customers book appointments from your public link, track every sale and generate branded PDF reports, manage your inventory with restock alerts, keep your finances crystal clear with income/expense tracking, and even earn money by referring other business owners through our affiliate program.
              </p>
              <p>
                OjaLink is <strong className="text-foreground">free to start</strong>, takes less than 2 minutes to set up, and works on any device. Whether you're in Lagos, Abuja, Port Harcourt, or anywhere in Nigeria — OjaLink is your business companion that never sleeps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Us ─── */
function ContactSection() {
  const { ref, isVisible } = useScrollReveal();
  return (
    <section id="contact" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div ref={ref} className={cn("scroll-reveal", isVisible && "revealed")}>
          <div className="text-center mb-8">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">Get In Touch</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Contact <span className="text-gradient">Us</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Have questions, feedback, or need help? We're always here for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a
              href="mailto:faruqabiola629@gmail.com"
              className="glass-strong rounded-2xl p-6 text-center hover:scale-[1.02] hover:glow-sm transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Email Us</h3>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                faruqabiola629@gmail.com
              </p>
            </a>
            <a
              href="https://wa.me/2349071926462"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-strong rounded-2xl p-6 text-center hover:scale-[1.02] hover:glow-sm transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-sm mb-1">WhatsApp</h3>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                09071926462
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
const faqs = [
  { q: "Is OjaLink really free?", a: "Yes! Our Starter plan is completely free forever. You get access to all core features including bookings, customer tracking, inventory, sales reports, and notes. Premium features are available on paid plans." },
  { q: "Do I need any technical knowledge?", a: "Not at all. OjaLink is designed for everyday business owners. If you can use WhatsApp, you can use OjaLink. Setup takes less than 2 minutes." },
  { q: "How does the affiliate program work?", a: "Share your unique referral link. You earn ₦1,000 ($0.50) when someone signs up and ₦250 ($0.25) for each month they stay subscribed. You can withdraw earnings or use them to pay for your own subscription." },
  { q: "Can my customers book appointments directly?", a: "Yes! OjaLink creates a public booking page for your business. Share the link on WhatsApp, Instagram, or your website — customers book directly and you manage everything from your dashboard." },
  { q: "What currencies does OjaLink support?", a: "OjaLink supports Nigerian Naira (₦) and US Dollars ($). You can switch between currencies at any time, and all your reports will update automatically." },
  { q: "Is my data safe?", a: "Absolutely. We use enterprise-grade security with encrypted data storage, secure authentication, and row-level security policies. Your data is protected and only accessible by you." },
  { q: "Can I export my sales reports?", a: "Yes! You can export branded PDF reports with your business name for daily, weekly, or monthly periods. You can also share reports directly via WhatsApp or any messaging app." },
  { q: "How do I get help if I'm stuck?", a: "You can reach us via email at support@ojalink.com. We also provide in-app tips and a knowledge base to help you get the most out of OjaLink." },
];

function FAQSection() {
  const { ref, isVisible } = useScrollReveal();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className={cn("text-center mb-8 scroll-reveal", isVisible && "revealed")}>
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Got Questions? <span className="text-gradient">We've Got Answers.</span>
          </h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-strong rounded-xl overflow-hidden transition-all"
            >
              <button
                className="w-full flex items-center justify-between p-4 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });
  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div ref={ref} className={cn("relative glass-strong rounded-3xl p-8 sm:p-10 text-center overflow-hidden scroll-reveal-scale", isVisible && "revealed")}>
          <div className="absolute inset-0 gradient-glow opacity-50" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4 glow">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Ready to <span className="text-gradient">Work Smarter?</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-5">
              Join 2,400+ businesses saving 15+ hours every week with OjaLink.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              {["Free Starter plan — ₦0 forever", "No credit card required", "Full feature access"].map((p) => (
                <div key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/pricing">Compare Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const productLinks = [
    { label: "Booking", to: "/booking" },
    { label: "Customers", to: "/customers" },
    { label: "Inventory", to: "/inventory" },
    { label: "Sales Reports", to: "/sales-report" },
    { label: "Budget", to: "/budget" },
    { label: "Affiliate", to: "/affiliate" },
  ];
  const companyLinks = [
    { label: "Pricing", to: "/pricing" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "Settings", to: "/settings" },
  ];

  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-gradient">OjaLink</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The all-in-one business management platform built for Nigerian entrepreneurs. Run smarter, grow faster.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} OjaLink. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/60">Built with ❤️ for Nigerian businesses</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Landing Page ─── */
export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <AboutSection />
      <SocialProofSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  );
}
