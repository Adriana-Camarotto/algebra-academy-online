# 🔧 Correção dos Erros de CORS e HTML

## ✅ **Problemas Identificados e Soluções**

### **1. Erro de CORS na Edge Function**

```
Access to fetch at 'https://rnhibdbxfbminqseayos.supabase.co/functions/v1/admin-delete-booking'
from origin 'http://localhost:8082' has been blocked by CORS policy
```

**Causa:** A Edge Function está falhando antes de retornar resposta com headers CORS.

**Solução:**

- ✅ Corrigido headers CORS na função
- ✅ Adicionado melhor tratamento de erros
- ✅ Adicionado logs de debug

### **2. Warning de HTML Aninhado**

```
Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>
```

**Causa:** `<p>` tags dentro de `AlertDialogDescription` (que já é um `<p>`).

**Solução:** ✅ Substituído `<p>` por `<div>` dentro do AlertDialog.

## 🚀 **Para Aplicar as Correções:**

### **1. Fazer Deploy da Edge Function Corrigida**

No terminal do Supabase CLI:

```bash
# Navegar até o projeto
cd supabase

# Fazer deploy da função corrigida
supabase functions deploy admin-delete-booking

# Ou se preferir, usar a versão nova:
supabase functions deploy admin-delete-booking-fixed
```

### **2. Verificar Logs da Edge Function**

```bash
# Ver logs em tempo real
supabase functions logs admin-delete-booking --follow

# Ver logs específicos
supabase functions logs admin-delete-booking --filter="ADMIN DELETE"
```

### **3. Testar a Função**

```bash
# Testar localmente (opcional)
supabase functions serve admin-delete-booking --env-file .env.local

# Testar no navegador
# 1. Login como admin/tutor
# 2. Ir para /admin/bookings ou /tutor
# 3. Tentar deletar uma aula
# 4. Verificar console para logs de debug
```

## 📋 **Checklist de Verificação**

- [ ] Edge function deployed no Supabase
- [ ] Headers CORS corretos configurados
- [ ] Usuário tem role "admin" ou "tutor"
- [ ] Políticas RLS permitem DELETE
- [ ] Frontend não mostra mais warning de HTML
- [ ] Logs da edge function são visíveis

## 🔍 **Debug Adicional**

Se ainda não funcionar, verificar:

### **1. Variáveis de Ambiente**

No Supabase Dashboard → Settings → Edge Functions:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `STRIPE_SECRET_KEY`

### **2. Políticas RLS**

Execute no SQL Editor:

```sql
-- Verificar se pode deletar
SELECT policy_name, cmd FROM pg_policies
WHERE tablename = 'bookings' AND cmd = 'DELETE';

-- Se não existir, criar:
CREATE POLICY "admin_tutor_delete_bookings" ON bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'tutor')
    )
  );
```

### **3. Role do Usuário**

```sql
-- Verificar role do usuário atual
SELECT email, role FROM users WHERE email = 'seu-email@teste.com';

-- Se necessário, promover a tutor
UPDATE users SET role = 'tutor' WHERE email = 'seu-email@teste.com';
```

## 🎯 **Resultado Esperado**

Após as correções:

- ✅ Admins e tutores podem deletar aulas
- ✅ Sem erros de CORS
- ✅ Sem warnings de HTML
- ✅ Logs detalhados para debug
- ✅ Tratamento adequado de erros

## 📞 **Se Ainda Não Funcionar**

1. Verificar logs da edge function: `supabase functions logs admin-delete-booking`
2. Testar com usuário diferente
3. Verificar se o booking_id existe
4. Confirmar que o usuário está autenticado

As correções devem resolver os problemas de CORS e HTML. O sistema agora tem melhor diagnóstico de erros!
