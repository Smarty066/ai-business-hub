import { useState } from "react";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";
import { generateContent, type GeneratedContent, type MarketingFormData } from "@/lib/marketingGenerator";
import { MarketingForm } from "@/components/marketing/MarketingForm";
import { ContentOutput } from "@/components/marketing/ContentOutput";
import { useFreemiumGate } from "@/hooks/useFreemiumGate";
import { UsageMeter } from "@/components/freemium/UsageMeter";
import { UpgradeDialog } from "@/components/freemium/UpgradeDialog";

export default function Marketing() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [productName, setProductName] = useState("");
  const gate = useFreemiumGate();

  const handleGenerate = async (formData: MarketingFormData) => {
    if (!gate.tryConsume()) return;

    setIsGenerating(true);
    setProductName(formData.productName);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setContent(generateContent(formData));
    setIsGenerating(false);
    toast.success("Content generated successfully!");
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
          Generate AI-powered marketing content — ads, emails, WhatsApp messages, social media posts & more.
        </p>
      </div>

      {/* Usage Meter */}
      <UsageMeter used={gate.used} limit={gate.limit} className="mb-6" />

      <div className="grid lg:grid-cols-5 gap-6">
        <MarketingForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        <ContentOutput content={content} productName={productName} />
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog open={gate.showUpgrade} onOpenChange={gate.closeUpgrade} />
    </div>
  );
}
