import { Card, CardContent } from "@/components/ui/card";
import { FileText, CalendarCheck, CheckCircle, BarChart3 } from "lucide-react";
import { type ScheduledPost } from "./PostCard";
import { type Platform, platformConfig } from "./PlatformBadge";

interface CalendarStatsProps {
  posts: ScheduledPost[];
}

export function CalendarStats({ posts }: CalendarStatsProps) {
  const drafts = posts.filter((p) => p.status === "draft").length;
  const scheduled = posts.filter((p) => p.status === "scheduled").length;
  const published = posts.filter((p) => p.status === "published").length;

  // Platform breakdown
  const platformCounts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.platform] = (acc[p.platform] || 0) + 1;
    return acc;
  }, {});

  const topPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0];

  const stats = [
    { label: "Drafts", value: drafts, icon: FileText, color: "text-warning" },
    { label: "Scheduled", value: scheduled, icon: CalendarCheck, color: "text-primary" },
    { label: "Published", value: published, icon: CheckCircle, color: "text-success" },
    {
      label: "Top Platform",
      value: topPlatform ? platformConfig[topPlatform[0] as Platform].label : "—",
      icon: BarChart3,
      color: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <Card key={stat.label} className="glass-strong border-0 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
