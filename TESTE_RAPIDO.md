# 🎯 GUIA DE TESTE RÁPIDO

## **Execute este script SQL primeiro:**

1. **Supabase Dashboard → SQL Editor**
2. **Copie e execute** o script completo `supabase_database_setup.sql`
3. **Aguarde** a confirmação de que tudo foi executado com sucesso

---

## **🧪 TESTE 1: Criação de Usuário**

1. **Vá para** `/signup`
2. **Crie uma conta** com:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
   - Role: `student`
3. **Resultado esperado:** ✅ Usuário criado sem erros

---

## **🧪 TESTE 2: Agendamento de Aula**

1. **Vá para** `/booking`
2. **Selecione** "Individual Tutoring"
3. **Escolha** uma data e horário
4. **Clique** "Pay and Book a Lesson"
5. **O que deve acontecer:**
   - ✅ Botão muda para "Processing..." por alguns segundos
   - ✅ Aparece uma mensagem de sucesso OU abre o Stripe
   - ❌ NÃO deve ficar travado em "Processing..."

---

## **🔍 SE AINDA DER ERRO**

### **Passo 1: Verificar Console**

1. **F12 → Console**
2. **Tente fazer o booking**
3. **Procure por mensagens de erro**
4. **Me conte exatamente qual erro aparece**

### **Passo 2: Verificar Políticas**

Execute no SQL Editor:

```sql
-- Verificar se as políticas foram criadas
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('users', 'bookings')
ORDER BY tablename, policyname;
```

### **Passo 3: Teste Manual de Inserção**

Execute no SQL Editor:

```sql
-- Testar inserção de booking manualmente
INSERT INTO public.bookings (
    user_id, lesson_date, lesson_time, lesson_day,
    service_type, amount, currency, status
) VALUES (
    auth.uid(), '2025-07-15', '10:00', 'monday',
    'individual', 30, 'gbp', 'scheduled'
);
```

**Se der erro aqui**, me conte qual mensagem aparece.

---

## **🚀 SOLUÇÃO ALTERNATIVA**

Se ainda não funcionar, posso ativar o **modo de pagamento simulado**:

1. **Muda uma linha** no código
2. **Pula o Stripe** completamente
3. **Cria o booking** direto no banco
4. **Mostra sucesso** imediatamente

**Quer que eu ative isso?**

---

## **📞 PRÓXIMOS PASSOS**

Depois de executar o script SQL:

1. **Teste a criação de usuário** ✅
2. **Teste o agendamento** ✅
3. **Me conte** se ainda dá erro e qual erro específico aparece

**Com essas informações, posso resolver o problema rapidamente!**
