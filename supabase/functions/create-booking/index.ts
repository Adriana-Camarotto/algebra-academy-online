
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

  try {
    console.log("Starting booking creation process");

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) throw new Error("User not authenticated");

    const user = userData.user;
    console.log("User authenticated:", user.email);

    // Get request body
    const {
      service_type,
      lesson_type,
      lesson_date,
      lesson_time,
      lesson_day,
      student_email,
      amount = 30 // Default to minimum Stripe amount
    } = await req.json();

    console.log("Booking data:", {
      service_type,
      lesson_type,
      lesson_date,
      lesson_time,
      lesson_day,
      student_email,
      amount
    });

    // Calculate scheduled payment date (24h + 1min before lesson)
    const lessonDateTime = new Date(`${lesson_date}T${lesson_time}:00Z`);
    const scheduledPaymentDate = new Date(lessonDateTime.getTime() - (24 * 60 + 1) * 60 * 1000);
    
    // Calculate cancellation deadline (24h before lesson)
    const canCancelUntil = new Date(lessonDateTime.getTime() - 24 * 60 * 60 * 1000);

    console.log("Calculated dates:", {
      lessonDateTime: lessonDateTime.toISOString(),
      scheduledPaymentDate: scheduledPaymentDate.toISOString(),
      canCancelUntil: canCancelUntil.toISOString()
    });

    // Create booking record
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: user.id,
        student_email,
        service_type,
        lesson_type,
        lesson_date,
        lesson_time,
        lesson_day,
        amount,
        currency: 'gbp',
        status: 'scheduled',
        payment_status: 'pending',
        scheduled_payment_date: scheduledPaymentDate.toISOString(),
        can_cancel_until: canCancelUntil.toISOString()
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Booking creation error:", bookingError);
      throw new Error(`Erro ao criar agendamento: ${bookingError.message}`);
    }

    console.log("Booking created successfully:", booking.id);

    return new Response(JSON.stringify({ 
      success: true, 
      booking_id: booking.id,
      scheduled_payment_date: scheduledPaymentDate.toISOString(),
      can_cancel_until: canCancelUntil.toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Booking creation error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Erro ao criar agendamento. Verifique os logs para mais detalhes."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
