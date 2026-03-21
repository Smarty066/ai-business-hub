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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Validate user auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { provider, plan, currency, email } = body;

    if (!provider || !["paystack", "nowpayments"].includes(provider)) {
      return new Response(JSON.stringify({ error: "Invalid payment provider" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine amount
    const isAnnual = plan === "annual";
    let amount: number;
    let currencyCode: string;

    if (currency === "USD") {
      amount = isAnnual ? 30 : 3;
      currencyCode = "USD";
    } else {
      amount = isAnnual ? 25000 : 2500;
      currencyCode = "NGN";
    }

    if (provider === "paystack") {
      const PAYSTACK_SECRET = Deno.env.get("PAYSTACK_SECRET_KEY");
      if (!PAYSTACK_SECRET) {
        return new Response(JSON.stringify({ error: "Paystack not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Paystack uses kobo (NGN * 100) or cents (USD * 100)
      const paystackAmount = Math.round(amount * 100);

      const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || user.email,
          amount: paystackAmount,
          currency: currencyCode,
          callback_url: `${req.headers.get("origin") || supabaseUrl}/pricing?payment=success`,
          metadata: {
            user_id: user.id,
            plan: isAnnual ? "annual" : "monthly",
            custom_fields: [
              { display_name: "User ID", variable_name: "user_id", value: user.id },
            ],
          },
        }),
      });

      const paystackData = await paystackRes.json();
      if (!paystackRes.ok || !paystackData.status) {
        console.error("Paystack error:", paystackData);
        return new Response(JSON.stringify({ error: "Payment initialization failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          authorization_url: paystackData.data.authorization_url,
          reference: paystackData.data.reference,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (provider === "nowpayments") {
      const NOWPAY_KEY = Deno.env.get("NOWPAYMENTS_API_KEY");
      if (!NOWPAY_KEY) {
        return new Response(JSON.stringify({ error: "NowPayments not configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // NowPayments always uses USD for price_amount
      const usdAmount = currencyCode === "USD" ? amount : Math.round((amount / 1600) * 100) / 100;

      const nowpayRes = await fetch("https://api.nowpayments.io/v1/invoice", {
        method: "POST",
        headers: {
          "x-api-key": NOWPAY_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: usdAmount,
          price_currency: "usd",
          order_id: `${user.id}_${Date.now()}`,
          order_description: `OjaLink ${isAnnual ? "Annual" : "Monthly"} Subscription`,
          ipn_callback_url: `${supabaseUrl}/functions/v1/payment-webhook`,
          success_url: `${req.headers.get("origin") || supabaseUrl}/pricing?payment=success`,
          cancel_url: `${req.headers.get("origin") || supabaseUrl}/pricing?payment=cancelled`,
        }),
      });

      const nowpayData = await nowpayRes.json();
      if (!nowpayRes.ok || !nowpayData.invoice_url) {
        console.error("NowPayments error:", nowpayData);
        return new Response(JSON.stringify({ error: "Crypto payment initialization failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          invoice_url: nowpayData.invoice_url,
          invoice_id: nowpayData.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid provider" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Payment error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
