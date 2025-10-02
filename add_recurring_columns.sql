-- Add recurring lesson support columns to bookings table
-- Run this in Supabase SQL Editor FIRST before deploying the function

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS recurring_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS recurring_session_number INTEGER,
ADD COLUMN IF NOT EXISTS recurring_session_total INTEGER;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_recurring_session_id ON bookings(recurring_session_id);

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name LIKE 'recurring%';

-- Success message
SELECT 'Recurring lesson columns added successfully!' as status;
