// Teste para verificar se as group sessions estão funcionando corretamente
console.log("🧪 TESTE DE GROUP SESSIONS");

// Simular booking de group session
const testGroupSessionBooking = {
  selectedService: "group",
  selectedDate: new Date("2025-01-20"), // Monday
  selectedDay: "monday",
  selectedTime: "10:00",
  lessonType: null, // Group sessions não precisam de lesson type
};

console.log("📋 Test booking data:", testGroupSessionBooking);

// Verificar se o serviço é group
const isGroupService = testGroupSessionBooking.selectedService === "group";
console.log("✅ Is group service?", isGroupService);

// Verificar se deveria calcular datas recorrentes
const shouldCalculateRecurring =
  testGroupSessionBooking.selectedService === "group";
console.log("✅ Should calculate recurring dates?", shouldCalculateRecurring);

// Simular função calculateRecurringDates
function calculateRecurringDates(startDate, dayOfWeek) {
  const recurringDates = [];
  let currentDate = new Date(startDate);

  // Gerar 6 datas semanais
  for (let i = 0; i < 6; i++) {
    recurringDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return recurringDates;
}

if (shouldCalculateRecurring) {
  const recurringDates = calculateRecurringDates(
    testGroupSessionBooking.selectedDate,
    testGroupSessionBooking.selectedDay
  );

  console.log(
    "📅 Recurring dates calculated:",
    recurringDates.map((d) => d.toISOString().split("T")[0])
  );
  console.log("📊 Total sessions:", recurringDates.length);
}

// Verificar lógica de isRecurring
const isRecurring = testGroupSessionBooking.selectedService === "group";
console.log("✅ Should mark as recurring?", isRecurring);

console.log(
  "🎯 RESULTADO: Se tudo estiver OK, group sessions deveriam funcionar!"
);
