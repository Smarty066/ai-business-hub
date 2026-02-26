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

    const body = await req.json();
    const topic = body.topic;
    const generate_image = body.generate_image;

    // Input validation
    if (topic !== undefined && topic !== null) {
      if (typeof topic !== "string" || topic.length > 500) {
        return new Response(JSON.stringify({ error: "Invalid topic. Must be a string under 500 characters." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    if (generate_image !== undefined && typeof generate_image !== "boolean") {
      return new Response(JSON.stringify({ error: "Invalid generate_image parameter." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Rate limiting: max 10 generations per hour per user
    const { data: recentCalls } = await supabase
      .from("activity_log")
      .select("created_at")
      .eq("user_id", user.id)
      .eq("action", "generate_affiliate_content")
      .gte("created_at", new Date(Date.now() - 3600000).toISOString());

    if (recentCalls && recentCalls.length >= 10) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Max 10 generations per hour." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
            content: `You are a marketing copywriter for OjaLink, a Nigerian business productivity app. Generate affiliate marketing content that affiliates can copy and paste to promote OjaLink. The content should:
- Be written in conversational Nigerian English (can include pidgin phrases)
- Be persuasive and benefit-focused
- Include emojis naturally
- Be ready to paste on WhatsApp, Instagram, Twitter, or Facebook
- ALWAYS mention "OjaLink" by name at least 2-3 times
- Highlight key features: booking management, customer CRM, inventory tracking, sales reports, budget planning, affiliate earnings
- Include a call-to-action mentioning the referral link
- Include 3-5 KEY SELLING POINTS as bullet points

Return a JSON object with exactly these fields:
{
  "title": "A catchy title (must include OjaLink)",
  "body": "The full marketing copy ready to paste (must mention OjaLink multiple times with key selling points)"
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

    // Generate promotional flier image if requested
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
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `Create a professional promotional flier image for OjaLink - a Nigerian business management app. The flier should:
- Feature the text "OjaLink" prominently at the top
- Include these key points from the content: ${parsed.title}
- Key selling points to highlight on the flier:
  • Manage bookings, customers & inventory
  • AI-powered sales reports & insights
  • Earn money with affiliate program
  • Free 7-day trial
- Use modern, professional design with vibrant green and gold accents
- Be suitable for WhatsApp status and social media
- Include tagline: "Run Your Business From One Dashboard"
- Make it look like a real marketing banner, clean and professional
- Add "Sign up FREE at ojalink.com" at the bottom`
              }
            ],
            modalities: ["image", "text"],
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          // Check for images in the response (Lovable AI format)
          const images = imageData.choices?.[0]?.message?.images;
          if (images && images.length > 0) {
            const base64Url = images[0].image_url?.url;
            if (base64Url && base64Url.startsWith("data:image")) {
              // Extract base64 data
              const matches = base64Url.match(/^data:image\/(\w+);base64,(.+)$/);
              if (matches) {
                const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
                const base64Data = matches[2];
                const fileName = `affiliate-fliers/${crypto.randomUUID()}.${ext}`;
                const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

                // Ensure bucket exists
                await supabase.storage.createBucket("affiliate-images", { public: true }).catch(() => {});

                const { error: uploadError } = await supabase.storage
                  .from("affiliate-images")
                  .upload(fileName, binaryData, { contentType: `image/${matches[1]}` });

                if (!uploadError) {
                  const { data: urlData } = supabase.storage
                    .from("affiliate-images")
                    .getPublicUrl(fileName);
                  imageUrl = urlData.publicUrl;
                }
              }
            }
          }
        }
      } catch (imgErr) {
        console.error("Image generation error:", imgErr);
        // Continue without image
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
      details: `Generated: ${parsed.title}${generate_image ? " (with flier image)" : ""}`,
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
