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

  try {
    console.log("=== ADMIN DELETE BOOKING START ===");
    console.log("Method:", req.method);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));

    console.log("Starting admin/tutor booking deletion process");

    const { booking_id } = await req.json();
    console.log("Deleting booking:", booking_id);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Usuário não autenticado");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);

    if (!data.user?.id) {
      throw new Error("Usuário não encontrado");
    }

    // Verify user has admin or tutor role
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (userError || !userData) {
      throw new Error("Dados do usuário não encontrados");
    }

    if (userData.role !== "admin" && userData.role !== "tutor") {
      throw new Error(
        "Permissão insuficiente: apenas administradores e tutores podem deletar agendamentos"
      );
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Agendamento não encontrado");
    }

    console.log("Booking found:", {
      id: booking.id,
      lesson_date: booking.lesson_date,
      lesson_time: booking.lesson_time,
      payment_status: booking.payment_status,
      status: booking.status,
    });

    // Check if lesson is within 24-hour payment window
    const lessonDateTime = new Date(
      `${booking.lesson_date}T${booking.lesson_time}`
    );
    const twentyFourHoursBefore = new Date(
      lessonDateTime.getTime() - 24 * 60 * 60 * 1000
    );
    const now = new Date();

    // Admin deletion within payment window requires automatic refund
    const isWithinPaymentWindow =
      now >= twentyFourHoursBefore && now < lessonDateTime;
    const shouldAutoRefund =
      isWithinPaymentWindow &&
      (booking.payment_status === "paid" ||
        booking.payment_status === "completed") &&
      booking.status !== "cancelled";

    console.log("Refund logic check:", {
      lessonDateTime: lessonDateTime.toISOString(),
      twentyFourHoursBefore: twentyFourHoursBefore.toISOString(),
      now: now.toISOString(),
      isWithinPaymentWindow,
      shouldAutoRefund,
      paymentStatus: booking.payment_status,
      bookingStatus: booking.status,
    });

    // Initialize Stripe for automatic refund if needed
    let paymentRefunded = false;
    let refundId = null;

    if (shouldAutoRefund && booking.payment_intent_id) {
      const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeSecretKey) {
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: "2023-10-16",
        });

        try {
          console.log(
            "Processing automatic refund for payment:",
            booking.payment_intent_id
          );

          // Create automatic refund
          const refund = await stripe.refunds.create({
            payment_intent: booking.payment_intent_id,
            reason: "requested_by_customer", // Stripe requires this to be one of their predefined reasons
            metadata: {
              admin_deletion: "true",
              admin_user_id: data.user.id,
              deletion_reason:
                "Admin/tutor deleted lesson within 24h payment window",
            },
          });

          if (refund.status === "succeeded" || refund.status === "pending") {
            paymentRefunded = true;
            refundId = refund.id;
            console.log(
              "Automatic refund processed:",
              refund.id,
              "Status:",
              refund.status
            );
          } else {
            console.warn("Refund not processed, status:", refund.status);
          }
        } catch (stripeError) {
          console.error("Stripe automatic refund error:", stripeError);
          // Log the error but continue with deletion - admin can manually process refund
        }
      } else {
        console.warn(
          "Stripe secret key not configured - cannot process refund"
        );
      }
    }

    // Log the admin deletion in payment_logs as audit trail
    const { error: logError } = await supabaseAdmin
      .from("payment_logs")
      .insert({
        booking_id: booking_id,
        user_id: booking.user_id,
        amount: booking.amount,
        currency: booking.currency,
        status: paymentRefunded ? "admin_deleted_refunded" : "admin_deleted",
        payment_intent_id:
          booking.payment_intent_id ||
          `admin_deleted_${booking_id}_${Date.now()}`,
        stripe_session_id: `admin_deletion_${data.user.id}`,
        stripe_response: {
          admin_deletion: true,
          admin_user_id: data.user.id,
          admin_role: userData.role,
          within_payment_window: isWithinPaymentWindow,
          refund_processed: paymentRefunded,
          refund_id: refundId,
          deletion_timestamp: now.toISOString(),
        },
        created_at: now.toISOString(),
      });

    if (logError) {
      console.warn("Could not log admin deletion:", logError);
    }

    // Delete the booking
    const { error: deleteError } = await supabaseAdmin
      .from("bookings")
      .delete()
      .eq("id", booking_id);

    if (deleteError) {
      console.error("Error deleting booking:", deleteError);
      throw new Error("Erro ao deletar agendamento: " + deleteError.message);
    }

    console.log("Booking deleted successfully by admin/tutor");

    // Determine success message based on refund status
    let message = "Agendamento deletado com sucesso";
    if (shouldAutoRefund) {
      if (paymentRefunded) {
        message += " e reembolso processado automaticamente";
      } else {
        message += " (reembolso automático falhou - processar manualmente)";
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message,
        automatic_refund_processed: paymentRefunded,
        refund_id: refundId,
        within_payment_window: isWithinPaymentWindow,
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
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
