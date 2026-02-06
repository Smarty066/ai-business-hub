import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { type Platform, platformConfig } from "./PlatformBadge";
import { type ScheduledPost } from "./PostCard";

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (post: Omit<ScheduledPost, "id">) => void;
  editingPost?: ScheduledPost | null;
  defaultDate?: Date;
  onAITemplate?: () => boolean; // Returns false if limit reached
}

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00",
];

const contentTemplates: Record<Platform, string> = {
  instagram: "✨ Check out our latest [product]! Perfect for [audience]. \n\nDM us to order 📩\n\n#SmallBusiness #MadeInNigeria #ShopSmall",
  facebook: "🔥 New arrival alert!\n\nWe just restocked [product] — and it's selling fast!\n\nOrder now before it's gone 👉 [link]\n\nFree delivery in Lagos!",
  twitter: "Just dropped 🔥\n\n[Product] now available!\n\nRT & share with someone who needs this 🙌\n\n#NigerianBusiness #ShopLocal",
  linkedin: "Excited to announce that we've expanded our [product] line!\n\nAs a growing business, we're committed to delivering quality products to our customers across Nigeria.\n\nLet's connect! 🤝",
  whatsapp: "Hello! 👋\n\nThank you for your interest in our products.\n\nWe have [product] available at ₦[price].\n\nWould you like to place an order? We deliver nationwide! 🚚",
  tiktok: "POV: When your customers see the new [product] 😍🔥\n\n#FYP #NigerianBusiness #SmallBusinessOwner #Trending",
};

export function NewPostDialog({
  open,
  onOpenChange,
  onSave,
  editingPost,
  defaultDate,
  onAITemplate,
}: NewPostDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [date, setDate] = useState<Date>(defaultDate || new Date());
  const [time, setTime] = useState("09:00");
  const [status, setStatus] = useState<ScheduledPost["status"]>("draft");

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setPlatform(editingPost.platform);
      setDate(new Date(editingPost.date));
      setTime(editingPost.time);
      setStatus(editingPost.status);
    } else {
      setTitle("");
      setContent("");
      setPlatform("instagram");
      setDate(defaultDate || new Date());
      setTime("09:00");
      setStatus("draft");
    }
  }, [editingPost, defaultDate, open]);

  const handleAutoGenerate = () => {
    // Check freemium gate if provided
    if (onAITemplate) {
      const allowed = onAITemplate();
      if (!allowed) return;
    }
    setContent(contentTemplates[platform]);
    if (!title) setTitle(`${platformConfig[platform].label} Post`);
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content, platform, date, time, status });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-strong border-border">
        <DialogHeader>
          <DialogTitle>{editingPost ? "Edit Post" : "Schedule New Post"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Platform */}
          <div className="space-y-1.5">
            <Label className="text-xs">Platform</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(platformConfig) as Platform[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {platformConfig[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs">Post Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Monday product showcase"
            />
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Content</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-primary"
                onClick={handleAutoGenerate}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                AI Template
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content..."
              rows={5}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {date ? format(date, "MMM d, yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ScheduledPost["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">📝 Draft</SelectItem>
                <SelectItem value="scheduled">📅 Scheduled</SelectItem>
                <SelectItem value="published">✅ Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="hero"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
            >
              {editingPost ? "Update Post" : "Schedule Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
