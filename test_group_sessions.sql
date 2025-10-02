-- Test script for group session functionality
-- This script helps verify that the group session system is working correctly

-- Check if group session columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('group_session_number', 'group_session_total', 'payment_processed_at', 'payment_intent_id', 'can_cancel_until');

-- Check existing group session bookings
SELECT 
    id,
    user_id,
    lesson_date,
    lesson_time,
    lesson_day,
    service_type,
    lesson_type,
    group_session_number,
    group_session_total,
    payment_status,
    status,
    created_at
FROM bookings 
WHERE service_type = 'group' 
ORDER BY lesson_date, group_session_number;

-- Count group sessions by user
SELECT 
    user_id,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_sessions,
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_sessions,
    MIN(lesson_date) as first_session,
    MAX(lesson_date) as last_session
FROM bookings 
WHERE service_type = 'group' 
GROUP BY user_id;

-- Check for any group session conflicts (should be none)
SELECT 
    lesson_date,
    lesson_time,
    lesson_day,
    COUNT(*) as booking_count,
    STRING_AGG(service_type, ', ') as service_types
FROM bookings 
WHERE status IN ('scheduled', 'pending')
AND lesson_date >= CURRENT_DATE
GROUP BY lesson_date, lesson_time, lesson_day
HAVING COUNT(*) > 1
OR (COUNT(*) > 0 AND 'group' = ANY(ARRAY_AGG(service_type)) AND 'individual' = ANY(ARRAY_AGG(service_type)));

-- Show upcoming group sessions for next 30 days
SELECT 
    lesson_date,
    lesson_time,
    lesson_day,
    group_session_number,
    group_session_total,
    payment_status,
    status,
    can_cancel_until,
    EXTRACT(HOUR FROM (TIMESTAMP(lesson_date || ' ' || lesson_time) - NOW())) as hours_until_session
FROM bookings 
WHERE service_type = 'group' 
AND lesson_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
AND status IN ('scheduled', 'pending')
ORDER BY lesson_date, lesson_time;
