// Test script to verify that cancelled bookings make time slots available again
// This simulates the booking cancellation and availability check process

console.log("🧪 Testing Cancellation → Availability Logic");

// Simulate the booking data structure
const mockBookings = [
  {
    id: "booking-1",
    lesson_date: "2025-08-19",
    lesson_time: "14:00",
    status: "scheduled",
    payment_status: "completed",
    service_type: "individual",
  },
  {
    id: "booking-2",
    lesson_date: "2025-08-19",
    lesson_time: "15:00",
    status: "cancelled", // This was cancelled
    payment_status: "refunded",
    service_type: "individual",
  },
  {
    id: "booking-3",
    lesson_date: "2025-08-19",
    lesson_time: "16:00",
    status: "scheduled",
    payment_status: "pending",
    service_type: "group",
  },
];

// Simulate the activeBookings filter logic from useBookingLogic.ts
const activeBookings = mockBookings.filter(
  (booking) =>
    booking.status !== "cancelled" &&
    booking.payment_status !== "refunded" &&
    (booking.service_type === "individual" || booking.service_type === "group")
);

console.log("📊 Original bookings:", mockBookings.length);
console.log("📊 Active bookings (blocking calendar):", activeBookings.length);

console.log("\n🔍 Active bookings details:");
activeBookings.forEach((booking, index) => {
  console.log(
    `${index + 1}. ${booking.lesson_date} ${booking.lesson_time} - ${
      booking.status
    }/${booking.payment_status}`
  );
});

// Simulate the isTimeSlotAvailable function logic
function isTimeSlotAvailable(date, time) {
  const conflictingBookings = activeBookings.filter((booking) => {
    const bookingTime = booking.lesson_time.slice(0, 5);
    const searchTime = time.slice(0, 5);
    return booking.lesson_date === date && bookingTime === searchTime;
  });

  const hasAnyActiveBooking = conflictingBookings.some((booking) => {
    return (
      booking.status !== "cancelled" && booking.payment_status !== "refunded"
    );
  });

  return !hasAnyActiveBooking;
}

// Test availability for each time slot on 2025-08-19
const testTimeSlots = ["14:00", "15:00", "16:00"];
console.log("\n🎯 Time Slot Availability Test for 2025-08-19:");

testTimeSlots.forEach((time) => {
  const isAvailable = isTimeSlotAvailable("2025-08-19", time);
  const originalBooking = mockBookings.find(
    (b) => b.lesson_date === "2025-08-19" && b.lesson_time === time
  );

  console.log(
    `${time}: ${isAvailable ? "✅ AVAILABLE" : "❌ BLOCKED"} ${
      originalBooking
        ? `(Original: ${originalBooking.status}/${originalBooking.payment_status})`
        : "(No booking)"
    }`
  );
});

console.log("\n🏆 EXPECTED RESULTS:");
console.log("• 14:00: ❌ BLOCKED (scheduled/completed)");
console.log("• 15:00: ✅ AVAILABLE (cancelled/refunded - SHOULD BE AVAILABLE)");
console.log("• 16:00: ❌ BLOCKED (scheduled/pending)");

console.log("\n🎉 TEST CONCLUSION:");
console.log(
  "If 15:00 shows as AVAILABLE, the cancellation → availability logic is working correctly!"
);
