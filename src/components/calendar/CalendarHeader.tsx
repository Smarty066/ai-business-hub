import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfWeek, endOfWeek } from "date-fns";

interface CalendarHeaderProps {
  currentWeek: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onNewPost: () => void;
  postCount: number;
}

export function CalendarHeader({
  currentWeek,
  onPrevWeek,
  onNextWeek,
  onToday,
  onNewPost,
  postCount,
}: CalendarHeaderProps) {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold">Content Calendar</h1>
          <Badge className="bg-primary/10 text-primary">{postCount} posts</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Plan and schedule your social media content for the week
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 glass-strong rounded-lg p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs px-3" onClick={onToday}>
            Today
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm font-medium text-muted-foreground hidden md:inline">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </span>
        <Button variant="hero" size="sm" onClick={onNewPost}>
          <Plus className="h-4 w-4 mr-1" />
          New Post
        </Button>
      </div>
    </div>
  );
}
