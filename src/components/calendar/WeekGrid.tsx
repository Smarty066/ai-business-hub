import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { PostCard, type ScheduledPost } from "./PostCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeekGridProps {
  currentWeek: Date;
  posts: ScheduledPost[];
  onEditPost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
  onAddPost: (date: Date) => void;
}

export function WeekGrid({ currentWeek, posts, onEditPost, onDeletePost, onAddPost }: WeekGridProps) {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
      {days.map((day) => {
        const dayPosts = posts.filter((p) => isSameDay(new Date(p.date), day));
        const today = isToday(day);

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "glass-strong rounded-xl p-3 min-h-[180px] flex flex-col transition-all duration-200",
              today && "ring-1 ring-primary/50 glow-sm"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {format(day, "EEE")}
                </p>
                <p
                  className={cn(
                    "text-lg font-bold leading-tight",
                    today ? "text-primary" : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </p>
              </div>
              {today && (
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                  TODAY
                </span>
              )}
            </div>

            <div className="space-y-2 flex-1">
              {dayPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={onEditPost}
                  onDelete={onDeletePost}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 h-7 text-xs text-muted-foreground hover:text-primary"
              onClick={() => onAddPost(day)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        );
      })}
    </div>
  );
}
