-- Test script to manually create a test user profile
-- Use this to verify the users table and profile creation is working

-- First, let's see the current state
SELECT 'Current state before test' as status;

SELECT COUNT(*) as auth_users_count FROM auth.users;
SELECT COUNT(*) as profile_users_count FROM public.users;

-- Test: Create a test user profile manually (simulate what should happen after signup)
-- Replace the UUID and email with actual values from a real signup attempt

-- Example test data (replace with real values from your signup attempt):
/*
INSERT INTO public.users (
    id, 
    email, 
    name, 
    role, 
    created_at, 
    updated_at
) VALUES (
    '12345678-1234-1234-1234-123456789012', -- Replace with actual UUID from auth.users
    'test@example.com',                      -- Replace with actual email
    'Test User',                            -- Replace with actual name
    'student',                              -- Role from signup
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
*/

-- To find the actual user ID from a recent signup, run this:
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if there are any auth users without profiles
SELECT 
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data->>'name' as metadata_name,
    au.raw_user_meta_data->>'role' as metadata_role,
    CASE WHEN pu.id IS NOT NULL THEN 'HAS_PROFILE' ELSE 'MISSING_PROFILE' END as profile_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;

-- Function to manually create profile for a user (use this if automatic creation failed)
-- Replace USER_ID_HERE with the actual user ID
/*
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Get user data from auth.users
    SELECT 
        id,
        email,
        raw_user_meta_data->>'name' as name,
        raw_user_meta_data->>'role' as role
    INTO user_record
    FROM auth.users 
    WHERE id = 'USER_ID_HERE'; -- Replace with actual user ID
    
    IF user_record.id IS NOT NULL THEN
        -- Create the profile
        INSERT INTO public.users (id, email, name, role)
        VALUES (
            user_record.id,
            user_record.email,
            COALESCE(user_record.name, split_part(user_record.email, '@', 1)),
            COALESCE(user_record.role, 'student')
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            role = EXCLUDED.role,
            updated_at = NOW();
            
        RAISE NOTICE 'Profile created/updated for user: %', user_record.email;
    ELSE
        RAISE NOTICE 'User not found in auth.users';
    END IF;
END $$;
*/

-- Verify table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
