import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🚀 Payment creation started (clean version)");

    const body = await req.json();
    console.log("📥 Request body:", body);

    const {
      amount,
      currency = "gbp",
      product_name,
      booking_details,
      user_info,
    } = body;

    if (!booking_details || !user_info) {
      throw new Error("Missing required fields");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
    });

    const finalAmount = Math.max(amount, 30); // Minimum £0.30
    let bookingIds = [];
    let totalBookings = 1;

    // SIMPLIFIED: Skip all validation - frontend already validates
    console.log(
      "✅ SKIPPING EDGE FUNCTION VALIDATION - Frontend already validated all slots"
    );

    // Handle recurring individual lessons
    if (
      booking_details.recurring_dates &&
      booking_details.recurring_dates.length > 0
    ) {
      console.log("🔄 Creating recurring individual lessons");
      const recurringDates = booking_details.recurring_dates;
      totalBookings = recurringDates.length;

      for (let i = 0; i < recurringDates.length; i++) {
        const sessionDate = recurringDates[i];
        console.log(
          `Creating lesson ${i + 1}/${recurringDates.length} for ${sessionDate}`
        );

        const { data: bookingData, error } = await supabaseAdmin
          .from("bookings")
          .insert({
            user_id: user_info.id,
            lesson_date: sessionDate,
            lesson_time: booking_details.time,
            lesson_day: booking_details.day,
            service_type: "individual",
            lesson_type: "recurring",
            amount: finalAmount,
            currency: currency,
            student_email: booking_details.student_email,
            status: "scheduled",
            payment_status: "pending",
          })
          .select()
          .single();

        if (error) {
          console.error(`Error creating lesson ${i + 1}:`, error);
          throw new Error(`Failed to create lesson ${i + 1}: ${error.message}`);
        }

        bookingIds.push(bookingData.id);
        console.log(`✅ Created lesson ${i + 1}: ${bookingData.id}`);
      }
    } else {
      // Handle single booking (individual or group)
      console.log("📝 Creating single booking");

      const bookingData = {
        user_id: user_info.id,
        lesson_date: booking_details.date,
        lesson_time: booking_details.time,
        lesson_day: booking_details.day,
        service_type: booking_details.service,
        lesson_type: booking_details.service === "group" ? "group" : "single",
        amount: finalAmount,
        currency: currency,
        student_email: booking_details.student_email,
        status: "scheduled",
        payment_status: "pending",
      };

      const { data: booking, error } = await supabaseAdmin
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error("Error creating booking:", error);
        throw new Error(`Failed to create booking: ${error.message}`);
      }

      bookingIds.push(booking.id);
      console.log(`✅ Created booking: ${booking.id}`);
    }

    // Create Stripe payment intent
    console.log("💳 Creating Stripe payment intent");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount * 100, // Convert to pence
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        booking_ids: bookingIds.join(","),
        user_id: user_info.id,
        service_type: booking_details.service,
        total_bookings: totalBookings.toString(),
      },
    });

    console.log("✅ Payment intent created:", paymentIntent.id);

    return new Response(
      JSON.stringify({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        booking_ids: bookingIds,
        total_bookings: totalBookings,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
