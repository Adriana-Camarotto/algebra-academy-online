// Teste direto das Edge Functions usando fetch
const SUPABASE_URL = "https://rnhibdbxfbminqseayos.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaGliZGJ4ZmJtaW5xc2VheW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDMzNzgsImV4cCI6MjA2MzY3OTM3OH0.XKxVhfKNDQByuktEaJZtJkRqQyU3kvg91Ogfk2-dOjY";

async function testEdgeFunctions() {
  console.log("🔍 Testando Edge Functions com fetch direto...");
  console.log("URL do Supabase:", SUPABASE_URL);

  const testPayload = {
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
  };

  // Teste 1: create-payment-v2
  try {
    console.log("\n1️⃣ Testando create-payment-v2...");
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/create-payment-v2`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(testPayload),
      }
    );

    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ create-payment-v2 funcionando:", data);
    } else {
      const error = await response.text();
      console.log("⚠️ create-payment-v2 erro:", error);
    }
  } catch (err) {
    console.error("❌ Erro de rede em create-payment-v2:", err.message);
  }

  // Teste 2: create-payment
  try {
    console.log("\n2️⃣ Testando create-payment...");
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/create-payment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(testPayload),
      }
    );

    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ create-payment funcionando:", data);
    } else {
      const error = await response.text();
      console.log("⚠️ create-payment erro:", error);
    }
  } catch (err) {
    console.error("❌ Erro de rede em create-payment:", err.message);
  }

  // Teste 3: Listar funções disponíveis (endpoint de health check)
  try {
    console.log("\n3️⃣ Testando endpoint base das functions...");
    const response = await fetch(`${SUPABASE_URL}/functions/v1/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });

    console.log("Status endpoint base:", response.status);
    const responseText = await response.text();
    console.log("Resposta:", responseText);
  } catch (err) {
    console.error("❌ Erro no endpoint base:", err.message);
  }
}

testEdgeFunctions();
