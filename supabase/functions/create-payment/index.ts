
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting payment creation process");

    // Get request body
    const { amount, currency = 'usd', product_name, booking_details } = await req.json();
    console.log("Request data:", { amount, currency, product_name, booking_details });

    // Retrieve authenticated user (optional for one-time payments)
    let userEmail = "guest@example.com";
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      try {
        // Create Supabase client using the anon key for user authentication
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? ""
        );

        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user?.email) {
          userEmail = data.user.email;
          console.log("User authenticated:", userEmail);
        }
      } catch (error) {
        console.log("User not authenticated, proceeding as guest:", error.message);
      }
    }

    // Check if Stripe secret key is available
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Stripe initialized successfully");

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer found:", customerId);
    } else {
      console.log("No existing customer found, will create new one");
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: product_name || "Aula de Tutoria de Matemática",
              description: booking_details ? 
                `Aula agendada para ${booking_details.date} (${booking_details.day}) às ${booking_details.time}` : 
                "Sessão de tutoria de matemática individual"
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/booking`,
      metadata: {
        booking_date: booking_details?.date || "",
        booking_day: booking_details?.day || "",
        booking_time: booking_details?.time || "",
        user_email: userEmail,
      }
    });

    console.log("Stripe session created successfully:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Erro ao processar pagamento. Verifique os logs para mais detalhes."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
