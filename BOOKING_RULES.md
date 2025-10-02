# 📋 Regras de Disponibilidade de Horários - Sistema de Agendamento

## 🎯 Implementação Atualizada

### 🟦 **Aulas Individuais**

**Regra**: Um horário **NÃO** está disponível para aulas individuais se já existe **QUALQUER** aula individual no mesmo horário com:

- `status = "scheduled"` **OU**
- `payment_status = "pending"` **OU**
- `payment_status = "paid"`

**✅ Resultado**: Aulas individuais são **exclusivas** - não podem compartilhar horário com nenhuma outra aula individual.

### 🟩 **Aulas em Grupo**

**Regra**: Um horário **NÃO** está disponível para aulas em grupo se já existe **aula INDIVIDUAL** no mesmo horário com:

- `status = "scheduled"` **OU**
- `payment_status = "pending"` **OU**
- `payment_status = "paid"`

**✅ Resultado**: Aulas em grupo **podem** compartilhar horário entre si, mas **não** com aulas individuais.

## 📊 **Tabela de Conflitos**

| Aula Existente | Novo Agendamento | Pode Compartilhar? | Motivo                                                        |
| -------------- | ---------------- | ------------------ | ------------------------------------------------------------- |
| Individual     | Individual       | ❌ **NÃO**         | Aulas individuais são exclusivas                              |
| Individual     | Grupo            | ❌ **NÃO**         | Individual bloqueia grupo                                     |
| Grupo          | Individual       | ✅ **SIM\***       | Individual pode ser marcada (se não há individual já marcada) |
| Grupo          | Grupo            | ✅ **SIM**         | Grupos podem compartilhar                                     |

**\*Observação**: Aulas individuais ainda seguem sua regra de exclusividade.

## 🔧 **Implementação Técnica**

### **Hook (useBookingLogic.ts)**

```typescript
// 🟦 Individual: Verifica conflito com QUALQUER aula individual
if (selectedService === "individual") {
  const conflictingBookings = existingBookings.filter(
    (booking) =>
      booking.service_type === "individual" &&
      (booking.status === "scheduled" ||
        booking.payment_status === "pending" ||
        booking.payment_status === "paid")
  );
}

// 🟩 Grupo: Verifica conflito apenas com aulas individuais
if (selectedService === "group") {
  const hasIndividualLesson = existingBookings.some(
    (booking) =>
      booking.service_type === "individual" &&
      (booking.status === "scheduled" ||
        booking.payment_status === "pending" ||
        booking.payment_status === "paid")
  );
}
```

### **Componente (DateTimeSelection.tsx)**

- Mesma lógica aplicada na verificação direta
- Logs de debug com emojis 🟦🟩 para identificar regras
- Feedback visual em tempo real

## ⚡ **Tempo Real**

- **Supabase Realtime**: Atualiza automaticamente entre navegadores
- **Refresh periódico**: A cada 30 segundos
- **Otimização**: Previne cliques simultâneos no mesmo slot

## 🎯 **Resultado Final**

Sistema robusto que garante:

- ✅ Aulas individuais são sempre exclusivas
- ✅ Aulas em grupo respeitam prioridade de individuais
- ✅ Múltiplas aulas em grupo podem compartilhar horário
- ✅ Feedback visual imediato e em tempo real
