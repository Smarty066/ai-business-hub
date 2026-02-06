import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Download,
  FileText,
  Megaphone,
  Mail,
  Layout,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { exportMarketingPdf } from "@/lib/exportPdf";
import type { GeneratedContent } from "@/lib/marketingGenerator";

interface ContentOutputProps {
  content: GeneratedContent | null;
  productName: string;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
}

export function ContentOutput({ content, productName }: ContentOutputProps) {
  if (!content) {
    return (
      <Card className="lg:col-span-3 glass-strong border-0">
        <CardHeader>
          <CardTitle className="text-lg">Generated Content</CardTitle>
          <CardDescription>Your AI-generated marketing materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">No content generated yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Fill in the product details and click "Generate Content" to create AI-powered marketing materials.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-3 glass-strong border-0">
      <CardHeader>
        <CardTitle className="text-lg">Generated Content</CardTitle>
        <CardDescription>Your AI-generated marketing materials</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="headlines" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="headlines" className="text-xs sm:text-sm">
              <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
              Headlines
            </TabsTrigger>
            <TabsTrigger value="ads" className="text-xs sm:text-sm">
              <Megaphone className="h-4 w-4 mr-1 hidden sm:inline" />
              Ads
            </TabsTrigger>
            <TabsTrigger value="emails" className="text-xs sm:text-sm">
              <Mail className="h-4 w-4 mr-1 hidden sm:inline" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="text-xs sm:text-sm">
              <MessageCircle className="h-4 w-4 mr-1 hidden sm:inline" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="social" className="text-xs sm:text-sm">
              <Share2 className="h-4 w-4 mr-1 hidden sm:inline" />
              Social
            </TabsTrigger>
            <TabsTrigger value="landing" className="text-xs sm:text-sm">
              <Layout className="h-4 w-4 mr-1 hidden sm:inline" />
              Landing
            </TabsTrigger>
          </TabsList>

          {/* Headlines Tab */}
          <TabsContent value="headlines" className="space-y-3">
            {content.headlines.map((headline, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-secondary/50 flex items-start justify-between gap-4"
              >
                <p className="font-medium">{headline}</p>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(headline)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads" className="space-y-3">
            {content.ads.map((ad, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-secondary/50 flex items-start justify-between gap-4"
              >
                <p className="text-sm">{ad}</p>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(ad)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsContent>

          {/* Emails Tab */}
          <TabsContent value="emails" className="space-y-4">
            {content.emails.map((email, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">Email {index + 1}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(`Subject: ${email.subject}\n\n${email.body}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-medium mb-2">Subject: {email.subject}</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{email.body}</p>
              </div>
            ))}
          </TabsContent>

          {/* WhatsApp Tab */}
          <TabsContent value="whatsapp" className="space-y-4">
            <div className="flex items-center gap-2 mb-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <MessageCircle className="h-5 w-5 text-success" />
              <p className="text-sm text-success">Ready to copy & paste into WhatsApp Business</p>
            </div>
            {content.whatsapp.map((msg, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    {msg.title}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(msg.message)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-4">
            {content.socialMedia.map((post, index) => (
              <div key={index} className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">
                    <span className="mr-1">{post.icon}</span> {post.platform}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`${post.post}\n\n${post.hashtags.map((h) => `#${h}`).join(" ")}`)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm whitespace-pre-line leading-relaxed mb-3">{post.post}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Landing Tab */}
          <TabsContent value="landing" className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">Hero Section</Badge>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(content.landingPage.hero)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium">{content.landingPage.hero}</p>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">Features</Badge>
              </div>
              <ul className="space-y-2">
                {content.landingPage.features.map((feature, index) => (
                  <li key={index} className="text-sm flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">CTA</Badge>
                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(content.landingPage.cta)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-medium text-primary">{content.landingPage.cta}</p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                exportMarketingPdf(content, productName);
                toast.success("PDF downloaded!");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </TabsContent>

          <div className="pt-4 border-t border-border mt-4">
            <Button
              variant="hero"
              className="w-full"
              onClick={() => {
                exportMarketingPdf(content, productName);
                toast.success("PDF downloaded!");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All Content as PDF
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
