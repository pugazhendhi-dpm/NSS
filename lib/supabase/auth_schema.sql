-- ============================================
-- AUTHORIZED USERS TABLE (for Google OAuth login)
-- ============================================
-- This table acts as the allowlist for dashboard access.
-- Only emails present here (and marked active) can log in.

CREATE TABLE IF NOT EXISTS authorized_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'supersenior')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_authorized_users_email ON authorized_users(email);
CREATE INDEX IF NOT EXISTS idx_authorized_users_role ON authorized_users(role);

-- RLS
ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON authorized_users FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON authorized_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON authorized_users FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON authorized_users FOR DELETE USING (true);

-- Seed the initial admin user
INSERT INTO authorized_users (email, name, role)
VALUES ('nsskec@kongu.edu', 'NSS Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
