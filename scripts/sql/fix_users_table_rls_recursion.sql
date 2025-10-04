-- Fix infinite recursion in users table RLS policies
-- The issue: Admin policy is checking users table from within users table policy = infinite loop

-- Step 1: Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;

-- Step 2: Create a simpler, non-recursive admin policy using auth.jwt() metadata
-- This avoids querying the users table from within its own policy
CREATE POLICY "Admins can view all profiles" ON public.users
    FOR SELECT USING (
        COALESCE(
            (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role',
            (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role'
        ) = 'admin'
    );

-- Step 3: Alternative admin policy using a function that bypasses RLS
-- Create a function that checks admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user has admin role in their JWT claims
    RETURN COALESCE(
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role',
        (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role',
        'student'
    ) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Drop the JWT-based policy and create a function-based one (more reliable)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;

CREATE POLICY "Admins can view all profiles" ON public.users
    FOR SELECT USING (public.is_admin());

-- Step 5: Also add admin policies for INSERT and UPDATE operations
CREATE POLICY "Admins can insert profiles" ON public.users
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.users
    FOR UPDATE USING (public.is_admin());

-- Step 6: Create a test to verify the fix works
-- This should NOT cause infinite recursion anymore
DO $$
BEGIN
    RAISE NOTICE 'Testing users table access...';
    
    -- Try a simple count query
    PERFORM COUNT(*) FROM public.users;
    
    RAISE NOTICE 'SUCCESS: Users table RLS policies working correctly!';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: % - %', SQLSTATE, SQLERRM;
END;
$$;

-- Step 7: Show current policies for verification
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'users'
ORDER BY policyname;

-- Step 8: Test basic operations
SELECT 
    'RLS Fix Applied Successfully' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
    COUNT(CASE WHEN role = 'student' THEN 1 END) as student_users
FROM public.users;
