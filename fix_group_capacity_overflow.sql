-- Fix Group Session Capacity Overflow
-- This script removes excess bookings for group sessions, keeping only the first 4 bookings per slot
-- Run this to fix the issue where more than 4 students were allowed to book the same group session

-- 🔍 First, let's see which group sessions have more than 4 bookings
SELECT 
    lesson_date,
    lesson_day, 
    lesson_time,
    service_type,
    COUNT(*) as booking_count
FROM bookings 
WHERE service_type = 'group' 
    AND status IN ('scheduled', 'pending')
    AND payment_status IN ('pending', 'paid')
GROUP BY lesson_date, lesson_day, lesson_time, service_type
HAVING COUNT(*) > 4
ORDER BY lesson_date, lesson_day, lesson_time;

-- 🚨 BACKUP: Create a backup of affected bookings before deletion
CREATE TABLE IF NOT EXISTS bookings_overflow_backup AS
SELECT b.* 
FROM bookings b
WHERE b.id IN (
    SELECT id 
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY lesson_date, lesson_day, lesson_time, service_type 
                   ORDER BY created_at
               ) as rn
        FROM bookings 
        WHERE service_type = 'group' 
            AND status IN ('scheduled', 'pending')
            AND payment_status IN ('pending', 'paid')
    ) ranked
    WHERE rn > 4
);

-- 📊 Show what will be deleted
SELECT 
    'Will be deleted:' as action,
    lesson_date,
    lesson_day, 
    lesson_time,
    user_id,
    created_at,
    payment_status
FROM bookings 
WHERE id IN (
    SELECT id 
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY lesson_date, lesson_day, lesson_time, service_type 
                   ORDER BY created_at
               ) as rn
        FROM bookings 
        WHERE service_type = 'group' 
            AND status IN ('scheduled', 'pending')
            AND payment_status IN ('pending', 'paid')
    ) ranked
    WHERE rn > 4
)
ORDER BY lesson_date, lesson_day, lesson_time, created_at;

-- 🗑️ Delete excess bookings (only keep first 4 per group session slot)
-- UNCOMMENT THE LINES BELOW TO EXECUTE THE DELETION:

/*
DELETE FROM bookings 
WHERE id IN (
    SELECT id 
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY lesson_date, lesson_day, lesson_time, service_type 
                   ORDER BY created_at
               ) as rn
        FROM bookings 
        WHERE service_type = 'group' 
            AND status IN ('scheduled', 'pending')
            AND payment_status IN ('pending', 'paid')
    ) ranked
    WHERE rn > 4
);
*/

-- 📈 Verify the fix - should show no group sessions with more than 4 bookings
SELECT 
    lesson_date,
    lesson_day, 
    lesson_time,
    service_type,
    COUNT(*) as booking_count
FROM bookings 
WHERE service_type = 'group' 
    AND status IN ('scheduled', 'pending')
    AND payment_status IN ('pending', 'paid')
GROUP BY lesson_date, lesson_day, lesson_time, service_type
HAVING COUNT(*) > 4
ORDER BY lesson_date, lesson_day, lesson_time;

-- 📝 Summary: Show final booking counts per group session
SELECT 
    lesson_date,
    lesson_day, 
    lesson_time,
    COUNT(*) as final_booking_count
FROM bookings 
WHERE service_type = 'group' 
    AND status IN ('scheduled', 'pending')
    AND payment_status IN ('pending', 'paid')
GROUP BY lesson_date, lesson_day, lesson_time
ORDER BY lesson_date, lesson_day, lesson_time;
