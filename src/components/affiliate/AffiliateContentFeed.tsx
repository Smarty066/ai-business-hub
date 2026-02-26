import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface AffiliateContent {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
}

export function AffiliateContentFeed({ referralLink }: { referralLink: string }) {
  const [contents, setContents] = useState<AffiliateContent[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("affiliate_content")
        .select("*")
        .order("created_at", { ascending: false });
      setContents((data as AffiliateContent[]) || []);
    };
    fetch();
  }, []);

  const copyContent = async (content: AffiliateContent) => {
    const text = `${content.body}\n\n👉 Sign up here: ${referralLink}`;
    await navigator.clipboard.writeText(text);
    toast.success("Content copied with your referral link!");
  };

  if (contents.length === 0) return null;

  return (
    <Card className="glass-strong border-0">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Ready-to-Share Content
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {contents.map((c) => (
          <div key={c.id} className="p-4 rounded-lg bg-secondary/50 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-sm">{c.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(c.created_at), "MMM d, yyyy")}
                </p>
              </div>
              <Badge className="bg-primary/10 text-primary text-[10px]">New</Badge>
            </div>
            {c.image_url && (
              <img src={c.image_url} alt="" className="rounded-lg w-full max-h-48 object-cover" />
            )}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {c.body}
            </p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => copyContent(c)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy with Referral Link
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
