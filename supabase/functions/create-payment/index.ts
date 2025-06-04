
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting payment creation process");

    // Get request body
    const { amount, currency = 'gbp', product_name, booking_details, user_info } = await req.json();
    console.log("Request data:", { amount, currency, product_name, booking_details, user_info });

    // Stripe has a minimum amount requirement of £0.30 for GBP
    const minimumAmount = 30; // £0.30 = 30 pence
    const finalAmount = Math.max(amount, minimumAmount);
    console.log("Using amount:", finalAmount, "pence (minimum required)");

    // Create Supabase client using the service role key for database operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // For mock authentication, we'll use the user_info passed in the request body
    if (!user_info || !user_info.id || !user_info.email) {
      throw new Error("Informações do usuário são obrigatórias");
    }

    const userId = user_info.id;
    const userEmail = user_info.email;
    console.log("User authenticated:", { userId, userEmail });

    // Check if Stripe secret key is available
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    console.log("Stripe initialized successfully");

    // Create booking record in database first
    const { data: bookingData, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        lesson_date: booking_details.date,
        lesson_time: booking_details.time,
        lesson_day: booking_details.day,
        service_type: booking_details.service,
        lesson_type: booking_details.lesson_type,
        amount: finalAmount,
        currency: currency,
        student_email: booking_details.student_email,
        status: 'scheduled',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      console.error("Error creating booking:", bookingError);
      throw new Error("Erro ao criar agendamento: " + bookingError.message);
    }

    console.log("Booking created:", bookingData.id);

    // Check if a Stripe customer record exists for this user
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Existing customer found:", customerId);
    } else {
      console.log("No existing customer found, will create new one");
    }

    // Create a one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: product_name || "Aula de Tutoria de Matemática",
              description: booking_details ? 
                `Aula agendada para ${booking_details.date} (${booking_details.day}) às ${booking_details.time}` : 
                "Sessão de tutoria de matemática individual"
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingData.id}`,
      cancel_url: `${req.headers.get("origin")}/booking`,
      metadata: {
        booking_id: bookingData.id,
        booking_date: booking_details?.date || "",
        booking_day: booking_details?.day || "",
        booking_time: booking_details?.time || "",
        user_email: userEmail,
      }
    });

    console.log("Stripe session created successfully:", session.id);

    // Update booking with payment intent
    await supabaseAdmin
      .from('bookings')
      .update({ payment_intent_id: session.payment_intent })
      .eq('id', bookingData.id);

    // Log payment attempt
    await supabaseAdmin
      .from('payment_logs')
      .insert({
        booking_id: bookingData.id,
        payment_intent_id: session.payment_intent,
        status: 'session_created',
        stripe_response: { session_id: session.id }
      });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Erro ao processar pagamento. Verifique os logs para mais detalhes."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
