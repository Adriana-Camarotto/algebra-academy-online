
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

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Get request body
    const { amount, currency = 'usd', product_name, booking_details } = await req.json();

    // Retrieve authenticated user (optional for one-time payments)
    let userEmail = "guest@example.com";
    const authHeader = req.headers.get("Authorization");
    
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user?.email) {
          userEmail = data.user.email;
        }
      } catch (error) {
        console.log("User not authenticated, proceeding as guest");
      }
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
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
              name: product_name || "Math Tutoring Lesson",
              description: booking_details ? 
                `Lesson scheduled for ${booking_details.date} (${booking_details.day}) at ${booking_details.time}` : 
                "One-on-one math tutoring session"
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
      }
    });

    // Optional: Store booking details in Supabase
    if (authHeader && booking_details) {
      try {
        const supabaseService = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );
        
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await supabaseClient.auth.getUser(token);
        
        if (userData.user) {
          await supabaseService.from("bookings").insert({
            user_id: userData.user.id,
            stripe_session_id: session.id,
            booking_date: booking_details.date,
            booking_day: booking_details.day,
            booking_time: booking_details.time,
            amount: amount,
            status: "pending",
            created_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error storing booking:", error);
        // Continue with payment even if booking storage fails
      }
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
