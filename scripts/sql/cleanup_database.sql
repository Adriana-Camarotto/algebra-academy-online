-- Script para limpar o banco de dados
-- Execute este script no Supabase SQL Editor para limpar todas as tabelas

-- ATENÇÃO: Este script irá deletar TODOS os dados das tabelas!
-- Certifique-se de que é isso que você quer fazer.

-- 1. Limpar tabela de bookings
DELETE FROM bookings;

-- 2. Limpar tabela de profiles (se existir)
DELETE FROM profiles;

-- 3. Resetar sequências (IDs) se necessário
-- ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
-- ALTER SEQUENCE profiles_id_seq RESTART WITH 1;

-- 4. Verificar se as tabelas estão vazias
SELECT 'bookings' as table_name, COUNT(*) as record_count FROM bookings
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles;

-- Mensagem de confirmação
SELECT 'Database cleanup completed successfully' as status;
