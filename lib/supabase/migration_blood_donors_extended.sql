-- Migration to add student-specific fields to blood_donors table
-- Run this in Supabase SQL Editor after the initial schema setup

-- Add new columns for student donor information
ALTER TABLE blood_donors
ADD COLUMN IF NOT EXISTS roll_number TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS year TEXT,
ADD COLUMN IF NOT EXISTS section TEXT,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS hometown TEXT,
ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
ADD COLUMN IF NOT EXISTS blood_donation_willingness TEXT,
ADD COLUMN IF NOT EXISTS residential_status TEXT;

-- Add index for roll_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_blood_donors_roll_number ON blood_donors(roll_number);

-- Add index for department for filtering
CREATE INDEX IF NOT EXISTS idx_blood_donors_department ON blood_donors(department);

-- Add comment to table
COMMENT ON TABLE blood_donors IS 'Blood donor registry including both students and general public';
