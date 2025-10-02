import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper function to get lesson type description
function getLessonTypeDescription(lesson: any): string {
  if (lesson.service_type === "group") {
    return `Group Session ${lesson.group_session_number || 1}/${lesson.group_session_total || 1}`;
  } else if (lesson.service_type === "individual") {
    if (lesson.lesson_type === "recurring") {
      return `Individual Recurring Lesson ${lesson.recurring_session_number || 1}/${lesson.recurring_session_total || 1}`;
    }
    return "Individual Lesson (Single)";
  } else if (lesson.service_type === "exam-prep") {
    return "GCSE & A-Level Preparation";
  }
  return `${lesson.service_type} lesson`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Processing automatic payments for ALL lesson types (24h before each lesson)");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get current date and calculate 24h from now
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

    console.log("Checking for ALL lessons scheduled for:", tomorrowDateStr);

    // Find ALL lessons that need payment processing (24h before the lesson)
    // This includes: group, individual (single), individual (recurring), and exam-prep
    const { data: upcomingLessons, error: fetchError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("payment_status", "pending")
      .eq("lesson_date", tomorrowDateStr) // Lessons happening tomorrow
      .in("status", ["scheduled"]);

    if (fetchError) {
      console.error("Error fetching upcoming lessons:", fetchError);
      throw new Error("Failed to fetch upcoming lessons");
    }

    console.log(`Found ${upcomingLessons?.length || 0} lessons requiring payment processing:`, {
      individual: upcomingLessons?.filter(l => l.service_type === 'individual').length || 0,
      group: upcomingLessons?.filter(l => l.service_type === 'group').length || 0,
      examPrep: upcomingLessons?.filter(l => l.service_type === 'exam-prep').length || 0
    });

    if (!upcomingLessons || upcomingLessons.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        message: "No lessons requiring payment processing",
        processed_count: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    let processedCount = 0;
    const results = [];

    // Process each lesson (all types now follow the same 24h rule)
    for (const lesson of upcomingLessons) {
      try {
        const lessonTypeDescription = getLessonTypeDescription(lesson);
        console.log(`Processing payment for ${lessonTypeDescription} for user ${lesson.user_id}`);

        // Get user details
        const { data: userProfile, error: userError } = await supabaseClient
          .from("profiles")
          .select("email")
          .eq("id", lesson.user_id)
          .single();

        if (userError || !userProfile) {
          console.error(`Error fetching user profile for ${lesson.user_id}:`, userError);
          results.push({ 
            booking_id: lesson.id, 
            status: "error", 
            message: "User profile not found" 
          });
          continue;
        }

        // Create Stripe payment intent for the lesson
        try {
          const paymentAmount = Math.max(lesson.amount || 30, 30); // Minimum £0.30
          const paymentIntent = await stripe.paymentIntents.create({
            amount: paymentAmount,
            currency: "gbp",
            description: `${lessonTypeDescription} - Math Tutoring`,
            metadata: {
              booking_id: lesson.id,
              user_id: lesson.user_id,
              lesson_date: lesson.lesson_date,
              lesson_time: lesson.lesson_time,
              service_type: lesson.service_type,
              lesson_type: lesson.lesson_type || "single",
              automatic_payment: "true"
            },
            // In production, you would use stored payment method
            // payment_method: stored_payment_method_id,
            // confirm: true,
          });

          console.log(`Created payment intent for lesson ${lesson.id}: ${paymentIntent.id}`);

          // For now, simulate successful payment by marking as paid
          // In production, you would confirm the payment with the stored payment method
          const { error: updateError } = await supabaseClient
            .from("bookings")
            .update({
              payment_status: "paid",
              payment_intent_id: paymentIntent.id,
              payment_processed_at: new Date().toISOString(),
            })
            .eq("id", lesson.id);

          if (updateError) {
            console.error(`Error updating booking ${lesson.id}:`, updateError);
            results.push({ 
              booking_id: lesson.id, 
              status: "error", 
              message: "Failed to update booking after payment" 
            });
          } else {
            console.log(`Successfully processed payment for booking ${lesson.id}`);
            processedCount++;
            results.push({ 
              booking_id: lesson.id, 
              status: "paid", 
              payment_intent_id: paymentIntent.id,
              amount: paymentAmount,
              service_type: lesson.service_type,
              lesson_type: lesson.lesson_type,
              message: "Payment successfully processed"
            });
          }

        } catch (paymentError) {
          console.error(`Stripe payment error for booking ${lesson.id}:`, paymentError);
          
          // Mark as payment failed
          await supabaseClient
            .from("bookings")
            .update({
              payment_status: "payment_failed",
              payment_error: paymentError.message,
            })
            .eq("id", lesson.id);

          results.push({ 
            booking_id: lesson.id, 
            status: "payment_failed", 
            message: `Payment failed: ${paymentError.message}` 
          });
        }

      } catch (error) {
        console.error(`Error processing payment for booking ${lesson.id}:`, error);
        results.push({ 
          booking_id: lesson.id, 
          status: "error", 
          message: error.message 
        });
      }
    }

    console.log(`Payment processing completed. Processed: ${processedCount}/${upcomingLessons.length}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: "Payment processing completed for all lesson types",
      processed_count: processedCount,
      total_found: upcomingLessons.length,
      results: results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Automatic payment processing error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: "Error processing automatic payments",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const bookingsToProcess = bookings.filter((booking) => {
      const lessonDateTime = new Date(
        `${booking.lesson_date}T${booking.lesson_time}`
      );
      const paymentTime = new Date(
        lessonDateTime.getTime() - 23 * 60 * 60 * 1000 - 59 * 60 * 1000
      );

      return (
        paymentTime >= paymentWindowStart && paymentTime <= paymentWindowEnd
      );
    });

    console.log(`Found ${bookingsToProcess.length} bookings to process`);

    let processedCount = 0;
    const errors = [];

    // Process each booking
    for (const booking of bookingsToProcess) {
      try {
        console.log(`Processing payment for booking ${booking.id}`);

        // Update payment status to processing
        const { error: updateError1 } = await supabaseClient
          .from("bookings")
          .update({
            payment_status: "processing",
            updated_at: now.toISOString(),
          })
          .eq("id", booking.id);

        if (updateError1) {
          throw new Error(
            `Failed to update booking to processing: ${updateError1.message}`
          );
        }

        // Here you would integrate with Stripe or your payment processor
        // For now, we'll simulate the payment process

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simulate payment success (in real implementation, this would depend on Stripe response)
        const paymentSuccessful = Math.random() > 0.1; // 90% success rate for simulation

        if (paymentSuccessful) {
          // Update booking to paid status
          const { error: updateError2 } = await supabaseClient
            .from("bookings")
            .update({
              payment_status: "paid",
              payment_processed_at: now.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq("id", booking.id);

          if (updateError2) {
            throw new Error(
              `Failed to update booking to paid: ${updateError2.message}`
            );
          }

          console.log(`Payment successful for booking ${booking.id}`);
          processedCount++;

          // TODO: Send confirmation email to student
        } else {
          // Payment failed
          const { error: updateError3 } = await supabaseClient
            .from("bookings")
            .update({
              payment_status: "failed",
              updated_at: now.toISOString(),
            })
            .eq("id", booking.id);

          if (updateError3) {
            throw new Error(
              `Failed to update booking to failed: ${updateError3.message}`
            );
          }

          console.log(`Payment failed for booking ${booking.id}`);
          errors.push(`Payment failed for booking ${booking.id}`);

          // TODO: Send payment failure notification to student
        }
      } catch (error) {
        console.error(`Error processing booking ${booking.id}:`, error);
        errors.push(`Error processing booking ${booking.id}: ${error.message}`);

        // Reset booking status to pending on error
        await supabaseClient
          .from("bookings")
          .update({
            payment_status: "pending",
            updated_at: now.toISOString(),
          })
          .eq("id", booking.id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${processedCount} payments successfully`,
        processed_count: processedCount,
        total_found: bookingsToProcess.length,
        errors: errors,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-automatic-payments:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
