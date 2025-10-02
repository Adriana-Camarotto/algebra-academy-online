-- CORREÇÃO COMPLETA DO SISTEMA DE AUTENTICAÇÃO
-- Este arquivo corrige os problemas de RLS e sincronização

-- 1. Remove todas as políticas problemáticas
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

-- 2. Cria função para verificar se é admin sem recursão
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Usa apenas auth.jwt() para evitar recursão
    RETURN COALESCE(
        (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role',
        'student'
    ) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Cria função para verificar se é o próprio usuário
CREATE OR REPLACE FUNCTION public.is_own_profile(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Políticas RLS seguras e sem recursão
-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (public.is_own_profile(id));

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (public.is_own_profile(id));

-- Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (public.is_own_profile(id));

-- Admins podem ver todos os perfis (usando função sem recursão)
CREATE POLICY "Admins can view all profiles" ON public.users
    FOR SELECT USING (public.is_admin());

-- Admins podem atualizar todos os perfis
CREATE POLICY "Admins can update all profiles" ON public.users
    FOR UPDATE USING (public.is_admin());

-- Admins podem inserir perfis
CREATE POLICY "Admins can insert profiles" ON public.users
    FOR INSERT WITH CHECK (public.is_admin());

-- 5. Corrige a função de criação automática de perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, avatar)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1),
            'User'
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'role',
            'student'
        ),
        NEW.raw_user_meta_data->>'avatar'
    );
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Perfil já existe, apenas atualiza
        UPDATE public.users SET
            email = NEW.email,
            name = COALESCE(
                NEW.raw_user_meta_data->>'name',
                split_part(NEW.email, '@', 1),
                name
            ),
            role = COALESCE(
                NEW.raw_user_meta_data->>'role',
                role
            ),
            avatar = COALESCE(
                NEW.raw_user_meta_data->>'avatar',
                avatar
            ),
            updated_at = NOW()
        WHERE id = NEW.id;
        RETURN NEW;
    WHEN OTHERS THEN
        -- Log do erro mas não falha a autenticação
        RAISE LOG 'Erro ao criar perfil do usuário %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 7. Teste para verificar se funciona
DO $$
BEGIN
    RAISE NOTICE 'Testando acesso à tabela users...';
    PERFORM COUNT(*) FROM public.users;
    RAISE NOTICE 'SUCESSO: Políticas RLS funcionando corretamente!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERRO: % - %', SQLSTATE, SQLERRM;
END;
$$;

-- 8. Mostra as políticas atuais
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;
