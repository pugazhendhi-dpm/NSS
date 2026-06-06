-- Verify attendance_records table exists and check its structure
-- Run this in Supabase SQL Editor

-- 1. Check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'attendance_records'
) as table_exists;

-- 2. Show all columns in the table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'attendance_records'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'attendance_records';

-- 4. List all policies
SELECT policyname, cmd, permissive
FROM pg_policies
WHERE tablename = 'attendance_records';

-- 5. Count existing records (should be 0 if new)
SELECT COUNT(*) as record_count FROM attendance_records;
