import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) throw new Error("Admin access required");

    const { topic, generate_image } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Generate content text
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a marketing copywriter for OjaLink, a Nigerian business productivity app. Generate affiliate marketing content that affiliates can copy and paste to promote OjaLink. The content should be:
- Written in conversational Nigerian English (can include pidgin phrases)
- Persuasive and benefit-focused
- Include emojis naturally
- Ready to paste on WhatsApp, Instagram, Twitter, or Facebook
- ALWAYS mention "OjaLink" by name at least 2-3 times in the body
- Highlight key OjaLink features: booking management, customer CRM, inventory tracking, sales reports, budget planning, affiliate earnings
- Include a call-to-action mentioning the referral link

Return a JSON object with exactly these fields:
{
  "title": "A catchy title for the content piece (must include OjaLink)",
  "body": "The full marketing copy ready to paste (must mention OjaLink multiple times)"
}

Only return valid JSON, nothing else.`
          },
          {
            role: "user",
            content: topic ? `Generate affiliate content about: ${topic}` : "Generate general affiliate marketing content for OjaLink"
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content || "";
    
    let parsed;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
    } catch {
      parsed = { title: "OjaLink Affiliate Promo", body: rawContent };
    }

    // Generate image if requested
    let imageUrl: string | null = null;
    if (generate_image) {
      try {
        const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image-preview",
            messages: [
              {
                role: "user",
                content: `Create a professional, eye-catching promotional image for OjaLink - a Nigerian business management app. The image should:
- Feature the text "OjaLink" prominently
- Include key points from this content: ${parsed.title}
- Use modern, professional design with vibrant colors (green, gold accents on dark or white background)
- Be suitable for social media (WhatsApp, Instagram, Facebook)
- Include icons or visuals representing business tools (charts, calendar, money)
- Look like a professional marketing banner, NOT AI-generated art
- Add a tagline: "Run Your Business From One Dashboard"`
              }
            ],
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const imageContent = imageData.choices?.[0]?.message?.content;
          // Check if the response contains an image (base64 in parts)
          if (imageData.choices?.[0]?.message?.parts) {
            for (const part of imageData.choices[0].message.parts) {
              if (part.inline_data) {
                // Upload base64 image to Supabase storage
                const base64Data = part.inline_data.data;
                const mimeType = part.inline_data.mime_type || "image/png";
                const ext = mimeType.includes("jpeg") ? "jpg" : "png";
                const fileName = `affiliate-content/${crypto.randomUUID()}.${ext}`;
                
                const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
                
                // Ensure bucket exists
                await supabase.storage.createBucket("affiliate-images", { public: true }).catch(() => {});
                
                const { error: uploadError } = await supabase.storage
                  .from("affiliate-images")
                  .upload(fileName, binaryData, { contentType: mimeType });
                
                if (!uploadError) {
                  const { data: urlData } = supabase.storage
                    .from("affiliate-images")
                    .getPublicUrl(fileName);
                  imageUrl = urlData.publicUrl;
                }
                break;
              }
            }
          }
        }
      } catch (imgErr) {
        console.error("Image generation error:", imgErr);
        // Continue without image - don't fail the whole request
      }
    }

    // Save to database
    const { data: saved, error: saveError } = await supabase
      .from("affiliate_content")
      .insert({
        title: parsed.title,
        body: parsed.body,
        image_url: imageUrl,
        created_by: user.id,
      })
      .select()
      .single();

    if (saveError) throw saveError;

    // Log activity
    await supabase.from("activity_log").insert({
      user_id: user.id,
      user_email: user.email,
      action: "generate_affiliate_content",
      details: `Generated: ${parsed.title}${generate_image ? " (with image)" : ""}`,
    });

    return new Response(JSON.stringify(saved), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
