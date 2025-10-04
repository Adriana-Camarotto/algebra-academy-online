-- Debug RLS and check what's happening with bookings data
-- Execute this in Supabase SQL Editor

-- 1. Check RLS status
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('bookings', 'users');

-- 2. Check RLS policies for bookings table
SELECT * FROM pg_policies WHERE tablename = 'bookings';

-- 3. Check RLS policies for users table  
SELECT * FROM pg_policies WHERE tablename = 'users';

-- 4. Check what the current user can see
SELECT 'Current user bookings:' as test, count(*) FROM bookings;

-- 5. Try to see all bookings as admin
SELECT 'All bookings (should see all as admin):' as test, 
       b.id, b.user_id, b.lesson_date, b.lesson_time, b.service_type, b.status,
       u.name as student_name, u.email as student_email
FROM bookings b
JOIN users u ON b.user_id = u.id
ORDER BY b.lesson_date DESC;

-- 6. Check current authenticated user info
SELECT auth.uid() as current_user_id, 
       (SELECT role FROM users WHERE id = auth.uid()) as current_role;

-- 7. Test if admin can see all users
SELECT 'Users visible to admin:' as test, count(*) FROM users;
