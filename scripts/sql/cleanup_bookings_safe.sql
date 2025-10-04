-- Script SEGURO para limpar APENAS bookings
-- MANTÉM todos os usuários, profiles e outros dados
-- Execute este script no Supabase SQL Editor

-- ⚠️ IMPORTANTE: Este script deleta APENAS a tabela 'bookings'
-- ✅ PRESERVA: auth.users, profiles, e todas as outras tabelas

-- Limpar APENAS bookings
DELETE FROM bookings;

-- Resetar sequência de IDs (opcional)
-- ALTER SEQUENCE bookings_id_seq RESTART WITH 1;

-- Verificação: Confirmar que bookings foi limpo
SELECT 
  'bookings' as table_name, 
  COUNT(*) as remaining_records 
FROM bookings;

-- Verificação: Confirmar que usuários ainda existem
SELECT 
  'auth.users' as table_name, 
  COUNT(*) as total_users 
FROM auth.users;

-- Mensagem de confirmação
SELECT 'Bookings cleaned successfully - Users preserved' as status;
