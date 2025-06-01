
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
    console.log("Starting booking cancellation process");

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
    const { booking_id } = await req.json();
    console.log("Cancelling booking:", booking_id);

    // Get booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !booking) {
      throw new Error("Agendamento não encontrado ou não pertence ao usuário");
    }

    console.log("Booking found:", booking);

    // Check if cancellation is still allowed
    const now = new Date();
    const canCancelUntil = new Date(booking.can_cancel_until);
    
    if (now > canCancelUntil) {
      throw new Error("Prazo para cancelamento expirado. Não é possível cancelar a aula com menos de 24 horas de antecedência.");
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      throw new Error("Este agendamento já foi cancelado");
    }

    // Update booking status to cancelled
    const { error: updateError } = await supabaseAdmin
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', booking_id);

    if (updateError) {
      console.error("Update error:", updateError);
      throw new Error(`Erro ao cancelar agendamento: ${updateError.message}`);
    }

    console.log("Booking cancelled successfully:", booking_id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Agendamento cancelado com sucesso. O pagamento não será processado."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Booking cancellation error:", error);
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
