import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Shield, Sparkles, Users, Activity, FileText, Loader2, Trash2, Image,
} from "lucide-react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { format } from "date-fns";

interface AffiliateContent {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  user_email: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  business_name: string;
  phone: string;
  created_at: string;
}

export default function Admin() {
  const { user, session } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [contents, setContents] = useState<AffiliateContent[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [generateImage, setGenerateImage] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    const [contentRes, activityRes, usersRes] = await Promise.all([
      supabase.from("affiliate_content").select("*").order("created_at", { ascending: false }),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    ]);
    setContents((contentRes.data as AffiliateContent[]) || []);
    setActivities((activityRes.data as ActivityLog[]) || []);
    setUsers((usersRes.data as UserProfile[]) || []);
    setLoadingData(false);
  };

  const handleGenerate = async () => {
    if (!session) return;
    setGenerating(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-affiliate-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ topic, generate_image: generateImage }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      toast.success("Affiliate content generated!");
      setTopic("");
      setGenerateImage(true);
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("affiliate_content").delete().eq("id", id);
    toast.success("Content deleted");
    fetchAll();
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage content, users & monitor activity</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <Users className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <FileText className="h-5 w-5 text-success mb-2" />
            <p className="text-2xl font-bold">{contents.length}</p>
            <p className="text-sm text-muted-foreground">Affiliate Content</p>
          </CardContent>
        </Card>
        <Card className="glass-strong border-0">
          <CardContent className="p-5">
            <Activity className="h-5 w-5 text-warning mb-2" />
            <p className="text-2xl font-bold">{activities.length}</p>
            <p className="text-sm text-muted-foreground">Activity Logs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Content Generator
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        {/* AI Content Generator Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="glass-strong border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Generate Affiliate Marketing Content</CardTitle>
              <CardDescription>
                AI will create copy that affiliates can use to promote OjaLink
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Topic (optional)</Label>
                <Input
                  placeholder="e.g., Black Friday promo, New feature launch, General promotion..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="generate-image"
                  checked={generateImage}
                  onChange={(e) => setGenerateImage(e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="generate-image" className="flex items-center gap-2 cursor-pointer">
                  <Image className="h-4 w-4" />
                  Auto-generate promotional image with OjaLink branding
                </Label>
              </div>
              <Button variant="hero" onClick={handleGenerate} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Content */}
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Published Content ({contents.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {contents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No content generated yet. Use the form above to create content.
                </p>
              ) : (
                contents.map((c) => (
                  <div key={c.id} className="p-4 rounded-lg bg-secondary/50 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{c.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(c.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{c.body}</p>
                    {c.image_url && (
                      <img src={c.image_url} alt="" className="rounded-lg max-h-40 object-cover" />
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Registered Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name || "—"}</TableCell>
                      <TableCell>{u.business_name || "—"}</TableCell>
                      <TableCell className="text-sm">{u.phone || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(u.created_at), "MMM d, yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <Card className="glass-strong border-0">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(a.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-sm">{a.user_email || "System"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {a.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {a.details || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
