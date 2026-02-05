import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-gradient">Smart AI Suite</span>
          </div>

          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/marketing" className="hover:text-foreground transition-colors">
              Marketing
            </Link>
            <Link to="/booking" className="hover:text-foreground transition-colors">
              Booking
            </Link>
            <Link to="/budget" className="hover:text-foreground transition-colors">
              Budget
            </Link>
            <Link to="/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Smart AI Suite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
