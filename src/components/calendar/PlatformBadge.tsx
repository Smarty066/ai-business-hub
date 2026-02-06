import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "whatsapp" | "tiktok";

const platformConfig: Record<Platform, { label: string; className: string }> = {
  instagram: { label: "Instagram", className: "bg-pink-500/15 text-pink-400 border-pink-500/30" },
  facebook: { label: "Facebook", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  twitter: { label: "X / Twitter", className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
  linkedin: { label: "LinkedIn", className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
  whatsapp: { label: "WhatsApp", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  tiktok: { label: "TikTok", className: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30" },
};

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "default";
}

export function PlatformBadge({ platform, size = "default" }: PlatformBadgeProps) {
  const config = platformConfig[platform];
  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs"
      )}
    >
      {config.label}
    </Badge>
  );
}

export { platformConfig };
