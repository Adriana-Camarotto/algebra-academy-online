-- Add recurring lesson support to bookings table
-- Execute this in Supabase SQL Editor

-- Add new columns for recurring lessons if they don't exist
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS recurring_session_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS recurring_session_number INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS recurring_session_total INTEGER DEFAULT NULL;

-- Add comments for the new columns
COMMENT ON COLUMN bookings.recurring_session_id IS 'Unique identifier for recurring lesson series';
COMMENT ON COLUMN bookings.recurring_session_number IS 'Current lesson number in the recurring series (1, 2, 3...)';
COMMENT ON COLUMN bookings.recurring_session_total IS 'Total number of lessons in the recurring series';

-- Create index for recurring lesson queries
CREATE INDEX IF NOT EXISTS idx_bookings_recurring_series 
ON bookings(recurring_session_id, recurring_session_number)
WHERE recurring_session_id IS NOT NULL;

-- Create index for recurring lesson time slot conflicts
CREATE INDEX IF NOT EXISTS idx_bookings_recurring_slots 
ON bookings(lesson_date, lesson_time, lesson_type, status, payment_status)
WHERE lesson_type = 'recurring';

-- Update existing lesson_type to handle recurring lessons
-- This is safe to run multiple times
UPDATE bookings 
SET lesson_type = 'single' 
WHERE lesson_type IS NULL 
AND service_type = 'individual'
AND recurring_session_id IS NULL;

-- Show current booking structure
SELECT 
  'Current booking columns:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'bookings'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample of recurring bookings if any exist
SELECT 
  'Sample recurring bookings:' as info,
  id,
  service_type,
  lesson_type,
  lesson_date,
  lesson_time,
  recurring_session_id,
  recurring_session_number,
  recurring_session_total,
  status,
  payment_status
FROM bookings 
WHERE lesson_type = 'recurring' 
   OR recurring_session_id IS NOT NULL
ORDER BY recurring_session_id, recurring_session_number
LIMIT 10;
