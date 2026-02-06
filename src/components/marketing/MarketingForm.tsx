import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Sparkles } from "lucide-react";
import type { MarketingFormData } from "@/lib/marketingGenerator";

interface MarketingFormProps {
  onGenerate: (data: MarketingFormData) => void;
  isGenerating: boolean;
}

export function MarketingForm({ onGenerate, isGenerating }: MarketingFormProps) {
  const [errors, setErrors] = useState<{ productName?: string; description?: string }>({});
  const [formData, setFormData] = useState<MarketingFormData>({
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

  const handleSubmit = () => {
    if (!validate()) return;
    onGenerate(formData);
  };

  return (
    <Card className="lg:col-span-2 glass-strong border-0">
      <CardHeader>
        <CardTitle className="text-lg">Product Details</CardTitle>
        <CardDescription>Tell us about your product or service</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product/Service Name <span className="text-destructive">*</span></Label>
          <Input
            id="productName"
            placeholder="e.g., QuickBooks Naija, FreshCart Delivery"
            value={formData.productName}
            onChange={(e) => {
              setFormData({ ...formData, productName: e.target.value });
              if (errors.productName) setErrors((prev) => ({ ...prev, productName: undefined }));
            }}
            className={errors.productName ? "border-destructive" : ""}
          />
          {errors.productName && <p className="text-xs text-destructive">{errors.productName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
          <Textarea
            id="description"
            placeholder="Describe what your product or service does..."
            rows={4}
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
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
          onClick={handleSubmit}
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
  );
}
