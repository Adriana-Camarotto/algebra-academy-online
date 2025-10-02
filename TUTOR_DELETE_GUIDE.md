# 🔧 Guia de Correção: Permitir Tutores e Admins Deletarem Aulas

## ✅ Status Atual do Sistema

### **Edge Functions:**

- ✅ `admin-delete-booking` - JÁ permite admin E tutor deletar aulas
- ✅ Verificação de role: `userData.role !== "admin" && userData.role !== "tutor"`
- ✅ Reembolso automático dentro de 24h
- ✅ Logs de auditoria

### **Frontend:**

- ✅ `AdminBookingsPage` - Interface para deletar aulas
- ✅ `TutorDashboardPage` - Usa AdminBookingsPage (tutores podem deletar)
- ✅ `adminDeleteBooking()` - Função que chama a edge function

## 🚨 Possíveis Problemas e Soluções

### **1. Políticas RLS Faltando**

**Problema:** Tabela `bookings` pode não ter políticas DELETE para tutores.
**Solução:** Execute `add_tutor_delete_policies.sql`

### **2. Usuário Sem Role Tutor**

**Problema:** Usuário não tem role "tutor" no banco de dados.
**Solução:**

```sql
UPDATE users SET role = 'tutor' WHERE email = 'tutor@example.com';
```

### **3. Políticas de Visualização**

**Problema:** Tutor não consegue ver as aulas para deletar.
**Solução:** Execute `add_tutor_policies.sql`

### **4. Problemas de Autenticação**

**Problema:** Token de autenticação inválido ou expirado.
**Solução:** Usuário precisa fazer login novamente.

## 🔍 Scripts de Diagnóstico

1. **Verificar Permissões:** `diagnose_tutor_permissions.sql`
2. **Adicionar Políticas DELETE:** `add_tutor_delete_policies.sql`
3. **Testar Permissões:** `test-delete-permissions.js`

## 🎯 Passos para Resolução

### **Passo 1 - Diagnóstico**

Execute `diagnose_tutor_permissions.sql` no Supabase SQL Editor para identificar o problema específico.

### **Passo 2 - Adicionar Políticas RLS**

Se não houver políticas DELETE, execute:

```sql
-- Add DELETE policy for admins and tutors
CREATE POLICY "admin_tutor_delete_bookings" ON bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'tutor')
    )
  );
```

### **Passo 3 - Verificar Role do Usuário**

Certifique-se de que o usuário tem role "tutor":

```sql
SELECT email, role FROM users WHERE email = 'seu-tutor@email.com';
```

### **Passo 4 - Testar Funcionalidade**

1. Login como tutor
2. Acesse `/tutor` (TutorDashboardPage)
3. Encontre uma aula na lista
4. Clique no botão "Delete"
5. Verifique se a aula foi removida

## 📋 Checklist de Verificação

- [ ] Usuário tem role "tutor" no banco
- [ ] Políticas RLS permitem SELECT para tutor
- [ ] Políticas RLS permitem DELETE para tutor
- [ ] Edge function admin-delete-booking está ativa
- [ ] Frontend está chamando adminDeleteBooking() corretamente
- [ ] Usuário está autenticado com token válido

## 🔧 Comandos Úteis

```sql
-- Ver todos os tutores
SELECT * FROM users WHERE role = 'tutor';

-- Ver políticas da tabela bookings
SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- Promover usuário a tutor
UPDATE users SET role = 'tutor' WHERE email = 'user@example.com';

-- Testar se função exists
SELECT is_admin_or_tutor();
```

## 💡 Conclusão

O sistema JÁ está configurado para permitir que tutores deletem aulas. Se não está funcionando, o problema provavelmente é:

1. **Mais comum:** Usuário não tem role "tutor" no banco
2. **Segundo mais comum:** Faltam políticas RLS para DELETE
3. **Menos comum:** Problema de autenticação/sessão

Execute o diagnóstico para identificar o problema específico!
