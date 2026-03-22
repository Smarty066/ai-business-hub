import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawBody = await req.text();
    const body = rawBody ? JSON.parse(rawBody) : {};
    const url = new URL(req.url);
    const provider = url.searchParams.get("provider") || detectProvider(body);

    if (provider === "paystack") {
      return await handlePaystack(body, rawBody, supabase, req);
    } else if (provider === "nowpayments") {
      return await handleNowPayments(body, supabase);
    }

    return new Response(JSON.stringify({ error: "Unknown provider" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function detectProvider(body: any): string {
  if (body.event && body.data?.reference) return "paystack";
  if (body.payment_status && body.order_id) return "nowpayments";
  return "unknown";
}

async function handlePaystack(body: any, rawBody: string, supabase: any, req: Request) {
  // Verify webhook signature
  const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!PAYSTACK_SECRET) {
    return new Response(JSON.stringify({ error: "Not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Verify event from Paystack
  const hash = req.headers.get("x-paystack-signature");
  if (!hash) {
    console.error("Missing Paystack signature");
    return new Response(JSON.stringify({ error: "Missing signature" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(PAYSTACK_SECRET),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expectedHash = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (hash !== expectedHash) {
    console.error("Invalid Paystack signature");
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (body.event === "charge.success") {
    const data = body.data;
    const userId = data.metadata?.user_id;
    const plan = data.metadata?.plan || "monthly";

    if (!userId) {
      console.error("No user_id in Paystack metadata");
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const periodEnd = new Date();
    if (plan === "annual") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      user_id: userId,
      status: "active",
      plan,
      payment_provider: "paystack",
      payment_reference: data.reference,
      amount: data.amount / 100,
      currency: data.currency,
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = existing?.id
      ? await supabase.from("subscriptions").update(payload).eq("id", existing.id)
      : await supabase.from("subscriptions").insert(payload);

    if (result.error) {
      console.error("DB error:", result.error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handleNowPayments(body: any, supabase: any) {
  // NowPayments IPN callback
  if (body.payment_status === "finished" || body.payment_status === "confirmed") {
    const orderId = body.order_id;
    if (!orderId) {
      return new Response(JSON.stringify({ error: "Missing order_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // order_id format: {user_id}_{timestamp}
    const userId = orderId.split("_").slice(0, 5).join("-");
    // Detect plan from description or amount
    const isAnnual = body.order_description?.toLowerCase().includes("annual");

    const periodEnd = new Date();
    if (isAnnual) {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      user_id: userId,
      status: "active",
      plan: isAnnual ? "annual" : "monthly",
      payment_provider: "nowpayments",
      payment_reference: String(body.payment_id || body.invoice_id),
      amount: body.price_amount || 0,
      currency: "USD",
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = existing?.id
      ? await supabase.from("subscriptions").update(payload).eq("id", existing.id)
      : await supabase.from("subscriptions").insert(payload);

    if (result.error) {
      console.error("DB error:", result.error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
