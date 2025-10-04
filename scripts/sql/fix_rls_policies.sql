-- Fix RLS policies to allow admin access to all bookings and users
-- Execute this in Supabase SQL Editor

-- 1. Enable RLS on both tables (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;  
DROP POLICY IF EXISTS "Admin can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Tutors can view all bookings" ON bookings;

-- 3. Create comprehensive policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin and tutors can view all users" ON users  
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'tutor')
    )
  );

-- 4. Create comprehensive policies for bookings table
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin and tutors can view all bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'tutor')  
    )
  );

-- 5. Allow admin and tutors to insert/update/delete as needed
CREATE POLICY "Admin can manage all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can manage all bookings" ON bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 6. Test the policies
SELECT 'Testing admin access - should see all users:' as test, count(*) FROM users;
SELECT 'Testing admin access - should see all bookings:' as test, count(*) FROM bookings;

-- 7. Show sample data that should now be visible
SELECT 'All bookings now visible:' as test, 
       b.lesson_date, b.lesson_time, b.service_type, b.status,
       u.name as student_name, u.email as student_email
FROM bookings b
JOIN users u ON b.user_id = u.id
ORDER BY b.lesson_date DESC
LIMIT 10;
