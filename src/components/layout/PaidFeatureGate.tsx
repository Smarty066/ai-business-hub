import { useFreemiumGate } from "@/hooks/useFreemiumGate";
import { UpgradeDialog } from "@/components/freemium/UpgradeDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface PaidFeatureGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export function PaidFeatureGate({ children, featureName }: PaidFeatureGateProps) {
  const { hasFullAccess } = useFreemiumGate();

  if (hasFullAccess) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="glass-strong border-primary/20 max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto glow">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {featureName ? `${featureName} is a Paid Feature` : "Paid Feature"}
            </h2>
            <p className="text-muted-foreground">
              Subscribe to the Paid Plan to unlock {featureName || "this feature"} and all other premium tools.
            </p>
          </div>
          <Button variant="hero" size="lg" asChild className="w-full">
            <Link to="/pricing">
              <Crown className="h-5 w-5 mr-2" />
              View Pricing & Subscribe
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
