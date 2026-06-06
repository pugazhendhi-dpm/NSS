# Attendance System Setup Instructions

## 🚀 Quick Start

### Step 1: Run Database Migration

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard: https://app.supabase.com
   - Navigate to: **SQL Editor** (in the left sidebar)

2. **Run the Attendance Schema**
   - Open the file: `lib/supabase/attendance_schema.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click **Run** button

3. **Verify Tables Created**
   - Go to **Table Editor** in Supabase
   - You should see a new table: `attendance_records`
   - Check that the views were created: `volunteer_attendance_stats` and `activity_attendance_summary`

### Step 2: Test the Attendance System

1. **Mark Attendance**
   - Go to your app: `http://localhost:3000/dashboard/attendance`
   - Fill in the activity name and date
   - Mark attendance for volunteers (Present/Late/Absent)
   - Click "Save Attendance"
   - You should see: "✓ Attendance saved successfully to database!"

2. **Verify in Database**
   - Go to Supabase → Table Editor → `attendance_records`
   - You should see the attendance records you just saved

## 📊 Features Implemented

### Database Layer
- ✅ `attendance_records` table with complete schema
- ✅ Indexes for fast queries (by volunteer, date, activity)
- ✅ Row Level Security (RLS) policies
- ✅ Helper views for statistics:
  - `volunteer_attendance_stats` - Per volunteer statistics
  - `activity_attendance_summary` - Per activity summary

### Backend Service
- ✅ `saveAttendanceRecords()` - Save bulk attendance
- ✅ `getAttendanceByVolunteer()` - Get volunteer's attendance history
- ✅ `getAttendanceByDate()` - Get attendance for a specific date
- ✅ `getAttendanceByActivity()` - Get attendance for an activity
- ✅ `getVolunteerStats()` - Get attendance statistics for a volunteer
- ✅ `getAllVolunteerStats()` - Get all volunteers' statistics
- ✅ `getActivitySummary()` - Get activity-wise attendance summary
- ✅ `getAttendanceHistory()` - Paginated history with filters

### Frontend Updates
- ✅ Attendance page saves to database
- ✅ Loading state during save
- ✅ Success/error notifications
- ✅ Form reset after successful save
- ✅ Validation for required fields

## 🎯 What's Tracked

For each attendance record, the system stores:
- **Volunteer Information**: ID, name, roll number
- **Activity Details**: Name and date
- **Attendance Status**: Present, Late, or Absent
- **Metadata**: Who marked it, when it was marked
- **Optional Notes**: For special cases

## 📈 Statistics Available

The system automatically calculates:
- **Total Activities**: How many activities a volunteer attended
- **Days Present**: Count of present days
- **Days Late**: Count of late arrivals
- **Days Absent**: Count of absences
- **Attendance Percentage**: (Present + Late) / Total × 100
- **Date Range**: First and last activity dates

## 🔍 Querying Attendance Data

### Example: Get a volunteer's attendance
```typescript
import { getAttendanceByVolunteer } from '@/lib/attendanceService'

const records = await getAttendanceByVolunteer(volunteerId)
```

### Example: Get volunteer statistics
```typescript
import { getVolunteerStats } from '@/lib/attendanceService'

const stats = await getVolunteerStats(volunteerId)
// Returns: totalActivities, daysPresent, attendancePercentage, etc.
```

### Example: Get all attendance for a date
```typescript
import { getAttendanceByDate } from '@/lib/attendanceService'

const records = await getAttendanceByDate('2026-01-14')
```

## 🚧 Next Steps (Optional Enhancements)

These features are planned but not yet implemented:

1. **Attendance History Page** - View all past attendance records
2. **Statistics Dashboard** - Visual charts and trends
3. **Filters** - Filter by date range, volunteer, activity
4. **CSV Export** - Download attendance data
5. **Reports** - Monthly/yearly attendance reports
6. **Notifications** - Alert volunteers with low attendance

## 🐛 Troubleshooting

### Issue: "Failed to save attendance"
**Solution**: Check the browser console for detailed error messages. Common causes:
- Missing RLS policies (run the SQL migration again)
- Supabase connection issues (check `.env.local`)
- Invalid volunteer IDs

### Issue: No data showing in Supabase
**Solution**: 
- Verify the SQL migration ran successfully
- Check that you're looking at the correct table (`attendance_records`)
- Ensure RLS policies are enabled

### Issue: Permission denied errors
**Solution**: Run the RLS policy fix:
```sql
CREATE POLICY "Authenticated users can insert" 
ON attendance_records 
FOR INSERT 
WITH CHECK (true);
```

## 📝 Database Schema Reference

```sql
attendance_records (
  id UUID PRIMARY KEY,
  volunteer_id UUID REFERENCES volunteers(id),
  volunteer_name TEXT,
  volunteer_roll_number TEXT,
  activity_name TEXT,
  activity_date DATE,
  status TEXT ('present' | 'absent' | 'late'),
  marked_by TEXT,
  marked_by_id UUID,
  marked_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP
)
```

## ✅ Verification Checklist

- [ ] SQL migration ran successfully in Supabase
- [ ] `attendance_records` table exists
- [ ] Views `volunteer_attendance_stats` and `activity_attendance_summary` exist
- [ ] Can mark attendance on the attendance page
- [ ] Success message appears after saving
- [ ] Data appears in Supabase table editor
- [ ] Statistics views show correct calculations
