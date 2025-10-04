-- SIMPLE FIX: Reset RLS policies for users table
-- Run this to fix the infinite recursion problem

-- 1. First, let's see what we have
SELECT COUNT(*) as current_user_count FROM public.users;

-- 2. Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;  
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin full access" ON public.users;

-- 3. Create SIMPLE working policies
CREATE POLICY "Users own profile" ON public.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admin access via JWT" ON public.users
    FOR ALL USING (
        (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
        OR 
        (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
    );

-- 4. Test if it works now
SELECT COUNT(*) as final_user_count FROM public.users;
