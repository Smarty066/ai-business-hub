import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative glass-strong rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 gradient-glow opacity-50" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6 glow">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Join thousands of entrepreneurs and businesses saving hours every week with AI-powered automation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
