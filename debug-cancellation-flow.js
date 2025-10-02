// Debug script to test the full cancellation flow
// This will help identify where the availability update is failing

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = "https://bmjvjykuxtqwdzhprfpb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtanZqeWt1eHRxd2R6aHByZnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjI3MDUsImV4cCI6MjA1MDI5ODcwNX0.FdBMGXdWGgzK8M_8R2_YQ6Y5BglLz4BfvYh0GQxVQRE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugCancellationFlow() {
  console.log("🔍 DEBUG: Testing full cancellation → availability flow");

  try {
    // Step 1: Get all bookings to see current state
    console.log("\n📊 STEP 1: Current booking state");
    const { data: allBookings, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error("❌ Error fetching bookings:", fetchError);
      return;
    }

    console.log("📋 Recent bookings:");
    allBookings?.forEach((booking, index) => {
      console.log(
        `${index + 1}. ${booking.lesson_date} ${booking.lesson_time} - ${
          booking.status
        }/${booking.payment_status} (Service: ${booking.service_type})`
      );
    });

    // Step 2: Filter active bookings (what should block calendar)
    const activeBookings =
      allBookings?.filter(
        (booking) =>
          booking.status !== "cancelled" &&
          booking.payment_status !== "refunded" &&
          (booking.service_type === "individual" ||
            booking.service_type === "group")
      ) || [];

    console.log("\n🔍 STEP 2: Active bookings (blocking calendar):");
    console.log("📊 Total active bookings:", activeBookings.length);
    activeBookings.forEach((booking, index) => {
      console.log(
        `${index + 1}. ${booking.lesson_date} ${booking.lesson_time} - ${
          booking.status
        }/${booking.payment_status} (ID: ${booking.id})`
      );
    });

    // Step 3: Test specific time slot availability
    const testDate = "2025-08-19";
    const testTime = "14:00";

    console.log(
      `\n🎯 STEP 3: Testing availability for ${testDate} ${testTime}`
    );

    // Simulate isTimeSlotAvailable function
    const conflictingBookings = activeBookings.filter((booking) => {
      const bookingTime = booking.lesson_time.slice(0, 5);
      const searchTime = testTime.slice(0, 5);
      return booking.lesson_date === testDate && bookingTime === searchTime;
    });

    console.log("🔍 Conflicting bookings:", conflictingBookings.length);
    conflictingBookings.forEach((booking) => {
      console.log(
        `   • ${booking.id}: ${booking.status}/${booking.payment_status}`
      );
    });

    const hasAnyActiveBooking = conflictingBookings.some((booking) => {
      return (
        booking.status !== "cancelled" && booking.payment_status !== "refunded"
      );
    });

    const isSlotAvailable = !hasAnyActiveBooking;

    console.log(
      `🎯 Result: ${testDate} ${testTime} is ${
        isSlotAvailable ? "✅ AVAILABLE" : "❌ BLOCKED"
      }`
    );

    // Step 4: Find cancelled bookings
    console.log("\n📋 STEP 4: Cancelled bookings");
    const cancelledBookings =
      allBookings?.filter((booking) => booking.status === "cancelled") || [];

    console.log("📊 Total cancelled bookings:", cancelledBookings.length);
    cancelledBookings.forEach((booking, index) => {
      console.log(
        `${index + 1}. ${booking.lesson_date} ${booking.lesson_time} - ${
          booking.status
        }/${booking.payment_status} (Cancelled: ${booking.updated_at})`
      );
    });

    console.log("\n✅ DEBUG COMPLETE");
    console.log(
      "💡 If you cancelled a booking and the slot still shows as blocked:"
    );
    console.log(
      "   1. Check if the booking status is 'cancelled' in the database"
    );
    console.log("   2. Verify that the frontend is fetching fresh data");
    console.log(
      "   3. Ensure the calendar component is re-rendering after data refresh"
    );
  } catch (error) {
    console.error("❌ DEBUG ERROR:", error);
  }
}

debugCancellationFlow();
