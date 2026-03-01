import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  StickyNote,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

const COLORS = [
  { value: "default", label: "Default", class: "bg-card" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500/10 border-yellow-500/20" },
  { value: "green", label: "Green", class: "bg-green-500/10 border-green-500/20" },
  { value: "blue", label: "Blue", class: "bg-blue-500/10 border-blue-500/20" },
  { value: "pink", label: "Pink", class: "bg-pink-500/10 border-pink-500/20" },
];

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", color: "default" });
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", user.id)
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false });
    setNotes((data as Note[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, search]);

  // Highlight matching text (safe - no dangerouslySetInnerHTML)
  const highlightText = (text: string) => {
    if (!search.trim()) return <>{text}</>;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase()
            ? <mark key={i} className="bg-primary/30 rounded px-0.5">{part}</mark>
            : <span key={i}>{part}</span>
        )}
      </>
    );
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!user) return;

    if (editingId) {
      await supabase
        .from("notes")
        .update({ title: form.title, content: form.content, color: form.color })
        .eq("id", editingId);
      toast.success("Note updated!");
    } else {
      await supabase.from("notes").insert({
        user_id: user.id,
        title: form.title,
        content: form.content,
        color: form.color,
      });
      toast.success("Note created!");
    }
    setForm({ title: "", content: "", color: "default" });
    setShowForm(false);
    setEditingId(null);
    fetchNotes();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    toast.success("Note deleted");
    fetchNotes();
  };

  const togglePin = async (note: Note) => {
    await supabase.from("notes").update({ pinned: !note.pinned }).eq("id", note.id);
    fetchNotes();
  };

  const startEdit = (note: Note) => {
    setForm({ title: note.title, content: note.content, color: note.color });
    setEditingId(note.id);
    setShowForm(true);
  };

  const getColorClass = (color: string) =>
    COLORS.find((c) => c.value === color)?.class || "bg-card";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <StickyNote className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Notes</h1>
              <p className="text-muted-foreground">
                Jot down ideas, reminders & never forget anything.
              </p>
            </div>
          </div>
          <Button
            variant="hero"
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm({ title: "", content: "", color: "default" });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your notes..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card className="glass-strong border-primary/30 mb-6 animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {editingId ? "Edit Note" : "New Note"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Note title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your note..."
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`w-8 h-8 rounded-lg border-2 ${c.class} ${
                      form.color === c.value ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                    }`}
                    onClick={() => setForm({ ...form, color: c.value })}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="hero" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? "Update" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Grid */}
      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading notes...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <StickyNote className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {search ? "No notes match your search" : "No notes yet. Create your first one!"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <Card
              key={note.id}
              className={`${getColorClass(note.color)} border hover:scale-[1.01] transition-all duration-200`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm flex-1">
                    {highlightText(note.title)}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    {note.pinned && (
                      <Pin className="h-3 w-3 text-primary fill-primary" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4 mb-3">
                  {highlightText(note.content)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => togglePin(note)}
                    >
                      <Pin className={`h-3.5 w-3.5 ${note.pinned ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => startEdit(note)}
                    >
                      <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
