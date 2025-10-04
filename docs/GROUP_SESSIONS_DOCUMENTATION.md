# Sistema de Sessões em Grupo - Documentação Técnica

## Visão Geral

O sistema de Sessões em Grupo de Tutoria de Matemática foi implementado para suportar até 4 alunos por grupo, com 6 sessões semanais recorrentes. Cada sessão tem duração de 60 minutos e custa £0.30.

## Funcionalidades Implementadas

### 📚 Estrutura das Sessões

- **Capacidade**: Até 4 alunos por grupo (sem mínimo)
- **Duração**: 60 minutos por sessão
- **Total de sessões**: 6 sessões semanais
- **Preço**: £0.30 por sessão
- **Datas fixas**: 14/07/2025 a 18/08/2025 (todas às segundas-feiras)

### 🗓️ Agendamento

#### Frontend (React/TypeScript)

- **Arquivo**: `src/hooks/useBookingLogic.ts`
- **Funcionalidade**: Lógica de reserva que automaticamente cria 6 sessões individuais
- **Capacidade dinâmica**: Sistema calcula vagas disponíveis em tempo real

#### Backend (Supabase Edge Functions)

- **Arquivo**: `supabase/functions/create-payment-v2/index.ts`
- **Processo**: Cria 6 registros separados no banco de dados para cada sessão
- **Validação**: Verifica conflitos com aulas individuais

#### Banco de Dados

- **Tabela**: `bookings`
- **Colunas adicionadas**:
  - `group_session_number`: Número da sessão (1-6)
  - `group_session_total`: Total de sessões no grupo (6)
  - `payment_processed_at`: Timestamp do processamento do pagamento
  - `payment_intent_id`: ID do intent de pagamento Stripe
  - `can_cancel_until`: Prazo limite para cancelamento
  - `cancellation_fee`: Taxa de cancelamento tardio

### 💳 Sistema de Pagamentos - ATUALIZADO ⚠️

#### Pagamento Automático (NOVA REGRA UNIFICADA)

- **Arquivo**: `supabase/functions/process-automatic-payments/index.ts`
- **Agendamento**: Cron job diário (9h, 12h, 15h, 18h)
- **Trigger**: 24 horas antes de cada aula (TODOS OS TIPOS)
- **Tipos Cobertos**:
  - ✅ Individual (Single Lesson)
  - ✅ Individual (Recurring Lessons)
  - ✅ Group Sessions
  - ✅ GCSE & A-Level Preparation
- **Integração**: Stripe Payment Intents

**MUDANÇA IMPORTANTE**: Agora TODOS os tipos de aula seguem a mesma regra de cobrança automática 24h antes da aula. Não há mais cobrança imediata para aulas individuais.

#### Configuração do Cron

- **Arquivo**: `setup_automatic_payments_cron.sql`
- **Frequência**: Múltiplas execuções diárias para cobertura completa
- **Monitoramento**: Logs detalhados de execução

### 🎯 Interface do Usuário

#### Dashboard do Estudante

- **Arquivo**: `src/pages/student/StudentDashboardPage.tsx`
- **Exibição**: Cada sessão aparece individualmente
- **Informações**: Data, horário, status de pagamento, número da sessão

#### Componente de Aulas

- **Arquivo**: `src/components/student/UpcomingLessons.tsx`
- **Melhorias**:
  - Status de pagamento dinâmico
  - Informações de cancelamento
  - Badges para identificar sessões em grupo

#### Cards de Sessão em Grupo

- **Arquivo**: `src/components/GroupSessionCard.tsx`
- **Recursos**:
  - Exibição detalhada do progresso (X/6)
  - Status de pagamento em tempo real
  - Botões de cancelamento com regras

### 🚫 Sistema de Cancelamento

#### Regras de Cancelamento

- **Mais de 24h**: Cancelamento gratuito
- **Menos de 24h**: Cobrança de £0.30 (taxa de cancelamento tardio)
- **Processamento**: Atualização automática do status no banco

#### Lógica Implementada

```typescript
// Arquivo: src/hooks/useBookingLogic.ts
const canCancelSession = (lesson) => {
  const lessonDateTime = new Date(`${lesson.date}T${lesson.time}`);
  const now = new Date();
  const hoursUntilLesson =
    (lessonDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilLesson > 24;
};
```

## Estrutura de Arquivos

### Frontend

```
src/
├── hooks/
│   └── useBookingLogic.ts              # Lógica principal de reservas
├── components/
│   ├── student/
│   │   └── UpcomingLessons.tsx         # Lista de próximas aulas
│   └── GroupSessionCard.tsx            # Card especializado para sessões em grupo
└── pages/
    └── student/
        └── StudentDashboardPage.tsx    # Dashboard principal do estudante
```

### Backend

```
supabase/
├── functions/
│   ├── create-payment/
│   │   └── index.ts                    # Criação de pagamentos e sessões
│   └── process-automatic-payments/
│       └── index.ts                    # Processamento automático de pagamentos
└── migrations/
    └── add_group_session_columns.sql   # Schema para sessões em grupo
```

### Scripts SQL

```
├── add_group_session_columns.sql       # Adiciona colunas para sessões em grupo
├── setup_automatic_payments_cron.sql   # Configura cron job para pagamentos
└── test_group_sessions.sql             # Testes e verificações
```

## Fluxo de Funcionamento

### 1. Criação de Sessão em Grupo

1. Usuário seleciona "Group Session" no BookingWizard
2. Sistema valida disponibilidade (máximo 4 alunos)
3. Backend cria 6 registros individuais no banco de dados
4. Cada sessão recebe número sequencial (1/6, 2/6, etc.)
5. Status inicial: "scheduled" com pagamento "pending"

### 2. Processamento de Pagamentos

1. Cron job executa diariamente (múltiplas vezes)
2. Identifica sessões que acontecem nas próximas 24h
3. Processa pagamento automático via Stripe
4. Atualiza status para "paid" ou "payment_failed"

### 3. Exibição no Dashboard

1. Cada sessão aparece como card individual
2. Mostra progresso (ex: "Sessão 3/6")
3. Exibe status de pagamento em tempo real
4. Permite cancelamento com regras de prazo

### 4. Cancelamento de Sessão

1. Verifica se está dentro do prazo (>24h)
2. Se sim: cancela sem cobrança
3. Se não: cancela com taxa de £0.30
4. Atualiza status no banco de dados

## Configurações de Capacidade

### Horários Disponíveis para Grupos

```typescript
// src/hooks/useBookingLogic.ts
const groupSessionSpotsConfig = {
  "monday-8:00": { total: 4 }, // 4 vagas
  "monday-10:00": { total: 4 }, // 4 vagas
  "monday-11:00": { total: 4 }, // 4 vagas
  "tuesday-15:00": { total: 4 }, // 4 vagas
  "wednesday-12:00": { total: 4 }, // 4 vagas
  "thursday-16:00": { total: 4 }, // 4 vagas
  "friday-17:00": { total: 4 }, // 4 vagas
};
```

### Prevenção de Conflitos

- Aulas individuais bloqueiam horários de grupo
- Sessões em grupo bloqueiam aulas individuais
- Sistema calcula vagas disponíveis dinamicamente

## Monitoramento e Debug

### Logs Implementados

- Criação de sessões: logs detalhados no Edge Function
- Processamento de pagamentos: logs de cron job
- Cancelamentos: tracking completo de ações

### Verificações Automáticas

- Validação de capacidade em tempo real
- Verificação de conflitos antes da criação
- Monitoramento de status de pagamento

## Próximos Passos Sugeridos

1. **Implementar notificações**: Email/SMS 24h antes de cada sessão
2. **Dashboard de admin**: Visualização de todas as sessões em grupo
3. **Relatórios financeiros**: Tracking de pagamentos e cancelamentos
4. **Sistema de reembolso**: Processo automatizado para cancelamentos válidos
5. **Integração com calendário**: Export para Google Calendar/Outlook

## Suporte e Manutenção

### Comandos Úteis

```sql
-- Verificar sessões em grupo
SELECT * FROM bookings WHERE service_type = 'group' ORDER BY lesson_date;

-- Verificar pagamentos pendentes
SELECT * FROM bookings WHERE payment_status = 'pending' AND service_type = 'group';

-- Limpar dados de teste
DELETE FROM bookings WHERE service_type = 'group' AND created_at > NOW() - INTERVAL '1 day';
```

### Configuração do Ambiente

1. Executar `add_group_session_columns.sql` no Supabase
2. Executar `setup_automatic_payments_cron.sql` para cron jobs
3. Configurar variáveis de ambiente Stripe
4. Testar com `test_group_sessions.sql`

Este sistema fornece uma solução completa e robusta para sessões em grupo, com pagamentos automáticos, cancelamentos flexíveis e interface intuitiva para os estudantes.
