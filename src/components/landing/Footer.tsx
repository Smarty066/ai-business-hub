import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const productLinks = [
  { label: "Marketing", to: "/marketing" },
  { label: "Booking", to: "/booking" },
  { label: "Content Calendar", to: "/content-calendar" },
  { label: "Customers", to: "/customers" },
  { label: "Budget", to: "/budget" },
];

const companyLinks = [
  { label: "Pricing", to: "/pricing" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "Settings", to: "/settings" },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-gradient">OjaLink</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The all-in-one AI productivity suite built for Nigerian entrepreneurs and growing businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OjaLink. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built with ❤️ for Nigerian businesses
          </p>
        </div>
      </div>
    </footer>
  );
}
