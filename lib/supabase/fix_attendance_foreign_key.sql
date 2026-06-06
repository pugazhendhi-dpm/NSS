-- Fix: Remove foreign key constraint from attendance_records
-- This allows attendance to be saved even if volunteer_id doesn't exist in volunteers table
-- Run this in Supabase SQL Editor

-- Drop the existing foreign key constraint
ALTER TABLE attendance_records 
DROP CONSTRAINT IF EXISTS attendance_records_volunteer_id_fkey;

-- The table will now accept any volunteer_id without checking the volunteers table
-- This is useful when volunteers are managed in sessionStorage or other systems

-- Verify the constraint was removed
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'attendance_records'::regclass;
