// Teste para verificar se as Edge Functions estão funcionando
import { supabase } from "./src/integrations/supabase/client.js";

async function testEdgeFunctions() {
  console.log("🔍 Testando Edge Functions...");
  console.log("URL do Supabase:", "https://rnhibdbxfbminqseayos.supabase.co");

  // Teste 1: Verificar create-payment-v2
  try {
    console.log("\n1️⃣ Testando create-payment-v2...");
    const { data, error } = await supabase.functions.invoke(
      "create-payment-v2",
      {
        body: {
          amount: 30,
          currency: "gbp",
          product_name: "Test",
          booking_details: {
            service: "individual",
            lesson_type: "single",
            date: "2025-08-10",
            day: "sunday",
            time: "10:00",
            student_email: "test@test.com",
          },
          user_info: {
            id: "test-id",
            email: "test@test.com",
          },
        },
      }
    );

    console.log("✅ create-payment-v2 respondeu:", { data, error });
  } catch (err) {
    console.error("❌ Erro em create-payment-v2:", err);
  }

  // Teste 2: Verificar create-payment (original)
  try {
    console.log("\n2️⃣ Testando create-payment...");
    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: {
        amount: 30,
        currency: "gbp",
        product_name: "Test",
        booking_details: {
          service: "individual",
          lesson_type: "single",
          date: "2025-08-10",
          day: "sunday",
          time: "10:00",
          student_email: "test@test.com",
        },
        user_info: {
          id: "test-id",
          email: "test@test.com",
        },
      },
    });

    console.log("✅ create-payment respondeu:", { data, error });
  } catch (err) {
    console.error("❌ Erro em create-payment:", err);
  }

  // Teste 3: Verificar process-individual-payment
  try {
    console.log("\n3️⃣ Testando process-individual-payment...");
    const { data, error } = await supabase.functions.invoke(
      "process-individual-payment",
      {
        body: {
          booking_id: "test-booking-id",
          amount: 30,
          currency: "gbp",
          user_info: {
            id: "test-id",
            email: "test@test.com",
          },
        },
      }
    );

    console.log("✅ process-individual-payment respondeu:", { data, error });
  } catch (err) {
    console.error("❌ Erro em process-individual-payment:", err);
  }
}

// Execute o teste
testEdgeFunctions();
