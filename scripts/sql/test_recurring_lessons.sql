-- Test recurring lesson functionality
-- Execute this in Supabase SQL Editor to test the system

-- 1. First, let's see the current state
SELECT 'Current bookings count:' as test, count(*) FROM bookings;
SELECT 'Recurring bookings count:' as test, count(*) FROM bookings WHERE lesson_type = 'recurring';

-- 2. Create a test user for recurring lessons
INSERT INTO users (id, email, name, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'recurring.student@test.com',
  'Recurring Test Student',
  'student',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  updated_at = NOW();

-- 3. Insert test recurring lesson series (8 weeks starting from next Monday)
WITH recurring_dates AS (
  SELECT 
    generate_series(
      date_trunc('week', CURRENT_DATE) + interval '7 days', -- Next Monday
      date_trunc('week', CURRENT_DATE) + interval '7 days' + interval '7 weeks', -- 8 weeks later
      interval '1 week'
    )::date as lesson_date,
    row_number() over (order by generate_series) as session_number
)
INSERT INTO bookings (
  id,
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
  student_email,
  recurring_session_id,
  recurring_session_number,
  recurring_session_total,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'individual',
  'recurring',
  rd.lesson_date,
  '14:00:00',
  'monday',
  'scheduled',
  'paid',
  30, -- £0.30 per lesson
  'gbp',
  'recurring.student@test.com',
  'recurring_test_series_001',
  rd.session_number,
  8, -- Total 8 lessons
  NOW(),
  NOW()
FROM recurring_dates rd;

-- 4. Insert another recurring series with different time for conflict testing
WITH recurring_dates AS (
  SELECT 
    generate_series(
      date_trunc('week', CURRENT_DATE) + interval '10 days', -- Next Thursday
      date_trunc('week', CURRENT_DATE) + interval '10 days' + interval '5 weeks', -- 6 weeks later
      interval '1 week'
    )::date as lesson_date,
    row_number() over (order by generate_series) as session_number
)
INSERT INTO bookings (
  id,
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
  student_email,
  recurring_session_id,
  recurring_session_number,
  recurring_session_total,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  'individual',
  'recurring',
  rd.lesson_date,
  '16:00:00',
  'thursday',
  'scheduled',
  'paid',
  30, -- £0.30 per lesson
  'gbp',
  'recurring.student@test.com',
  'recurring_test_series_002',
  rd.session_number,
  6, -- Total 6 lessons
  NOW(),
  NOW()
FROM recurring_dates rd;

-- 5. Verify the test data
SELECT 
  'Test recurring bookings created:' as test,
  recurring_session_id,
  count(*) as lessons_count,
  min(lesson_date) as first_lesson,
  max(lesson_date) as last_lesson,
  lesson_time,
  lesson_day
FROM bookings 
WHERE recurring_session_id LIKE 'recurring_test_series_%'
GROUP BY recurring_session_id, lesson_time, lesson_day
ORDER BY recurring_session_id;

-- 6. Show individual lesson details
SELECT 
  'Individual recurring lessons:' as test,
  id,
  lesson_date,
  lesson_time,
  recurring_session_id,
  recurring_session_number,
  recurring_session_total,
  status,
  payment_status,
  amount
FROM bookings 
WHERE recurring_session_id LIKE 'recurring_test_series_%'
ORDER BY recurring_session_id, recurring_session_number;

-- 7. Test conflict detection query
SELECT 
  'Conflict detection test - Monday 14:00:' as test,
  lesson_date,
  lesson_time,
  service_type,
  lesson_type,
  recurring_session_id,
  status
FROM bookings 
WHERE lesson_time = '14:00:00'
  AND EXTRACT(dow FROM lesson_date) = 1 -- Monday
  AND status != 'cancelled'
  AND payment_status != 'refunded'
ORDER BY lesson_date;

-- 8. Show dashboard view for the test student
SELECT 
  'Student dashboard view:' as test,
  lesson_date,
  lesson_time,
  service_type,
  lesson_type,
  recurring_session_number || '/' || recurring_session_total as progress,
  status,
  payment_status,
  amount
FROM bookings 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
  AND lesson_date >= CURRENT_DATE
ORDER BY lesson_date, lesson_time;

-- 9. Admin view test
SELECT 
  'Admin view - all recurring lessons:' as test,
  u.name as student_name,
  u.email as student_email,
  b.lesson_date,
  b.lesson_time,
  b.service_type,
  b.lesson_type,
  b.recurring_session_id,
  b.recurring_session_number || '/' || b.recurring_session_total as progress,
  b.status,
  b.payment_status
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.lesson_type = 'recurring'
  AND b.lesson_date >= CURRENT_DATE
ORDER BY b.lesson_date, b.lesson_time;

-- 10. Test cleanup (uncomment to remove test data)
/*
DELETE FROM bookings WHERE recurring_session_id LIKE 'recurring_test_series_%';
DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001';
*/

SELECT 'Recurring lesson test completed!' as final_message;
