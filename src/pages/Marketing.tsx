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
import { exportMarketingPdf } from "@/lib/exportPdf";

interface GeneratedContent {
  headlines: string[];
  ads: string[];
  emails: { subject: string; body: string }[];
  landingPage: { hero: string; features: string[]; cta: string };
}

const generateContent = (data: { productName: string; description: string; audience: string; tone: string; goal: string }): GeneratedContent => {
  const { productName, description, audience, tone, goal } = data;
  const name = productName || "Your Product";
  const desc = description || "an innovative solution";
  const aud = audience || "your target audience";

  const toneMap: Record<string, { adj: string; verb: string; cta: string }> = {
    professional: { adj: "Transform", verb: "Elevate", cta: "Get Started Today" },
    casual: { adj: "Level Up", verb: "Try Out", cta: "Jump In – It's Free!" },
    friendly: { adj: "Discover", verb: "Explore", cta: "Come See What's New!" },
    urgent: { adj: "Act Now –", verb: "Don't Wait –", cta: "Claim Your Spot Before It's Gone!" },
  };
  const goalMap: Record<string, string> = {
    awareness: "spreading the word about",
    leads: "capturing leads for",
    sales: "driving sales of",
    engagement: "boosting engagement with",
  };

  const t = toneMap[tone] || toneMap.professional;
  const goalPhrase = goalMap[goal] || "promoting";

  return {
    headlines: [
      `${t.adj} Your Experience with ${name}`,
      `Why ${aud} Are Choosing ${name}`,
      `${t.verb} the Way You Work – Powered by ${name}`,
    ],
    ads: [
      `🚀 ${name} – ${desc}. Built for ${aud} who want results. ${t.cta}`,
      `💡 Stop settling for less. ${name} helps ${aud} achieve more with ${desc}. Try it free today!`,
      `⚡ ${t.verb} your workflow with ${name}. Perfect for ${goalPhrase} ${name.toLowerCase()}. Get started in 2 minutes.`,
    ],
    emails: [
      {
        subject: `${aud} – here's how ${name} can help you`,
        body: `Hi there,\n\nWe built ${name} specifically for ${aud}.\n\n${name} is ${desc}.\n\nHere's what you'll get:\n• Tailored solutions for ${aud}\n• Designed for ${goalPhrase} your business\n• Easy to start, powerful to scale\n\n${t.cta}\n\nBest,\nThe ${name} Team`,
      },
      {
        subject: `Quick question about ${goalPhrase} your business...`,
        body: `Hi,\n\nAre you spending too much time on ${goalPhrase} your products?\n\nWith ${name}, ${aud} can:\n• Save time with automation\n• Get better results faster\n• Focus on what matters most\n\n${desc} – and it's ready for you today.\n\nCheers,\nThe ${name} Team`,
      },
      {
        subject: `${t.adj} your results this week`,
        body: `Hey there,\n\nTime is your most valuable asset.\n\n${name} was designed for ${aud} who need:\n✓ ${desc}\n✓ Tools focused on ${goalPhrase} your business\n✓ Results you can measure\n\n${t.cta}\n\nBest,\nThe ${name} Team`,
      },
    ],
    landingPage: {
      hero: `${t.adj} Your Business with ${name}. ${desc.charAt(0).toUpperCase() + desc.slice(1)} – built specifically for ${aud}.`,
      features: [
        `Tailored for ${aud} – solutions designed around your needs`,
        `${name} delivers ${desc} with ease`,
        `Optimized for ${goalPhrase} your business at every stage`,
      ],
      cta: t.cta,
    },
  };
};

export default function Marketing() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [errors, setErrors] = useState<{ productName?: string; description?: string }>({});
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    audience: "",
    tone: "professional",
    goal: "awareness",
  });

  const validate = () => {
    const newErrors: { productName?: string; description?: string } = {};
    if (!formData.productName.trim()) newErrors.productName = "Product name is required";
    else if (formData.productName.trim().length > 100) newErrors.productName = "Must be under 100 characters";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.trim().length > 500) newErrors.description = "Must be under 500 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setContent(generateContent(formData));
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
              <Label htmlFor="productName">Product/Service Name <span className="text-destructive">*</span></Label>
              <Input
                id="productName"
                placeholder="e.g., AI Productivity Suite"
                value={formData.productName}
                onChange={(e) => { setFormData({ ...formData, productName: e.target.value }); if (errors.productName) setErrors((prev) => ({ ...prev, productName: undefined })); }}
                className={errors.productName ? "border-destructive" : ""}
              />
              {errors.productName && <p className="text-xs text-destructive">{errors.productName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe your product or service..."
                rows={4}
                value={formData.description}
                onChange={(e) => { setFormData({ ...formData, description: e.target.value }); if (errors.description) setErrors((prev) => ({ ...prev, description: undefined })); }}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
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

                  <Button variant="outline" className="w-full" onClick={() => { exportMarketingPdf(content, formData.productName); toast.success("PDF downloaded!"); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                </TabsContent>

                <div className="pt-4 border-t border-border mt-4">
                  <Button variant="hero" className="w-full" onClick={() => { exportMarketingPdf(content, formData.productName); toast.success("PDF downloaded!"); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Content as PDF
                  </Button>
                </div>
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
