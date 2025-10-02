# Guia de Resolução de Problemas - Sistema de Usuários

## Problema: Nova conta não aparece no banco de dados

### Passos de Diagnóstico

1. **Execute o script de diagnóstico**

   ```sql
   -- Execute o arquivo: diagnose_user_issues.sql
   ```

2. **Verifique se a tabela users existe**

   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'users';
   ```

3. **Verifique estrutura da tabela**
   ```sql
   \d public.users
   ```

### Soluções Comuns

#### 1. Tabela users não existe

**Solução**: Execute o script de setup

```sql
-- Execute: setup_users_table.sql
```

#### 2. Usuário criado em auth.users mas não em public.users

**Causa**: Trigger automático não funcionou
**Solução**:

```sql
-- Execute: test_user_creation.sql
-- Siga as instruções para criar perfil manualmente
```

#### 3. Problemas de permissão (RLS)

**Causa**: Row Level Security bloqueando acesso
**Solução**:

```sql
-- Temporariamente desabilitar RLS para teste
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- Teste a criação de usuário
-- Depois reabilite:
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

#### 4. Trigger não está funcionando

**Solução**: Recrie o trigger

```sql
-- Remover trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recriar função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        RETURN NEW;
    WHEN OTHERS THEN
        RAISE LOG 'Error creating user profile for %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
```

### Verificação Passo a Passo

#### 1. Testar Signup

1. Vá para `/signup`
2. Preencha o formulário
3. Envie
4. Verifique se recebeu email de confirmação

#### 2. Verificar Criação no Banco

```sql
-- Verificar se usuário foi criado em auth.users
SELECT * FROM auth.users WHERE email = 'seu_email@exemplo.com';

-- Verificar se perfil foi criado em public.users
SELECT * FROM public.users WHERE email = 'seu_email@exemplo.com';
```

#### 3. Verificar Logs da Aplicação

1. Abra DevTools (F12)
2. Vá para a aba Console
3. Procure por mensagens de erro durante o signup

#### 4. Verificar Edge Functions

```sql
-- Se houver tabela de logs de functions
SELECT * FROM edge_logs
WHERE function_name = 'create-user-profile'
ORDER BY created_at DESC;
```

### Soluções Manuais

#### Criar perfil manualmente para usuário existente

```sql
-- Substitua USER_ID pelo ID real do auth.users
INSERT INTO public.users (id, email, name, role)
SELECT
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)),
    COALESCE(raw_user_meta_data->>'role', 'student')
FROM auth.users
WHERE id = 'USER_ID_AQUI'
ON CONFLICT (id) DO NOTHING;
```

#### Recriar perfil para todos os usuários sem perfil

```sql
INSERT INTO public.users (id, email, name, role)
SELECT
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
    COALESCE(au.raw_user_meta_data->>'role', 'student')
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

### Configurações Importantes

#### Environment Variables (Supabase)

- `SUPABASE_URL`: URL do projeto
- `SUPABASE_ANON_KEY`: Chave pública
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (para Edge Functions)

#### Políticas RLS

Certifique-se de que as políticas permitem:

- Usuários podem inserir seu próprio perfil
- Usuários podem ver seu próprio perfil
- Usuários podem atualizar seu próprio perfil

### Comandos de Debug

#### Verificar estado atual

```sql
SELECT
    (SELECT COUNT(*) FROM auth.users) as auth_users,
    (SELECT COUNT(*) FROM public.users) as profile_users,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.users pu ON au.id = pu.id WHERE pu.id IS NULL) as missing_profiles;
```

#### Listar usuários recentes

```sql
SELECT
    au.email,
    au.created_at,
    au.email_confirmed_at,
    CASE WHEN pu.id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_profile
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;
```

### Contato de Suporte

Se os problemas persistirem:

1. Execute todos os scripts de diagnóstico
2. Colete os logs da aplicação
3. Documente os passos reproduzidos
4. Inclua os resultados dos scripts SQL
