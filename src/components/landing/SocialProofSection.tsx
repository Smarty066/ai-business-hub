import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

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
    text: "I used to spend 3 hours every day on social media and invoicing. Smart AI Suite cut that to 30 minutes. My revenue is up 40% since I started using it.",
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
    text: "Our content calendar keeps our 5 social accounts running like clockwork. The AI templates are perfectly tuned for the Nigerian market.",
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

export function SocialProofSection() {
  return (
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-strong rounded-2xl p-6 text-center hover:glow-sm transition-all duration-300"
            >
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials Header */}
        <div className="text-center mb-12">
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
            <div
              key={t.name}
              className="glass-strong rounded-2xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div>
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground/90 leading-relaxed mb-6">"{t.text}"</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3.5 w-3.5 fill-warning text-warning"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
