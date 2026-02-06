import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Sparkles, Zap, CheckCircle2 } from "lucide-react";

interface UpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const perks = [
  "Unlimited AI content generations",
  "Unlimited WhatsApp templates",
  "Social media content calendar",
  "Advanced AI insights & tips",
  "PDF & report exports",
  "Priority support",
];

export function UpgradeDialog({ open, onOpenChange }: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-strong border-border text-center">
        <DialogHeader className="items-center">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-2 glow">
            <Crown className="h-8 w-8 text-primary-foreground" />
          </div>
          <DialogTitle className="text-2xl">
            You've hit your free limit
          </DialogTitle>
          <DialogDescription className="text-base">
            You've used all <strong>5 free AI generations</strong> this month.
            Upgrade to Growth for unlimited access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 text-left my-4">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm text-foreground">{perk}</span>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-4 mb-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold">₦2,500</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            or ₦25,000/year (save 17%)
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="hero" size="lg" asChild>
            <Link to="/pricing">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Growth
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
