// Script de teste para verificar dados do Supabase
import { supabase } from "./src/integrations/supabase/client.js";

console.log("🔍 Testando conectividade com Supabase...");

async function testBookings() {
  try {
    // Testa a tabela bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .limit(5);

    console.log("📊 Bookings encontrados:", {
      error: bookingsError,
      count: bookings?.length || 0,
      data: bookings,
    });

    // Testa a tabela users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(5);

    console.log("👥 Users encontrados:", {
      error: usersError,
      count: users?.length || 0,
      data: users,
    });

    // Lista todas as tabelas
    const { data: tables, error: tablesError } = await supabase.rpc(
      "list_tables"
    );

    console.log("🗄️ Tabelas disponíveis:", {
      error: tablesError,
      tables: tables,
    });
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

testBookings();
