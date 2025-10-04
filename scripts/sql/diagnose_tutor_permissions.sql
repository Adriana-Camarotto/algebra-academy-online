-- Diagnóstico completo para verificar se tutores podem deletar aulas
-- Execute no Supabase SQL Editor

-- 1. Verificar se existem usuários com role 'tutor'
SELECT 'Usuários com role tutor:' as check_type, id, email, name, role, created_at
FROM users 
WHERE role = 'tutor'
ORDER BY created_at DESC;

-- 2. Verificar se existem usuários com role 'admin'  
SELECT 'Usuários com role admin:' as check_type, id, email, name, role, created_at
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- 3. Verificar políticas RLS na tabela bookings
SELECT 'Políticas RLS em bookings:' as check_type, 
       policyname, cmd, permissive, roles, qual
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY cmd, policyname;

-- 4. Verificar políticas RLS na tabela users
SELECT 'Políticas RLS em users:' as check_type,
       policyname, cmd, permissive, roles, qual  
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- 5. Verificar se a função is_admin_or_tutor existe
SELECT 'Função is_admin_or_tutor:' as check_type,
       proname, prosrc
FROM pg_proc 
WHERE proname = 'is_admin_or_tutor';

-- 6. Verificar algumas aulas recentes para teste
SELECT 'Aulas disponíveis para teste:' as check_type,
       id, user_id, lesson_date, lesson_time, service_type, status, payment_status
FROM bookings 
WHERE status != 'cancelled'
ORDER BY lesson_date DESC 
LIMIT 5;

-- 7. Se você tem o ID de um usuário tutor específico, substitua 'TUTOR_USER_ID' e descomente:
-- SELECT 'Teste de permissão específica:' as check_type,
--        CASE 
--          WHEN EXISTS (
--            SELECT 1 FROM users 
--            WHERE id = 'TUTOR_USER_ID' 
--            AND role = 'tutor'
--          ) THEN 'Usuário é tutor ✅'
--          ELSE 'Usuário NÃO é tutor ❌'
--        END as permission_check;

-- 8. Verificar logs de erro recentes (se a tabela existir)
-- SELECT 'Logs de erro recentes:' as check_type, *
-- FROM logs 
-- WHERE message LIKE '%admin-delete-booking%' OR message LIKE '%tutor%'
-- ORDER BY created_at DESC 
-- LIMIT 10;
