import { useCurrency, type CurrencyCode } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  size?: "sm" | "default";
  className?: string;
}

export function CurrencySelector({ size = "default", className }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency();

  const options: { code: CurrencyCode; label: string }[] = [
    { code: "NGN", label: "₦ NGN" },
    { code: "USD", label: "$ USD" },
  ];

  return (
    <div className={cn("inline-flex items-center rounded-lg bg-secondary/50 p-0.5", className)}>
      {options.map((opt) => (
        <Button
          key={opt.code}
          variant="ghost"
          size={size === "sm" ? "sm" : "sm"}
          onClick={() => setCurrency(opt.code)}
          className={cn(
            "rounded-md px-3 text-xs font-medium transition-all",
            currency === opt.code
              ? "bg-primary/10 text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
