-- Script para criar dados de teste na tabela bookings
-- Execute este script no Supabase SQL Editor para testar o dashboard

-- Primeiro, vamos verificar se há dados na tabela
SELECT 'Estado atual das tabelas:' as info;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_bookings FROM bookings;

-- Vamos pegar um usuário existente para usar nos bookings de teste
SELECT 'Usuários disponíveis:' as info;
SELECT id, email, name, role FROM users ORDER BY created_at DESC LIMIT 3;

-- Inserir alguns bookings de teste
-- NOTA: Substitua o user_id pelos IDs reais dos usuários na sua tabela

-- Exemplo de INSERT (descomente e ajuste os user_ids):
/*
INSERT INTO bookings (
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
  created_at
) VALUES
  -- Booking 1: Individual lesson
  ('user_id_here', 'individual', 'individual', '2025-08-20', '14:00', 'Tuesday', 'scheduled', 'paid', 5000, 'GBP', NOW()),
  
  -- Booking 2: Group lesson  
  ('user_id_here', 'group', 'group', '2025-08-22', '16:00', 'Thursday', 'scheduled', 'pending', 3000, 'GBP', NOW()),
  
  -- Booking 3: Exam prep
  ('user_id_here', 'exam-prep', 'exam-prep', '2025-08-25', '10:00', 'Sunday', 'completed', 'paid', 6000, 'GBP', NOW() - INTERVAL '1 day'),
  
  -- Booking 4: Cancelled booking
  ('user_id_here', 'individual', 'individual', '2025-08-18', '15:00', 'Sunday', 'cancelled', 'refunded', 5000, 'GBP', NOW() - INTERVAL '2 days');
*/

-- Verificar dados inseridos
SELECT 'Bookings após inserção:' as info;
SELECT COUNT(*) as total_bookings FROM bookings;

SELECT 
  b.id,
  u.name as student_name,
  u.email as student_email,
  b.service_type,
  b.lesson_date,
  b.lesson_time,
  b.status,
  b.payment_status,
  b.amount
FROM bookings b
LEFT JOIN users u ON b.user_id = u.id
ORDER BY b.created_at DESC
LIMIT 10;
