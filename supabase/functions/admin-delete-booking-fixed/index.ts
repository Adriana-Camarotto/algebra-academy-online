import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 200,
    });
  }

  // Only allow POST method
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  }

  try {
    console.log("=== ADMIN DELETE BOOKING START ===");
    console.log("Method:", req.method);
    console.log("Starting admin/tutor booking deletion process");

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { booking_id } = requestBody;
    console.log("Deleting booking:", booking_id);

    if (!booking_id) {
      return new Response(
        JSON.stringify({ success: false, error: "booking_id is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Usuário não autenticado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !data.user?.id) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ success: false, error: "Usuário não encontrado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // Verify user has admin or tutor role
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (userError) {
      console.error("User query error:", userError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Dados do usuário não encontrados",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    if (!userData || (userData.role !== "admin" && userData.role !== "tutor")) {
      console.log(
        "Permission denied for user:",
        data.user.id,
        "role:",
        userData?.role
      );
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Permissão insuficiente: apenas administradores e tutores podem deletar agendamentos",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 403,
        }
      );
    }

    console.log("User verified:", data.user.id, "role:", userData.role);

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (bookingError) {
      console.error("Booking query error:", bookingError);
      return new Response(
        JSON.stringify({ success: false, error: "Agendamento não encontrado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    if (!booking) {
      return new Response(
        JSON.stringify({ success: false, error: "Agendamento não encontrado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    console.log("Booking found:", {
      id: booking.id,
      lesson_date: booking.lesson_date,
      lesson_time: booking.lesson_time,
      payment_status: booking.payment_status,
      status: booking.status,
    });

    // Delete the booking
    const { error: deleteError } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", booking_id);

    if (deleteError) {
      console.error("Error deleting booking:", deleteError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Erro ao deletar agendamento: " + deleteError.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log("Booking deleted successfully by admin/tutor");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Agendamento deletado com sucesso",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Admin deletion error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Erro interno do servidor",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
