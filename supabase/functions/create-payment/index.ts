import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    console.log(
      "🚀 Payment creation started - UPDATED VERSION 2025-08-18-INDIVIDUAL-PAYMENTS"
    );
    console.log(
      "✅ RECURRING LESSONS: Setup fee only - each lesson charged individually"
    );

    const body = await req.json();
    console.log("📥 Request body:", body);

    const {
      amount,
      currency = "gbp",
      product_name,
      booking_details,
      user_info,
    } = body;

    console.log(
      "🔍 Checking for recurring_dates:",
      booking_details?.recurring_dates
    );
    console.log(
      "🔍 Booking details lesson_type:",
      booking_details?.lesson_type
    );

    if (!booking_details || !user_info) {
      throw new Error("Missing required fields");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get Stripe secret key from environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    console.log(
      "🔑 Stripe key configured:",
      stripeSecretKey.substring(0, 12) + "..."
    );

    // Usar Stripe real mesmo com chave de teste
    console.log("💳 Creating real Stripe Payment Intent...");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const finalAmount = Math.max(amount, 30); // Minimum £0.30
    let bookingIds: string[] = [];
    let totalBookings = 1;

    console.log(
      "✅ VALIDATION COMPLETELY SKIPPED - Frontend handles everything"
    );

    // Handle recurring individual lessons - CREATE PAYMENT INTENT FIRST
    if (
      booking_details.recurring_dates &&
      booking_details.recurring_dates.length > 0
    ) {
      console.log("🔄 Processing recurring lessons - SETUP FEE ONLY");
      const recurringDates = booking_details.recurring_dates;
      totalBookings = recurringDates.length;

      // Calculate individual lesson amount
      const amountPerLesson = Math.round(finalAmount / recurringDates.length);
      console.log(
        `💰 Setup fee: £${
          amountPerLesson / 100
        } (for series setup, each lesson will be charged individually)`
      );

      // Create Stripe payment intent for SETUP FEE only (equivalent to first lesson)
      console.log(
        "🔧 Creating Stripe payment intent for recurring series SETUP"
      );

      const metadata = {
        user_id: user_info.id,
        service_type: "individual",
        total_bookings: totalBookings.toString(),
        is_recurring: "true",
        booking_type: "recurring_setup",
        setup_fee_only: "true",
      };

      console.log("🔍 Recurring setup metadata object:", metadata);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountPerLesson * 100, // Setup fee only (equivalent to one lesson)
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });

      console.log(
        "✅ Setup payment intent created for recurring series:",
        paymentIntent.id
      );

      // Store recurring dates and payment info for later processing
      // The actual bookings will be created after payment confirmation
      return new Response(
        JSON.stringify({
          client_secret: paymentIntent.client_secret,
          payment_intent_id: paymentIntent.id,
          recurring_series: true,
          recurring_dates: recurringDates,
          total_bookings: totalBookings,
          amount_per_lesson: amountPerLesson,
          setup_fee_amount: amountPerLesson,
          payment_type: "setup_fee_only",
          message:
            "Setup fee payment - each lesson will be charged individually 24h before",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
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
        // Apply standard 24h cancellation policy for all lesson types
        can_cancel_until: new Date(
          new Date(
            `${booking_details.date}T${booking_details.time}`
          ).getTime() -
            24 * 60 * 60 * 1000
        ).toISOString(),
      };

      const { data: booking, error } = await supabaseAdmin
        .from("bookings")
        .insert(bookingData)
        .select()
        .single();

      if (error) {
        console.error("Error creating booking:", error);

        // Check for unique constraint violation (double booking)
        if (
          error.code === "23505" &&
          error.message.includes("idx_unique_individual_booking")
        ) {
          throw new Error(
            `This time slot (${booking_details.date} at ${booking_details.time}) is already booked for an individual lesson. Please select a different time.`
          );
        }

        // Check for other unique constraints
        if (error.code === "23505") {
          throw new Error(
            `This time slot is no longer available. Please refresh the page and select a different time.`
          );
        }

        throw new Error(`Failed to create booking: ${error.message}`);
      }

      bookingIds.push(booking.id);
      console.log(`✅ Created booking: ${booking.id}`);
    }

    // Create Stripe payment intent for single lessons
    console.log("💳 Creating Stripe payment intent for single lesson");

    // Create completely safe metadata - no booking IDs at all
    const metadata = {
      user_id: user_info.id,
      service_type: booking_details.service,
      total_bookings: totalBookings.toString(),
      is_recurring: "false",
      booking_type: "single_lesson",
    };

    console.log("🔍 Safe metadata object:", metadata);
    console.log(
      `🔍 Metadata length: ${JSON.stringify(metadata).length} characters`
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount * 100, // Convert to pence
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    console.log("✅ Payment intent created:", paymentIntent.id);

    // Update booking with payment_intent_id
    if (bookingIds.length > 0) {
      await supabaseAdmin
        .from("bookings")
        .update({
          payment_intent_id: paymentIntent.id,
          payment_status: paymentIntent.status,
          updated_at: new Date().toISOString(),
        })
        .in("id", bookingIds);

      // Insert payment log for each booking
      const paymentLogs = bookingIds.map((bookingId) => ({
        booking_id: bookingId,
        status: "intent_created",
        payment_intent_id: paymentIntent.id,
        stripe_response: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          client_secret: paymentIntent.client_secret,
        },
        created_at: new Date().toISOString(),
      }));

      const { error: logError } = await supabaseAdmin
        .from("payment_logs")
        .insert(paymentLogs);

      if (logError) {
        console.error("❌ Error inserting payment logs:", logError);
      } else {
        console.log("✅ Payment logs created for bookings:", bookingIds);
      }
    }

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
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
