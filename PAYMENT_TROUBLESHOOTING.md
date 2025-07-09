# 🚨 TROUBLESHOOTING: Botão "Processing..." Não Avança

## **Problema Identificado**

O botão "Pay and Book a Lesson" fica em "processing..." e não prossegue para o pagamento.

## **Possíveis Causas & Soluções**

### **Causa 1: Edge Function 'create-payment' Não Deployada**

**Como verificar:**

1. Vá para o Supabase Dashboard → Edge Functions
2. Verifique se `create-payment` está listada e deployada

**Solução:**

```bash
# Deploy the Edge Function
supabase functions deploy create-payment
```

### **Causa 2: Variáveis de Ambiente Não Configuradas**

**Como verificar:**

1. Supabase Dashboard → Settings → Environment Variables
2. Verifique se `STRIPE_SECRET_KEY` está configurada

**Solução:**

1. Adicione sua Stripe Secret Key:
   - Nome: `STRIPE_SECRET_KEY`
   - Valor: `sk_test_...` (sua chave do Stripe)

### **Causa 3: Problemas de Autenticação**

**Como verificar:**

1. Abra o Console do Navegador (F12)
2. Clique em "Pay and Book a Lesson"
3. Veja se há erros de 401/403

**Solução:**

- Faça logout e login novamente
- Verifique se o usuário está autenticado

### **Causa 4: Políticas RLS da Tabela 'bookings'**

**Como verificar:**

1. Supabase Dashboard → Database → Tables → bookings
2. Verifique se as políticas RLS permitem INSERT

**Solução:**
Execute no SQL Editor:

```sql
-- Allow authenticated users to create bookings
CREATE POLICY "Users can create their own bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);
```

## **🔧 STEPS PARA DEBUGAR**

### **Passo 1: Verificar Console do Navegador**

1. Abra F12 → Console
2. Clique em "Pay and Book a Lesson"
3. Procure por erros vermelhos
4. **Compartilhe os erros que encontrar**

### **Passo 2: Verificar Network Tab**

1. F12 → Network
2. Clique em "Pay and Book a Lesson"
3. Procure por requisições que falharam (status 4xx/5xx)
4. Clique na requisição → Response tab → veja o erro

### **Passo 3: Testar Edge Function Manualmente**

Execute no Supabase SQL Editor:

```sql
-- Test if you can insert a booking manually
INSERT INTO public.bookings (
  user_id,
  lesson_date,
  lesson_time,
  lesson_day,
  service_type,
  amount,
  currency,
  status
) VALUES (
  auth.uid(),
  '2025-07-15',
  '10:00',
  'monday',
  'individual',
  30,
  'gbp',
  'scheduled'
);
```

## **🎯 QUICK FIXES**

### **Fix 1: Deploy Edge Functions**

```bash
# Install Supabase CLI if not installed
npm install -g @supabase/cli

# Login and link project
supabase login
supabase link --project-ref rnhibdbxfbminqseayos

# Deploy both functions
supabase functions deploy create-payment
supabase functions deploy create-user-profile
```

### **Fix 2: Add Booking Policies**

Execute no Supabase SQL Editor:

```sql
-- Enable RLS on bookings table
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their bookings
CREATE POLICY "Users can manage their own bookings"
ON public.bookings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### **Fix 3: Check Stripe Configuration**

1. Vá para https://dashboard.stripe.com/test/apikeys
2. Copie sua Secret Key (sk*test*...)
3. Adicione no Supabase → Settings → Environment Variables

## **📋 CHECKLIST DE VERIFICAÇÃO**

- [ ] Edge Function `create-payment` deployada
- [ ] `STRIPE_SECRET_KEY` configurada no Supabase
- [ ] Usuário está autenticado
- [ ] Políticas RLS da tabela `bookings` permitem INSERT
- [ ] Console do navegador sem erros 4xx/5xx

## **🆘 SE NADA FUNCIONAR**

**Solução temporária - Mock Payment:**
Posso criar uma versão temporária que simula o pagamento para você testar o resto do sistema:

1. Pula o Stripe
2. Cria o booking diretamente
3. Redireciona para página de sucesso

**Quer que eu implemente essa solução temporária?**
