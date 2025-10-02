-- Emergency fix for RLS infinite recursion
-- Execute this IMMEDIATELY in Supabase SQL Editor

-- 1. DISABLE RLS temporarily to stop the recursion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies to clean slate
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admin and tutors can view all users" ON users;
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;  
DROP POLICY IF EXISTS "Admin and tutors can view all bookings" ON bookings;
DROP POLICY IF EXISTS "Admin can manage all users" ON users;
DROP POLICY IF EXISTS "Admin can manage all bookings" ON bookings;

-- 3. Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create SIMPLE, non-recursive policies
-- For users table - allow users to see their own data
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- For users table - allow service role full access (for admin operations)  
CREATE POLICY "users_select_service" ON users
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- For bookings table - allow users to see their own bookings
CREATE POLICY "bookings_select_own" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- For bookings table - allow service role full access
CREATE POLICY "bookings_select_service" ON bookings
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- 5. Test basic access
SELECT 'Emergency fix applied - testing basic access:' as status;
SELECT count(*) as users_visible FROM users;
SELECT count(*) as bookings_visible FROM bookings;
