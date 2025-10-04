-- Add admin policies to allow admins to see all data
-- Execute in Supabase SQL Editor after promoting users to admin

-- Create a secure function to check admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin policies for users table
CREATE POLICY "users_admin_all" ON users
  FOR ALL USING (is_admin());

-- Add admin policies for bookings table  
CREATE POLICY "bookings_admin_all" ON bookings
  FOR ALL USING (is_admin());

-- Test that admin can see all data
SELECT 'Admin policies created - testing access:' as status;
SELECT 'All users visible to admin:' as test, count(*) FROM users;
SELECT 'All bookings visible to admin:' as test, count(*) FROM bookings;
