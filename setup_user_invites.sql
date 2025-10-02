-- USER INVITE CONFIGURATION
-- Run this in Supabase SQL editor to configure user invites

-- 1. Enable user invites by email (Admin only)
-- This policy allows admins to use auth.admin.inviteUserByEmail()

-- First, make sure RLS is enabled on auth.users (this is usually automatic)
-- The auth.users table is managed by Supabase Auth

-- 2. Create function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
    OR 
    (auth.jwt() ->> 'app_metadata')::jsonb ->> 'role' = 'admin'
    OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to handle user profile creation after signup
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile when someone signs up
  INSERT INTO public.users (id, email, name, role, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    'https://ui-avatars.com/api/?name=' || encode(COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'escape') || '&background=random&color=fff'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    role = COALESCE(EXCLUDED.role, users.role),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger to auto-create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();

-- 5. Test the setup
SELECT 
  'Admin function test' as test,
  is_admin() as is_current_user_admin;

-- 6. Show current users count
SELECT 
  'Current users count' as info,
  COUNT(*) as total_users 
FROM public.users;
