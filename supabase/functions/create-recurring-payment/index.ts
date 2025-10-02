import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

console.log("🚀 create-recurring-payment function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("📥 Received request:", req.method);

    // Get request data
    const requestData = await req.json();
    console.log("📊 Request data:", JSON.stringify(requestData, null, 2));

    const {
      amount,
      currency,
      product_name,
      booking_details,
      user_info,
      request_id,
    } = requestData;

    // Validate required fields
    if (!amount || !booking_details || !user_info) {
      throw new Error("Missing required fields");
    }

    const {
      date,
      time,
      day,
      service,
      lesson_type,
      student_email,
      is_recurring,
      recurring_dates,
      total_lessons,
      recurring_end_date,
    } = booking_details;

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log("🔗 Connected to Supabase");

    // Check if this is a recurring booking
    if (is_recurring && recurring_dates && recurring_dates.length > 0) {
      console.log(
        `🔄 Processing recurring booking series: ${recurring_dates.length} lessons`
      );

      // Generate a unique recurring series ID
      const recurringSeriesId = `recurring_${user_info.id}_${Date.now()}`;

      // Create individual booking records for each date in the series
      const bookingInserts = recurring_dates.map(
        (lessonDate: string, index: number) => ({
          user_id: user_info.id,
          service_type: service,
          lesson_type: lesson_type,
          lesson_date: lessonDate,
          lesson_time: time,
          lesson_day: day.toLowerCase(),
          status: "scheduled",
          payment_status: "paid", // All recurring lessons are paid upfront
          amount: Math.round(amount / total_lessons), // Individual lesson amount
          currency: currency,
          student_email: student_email,
          // Recurring-specific fields
          recurring_session_number: index + 1,
          recurring_session_total: total_lessons,
          recurring_session_id: recurringSeriesId,
          // Metadata
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );

      console.log("📝 Creating booking records:", bookingInserts.length);

      // Insert all recurring booking records
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .insert(bookingInserts)
        .select();

      if (bookingsError) {
        console.error("❌ Error creating recurring bookings:", bookingsError);
        throw bookingsError;
      }

      console.log("✅ Successfully created recurring booking series:", {
        seriesId: recurringSeriesId,
        totalLessons: total_lessons,
        bookingsCreated: bookings?.length || 0,
        dateRange: `${recurring_dates[0]} to ${
          recurring_dates[recurring_dates.length - 1]
        }`,
      });

      // Return success response for recurring bookings
      return new Response(
        JSON.stringify({
          success: true,
          message: `Successfully created ${total_lessons} recurring lessons`,
          bookings_created: bookings?.length || 0,
          recurring_series_id: recurringSeriesId,
          total_amount: amount,
          lessons_scheduled: recurring_dates,
          payment_status: "paid",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      // Handle single lesson booking (existing logic)
      console.log("📝 Creating single lesson booking");

      const bookingData = {
        user_id: user_info.id,
        service_type: service,
        lesson_type: lesson_type || "single",
        lesson_date: date,
        lesson_time: time,
        lesson_day: day.toLowerCase(),
        status: "scheduled",
        payment_status: "pending", // Single lessons are paid 24h before
        amount: amount,
        currency: currency,
        student_email: student_email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        console.error("❌ Error creating single booking:", bookingError);
        throw bookingError;
      }

      console.log("✅ Successfully created single lesson booking:", booking.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Single lesson booking created successfully",
          booking_id: booking.id,
          payment_status: "pending",
          lesson_date: date,
          lesson_time: time,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
  } catch (error) {
    console.error("❌ Function error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        success: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
