import React, { useState } from "react";

const GroupSessionDebugger = () => {
  const [debugInfo, setDebugInfo] = useState("");

  const testGroupSessionFlow = () => {
    const log = [];

    // Simular seleção de group session
    const selectedService = "group";
    const selectedDate = new Date("2025-01-20"); // Monday
    const selectedDay = "monday";
    const selectedTime = "10:00";
    const lessonType = null; // Group sessions não precisam

    log.push("🔍 TESTE DO FLUXO COMPLETO DE GROUP SESSIONS");
    log.push(`📋 Dados selecionados:`);
    log.push(`   - Service: ${selectedService}`);
    log.push(`   - Date: ${selectedDate.toISOString().split("T")[0]}`);
    log.push(`   - Day: ${selectedDay}`);
    log.push(`   - Time: ${selectedTime}`);
    log.push(`   - Lesson Type: ${lessonType}`);

    // Teste 1: Verificar se é group service
    const isGroupService = selectedService === "group";
    log.push(`\n✅ Teste 1 - É group service? ${isGroupService}`);

    // Teste 2: Deve calcular datas recorrentes?
    const shouldCalculateRecurring = selectedService === "group";
    log.push(
      `✅ Teste 2 - Deve calcular datas recorrentes? ${shouldCalculateRecurring}`
    );

    // Teste 3: Simular calculateRecurringDates
    if (shouldCalculateRecurring) {
      const recurringDates = [];
      let currentDate = new Date(selectedDate);

      for (let i = 0; i < 6; i++) {
        recurringDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 7);
      }

      log.push(`✅ Teste 3 - Datas calculadas (${recurringDates.length}):`);
      recurringDates.forEach((date, i) => {
        log.push(`   Session ${i + 1}: ${date.toISOString().split("T")[0]}`);
      });
    }

    // Teste 4: Verificar lógica isRecurring
    const isRecurring = selectedService === "group";
    log.push(`\n✅ Teste 4 - Deve marcar como recurring? ${isRecurring}`);

    // Teste 5: Verificar preço
    const baseAmount = selectedService === "group" ? 30 * 6 : 30;
    log.push(
      `✅ Teste 5 - Preço calculado: ${baseAmount} pence (£${baseAmount / 100})`
    );

    // Teste 6: Verificar payload do request
    const requestPayload = {
      amount: baseAmount,
      currency: "gbp",
      product_name: `Tutoria de Matemática - ${selectedService} (6 sessões semanais)`,
      booking_details: {
        service: selectedService,
        lesson_type: lessonType,
        date: selectedDate.toISOString().split("T")[0],
        day: selectedDay,
        time: selectedTime,
        recurring_dates: shouldCalculateRecurring
          ? Array.from({ length: 6 }, (_, i) => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + i * 7);
              return date.toISOString().split("T")[0];
            })
          : undefined,
      },
    };

    log.push(`\n✅ Teste 6 - Payload do request:`);
    log.push(`   - Service: ${requestPayload.booking_details.service}`);
    log.push(`   - Amount: ${requestPayload.amount}`);
    log.push(
      `   - Recurring dates: ${
        requestPayload.booking_details.recurring_dates?.length || 0
      }`
    );

    log.push(`\n🎯 CONCLUSÃO:`);
    log.push(`Se todos os testes passaram, o problema pode estar em:`);
    log.push(`1. Backend não está recebendo service="group" corretamente`);
    log.push(`2. Validação bloqueando antes do request`);
    log.push(`3. UI não permitindo seleção de group sessions`);

    setDebugInfo(log.join("\n"));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>🧪 Group Session Debugger</h2>
      <button
        onClick={testGroupSessionFlow}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Executar Teste Completo
      </button>

      {debugInfo && (
        <pre
          style={{
            backgroundColor: "#f8f9fa",
            padding: "15px",
            borderRadius: "5px",
            border: "1px solid #dee2e6",
            whiteSpace: "pre-wrap",
            fontSize: "12px",
          }}
        >
          {debugInfo}
        </pre>
      )}
    </div>
  );
};

export default GroupSessionDebugger;
