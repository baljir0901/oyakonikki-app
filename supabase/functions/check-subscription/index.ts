
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");

    console.log(`[TEST] Checking subscription for user: ${user.email}`);

    // Mock subscription data - simulate different states based on email
    const isTestSubscriber = user.email.includes("premium") || user.email.includes("test");
    const mockSubscription = {
      subscribed: isTestSubscriber,
      subscription_tier: isTestSubscriber ? "Premium" : null,
      subscription_end: isTestSubscriber ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    };

    console.log(`[TEST] Mock subscription status:`, mockSubscription);

    // Update or insert subscription record
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      stripe_customer_id: isTestSubscriber ? `mock_customer_${user.id.slice(0, 8)}` : null,
      subscribed: mockSubscription.subscribed,
      subscription_tier: mockSubscription.subscription_tier,
      subscription_end: mockSubscription.subscription_end,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    return new Response(JSON.stringify(mockSubscription), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[TEST] Error in check-subscription:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
