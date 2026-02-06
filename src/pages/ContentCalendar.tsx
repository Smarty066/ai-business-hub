import { useState, useCallback } from "react";
import { addWeeks, subWeeks, startOfWeek, addDays } from "date-fns";
import { toast } from "sonner";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarStats } from "@/components/calendar/CalendarStats";
import { WeekGrid } from "@/components/calendar/WeekGrid";
import { NewPostDialog } from "@/components/calendar/NewPostDialog";
import { type ScheduledPost } from "@/components/calendar/PostCard";

// Seed demo posts relative to current week
function generateDemoPosts(): ScheduledPost[] {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  return [
    {
      id: "1",
      title: "New product launch 🚀",
      content:
        "✨ We're thrilled to announce our newest collection!\n\nPerfect for the rainy season. DM us to order 📩\n\n#MadeInNigeria #ShopSmall",
      platform: "instagram",
      date: weekStart,
      time: "09:00",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Customer appreciation post",
      content:
        "Thank you to all our amazing customers! 🙏 Your support keeps us going.\n\nTag someone who deserves a treat today! 🎁",
      platform: "facebook",
      date: weekStart,
      time: "14:00",
      status: "published",
    },
    {
      id: "3",
      title: "Midweek promo",
      content:
        "🔥 FLASH SALE — Wednesday only!\n\nGet 20% off all accessories.\n\nUse code MIDWEEK20 at checkout.\n\nShop now 👉 [link]",
      platform: "twitter",
      date: addDays(weekStart, 2),
      time: "10:00",
      status: "scheduled",
    },
    {
      id: "4",
      title: "WhatsApp broadcast",
      content:
        "Hello! 👋\n\nWe have exciting new arrivals this week.\n\nReply YES to see our latest catalog!\n\nFree delivery across Lagos 🚚",
      platform: "whatsapp",
      date: addDays(weekStart, 3),
      time: "08:00",
      status: "draft",
    },
    {
      id: "5",
      title: "Behind the scenes",
      content:
        "POV: When your small business starts trending 😍🔥\n\n#FYP #NigerianBusiness #SmallBusinessOwner",
      platform: "tiktok",
      date: addDays(weekStart, 4),
      time: "17:00",
      status: "draft",
    },
    {
      id: "6",
      title: "Professional update",
      content:
        "Excited to share that our team has grown to 5 members this quarter!\n\nWe're committed to delivering quality products across Nigeria.\n\nLooking for partners — let's connect! 🤝",
      platform: "linkedin",
      date: addDays(weekStart, 5),
      time: "11:00",
      status: "scheduled",
    },
  ];
}

export default function ContentCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [posts, setPosts] = useState<ScheduledPost[]>(generateDemoPosts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date>(new Date());

  const handlePrevWeek = useCallback(() => setCurrentWeek((w) => subWeeks(w, 1)), []);
  const handleNextWeek = useCallback(() => setCurrentWeek((w) => addWeeks(w, 1)), []);
  const handleToday = useCallback(() => setCurrentWeek(new Date()), []);

  const handleNewPost = useCallback(() => {
    setEditingPost(null);
    setDefaultDate(new Date());
    setDialogOpen(true);
  }, []);

  const handleAddPostOnDay = useCallback((date: Date) => {
    setEditingPost(null);
    setDefaultDate(date);
    setDialogOpen(true);
  }, []);

  const handleEditPost = useCallback((post: ScheduledPost) => {
    setEditingPost(post);
    setDialogOpen(true);
  }, []);

  const handleDeletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post deleted");
  }, []);

  const handleSavePost = useCallback(
    (postData: Omit<ScheduledPost, "id">) => {
      if (editingPost) {
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPost.id ? { ...postData, id: p.id } : p))
        );
        toast.success("Post updated!");
      } else {
        const newPost: ScheduledPost = {
          ...postData,
          id: crypto.randomUUID(),
        };
        setPosts((prev) => [...prev, newPost]);
        toast.success("Post scheduled!");
      }
    },
    [editingPost]
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <CalendarHeader
        currentWeek={currentWeek}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onToday={handleToday}
        onNewPost={handleNewPost}
        postCount={posts.length}
      />

      <CalendarStats posts={posts} />

      <WeekGrid
        currentWeek={currentWeek}
        posts={posts}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onAddPost={handleAddPostOnDay}
      />

      <NewPostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSavePost}
        editingPost={editingPost}
        defaultDate={defaultDate}
      />
    </div>
  );
}
