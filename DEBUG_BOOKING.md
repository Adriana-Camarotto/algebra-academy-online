# DEBUG: Diagnóstico do Problema de Booking

## Problema Atual

O processo para em "Attempting direct booking creation..." sem avançar ou mostrar erro.

## Logs Adicionados

Adicionei logs detalhados em:

1. `useBookingLogic.ts` - Processo de inserção no Supabase
2. `auth.ts` - Função `resolveUser`

## Como Testar Agora

### 1. Teste Rápido no Console

Abra o DevTools → Console e execute:

```javascript
// Teste se consegue ler bookings
supabase
  .from("bookings")
  .select("id")
  .limit(1)
  .then((result) => {
    console.log("READ TEST:", result);
  });

// Teste se consegue inserir um booking simples
supabase
  .from("bookings")
  .insert({
    user_id: "12345678-1234-1234-1234-123456789012", // UUID de teste
    lesson_date: "2024-12-20",
    lesson_time: "10:00",
    lesson_day: "friday",
    service_type: "individual",
    lesson_type: "single",
    amount: 30,
    currency: "gbp",
    status: "scheduled",
    payment_status: "paid",
  })
  .select()
  .then((result) => {
    console.log("INSERT TEST:", result);
  });
```

### 2. Verificar RLS no Supabase Dashboard

1. Acesse o Supabase Dashboard
2. Vá para Table Editor → bookings
3. Verifique se a opção "RLS enabled" está ON
4. Clique em "View Policies" e confirme que existe:
   - Política INSERT para authenticated users
   - Política SELECT para authenticated users

### 3. Verificar Autenticação

No Console do DevTools:

```javascript
// Verificar se está autenticado
supabase.auth.getSession().then((result) => {
  console.log("AUTH SESSION:", result);
});

// Verificar user atual
supabase.auth.getUser().then((result) => {
  console.log("AUTH USER:", result);
});
```

### 4. O que procurar nos logs

Quando tentar fazer um booking, procure por estes logs:

- `=== RESOLVING USER ===` - Mostra se o user está sendo resolvido corretamente
- `=== STARTING SUPABASE INSERT ===` - Mostra se chegou ao ponto de inserção
- `=== BOOKING CREATION FAILED ===` - Mostra o erro específico se falhar

## Possíveis Causas

### A. User ID Inválido

- Se o `resolveUser` retornar null ou ID inválido
- Verificar nos logs se o UUID tem formato correto

### B. RLS Policy Problem

- Política de INSERT não permite o user atual
- User não está autenticado adequadamente

### C. Database Schema Issue

- Campo obrigatório faltando
- Tipo de dados incorreto
- Constraint violada

### D. Network/Connection Issue

- Supabase client mal configurado
- Problemas de rede

## Próximos Passos

1. Faça um teste de booking e verifique os novos logs detalhados
2. Execute os testes de console acima
3. Reporte os resultados específicos dos logs
4. Com base nos resultados, poderemos identificar e corrigir o problema exato
