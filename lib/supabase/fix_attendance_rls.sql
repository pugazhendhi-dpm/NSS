-- Complete fix for attendance_records RLS policies
-- This ensures anyone can insert attendance records
-- Run this in Supabase SQL Editor

-- First, drop all existing policies
DROP POLICY IF EXISTS "Public read access" ON attendance_records;
DROP POLICY IF EXISTS "Authenticated users can insert" ON attendance_records;
DROP POLICY IF EXISTS "Authenticated users can update" ON attendance_records;
DROP POLICY IF EXISTS "Authenticated users can delete" ON attendance_records;

-- Disable RLS temporarily to test
ALTER TABLE attendance_records DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations
CREATE POLICY "Allow all read access" 
ON attendance_records 
FOR SELECT 
USING (true);

CREATE POLICY "Allow all insert access" 
ON attendance_records 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow all update access" 
ON attendance_records 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all delete access" 
ON attendance_records 
FOR DELETE 
USING (true);

-- Verify policies were created
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'attendance_records';
