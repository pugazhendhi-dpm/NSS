-- ============================================
-- ATTENDANCE RECORDS TABLE
-- ============================================
-- This table stores all attendance records for NSS activities
-- Run this in Supabase SQL Editor

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteer_id UUID NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
  volunteer_name TEXT NOT NULL,
  volunteer_roll_number TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  activity_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by TEXT NOT NULL,
  marked_by_id UUID,
  marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_volunteer_id ON attendance_records(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_activity ON attendance_records(activity_name);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_attendance_marked_at ON attendance_records(marked_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_attendance_volunteer_date ON attendance_records(volunteer_id, activity_date DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on attendance_records table
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Public read access for transparency
CREATE POLICY "Public read access" 
ON attendance_records 
FOR SELECT 
USING (true);

-- Authenticated users can insert attendance records
CREATE POLICY "Authenticated users can insert" 
ON attendance_records 
FOR INSERT 
WITH CHECK (true);

-- Authenticated users can update attendance records
CREATE POLICY "Authenticated users can update" 
ON attendance_records 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Authenticated users can delete attendance records (for corrections)
CREATE POLICY "Authenticated users can delete" 
ON attendance_records 
FOR DELETE 
USING (true);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View to get attendance statistics per volunteer
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
LEFT JOIN attendance_records ar ON v.id = ar.volunteer_id
WHERE v.status = 'approved'
GROUP BY v.id, v.name, v.roll_number, v.department, v.year;

-- View to get activity-wise attendance summary
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

-- ============================================
-- DONE!
-- ============================================
-- Attendance tracking system is now ready!
-- Next steps:
-- 1. Create attendanceService.ts to interact with this table
-- 2. Update the attendance page to save records
-- 3. Create attendance history and statistics pages
