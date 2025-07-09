# 🚨 INSERÇÃO TRAVANDO - TESTE DIRETO NO CONSOLE

## 🎯 Progresso Atual ✅

Conseguimos passar por TODAS as verificações que travavam antes:

- ✅ getSession() - Resolvido com timeout
- ✅ Teste de RLS - Removido completamente
- ✅ Preparação de dados - Funcionando
- ❌ **AGORA trava na inserção**: `supabase.from("bookings").insert()`

## 🧪 TESTE IMEDIATO NO CONSOLE

Enquanto o timeout que implementei está sendo testado, execute este código **AGORA** no Console do DevTools:

```javascript
// TESTE DIRETO DE INSERÇÃO NO CONSOLE
async function testInsertTimeout() {
  console.log("🧪 TESTE DE INSERÇÃO COM TIMEOUT");

  const insertData = {
    user_id: "f1f1eba4-3624-4ee4-bd65-bc1e17d075a6",
    lesson_date: "2025-07-10",
    lesson_time: "10:00",
    lesson_day: "thursday",
    service_type: "individual",
    lesson_type: "single",
    amount: 30,
    currency: "gbp",
    status: "scheduled",
    payment_status: "paid",
  };

  console.log("📝 Dados para inserir:", insertData);

  try {
    console.log("⏱️ Iniciando inserção com timeout de 3 segundos...");

    const insertPromise = supabase
      .from("bookings")
      .insert(insertData)
      .select()
      .single();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout de 3 segundos")), 3000)
    );

    const result = await Promise.race([insertPromise, timeoutPromise]);

    console.log("✅ INSERÇÃO CONCLUÍDA:", result);

    if (result.error) {
      console.error("❌ ERRO NA INSERÇÃO:", result.error);
    } else {
      console.log("🎉 BOOKING CRIADO COM SUCESSO:", result.data);
    }
  } catch (timeoutError) {
    console.error("⏰ INSERÇÃO TRAVOU - TIMEOUT:", timeoutError.message);
    console.log(
      "🔍 Isso confirma que a inserção está travando indefinidamente"
    );
  }
}

// Execute o teste
testInsertTimeout();
```

## 🎯 Resultados Esperados

### ✅ **Se der timeout (3 segundos):**

```
⏰ INSERÇÃO TRAVOU - TIMEOUT: Timeout de 3 segundos
```

→ **Confirma que o problema é a inserção travando**

### ✅ **Se funcionar rapidamente:**

```
🎉 BOOKING CRIADO COM SUCESSO: { id: "...", ... }
```

→ **Problema resolvido!**

### ❌ **Se der erro específico:**

```
❌ ERRO NA INSERÇÃO: { code: "PGRST116", message: "..." }
```

→ **Problema de RLS ou schema identificado**

## 🚀 Execute o teste e me diga o resultado!

Isso vai nos mostrar **exatamente** se o problema é:

1. **Timeout na inserção** (mais provável)
2. **Erro específico de RLS/Database**
3. **Inserção funcionando** (problema no código da app)

**Execute no console e reporte o resultado!** 🔧
