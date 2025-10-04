-- SQL script to prevent double booking of individual lessons
-- This should be executed in your Supabase SQL editor

-- Method 1: Create a partial unique index (PostgreSQL specific)
-- This will prevent multiple individual lessons at the same time
CREATE UNIQUE INDEX IF NOT EXISTS unique_individual_lesson_time_idx 
ON bookings (lesson_date, lesson_time) 
WHERE service_type = 'individual' 
  AND status IN ('scheduled', 'pending') 
  AND payment_status IN ('pending', 'paid');

-- Method 2: Alternative using a composite unique constraint
-- If the above doesn't work, you can try this approach:
-- ALTER TABLE bookings 
-- ADD CONSTRAINT unique_individual_lesson_slot 
-- EXCLUDE (lesson_date WITH =, lesson_time WITH =) 
-- WHERE (service_type = 'individual' AND status IN ('scheduled', 'pending'));

-- Note: This index will prevent any two individual lessons from being booked
-- at the same date and time, regardless of user or other factors
