// 🔍 SCRIPT DE DEBUG PARA BOOKING VALIDATION

// Cole este código no console do navegador para debug detalhado

console.log("🚀 INICIANDO DEBUG DO BOOKING VALIDATION");

// Função para simular o teste de booking
window.debugBookingValidation = function (day, time, dateStr) {
  console.group(`🔍 DEBUG BOOKING: ${day} ${time} ${dateStr}`);

  // 1. Verificar estado atual dos bookedSlots
  const bookingLogic = window.bookingLogicHook;
  if (!bookingLogic) {
    console.error(
      "❌ Hook de booking não encontrado. Certifique-se de estar na página de booking."
    );
    console.groupEnd();
    return;
  }

  // 2. Simular data
  const testDate = new Date(dateStr);
  console.log("📅 Data de teste:", testDate);

  // 3. Testar isTimeSlotAvailable com contexto UI
  console.log("🎨 Testando validação da UI...");
  const uiResult = bookingLogic.isTimeSlotAvailable(
    day,
    time,
    testDate,
    "DEBUG_UI"
  );

  // 4. Simular o force refresh e testar novamente
  console.log("🔄 Simulando force refresh...");
  bookingLogic.loadBookings(true).then(() => {
    console.log("✅ Dados recarregados, testando validação de booking...");
    const bookingResult = bookingLogic.isTimeSlotAvailable(
      day,
      time,
      testDate,
      "DEBUG_BOOKING"
    );

    // 5. Comparar resultados
    console.log("📊 RESULTADOS COMPARADOS:");
    console.table({
      "UI Validation": uiResult,
      "Booking Validation": bookingResult,
      Synchronized: uiResult === bookingResult,
    });

    if (uiResult !== bookingResult) {
      console.error("❌ DISCREPÂNCIA DETECTADA!");
      console.log("🔍 Verificando dados detalhados...");

      // Verificar bookedSlots para essa data
      const bookedSlots = bookingLogic.bookedSlots;
      const dayBookings = bookedSlots[dateStr];

      console.log("🗓️ BookedSlots para", dateStr, ":", dayBookings);
      if (dayBookings && dayBookings[day]) {
        console.log("📋 Bookings específicos para", day, ":", dayBookings[day]);

        // Filtrar bookings para esse horário específico
        const timeBookings = dayBookings[day].filter((b) => {
          const bookingTime = b.time.substring(0, 5);
          const normalizedTime = time.padStart(5, "0");
          return bookingTime === normalizedTime;
        });

        console.log("⏰ Bookings para", time, ":", timeBookings);
      }
    } else {
      console.log("✅ Validações sincronizadas corretamente!");
    }

    console.groupEnd();
  });
};

// Função para testar o caso específico mencionado
window.debugTuesdayNine = function () {
  console.log("🚨 TESTANDO O CASO ESPECÍFICO: Tuesday 9:00");

  // Use a data de hoje ou próxima terça-feira
  const today = new Date();
  const nextTuesday = new Date(today);

  // Encontrar próxima terça-feira
  const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;
  nextTuesday.setDate(today.getDate() + daysUntilTuesday);

  const dateStr = nextTuesday.toISOString().split("T")[0]; // YYYY-MM-DD format

  debugBookingValidation("tuesday", "9:00", dateStr);
};

// Função para expor o hook globalmente para debug
window.exposeBookingHook = function () {
  // Tenta encontrar o componente React e expor o hook
  const bookingComponents = document.querySelectorAll(
    '[data-testid*="booking"], [class*="booking"]'
  );
  console.log(
    "🔍 Componentes de booking encontrados:",
    bookingComponents.length
  );

  // Instruções para o usuário
  console.log(`
📋 INSTRUÇÕES DE DEBUG:

1. Certifique-se de estar na página de booking
2. Execute: debugTuesdayNine() 
3. Ou teste um horário específico: debugBookingValidation("tuesday", "9:00", "2025-08-05")

4. Para expor o hook manualmente, execute este código quando estiver no booking:
   window.bookingLogicHook = useBookingLogic(); // Cole isso no componente
`);
};

// Auto-executar setup
exposeBookingHook();

console.log(`
🎯 SCRIPT DE DEBUG CARREGADO!

Funções disponíveis:
- debugTuesdayNine() - Testa o caso específico
- debugBookingValidation(day, time, dateStr) - Teste customizado
- exposeBookingHook() - Mostra instruções de setup

Execute debugTuesdayNine() para começar!
`);
