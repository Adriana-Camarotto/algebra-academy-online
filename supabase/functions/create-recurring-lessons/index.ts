import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
      "🔄 Creating recurring lessons with INDIVIDUAL payment scheduling"
    );
    console.log(
      "💡 Each lesson will be charged separately 24h before the lesson date"
    );

    const body = await req.json();
    console.log("📥 Request body:", body);

    const {
      payment_intent_id,
      recurring_dates,
      booking_details,
      user_info,
      amount_per_lesson,
    } = body;

    if (
      !payment_intent_id ||
      !recurring_dates ||
      !booking_details ||
      !user_info
    ) {
      throw new Error("Missing required fields for recurring lesson creation");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Generate unique recurring series ID
    const recurringSeriesId = `recurring_${user_info.id}_${Date.now()}`;
    console.log(`🔄 Series ID: ${recurringSeriesId}`);

    const bookingIds: string[] = [];

    // Create all recurring lessons
    for (let i = 0; i < recurring_dates.length; i++) {
      const sessionDate = recurring_dates[i];
      console.log(
        `Creating lesson ${i + 1}/${recurring_dates.length} for ${sessionDate}`
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
          amount: amount_per_lesson,
          currency: booking_details.currency || "gbp",
          student_email: booking_details.student_email,
          status: "scheduled",
          // CORRECTED: Each recurring lesson starts as PENDING and will be charged 24h before
          payment_status: "pending",
          // Each lesson will get its own payment intent 24h before
          payment_intent_id: null,
          recurring_session_id: recurringSeriesId,
          recurring_session_number: i + 1,
          recurring_session_total: recurring_dates.length,
          // Apply standard 24h cancellation policy like other lesson types
          can_cancel_until: new Date(
            new Date(`${sessionDate}T${booking_details.time}`).getTime() -
              24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error(`Error creating lesson ${i + 1}:`, error);

        // Check for unique constraint violation (double booking)
        if (
          error.code === "23505" &&
          error.message.includes("idx_unique_individual_booking")
        ) {
          throw new Error(
            `Lesson ${i + 1} conflicts: ${sessionDate} at ${
              booking_details.time
            } is already booked for an individual lesson. Please adjust your selection.`
          );
        }

        // Check for other unique constraints
        if (error.code === "23505") {
          throw new Error(
            `Lesson ${
              i + 1
            } time slot is no longer available (${sessionDate} at ${
              booking_details.time
            }). Please refresh and select different times.`
          );
        }

        throw new Error(`Failed to create lesson ${i + 1}: ${error.message}`);
      }

      bookingIds.push(bookingData.id);
      console.log(`✅ Created lesson ${i + 1}: ${bookingData.id}`);
    }

    // Create setup log for the recurring series (not individual payments)
    const setupLog = {
      booking_id: bookingIds[0], // Reference first booking for series tracking
      status: "series_created",
      payment_intent_id: payment_intent_id, // Original setup payment
      stripe_response: {
        setup_payment_intent: payment_intent_id,
        total_lessons: recurring_dates.length,
        series_id: recurringSeriesId,
        individual_payments: "Each lesson will be charged 24h before",
        amount_per_lesson: amount_per_lesson,
      },
      created_at: new Date().toISOString(),
    };

    const { error: logError } = await supabaseAdmin
      .from("payment_logs")
      .insert([setupLog]);

    if (logError) {
      console.error("❌ Error inserting payment logs:", logError);
    } else {
      console.log("✅ Payment logs created for all recurring lessons");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully created ${recurring_dates.length} recurring lessons with individual payment scheduling`,
        bookings_created: bookingIds.length,
        recurring_series: true,
        recurring_series_id: recurringSeriesId,
        booking_ids: bookingIds,
        setup_payment_intent_id: payment_intent_id,
        payment_policy:
          "Each lesson will be charged individually 24h before the lesson date",
        amount_per_lesson: amount_per_lesson,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error creating recurring lessons:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
