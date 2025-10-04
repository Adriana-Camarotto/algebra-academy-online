-- Script para limpar apenas os bookings
-- Mantém os perfis de usuário mas remove todos os agendamentos

-- OPÇÃO 1: Deletar TODOS os bookings
DELETE FROM bookings;

-- OPÇÃO 2: Deletar apenas bookings futuros (mantém histórico)
-- DELETE FROM bookings WHERE lesson_date >= CURRENT_DATE;

-- OPÇÃO 3: Deletar apenas bookings de teste (adapte conforme necessário)
-- DELETE FROM bookings WHERE created_at >= '2025-07-11'::date;

-- Verificar resultado
SELECT 
  COUNT(*) as total_bookings_remaining,
  MIN(lesson_date) as earliest_booking,
  MAX(lesson_date) as latest_booking
FROM bookings;

-- Se não houver bookings, esta query retornará 0
SELECT 'Bookings cleanup completed' as status;
