-- Script para criar dados de teste
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos verificar a estrutura das tabelas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
ORDER BY ordinal_position;

-- Inserir alguns usuários de teste (usando apenas as colunas que existem)
INSERT INTO users (id, name, email, role, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Admin Test', 'admin.test@algebra-academy.com', 'admin', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'João Silva', 'joao.silva@algebra-academy.com', 'student', NOW(), NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Maria Santos', 'maria.santos@algebra-academy.com', 'student', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Prof. Carlos', 'prof.carlos@algebra-academy.com', 'tutor', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Agora vamos inserir algumas aulas de teste
INSERT INTO bookings (
  id, 
  user_id, 
  service_type, 
  lesson_type, 
  lesson_date, 
  lesson_time, 
  lesson_day, 
  status, 
  payment_status, 
  amount, 
  currency, 
  created_at, 
  updated_at
)
VALUES 
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    'individual',
    'math',
    '2024-12-20',
    '14:00',
    'friday',
    'confirmed',
    'paid',
    50.00,
    'EUR',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    'individual',
    'algebra',
    '2024-12-21',
    '15:00',
    'saturday',
    'confirmed',
    'paid',
    50.00,
    'EUR',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    'group',
    'calculus',
    '2024-12-22',
    '10:00',
    'sunday',
    'pending',
    'pending',
    35.00,
    'EUR',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '33333333-3333-3333-3333-333333333333',
    'exam-prep',
    'final-exam',
    '2024-12-23',
    '16:00',
    'monday',
    'confirmed',
    'paid',
    75.00,
    'EUR',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '22222222-2222-2222-2222-222222222222',
    'individual',
    'geometry',
    '2024-12-24',
    '11:00',
    'tuesday',
    'cancelled',
    'refunded',
    50.00,
    'EUR',
    NOW(),
    NOW()
  );

-- Verificar os dados inseridos
SELECT 'Users criados:' as info, count(*) as total FROM users;
SELECT 'Bookings criados:' as info, count(*) as total FROM bookings;

-- Mostrar os dados criados
SELECT 'USERS:' as table_name, name, email, role FROM users;
SELECT 'BOOKINGS:' as table_name, b.lesson_date, b.lesson_time, b.service_type, b.lesson_type, b.status, b.payment_status, u.name as student_name, u.email as student_email
FROM bookings b
JOIN users u ON b.user_id = u.id
ORDER BY b.lesson_date, b.lesson_time;
