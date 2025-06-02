
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

    // Create client with anon key for user auth - this is the key fix
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.error("No authorization header found");
      return new Response(JSON.stringify({ 
        success: false,
        error: "Token de autenticação não encontrado. Por favor, faça login novamente."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Extract and verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    console.log("Extracted token, attempting user verification");

    // Use the anon client to verify the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) {
      console.error("User authentication error:", userError.message);
      return new Response(JSON.stringify({ 
        success: false,
        error: `Erro de autenticação: ${userError.message}. Por favor, faça login novamente.`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    if (!user) {
      console.error("No user found from token");
      return new Response(JSON.stringify({ 
        success: false,
        error: "Usuário não encontrado. Por favor, faça login novamente."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("User authenticated successfully:", { id: user.id, email: user.email });

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

    console.log("Booking data received:", {
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
      console.error("Missing required fields");
      return new Response(JSON.stringify({ 
        success: false,
        error: "Dados obrigatórios não fornecidos"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
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
      return new Response(JSON.stringify({ 
        success: false,
        error: `Erro ao criar agendamento: ${bookingError.message}`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
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
      success: false,
      error: error.message || "Erro interno do servidor",
      details: "Erro ao criar agendamento. Verifique os logs para mais detalhes."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
