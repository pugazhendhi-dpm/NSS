-- Blood Donation Campaign Manager Schema
-- Run this in Supabase SQL Editor

-- 1. Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  goal_units INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  location TEXT,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')) DEFAULT 'upcoming',
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create donation_records table
CREATE TABLE IF NOT EXISTS donation_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES blood_donors(id) ON DELETE CASCADE,
  donor_name TEXT NOT NULL,
  donor_roll_number TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  donation_date DATE NOT NULL,
  units_donated DECIMAL(3,1) DEFAULT 1.0,
  notes TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add last_donation_date to blood_donors (if not exists)
ALTER TABLE blood_donors 
ADD COLUMN IF NOT EXISTS last_donation_date DATE;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donation_records(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donation_records(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donation_records(donation_date DESC);

-- 5. Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_records ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
CREATE POLICY "Public read campaigns" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Authenticated insert campaigns" ON campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated update campaigns" ON campaigns FOR UPDATE USING (true);

CREATE POLICY "Public read donations" ON donation_records FOR SELECT USING (true);
CREATE POLICY "Authenticated insert donations" ON donation_records FOR INSERT WITH CHECK (true);

-- 7. Create view for donor eligibility
CREATE OR REPLACE VIEW donor_eligibility AS
SELECT 
  bd.id,
  bd.name,
  bd.roll_number,
  bd.blood_group,
  bd.department,
  bd.year,
  bd.phone,
  bd.last_donation_date,
  CASE 
    WHEN bd.last_donation_date IS NULL THEN true
    WHEN bd.last_donation_date + INTERVAL '90 days' <= CURRENT_DATE THEN true
    ELSE false
  END as is_eligible,
  CASE 
    WHEN bd.last_donation_date IS NULL THEN 0
    WHEN bd.last_donation_date + INTERVAL '90 days' > CURRENT_DATE THEN 
      EXTRACT(DAY FROM (bd.last_donation_date + INTERVAL '90 days' - CURRENT_DATE))
    ELSE 0
  END as days_until_eligible,
  COUNT(dr.id) as total_donations
FROM blood_donors bd
LEFT JOIN donation_records dr ON bd.id = dr.donor_id
GROUP BY bd.id, bd.name, bd.roll_number, bd.blood_group, bd.department, bd.year, bd.phone, bd.last_donation_date;

-- 8. Create view for campaign statistics
CREATE OR REPLACE VIEW campaign_stats AS
SELECT 
  c.id as campaign_id,
  c.name as campaign_name,
  c.goal_units,
  c.start_date,
  c.end_date,
  c.status,
  COUNT(dr.id) as total_donations,
  COALESCE(SUM(dr.units_donated), 0) as units_collected,
  ROUND((COALESCE(SUM(dr.units_donated), 0) / c.goal_units * 100)::NUMERIC, 2) as progress_percentage,
  COUNT(DISTINCT dr.donor_id) as unique_donors
FROM campaigns c
LEFT JOIN donation_records dr ON c.id = dr.campaign_id
GROUP BY c.id, c.name, c.goal_units, c.start_date, c.end_date, c.status;

-- Done!
