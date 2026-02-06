import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlatformBadge, type Platform } from "./PlatformBadge";
import { Clock, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  date: Date;
  time: string;
  status: "draft" | "scheduled" | "published";
}

const statusStyles: Record<ScheduledPost["status"], string> = {
  draft: "border-l-warning",
  scheduled: "border-l-primary",
  published: "border-l-success",
};

interface PostCardProps {
  post: ScheduledPost;
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  return (
    <Card
      className={cn(
        "glass-strong border-0 border-l-2 animate-fade-in cursor-pointer hover:glow-sm transition-all duration-200 group",
        statusStyles[post.status]
      )}
      onClick={() => onEdit(post)}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-1">
          <PlatformBadge platform={post.platform} size="sm" />
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => { e.stopPropagation(); onEdit(post); }}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={(e) => { e.stopPropagation(); onDelete(post.id); }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <p className="text-xs font-medium line-clamp-2">{post.title}</p>
        <p className="text-[11px] text-muted-foreground line-clamp-2">{post.content}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{post.time}</span>
        </div>
      </CardContent>
    </Card>
  );
}
