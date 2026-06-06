-- Fix: Add UPDATE policy for volunteers table
-- This allows authenticated users to update volunteer records (approve/reject)

-- Drop existing policy if it exists (just in case)
DROP POLICY IF EXISTS "Authenticated users can update" ON volunteers;

-- Create UPDATE policy for volunteers table
CREATE POLICY "Authenticated users can update" 
ON volunteers 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Verify the policy was created
-- You should see this policy listed in the Supabase dashboard under:
-- Table Editor > volunteers > Policies
