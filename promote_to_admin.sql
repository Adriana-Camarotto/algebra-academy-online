-- Quick script to promote Miguel to admin for testing
-- Execute in Supabase SQL Editor

-- Option 1: Promote Miguel to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'miguel.camarotto@gmail.com';

-- Option 2: Also promote Adriana to admin (if not already)
UPDATE users 
SET role = 'admin' 
WHERE email = 'adriana.camarotto1@gmail.com';

-- Verify the role changes
SELECT name, email, role 
FROM users 
WHERE email IN ('miguel.camarotto@gmail.com', 'adriana.camarotto1@gmail.com');
