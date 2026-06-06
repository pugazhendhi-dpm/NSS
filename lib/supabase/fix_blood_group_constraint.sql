-- Fix blood_group constraint to allow extended blood groups
-- Run this in Supabase SQL Editor to fix the registration issue

-- Drop the existing CHECK constraint on blood_group column
ALTER TABLE blood_donors 
DROP CONSTRAINT IF EXISTS blood_donors_blood_group_check;

-- The column will now accept any text value for blood_group
-- This allows extended blood groups like 'A1 Positive (A1+)', 'A2B Negative (A2B-)', 'Others', etc.

-- Add a comment to document the change
COMMENT ON COLUMN blood_donors.blood_group IS 'Blood group including standard (A+, B-, etc.) and extended variants (A1+, A2B+, Others)';
