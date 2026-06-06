-- Fix: Change volunteer_id from UUID to TEXT
-- This allows any volunteer ID format (UUID, integer, string, etc.)
-- Run this in Supabase SQL Editor

-- 1. Drop the foreign key constraint if it exists
ALTER TABLE attendance_records 
DROP CONSTRAINT IF EXISTS attendance_records_volunteer_id_fkey;

-- 2. Change the column type from UUID to TEXT
ALTER TABLE attendance_records 
ALTER COLUMN volunteer_id TYPE TEXT USING volunteer_id::TEXT;

-- 3. Also change marked_by_id to TEXT for consistency
ALTER TABLE attendance_records 
ALTER COLUMN marked_by_id TYPE TEXT USING marked_by_id::TEXT;

-- 4. Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'attendance_records' 
AND column_name IN ('volunteer_id', 'marked_by_id');

-- Done! Now try saving attendance again.
