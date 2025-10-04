# 📅 Gerenciamento ### 🔒 **Regras de Negócio Implementadas:**

#### 📚 **1. Conflitos entre Aulas Individuais e Grupos:**

- ❌ **Aulas individuais são BLOQUEADAS quando há slot de grupo CONFIGURADO (disponível OU lotado)**
- ❌ **Preparação para exames é BLOQUEADA quando há slot de grupo CONFIGURADO (disponível OU lotado)**
- ❌ **Aulas em grupo são BLOQUEADAS quando há aula individual agendada**

#### 🎯 **2. Estados de Disponibilidade:**

- **Slot Disponível para Grupo**: `{ available: X > 0, total: Y > 0 }` - Botão HABILITADO para grupos, DESABILITADO para individual/exam
- **Slot Lotado**: `{ available: 0, total: Y > 0 }` - Botão DESABILITADO para grupos, DESABILITADO para individual/exam
- **Slot Inativo**: `{ available: 0, total: 0 }` - Botão DESABILITADO para grupos, HABILITADO para individual/exam

#### ⚡ **3. Prioridade de Horários:**

1. **Grupos têm PRIORIDADE ABSOLUTA** - qualquer slot configurado para grupo (`total > 0`) bloqueia individual/exam
2. **Individual/Exam** - só disponível se slot de grupo tem `total: 0` (completamente desabilitado)
3. **Conflitos** - nunca permite sobreposiçãoGuia Completo

## 📋 **Horários Atualmente Configurados**

### ✅ **Status Atual (Atualizado - CORRIGIDO)**

**Segunda-feira**: 8:00, 9:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 (8 slots)
**Terça-feira**: 8:00, 9:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00 (8 slots)  
**Quarta-feira**: 8:00, 9:00, 10:00, 11:00, 12:00, 14:00, 15:00, 16:00, 17:00 (9 slots)
**Quinta-feira**: 8:00, 9:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 (8 slots)
**Sexta-feira**: 8:00, 9:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 (8 slots)
**Sábado**: 8:00, 9:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00, 16:00, 17:00, 18:00, 19:00 (12 slots)
**Quinta-feira**: 8:00, 9:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 (8 slots)
**Sexta-feira**: 8:00, 9:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00 (8 slots)

**Total**: 53 time slots por semana (41 + 12 sábado)
**Capacidade de Grupos**: 4 alunos por slot (limite CORRIGIDO)

🎯 **Todos os horários estão sincronizados entre `availableSlots` e `groupSessionSpots`**
🔧 **Sistema de capacidade de grupos CORRIGIDO - agora limita a 4 alunos por slot**
⚡ **Atualização em tempo real MELHORADA - refresh a cada 10 segundos**

### � **Regras de Negócio Implementadas:**

#### 📚 **1. Conflitos entre Aulas Individuais e Grupos:**

- ❌ **Aulas individuais são BLOQUEADAS quando há slot de grupo disponível**
- ❌ **Preparação para exames é BLOQUEADA quando há slot de grupo disponível**
- ❌ **Aulas em grupo são BLOQUEADAS quando há aula individual agendada**

#### 🎯 **2. Estados de Disponibilidade:**

- **Slot Disponível para Grupo**: `{ available: X > 0, total: Y > 0 }` - Botão HABILITADO
- **Slot Lotado**: `{ available: 0, total: Y > 0 }` - Botão DESABILITADO
- **Slot Inativo**: `{ available: 0, total: 0 }` - Botão DESABILITADO

#### ⚡ **3. Prioridade de Horários:**

1. **Grupos têm PRIORIDADE** - se disponível, bloqueia individual/exam
2. **Individual/Exam** - só disponível se não há grupo ativo
3. **Conflitos** - nunca permite sobreposição

### �🐛 **Correções Aplicadas:**

- ✅ Corrigido bug que permitia bookings ilimitados quando slot não estava configurado
- ✅ Todos os slots de grupo agora têm limite de 4 alunos
- ✅ Tempo de atualização reduzido para resposta mais rápida
- ✅ Limpeza automática de atualizações otimistas melhorada
- ✅ **NOVO**: Aulas individuais e exam prep bloqueadas quando grupo disponível
- ✅ **NOVO**: Logs detalhados para debugging de conflitos

---

## 🎯 **Como Adicionar/Modificar Time Slots**

### 📍 **Local Principal: `src/hooks/useBookingLogic.ts`**

## 🔧 **1. Horários Disponíveis (`availableSlots`)**

```typescript
const availableSlots = {
  monday: [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
  tuesday: [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ],
  wednesday: [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
  thursday: [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
  friday: [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
};
```

### ✅ **Como Adicionar Novos Horários:**

1. **Adicione o horário no array do dia desejado**
2. **Use formato "HH:MM" (24 horas)**
3. **Mantenha em ordem cronológica**

**Exemplo**: Para adicionar 18:00 na segunda-feira:

```typescript
monday: ["8:00", "9:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
```

## 🟩 **2. Capacidade de Aulas em Grupo (`groupSessionSpots`)**

Para **CADA** novo horário adicionado, você deve configurar a capacidade:

```typescript
const groupSessionSpots = {
  "monday-18:00": { available: 4, total: 4 }, // Novo horário
  "tuesday-18:00": { available: 4, total: 4 }, // Novo horário
  // ... outros horários
};
```

### 📊 **Formato do `groupSessionSpots`:**

- **Chave**: `"dia-horario"` (ex: `"monday-18:00"`)
- **Valor**: `{ available: X, total: Y }`
  - `available`: Vagas disponíveis no momento
  - `total`: Capacidade máxima do slot

## 🔄 **3. Sistema Automático**

O sistema automaticamente:

- ✅ **Detecta** novos horários
- ✅ **Valida** disponibilidade
- ✅ **Aplica regras** de conflito
- ✅ **Atualiza UI** em tempo real

## 📋 **Exemplos de Modificações**

### **Adicionar horário matinal (7:00)**

```typescript
// Em availableSlots
monday: ["7:00", "8:00", "9:00", ...],

// Em groupSessionSpots
"monday-7:00": { available: 4, total: 4 },
```

### **Adicionar horário noturno (19:00)**

```typescript
// Em availableSlots
friday: [..., "17:00", "18:00", "19:00"],

// Em groupSessionSpots
"friday-19:00": { available: 4, total: 4 },
```

### **Remover horário**

```typescript
// Remover de availableSlots
tuesday: ["9:00", "10:00", "14:00"], // removeu 11:00

// Remover de groupSessionSpots (opcional, mas recomendado)
// Simplesmente delete a linha "tuesday-11:00"
```

### 🚫 **Como Desabilitar Slots de Grupo**

Para controlar a disponibilidade de slots de grupo, use as seguintes configurações:

```typescript
"day-time": { available: X, total: Y }
```

**Estados Possíveis:**

```typescript
const groupSessionSpots = {
  // 🟢 ATIVO - 4 vagas disponíveis
  "monday-8:00": { available: 4, total: 4 },

  // 🔴 DESABILITADO - slot fechado (não aceita bookings)
  "monday-9:00": { available: 0, total: 0 },

  // 🔴 LOTADO - todas as vagas preenchidas (botão desabilitado)
  "monday-10:00": { available: 0, total: 4 },

  // 🟡 PARCIALMENTE OCUPADO - ainda há vagas
  "monday-11:00": { available: 2, total: 4 }, // 2 vagas restantes
};
```

**Comportamento do Botão:**

- `available > 0 && total > 0` = ✅ **Botão HABILITADO**
- `available = 0` (qualquer total) = ❌ **Botão DESABILITADO**
- `total = 0` (qualquer available) = ❌ **Botão DESABILITADO**

### 🚫 **Como Funcionam os Conflitos de Horários**

#### **Regra Principal: GRUPOS TÊM PRIORIDADE ABSOLUTA**

**Cenário 1: Slot de Grupo Disponível**

```typescript
"monday-14:00": { available: 3, total: 4 }, // 3 vagas disponíveis
```

- ✅ **Grupos**: Botão HABILITADO (ainda há vagas)
- ❌ **Individual**: Botão DESABILITADO (grupo configurado)
- ❌ **Exam Prep**: Botão DESABILITADO (grupo configurado)

**Cenário 2: Slot de Grupo Lotado (NOVO COMPORTAMENTO)**

```typescript
"monday-15:00": { available: 0, total: 4 }, // sem vagas, mas grupo configurado
```

- ❌ **Grupos**: Botão DESABILITADO (sem vagas)
- ❌ **Individual**: Botão DESABILITADO (grupo configurado, mesmo lotado)
- ❌ **Exam Prep**: Botão DESABILITADO (grupo configurado, mesmo lotado)

**Cenário 3: Slot de Grupo Completamente Desabilitado**

```typescript
"monday-16:00": { available: 0, total: 0 }, // grupo desabilitado
```

- ❌ **Grupos**: Botão DESABILITADO (total = 0)
- ✅ **Individual**: Botão HABILITADO (grupo não configurado)
- ✅ **Exam Prep**: Botão HABILITADO (grupo não configurado)

**Cenário 4: Aula Individual Agendada**

```typescript
// Existe booking: { time: "17:00", service_type: "individual" }
```

- ❌ **Grupos**: Botão DESABILITADO (conflito com individual)
- ❌ **Individual**: Botão DESABILITADO (horário ocupado)
- ❌ **Exam Prep**: Botão DESABILITADO (horário ocupado)

**Logs de Debug:**

```
❌ BLOCKING INDIVIDUAL: monday 14:00 - Group session slot is configured (3/4) - individual lessons blocked
❌ BLOCKING EXAM-PREP: monday 15:00 - Group session slot is configured (0/4) - individual lessons blocked
✅ ALLOWING SLOT: monday 16:00 - No conflict for individual lesson
```

---

## 🔄 **Aulas Recorrentes (NOVO)**

### ✨ **Funcionalidades Implementadas:**

#### 📅 **Booking Recorrente**

- Quando o usuário seleciona "recurring lessons" + "individual tutoring"
- Sistema calcula automaticamente todas as datas até **01/12/2025**
- **NOVO**: Carrega e verifica TODAS as aulas futuras, não apenas do primeiro mês
- **NOVO**: Validação completa de conflitos para toda a série recorrente
- Todas as aulas da série são criadas simultaneamente
- Preço é multiplicado pelo número de aulas (ex: 10 aulas = £3.00)

#### 🗓️ **Bloqueio Automático de Slots (MELHORADO)**

- Todos os slots das mesmas semanas seguintes são automaticamente desabilitados
- **NOVO**: Sistema verifica séries recorrentes existentes ao avaliar disponibilidade
- **NOVO**: Prevenção de double booking considera todas as datas futuras
- **NOVO**: Detecção de conflitos com slots de grupo para toda a série
- **NOVO**: Função `isSlotBlockedByRecurringSeries()` para verificação avançada
- Aplica-se apenas a aulas individuais recorrentes

#### 📊 **Dashboard do Estudante**

- Todas as aulas recorrentes aparecem no dashboard
- Marcação visual para identificar aulas recorrentes
- Limite aumentado para mostrar até 10 aulas próximas

#### ❌ **Cancelamento Individual**

- Estudantes podem cancelar aulas individuais de uma série recorrente
- Cancelamento torna o slot disponível novamente
- Apenas aulas individuais e exam prep podem ser canceladas
- Aulas em grupo requerem lógica diferente (não implementada ainda)

### 🔧 **Implementação Técnica:**

#### **Hook useBookingLogic.ts:**

```typescript
// Nova função para calcular datas recorrentes
calculateRecurringDates(startDate: Date, dayOfWeek: string): Date[]

// Nova função para cancelar aulas
cancelLesson(lessonDate: string, lessonDay: string, lessonTime: string)

// Validação melhorada para aulas recorrentes
isTimeSlotAvailable() // Agora considera conflitos de séries recorrentes
```

#### **Componente UpcomingLessons.tsx:**

- Botão de cancelamento para aulas elegíveis
- Indicador visual para aulas recorrentes
- Integração com useBookingLogic para cancelamentos

#### **Lógica de Preços:**

- Single lesson: £0.30
- Recurring lessons: £0.30 × número de aulas
- Automaticamente calculado baseado nas datas

### 🚀 **Melhorias Técnicas (NOVO):**

#### **Query Otimizada para Todas as Datas Futuras**

```typescript
// Antes: Limitado a primeiro mês
.gte("lesson_date", format(new Date(), "yyyy-MM-dd"))

// Agora: Todas as datas futuras com ordenação
.gte("lesson_date", format(new Date(), "yyyy-MM-dd"))
.order("lesson_date", { ascending: true })
```

#### **Verificação Avançada de Séries Recorrentes**

```typescript
// Nova função para detectar conflitos de séries recorrentes
isSlotBlockedByRecurringSeries(day: string, time: string, targetDate: Date): boolean

// Verifica se uma série recorrente existente bloqueia um slot
// Considera todas as aulas carregadas, não apenas a data específica
```

#### **Validação Completa para Aulas Recorrentes**

```typescript
// Valida TODAS as datas da série antes do booking
const datesToCheck =
  lessonType === "recurring"
    ? calculateRecurringDates(selectedDate, selectedDay)
    : [selectedDate];

// Verifica conflitos em cada data da série
for (const checkDate of datesToCheck) {
  // Validação individual para cada data
}
```

#### **Logs Melhorados**

```
📊 Checking availability for 16 dates
🔄 Found recurring series blocking monday 14:00 for date 2025-08-18
❌ Conflito detectado em 2025-09-15: Este horário já está ocupado
✅ All slots validation passed - proceeding with booking
```

---
