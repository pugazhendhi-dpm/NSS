-- Complete fix: Drop views, change column types, recreate views
-- Run this entire script in Supabase SQL Editor

-- Step 1: Drop the views that depend on volunteer_id
DROP VIEW IF EXISTS volunteer_attendance_stats;
DROP VIEW IF EXISTS activity_attendance_summary;

-- Step 2: Drop foreign key constraint if it exists
ALTER TABLE attendance_records 
DROP CONSTRAINT IF EXISTS attendance_records_volunteer_id_fkey;

-- Step 3: Change column types from UUID to TEXT
ALTER TABLE attendance_records 
ALTER COLUMN volunteer_id TYPE TEXT USING volunteer_id::TEXT;

ALTER TABLE attendance_records 
ALTER COLUMN marked_by_id TYPE TEXT USING marked_by_id::TEXT;

-- Step 4: Recreate the volunteer_attendance_stats view with TEXT volunteer_id
CREATE OR REPLACE VIEW volunteer_attendance_stats AS
SELECT 
  v.id as volunteer_id,
  v.name as volunteer_name,
  v.roll_number,
  v.department,
  v.year,
  COUNT(DISTINCT ar.activity_date) as total_activities,
  COUNT(CASE WHEN ar.status = 'present' THEN 1 END) as days_present,
  COUNT(CASE WHEN ar.status = 'late' THEN 1 END) as days_late,
  COUNT(CASE WHEN ar.status = 'absent' THEN 1 END) as days_absent,
  ROUND(
    (COUNT(CASE WHEN ar.status IN ('present', 'late') THEN 1 END)::NUMERIC / 
     NULLIF(COUNT(DISTINCT ar.activity_date), 0) * 100), 
    2
  ) as attendance_percentage,
  MIN(ar.activity_date) as first_activity_date,
  MAX(ar.activity_date) as last_activity_date
FROM volunteers v
LEFT JOIN attendance_records ar ON v.id::TEXT = ar.volunteer_id
WHERE v.status = 'approved'
GROUP BY v.id, v.name, v.roll_number, v.department, v.year;

-- Step 5: Recreate the activity_attendance_summary view
CREATE OR REPLACE VIEW activity_attendance_summary AS
SELECT 
  activity_name,
  activity_date,
  COUNT(*) as total_volunteers,
  COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
  COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
  COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
  ROUND(
    (COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END)::NUMERIC / 
     NULLIF(COUNT(*), 0) * 100), 
    2
  ) as attendance_percentage,
  marked_by,
  MIN(marked_at) as marked_at
FROM attendance_records
GROUP BY activity_name, activity_date, marked_by
ORDER BY activity_date DESC;

-- Step 6: Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'attendance_records' 
AND column_name IN ('volunteer_id', 'marked_by_id');

-- Done! Now try saving attendance again.
