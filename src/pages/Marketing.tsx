import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  Mail,
  FileText,
  Layout,
} from "lucide-react";
import { toast } from "sonner";

interface GeneratedContent {
  headlines: string[];
  ads: string[];
  emails: { subject: string; body: string }[];
  landingPage: { hero: string; features: string[]; cta: string };
}

const mockContent: GeneratedContent = {
  headlines: [
    "Transform Your Business with AI-Powered Solutions",
    "Boost Productivity by 300% – See How",
    "The Future of Work is Here – Don't Get Left Behind",
  ],
  ads: [
    "🚀 Ready to 10x your productivity? Our AI suite handles marketing, booking, and finances – so you can focus on growth. Try it free today!",
    "💡 Smart business owners use AI. Generate marketing content, manage appointments, and track finances in one place. Start your free trial!",
    "⚡ Stop wasting hours on repetitive tasks. Let AI do the heavy lifting while you build your empire. Get started in 2 minutes.",
  ],
  emails: [
    {
      subject: "Your competitors are using AI – Are you?",
      body: "Hi there,\n\nIn today's fast-paced business environment, staying ahead means working smarter, not harder.\n\nOur AI Productivity Suite helps you:\n• Generate compelling marketing content in seconds\n• Automate booking and scheduling\n• Get AI-powered financial insights\n\nJoin 10,000+ businesses already saving 10+ hours per week.\n\nBest,\nThe Smart AI Team",
    },
    {
      subject: "Quick question about your marketing...",
      body: "Hi,\n\nI noticed you might be spending too much time on content creation.\n\nWhat if you could generate:\n• Sales copy\n• Ad variations\n• Email sequences\n• Landing pages\n\n...all in under 5 minutes?\n\nLet me show you how.\n\nCheers,\nThe Smart AI Team",
    },
    {
      subject: "Save 10 hours this week (here's how)",
      body: "Hey there,\n\nTime is your most valuable asset.\n\nOur users save an average of 10 hours per week by automating:\n✓ Marketing content generation\n✓ Appointment scheduling\n✓ Financial tracking and insights\n\nReady to get those hours back?\n\nStart your free trial today.\n\nBest,\nThe Smart AI Team",
    },
  ],
  landingPage: {
    hero: "Supercharge Your Business with AI-Powered Automation. Generate marketing content, manage bookings, and track finances – all in one intelligent platform.",
    features: [
      "AI Marketing Generator – Create compelling copy in seconds",
      "Smart Booking System – Automated scheduling with queue management",
      "Financial Insights – AI-powered expense tracking and recommendations",
    ],
    cta: "Start Your Free Trial – No Credit Card Required",
  },
};

export default function Marketing() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    audience: "",
    tone: "professional",
    goal: "awareness",
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setContent(mockContent);
    setIsGenerating(false);
    toast.success("Content generated successfully!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Marketing Funnel Generator</h1>
        </div>
        <p className="text-muted-foreground">
          Generate AI-powered marketing content for your products and services.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-2 glass-strong border-0">
          <CardHeader>
            <CardTitle className="text-lg">Product Details</CardTitle>
            <CardDescription>
              Tell us about your product or service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product/Service Name</Label>
              <Input
                id="productName"
                placeholder="e.g., AI Productivity Suite"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product or service..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Small business owners, entrepreneurs"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select
                  value={formData.tone}
                  onValueChange={(value) => setFormData({ ...formData, tone: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <Select
                  value={formData.goal}
                  onValueChange={(value) => setFormData({ ...formData, goal: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="sales">Direct Sales</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="lg:col-span-3 glass-strong border-0">
          <CardHeader>
            <CardTitle className="text-lg">Generated Content</CardTitle>
            <CardDescription>
              Your AI-generated marketing materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {content ? (
              <Tabs defaultValue="headlines" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
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
                  <TabsTrigger value="landing" className="text-xs sm:text-sm">
                    <Layout className="h-4 w-4 mr-1 hidden sm:inline" />
                    Landing
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="headlines" className="space-y-3">
                  {content.headlines.map((headline, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-secondary/50 flex items-start justify-between gap-4"
                    >
                      <p className="font-medium">{headline}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(headline)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="ads" className="space-y-3">
                  {content.ads.map((ad, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-secondary/50 flex items-start justify-between gap-4"
                    >
                      <p className="text-sm">{ad}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(ad)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

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
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {email.body}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="landing" className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Hero Section</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(content.landingPage.hero)}
                      >
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(content.landingPage.cta)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium text-primary">{content.landingPage.cta}</p>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export as HTML
                  </Button>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">No content generated yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Fill in the product details and click "Generate Content" to create AI-powered marketing materials.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
