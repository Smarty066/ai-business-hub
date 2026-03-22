import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");

    if (!paystackSecret) {
      return json({ error: "Paystack not configured" }, 500);
    }

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return json({ error: "Unauthorized" }, 401);
    }

    const userId = claimsData.claims.sub as string;
    const userEmail = (claimsData.claims.email as string | undefined)?.toLowerCase() ?? "";

    const body = await req.json();
    const reference = body?.reference;
    const provider = body?.provider;

    if (provider !== "paystack" || !reference) {
      return json({ error: "Invalid verification request" }, 400);
    }

    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    });

    const verifyData = await verifyRes.json();
    if (!verifyRes.ok || !verifyData?.status || !verifyData?.data) {
      console.error("Paystack verify error:", verifyData);
      return json({ error: "Unable to verify payment" }, 500);
    }

    const payment = verifyData.data;
    if (payment.status !== "success") {
      return json({ error: "Payment not successful" }, 400);
    }

    const metadataUserId = payment.metadata?.user_id as string | undefined;
    const paymentEmail = (payment.customer?.email as string | undefined)?.toLowerCase() ?? "";

    if (metadataUserId && metadataUserId !== userId && paymentEmail !== userEmail) {
      return json({ error: "Payment does not belong to this user" }, 403);
    }

    const plan = payment.metadata?.plan === "annual" ? "annual" : "monthly";
    const periodEnd = new Date();
    if (plan === "annual") {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const serviceClient = createClient(supabaseUrl, supabaseServiceKey);
    const { data: existing } = await serviceClient
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
      payment_reference: payment.reference,
      amount: payment.amount / 100,
      currency: payment.currency,
      current_period_start: new Date().toISOString(),
      current_period_end: periodEnd.toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = existing?.id
      ? await serviceClient.from("subscriptions").update(payload).eq("id", existing.id)
      : await serviceClient.from("subscriptions").insert(payload);

    if (result.error) {
      console.error("Subscription write error:", result.error);
      return json({ error: "Failed to activate subscription" }, 500);
    }

    return json({ success: true });
  } catch (error) {
    console.error("Verify payment error:", error);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}