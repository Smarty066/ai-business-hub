import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: 2400, suffix: "+", label: "Businesses Automated" },
  { value: 15, suffix: "hrs", label: "Saved Weekly per User" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 50, suffix: "K+", label: "Posts Scheduled" },
];

const testimonials = [
  {
    name: "Adaeze Okafor",
    role: "Founder, Ada's Kitchen",
    text: "I used to spend 3 hours every day on social media and invoicing. OjaLink cut that to 30 minutes. My revenue is up 40% since I started using it.",
    rating: 5,
  },
  {
    name: "Tunde Bakare",
    role: "CEO, LogiMove Express",
    text: "The booking system alone saved my dispatch team from drowning in WhatsApp messages. Now customers book directly and we manage the queue effortlessly.",
    rating: 5,
  },
  {
    name: "Ngozi Eze",
    role: "Marketing Director, GlowUp Beauty",
    text: "The marketing funnel generator creates copy that actually sounds Nigerian. The AI templates are perfectly tuned for our market.",
    rating: 5,
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold text-gradient">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

function StatCard({ stat, index }: { stat: typeof stats[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn("scroll-reveal-scale", isVisible && "revealed")}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="glass-strong rounded-2xl p-6 text-center hover:glow-sm transition-all duration-300">
        <AnimatedCounter target={stat.value} suffix={stat.suffix} />
        <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn("scroll-reveal", isVisible && "revealed")}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="glass-strong rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 h-full">
        <div>
          <Quote className="h-8 w-8 text-primary/30 mb-4" />
          <p className="text-foreground/90 leading-relaxed mb-6">"{testimonial.text}"</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="font-semibold text-sm">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, idx) => (
              <Star
                key={idx}
                className="h-3.5 w-3.5 fill-warning text-warning"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialProofSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();

  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Testimonials Header */}
        <div
          ref={headerRef}
          className={cn("text-center mb-12 scroll-reveal", headerVisible && "revealed")}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Trusted by <span className="text-gradient">Growing Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Real results from entrepreneurs who automated their operations.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
