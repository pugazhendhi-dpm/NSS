-- Debug: Check RLS policies and test insert
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'attendance_records';

-- 2. Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'attendance_records';

-- 3. Try a manual insert to see the exact error
-- Replace the UUIDs and values with actual data
INSERT INTO attendance_records (
    volunteer_id,
    volunteer_name,
    volunteer_roll_number,
    activity_name,
    activity_date,
    status,
    marked_by
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Test Volunteer',
    'TEST123',
    'Test Activity',
    '2026-01-14',
    'present',
    'Test Marker'
);

-- If the above fails, the error message will tell us exactly what's wrong

-- 4. Check if the table exists and its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'attendance_records'
ORDER BY ordinal_position;
