-- Add tutor policies to allow tutors to see all bookings and students
-- Execute in Supabase SQL Editor

-- Update the admin check function to include tutors
CREATE OR REPLACE FUNCTION is_admin_or_tutor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'tutor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add tutor policies for users table (tutors need to see all students)
CREATE POLICY "users_tutor_all" ON users
  FOR SELECT USING (is_admin_or_tutor());

-- Add tutor policies for bookings table (tutors need to see all bookings)
CREATE POLICY "bookings_tutor_all" ON bookings
  FOR SELECT USING (is_admin_or_tutor());

-- Test that tutors can now see all data
SELECT 'Tutor policies created - testing access:' as status;
SELECT 'All users visible to tutor:' as test, count(*) FROM users;
SELECT 'All bookings visible to tutor:' as test, count(*) FROM bookings;

-- Show sample data that should now be visible
SELECT 'Sample bookings for tutor:' as test, 
       lesson_date, lesson_time, service_type, status
FROM bookings 
ORDER BY lesson_date DESC 
LIMIT 5;
