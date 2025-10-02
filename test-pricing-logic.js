// Test script to validate the pricing logic for all service types

console.log("🧪 Testing Pricing Logic for New Services\n");

// Service prices defined in useBookingLogic.ts
const servicePrices = {
  "primary-school": 2500, // £25.00
  "secondary-school": 3000, // £30.00
  "a-level": 3500, // £35.00
  individual: 30, // £0.30 (legacy)
  "exam-prep": 30, // £0.30
  group: 30, // £0.30
};

// Test function to calculate pricing
function calculateBookingAmount(serviceType, lessonType, numberOfLessons = 1) {
  const servicePrice = servicePrices[serviceType] || 30;

  if (lessonType === "recurring") {
    return servicePrice * numberOfLessons;
  } else {
    return servicePrice;
  }
}

// Test function to calculate lessons from amount (for display splitting)
function calculateLessonsFromAmount(serviceType, totalAmount) {
  const pricePerLesson = servicePrices[serviceType] || 30;
  return Math.floor(totalAmount / pricePerLesson) || 1;
}

console.log("📊 SINGLE LESSON PRICING:");
console.log(
  "Primary School (single):",
  `£${calculateBookingAmount("primary-school", "single") / 100}`
);
console.log(
  "Secondary School (single):",
  `£${calculateBookingAmount("secondary-school", "single") / 100}`
);
console.log(
  "A-level (single):",
  `£${calculateBookingAmount("a-level", "single") / 100}`
);

console.log("\n📊 RECURRING LESSON PRICING (4 weeks):");
console.log(
  "Primary School (recurring):",
  `£${
    calculateBookingAmount("primary-school", "recurring", 4) / 100
  } (4 lessons × £25)`
);
console.log(
  "Secondary School (recurring):",
  `£${
    calculateBookingAmount("secondary-school", "recurring", 4) / 100
  } (4 lessons × £30)`
);
console.log(
  "A-level (recurring):",
  `£${
    calculateBookingAmount("a-level", "recurring", 4) / 100
  } (4 lessons × £35)`
);

console.log("\n🔄 DISPLAY SPLITTING LOGIC TEST:");
// Test the logic used in StudentBookingsPage for splitting recurring bookings into individual cards
const testBookings = [
  {
    service_type: "primary-school",
    amount: 10000,
    description: "4 Primary School lessons",
  },
  {
    service_type: "secondary-school",
    amount: 12000,
    description: "4 Secondary School lessons",
  },
  { service_type: "a-level", amount: 14000, description: "4 A-level lessons" },
  {
    service_type: "individual",
    amount: 120,
    description: "4 Individual lessons (legacy)",
  },
];

testBookings.forEach((booking) => {
  const lessonCount = calculateLessonsFromAmount(
    booking.service_type,
    booking.amount
  );
  const amountPerLesson = Math.floor(booking.amount / lessonCount);

  console.log(`${booking.description}:`);
  console.log(`  Total: £${booking.amount / 100}`);
  console.log(`  Lessons detected: ${lessonCount}`);
  console.log(`  Per lesson: £${amountPerLesson / 100}`);
  console.log("");
});

console.log("✅ All pricing logic tests completed!");
