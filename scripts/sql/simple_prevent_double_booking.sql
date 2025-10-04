-- Versão simplificada do SQL para prevenir double booking
-- Execute este no Supabase SQL Editor

-- Primeiro, vamos ver a estrutura atual da tabela
-- (Execute isso primeiro para verificar os campos)
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bookings';

-- Criar índice único parcial simples
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_individual_bookings 
ON bookings (lesson_date, lesson_time) 
WHERE service_type = 'individual';

-- Se quiser incluir o status na validação, use esta versão:
-- DROP INDEX IF EXISTS idx_unique_individual_bookings;
-- CREATE UNIQUE INDEX idx_unique_individual_active_bookings 
-- ON bookings (lesson_date, lesson_time) 
-- WHERE service_type = 'individual' AND status = 'scheduled';

-- Para testar se funcionou, tente inserir um booking duplicado:
-- (Isso deve falhar com erro de violação de constraint)
-- INSERT INTO bookings (lesson_date, lesson_time, service_type, status) 
-- VALUES ('2025-07-15', '10:00', 'individual', 'scheduled');
