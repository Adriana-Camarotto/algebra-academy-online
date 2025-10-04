-- Add DELETE policies for tutors and admins on bookings table
-- This ensures tutors can delete bookings through the admin-delete-booking edge function

-- First, let's check the current RLS policies on bookings
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'bookings';

-- Add DELETE policy for admins and tutors on bookings table
-- This allows the backend to delete bookings when called by admin/tutor users
CREATE POLICY "admin_tutor_delete_bookings" ON bookings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'tutor')
    )
  );

-- Also add UPDATE policy for admins and tutors (in case they need to update booking status)
CREATE POLICY "admin_tutor_update_bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'tutor')
    )
  );

-- Test the policies by checking if they were created
SELECT 'DELETE and UPDATE policies for tutors/admins created' as status;

-- Show all current policies on bookings table
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'bookings'
ORDER BY cmd, policyname;
