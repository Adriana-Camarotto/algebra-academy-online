// Script temporário para debug dos bookings
console.log("🔍 Iniciando verificação dos bookings...");

// Vamos usar fetch direto para a API do Supabase
const supabaseUrl = "https://uqokrzgvshzcbokqnjth.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxb2tyemd2c2h6Y2Jva3FuanRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MTgzMTcsImV4cCI6MjA1MDI5NDMxN30.ZiEoklbL5Bw5TlVMJdpbnwP6i-xTXNfC0hvFKsKlFj0";

async function debugBookings() {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/bookings?service_type=eq.group&order=lesson_date.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const allGroupBookings = await response.json();

    console.log("📊 All group bookings found:", allGroupBookings.length);

    if (allGroupBookings.length > 0) {
      console.log("\n📅 Group bookings by date:");
      allGroupBookings.forEach((booking, index) => {
        console.log(`${index + 1}. ID: ${booking.id}`);
        console.log(`   Date: ${booking.lesson_date}`);
        console.log(`   Time: ${booking.lesson_time}`);
        console.log(
          `   Session: ${booking.group_session_number}/${booking.group_session_total}`
        );
        console.log(`   Status: ${booking.status}`);
        console.log(`   Payment: ${booking.payment_status}`);
        console.log(`   User ID: ${booking.user_id}`);
        console.log("   ---");
      });
    } else {
      console.log("❌ No group bookings found in database");
    }
  } catch (error) {
    console.error("Script error:", error);
  }
}

debugBookings();
