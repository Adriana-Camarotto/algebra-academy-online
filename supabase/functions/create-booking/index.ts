
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

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create client with anon key for user auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header found");
      throw new Error("Token de autenticação não encontrado");
    }

    // Extract the JWT token
    const token = authHeader.replace("Bearer ", "");
    console.log("Auth token received:", token.substring(0, 20) + "...");

    // Verify the JWT token and get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      console.error("User authentication error:", userError);
      throw new Error(`Erro de autenticação: ${userError.message}`);
    }

    if (!user) {
      console.error("No user found from token");
      throw new Error("Usuário não encontrado");
    }

    console.log("User authenticated successfully:", user.email);

    // Get request body
    const {
      service_type,
      lesson_type,
      lesson_date,
      lesson_time,
      lesson_day,
      student_email,
      amount = 30 // Default to minimum Stripe amount (30 pence = £0.30)
    } = await req.json();

    console.log("Booking data:", {
      service_type,
      lesson_type,
      lesson_date,
      lesson_time,
      lesson_day,
      student_email,
      amount,
      user_id: user.id
    });

    // Validate required fields
    if (!service_type || !lesson_date || !lesson_time || !lesson_day) {
      throw new Error("Dados obrigatórios não fornecidos");
    }

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

    // Create booking record using admin client
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: user.id,
        student_email: student_email || user.email,
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
      can_cancel_until: canCancelUntil.toISOString(),
      message: "Agendamento criado com sucesso. O pagamento será processado 24 horas antes da aula."
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
