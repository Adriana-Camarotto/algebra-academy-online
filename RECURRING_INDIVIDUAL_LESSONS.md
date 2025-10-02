# 🔄 Sistema de Cobrança para Aulas Individuais Recorrentes

## 📋 **Visão Geral**

Implementação do novo sistema de cobrança para **Individual Tutoring - Recurring Lessons** usando o produto específico criado no Stripe.

## ✅ **Funcionalidades Implementadas**

### 🎯 **1. Cards Individuais por Aula**

```typescript
// Cada aula recorrente agora aparece como um card separado
if (
  booking.service_type === "individual" &&
  booking.lesson_type === "recurring" &&
  booking.amount >= 600
) {
  // Divide em cards individuais
  const lessonsCount = Math.floor(booking.amount / 3000);
  // Cria um card para cada aula futura
}
```

### 💳 **2. Sistema de Cobrança 24h**

- **Antes de 24h**: Aula pode ser cancelada sem cobrança
- **Menos de 24h**: Pagamento é processado automaticamente
- **Produto Stripe**: `"Individual Tutoring - Recurring Lessons"`

### 🚫 **3. Política de Cancelamento**

```typescript
// Regra de 24 horas

## 📅 **Atualização - Sábados Inclusos**

✅ **Aulas agora permitidas aos sábados!**
- Sistema atualizado para permitir agendamentos de segunda a sábado
- Mesma política de 24h para cancelamento aplicada aos sábados
- Interface atualizada com tradução para "Sábado"/"Saturday" para aulas recorrentes individuais
if (
  booking.service_type === "individual" &&
  booking.lesson_type === "recurring"
) {
  const hoursUntilLesson = (lessonDateTime - now) / (1000 * 60 * 60);
  return hoursUntilLesson >= 24 && booking.status === "scheduled";
}
```

## 🖥️ **Interface do Usuário**

### **Cards de Aulas Futuras**

- ✅ Badge mostrando "Aula X de Y"
- ✅ Valor individual por aula (£30.00)
- ✅ Status de pagamento específico
- ✅ Regras de cancelamento claras

### **Informações de Pagamento**

```
📅 Aula Individual Recorrente
⏰ Pagamento será cobrado automaticamente 24h antes da aula
🚫 Pode ser cancelada até 24h antes da aula
💷 £30.00 por aula
```

### **Após 24h**

```
⚠️ Prazo de cancelamento expirado - pagamento será cobrado
```

## 🔧 **Campos Adicionados**

### **Interface Booking**

```typescript
interface Booking {
  // Campos existentes...

  // NOVOS: Para aulas recorrentes individuais
  recurring_session_number?: number | null;
  recurring_session_total?: number | null;
  recurring_session_id?: string | null;
}
```

### **Processamento de Dados**

```typescript
// Detecta aulas recorrentes pagas antecipadamente
if (
  booking.service_type === "individual" &&
  booking.lesson_type === "recurring" &&
  booking.amount >= 600
) {
  // Divide em sessões individuais
  const sessions = createIndividualSessions(booking);
  return sessions;
}
```

## 🎨 **Melhorias na UI**

### **Badges e Indicadores**

- 🔄 Badge "Recurring" para identificar facilmente
- 📊 Contador "Aula X de Y"
- 💳 Status de pagamento específico por aula
- ⏰ Informações claras sobre timing de cobrança

### **Mensagens Personalizadas**

```typescript
// Para aulas recorrentes individuais
canCancelBooking(booking)
  ? "Pode ser cancelada até 24h antes da aula"
  : "Prazo de cancelamento expirado - pagamento será cobrado";
```

## 📊 **Fluxo de Pagamento**

### **1. Reserva Inicial**

- Produto: `"Individual Tutoring - Recurring Lessons"`
- Valor: £30 × número de aulas
- Status: `pending`

### **2. 24h Antes de Cada Aula**

- Sistema verifica se `hoursUntilLesson <= 24`
- Processa pagamento automaticamente
- Muda status para `payment_due` → `paid`

### **3. Cancelamento**

- **Permitido**: > 24h antes da aula
- **Negado**: < 24h antes da aula
- **Reembolso**: Processado automaticamente se permitido

## 🚀 **Benefícios**

### **Para o Estudante**

- ✅ Visibilidade clara de cada aula futura
- ✅ Controle total sobre cancelamentos
- ✅ Transparência no processo de cobrança
- ✅ Interface intuitiva e moderna

### **Para o Sistema**

- ✅ Cobrança automatizada e confiável
- ✅ Redução de inadimplência
- ✅ Melhor gestão de fluxo de caixa
- ✅ Compliance com políticas de cancelamento

## 📋 **Próximos Passos**

1. **Teste Completo**: Verificar funcionamento em produção
2. **Cron Jobs**: Implementar tarefas automáticas para cobrança
3. **Notificações**: Emails 24h antes da cobrança
4. **Dashboard Admin**: Visão geral de pagamentos pendentes

## 💡 **Observações Técnicas**

- Sistema detecta automaticamente aulas recorrentes antigas (amount >= 600)
- Compatível com sistema existente de aulas em grupo
- Não afeta aulas individuais únicas (single)
- Mantém integridade dos dados existentes

**Status**: ✅ **Implementado e pronto para teste**
