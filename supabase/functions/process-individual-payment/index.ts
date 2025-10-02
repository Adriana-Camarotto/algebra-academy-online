import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing individual session payment");

    // Get request body
    const {
      booking_id,
      amount,
      currency = "gbp",
      user_info,
    } = await req.json();

    console.log("Individual payment request:", {
      booking_id,
      amount,
      currency,
      user_info,
    });

    // Create Supabase client using the service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Validate user info
    if (!user_info || !user_info.id || !user_info.email) {
      throw new Error("User information is required");
    }

    const userId = user_info.id;
    const userEmail = user_info.email;
    console.log("User authenticated:", { userId, userEmail });

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .eq("user_id", userId)
      .single();

    if (bookingError || !booking) {
      console.error("Error fetching booking:", bookingError);
      throw new Error("Booking not found or access denied");
    }

    console.log("Booking found:", booking);

    // Check if booking is already paid
    if (booking.payment_status === "paid") {
      throw new Error("This session is already paid");
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer found:", customerId);
    }

    // Create a payment session for individual session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Group Session ${booking.group_session_number}/${booking.group_session_total}`,
              description: `Session scheduled for ${booking.lesson_date} at ${booking.lesson_time}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking_id}`,
      cancel_url: `${req.headers.get("origin")}/dashboard`,
      metadata: {
        booking_id: booking_id,
        session_type: "individual_group_session",
        session_number: booking.group_session_number.toString(),
        user_email: userEmail,
      },
    });

    console.log("Stripe session created successfully:", session.id);

    // Update booking with payment intent
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        payment_intent_id: session.payment_intent,
        payment_status: "pending",
      })
      .eq("id", booking_id);

    if (updateError) {
      console.error("Error updating booking with payment intent:", updateError);
    }

    // Log payment attempt
    await supabaseAdmin.from("payment_logs").insert({
      booking_id: booking_id,
      payment_intent_id: session.payment_intent,
      status: "individual_session_created",
      stripe_response: {
        session_id: session.id,
        checkout_url: session.url,
        session_number: booking.group_session_number,
      },
    });

    console.log("Individual payment session created and logged successfully");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Individual payment error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: "Error processing individual session payment",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
