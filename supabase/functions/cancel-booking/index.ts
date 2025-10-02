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
    console.log("Starting booking cancellation process");

    const { booking_id, refund_eligible } = await req.json();
    console.log(
      "Cancelling booking:",
      booking_id,
      "Refund eligible:",
      refund_eligible
    );

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

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .eq("user_id", data.user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Agendamento não encontrado");
    }

    // Check if cancellation is allowed (24 hours before lesson)
    // Calculate 24 hours before lesson in UTC
    const lessonDateTime = new Date(
      `${booking.lesson_date}T${booking.lesson_time}`
    );
    const twentyFourHoursBefore = new Date(
      lessonDateTime.getTime() - 24 * 60 * 60 * 1000
    );
    const now = new Date();

    const canCancel = now <= twentyFourHoursBefore;
    console.log("Cancellation check:", {
      lessonDateTime: lessonDateTime.toISOString(),
      twentyFourHoursBefore: twentyFourHoursBefore.toISOString(),
      now: now.toISOString(),
      canCancel,
    });

    if (booking.status === "cancelled") {
      throw new Error("Agendamento já foi cancelado");
    }

    // Determine if refund should be processed based on timing and payment status
    const shouldRefund =
      refund_eligible && booking.payment_status === "paid" && canCancel;

    // Initialize Stripe if payment was made and refund is needed
    let paymentRefunded = false;
    if (shouldRefund && booking.payment_intent_id) {
      const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
      if (stripeSecretKey) {
        const stripe = new Stripe(stripeSecretKey, {
          apiVersion: "2023-10-16",
        });

        try {
          // Try to refund the payment
          const refund = await stripe.refunds.create({
            payment_intent: booking.payment_intent_id,
            reason: "requested_by_customer",
          });

          if (refund.status === "succeeded" || refund.status === "pending") {
            paymentRefunded = true;
            console.log("Refund created:", refund.id);
          }
        } catch (stripeError) {
          console.error("Stripe refund error:", stripeError);
          // Continue with cancellation even if refund fails
        }
      }
    }

    // Update booking status
    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update({
        status: "cancelled",
        payment_status: paymentRefunded ? "refunded" : booking.payment_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id);

    if (updateError) {
      throw new Error("Erro ao cancelar agendamento: " + updateError.message);
    }

    // Log cancellation
    await supabaseAdmin.from("payment_logs").insert({
      booking_id: booking_id,
      payment_intent_id: booking.payment_intent_id,
      status: "cancelled",
      stripe_response: {
        refund_status: paymentRefunded ? "refunded" : "no_payment_to_refund",
      },
    });

    console.log("Booking cancelled successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Agendamento cancelado com sucesso",
        payment_refunded: paymentRefunded,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Cancellation error:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
