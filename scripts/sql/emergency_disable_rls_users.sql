-- EMERGENCY FIX: Temporarily disable RLS on users table to stop infinite recursion
-- Use this if you need immediate access to the SecurityPage

-- OPTION 1: Completely disable RLS temporarily (quick fix)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Test that table is now accessible
SELECT 
    'Emergency Fix Applied' as status,
    'RLS DISABLED - Table now accessible' as message,
    COUNT(*) as total_users
FROM public.users;

-- OPTION 2: If you want to keep RLS enabled but remove problematic policies
-- Uncomment the lines below instead of disabling RLS above:

/*
-- Keep RLS enabled but drop the recursive admin policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop all policies and recreate simple ones
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;

-- Create simple non-recursive policies
CREATE POLICY "Allow all operations for authenticated users" ON public.users
    FOR ALL USING (auth.role() = 'authenticated');

-- Test
SELECT 
    'Simple RLS Fix Applied' as status,
    COUNT(*) as total_users
FROM public.users;
*/
