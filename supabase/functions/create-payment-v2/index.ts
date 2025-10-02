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
    console.log("🚀 Payment creation started");

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
    let bookingIds: string[] = [];
    let totalBookings = 1;

    // Check if recurring individual lessons
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
        console.log(`✅ Lesson ${i + 1} created: ${bookingData.id}`);
      }
    } else {
      // Single lesson
      console.log("📝 Creating single lesson");

      const { data: bookingData, error } = await supabaseAdmin
        .from("bookings")
        .insert({
          user_id: user_info.id,
          lesson_date: booking_details.date,
          lesson_time: booking_details.time,
          lesson_day: booking_details.day,
          service_type: booking_details.service,
          lesson_type: booking_details.lesson_type,
          amount: finalAmount,
          currency: currency,
          student_email: booking_details.student_email,
          status: "scheduled",
          payment_status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating single lesson:", error);
        throw new Error(`Failed to create lesson: ${error.message}`);
      }

      bookingIds.push(bookingData.id);
      console.log(`✅ Single lesson created: ${bookingData.id}`);
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: product_name || "Individual Tutoring - Recurring Lessons",
            },
            unit_amount: finalAmount,
          },
          quantity: totalBookings,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${
        bookingIds[0]
      }`,
      cancel_url: `${req.headers.get("origin")}/booking`,
      metadata: {
        booking_ids: bookingIds.join(","),
        total_sessions: totalBookings.toString(),
      },
    });

    console.log("💳 Stripe session created:", session.id);

    // Update bookings with payment intent
    for (const bookingId of bookingIds) {
      await supabaseAdmin
        .from("bookings")
        .update({ payment_intent_id: session.payment_intent })
        .eq("id", bookingId);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Payment error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
