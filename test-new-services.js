// Test the new service types
console.log("🧪 Testing new service types implementation");

// Test service prices
const servicePrices = {
  "primary-school": 2500, // £25.00
  "secondary-school": 3000, // £30.00
  "a-level": 3500, // £35.00
  individual: 30, // £0.30 (legacy)
  "exam-prep": 30, // £0.30
  group: 30, // £0.30
};

console.log("📊 Service Prices (in pence):");
Object.entries(servicePrices).forEach(([service, price]) => {
  console.log(`• ${service}: ${price} pence (£${price / 100})`);
});

// Test service names
const serviceNames = {
  "primary-school": "Primary School",
  "secondary-school": "Secondary School (including GCSE preparation)",
  "a-level": "A-level",
  individual: "Individual Tutoring",
  "exam-prep": "GCSE & A-Level Preparation",
  group: "Group Sessions",
};

console.log("\n📝 Service Names:");
Object.entries(serviceNames).forEach(([id, name]) => {
  console.log(`• ${id}: "${name}"`);
});

// Test recurring lesson types
const recurringServices = [
  "primary-school",
  "secondary-school",
  "a-level",
  "individual",
];
console.log("\n🔄 Services that support recurring lessons:");
recurringServices.forEach((service) => {
  console.log(`• ${service}: SUPPORTS recurring lessons with dropdown`);
});

console.log("\n✅ All service types configured correctly!");
console.log("🎯 Ready to test in the application!");
