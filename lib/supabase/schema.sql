-- NSS Platform Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/YOUR_PROJECT/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Regular Activities', 'Special Camps')),
  date DATE NOT NULL,
  location TEXT,
  participants INTEGER DEFAULT 0,
  image_url TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date DESC);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_uploaded_at ON gallery(uploaded_at DESC);

-- ============================================
-- STATISTICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  volunteers_enrolled INTEGER DEFAULT 0,
  hours_of_service INTEGER DEFAULT 0,
  blood_units_donated INTEGER DEFAULT 0,
  villages_adopted INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_by TEXT
);

-- Insert default statistics
INSERT INTO statistics (volunteers_enrolled, hours_of_service, blood_units_donated, villages_adopted, last_updated_by)
VALUES (250, 12500, 450, 8, 'System')
ON CONFLICT DO NOTHING;

-- ============================================
-- UPDATES TABLE (Announcements/Marquee)
-- ============================================
CREATE TABLE IF NOT EXISTS updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_updates_created_at ON updates(created_at DESC);

-- ============================================
-- VOLUNTEERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  roll_number TEXT UNIQUE NOT NULL,
  department TEXT,
  year INTEGER,
  phone TEXT,
  role TEXT DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'supersenior', 'admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_status ON volunteers(status);

-- ============================================
-- BLOOD DONORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS blood_donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  phone TEXT NOT NULL,
  email TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  address TEXT,
  last_donation_date DATE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_blood_donors_blood_group ON blood_donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_blood_donors_available ON blood_donors(is_available);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_donors ENABLE ROW LEVEL SECURITY;

-- Public read access for activities, gallery, statistics, updates
CREATE POLICY "Public read access" ON activities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access" ON statistics FOR SELECT USING (true);
CREATE POLICY "Public read access" ON updates FOR SELECT USING (true);

-- Volunteers can insert/update/delete (authenticated users only)
-- Note: For now, allowing all authenticated users. Later, add role checks.
CREATE POLICY "Authenticated users can insert" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON activities FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON activities FOR DELETE USING (true);

CREATE POLICY "Authenticated users can insert" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON gallery FOR DELETE USING (true);

CREATE POLICY "Authenticated users can update" ON statistics FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can insert" ON updates FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can delete" ON updates FOR DELETE USING (true);

-- Blood donors: public read, authenticated write
CREATE POLICY "Public read access" ON blood_donors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON blood_donors FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update" ON blood_donors FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete" ON blood_donors FOR DELETE USING (true);

-- Volunteers: public can insert (registration), authenticated can read
CREATE POLICY "Public can register" ON volunteers FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can read" ON volunteers FOR SELECT USING (true);

-- ============================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can read
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery-images');

-- Storage policy: authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery-images');

-- Storage policy: authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery-images');

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for activities table
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (2018-2019 Activities)
-- ============================================

INSERT INTO activities (title, description, category, date, location, participants, created_by) VALUES
('Swachh Bharat Summer Internship (SBSI)', 'Swachh Bharat Abhiyan is a campaign in India that aims to clean up the streets, roads and infrastructure of India''s cities, smaller towns and urban areas. It is a 100 hour internship plan programme, in which 8 team of volunteers worked for different villages. Villages were adopted and given awareness on Clean India movement, avoiding plastic usage and hygienic sanitation facilities.', 'Special Camps', '2018-08-01', '5 Adopted Villages', 64, 'NSS Admin'),
('Blood Donation Camp', 'Blood camp in association with Management Studies was conducted to help the needy at emergency situations. 110 units of blood were donated. Many students, staff and workers donated blood.', 'Regular Activities', '2018-08-07', 'Indoor Stadium, KEC', 110, 'NSS Admin'),
('Orphanage Visit', 'Special children and mentally retarded children at orphans were visited. Fun activities were conducted motivating the little minds and cultural activities were conducted.', 'Regular Activities', '2018-09-24', 'Kongu Arivalayam, Thindal', 50, 'NSS Admin'),
('NALAM 2K18 - Mega Health Camp', 'Health is wealth. The event aims to promote the welfare of all students, staff, workers, drivers and all beings in and around the college.', 'Regular Activities', '2018-09-25', 'Maharaja Auditorium, KEC', 200, 'NSS Admin'),
('District Youth Parliament', 'Around 11 volunteers from Kongu Engineering College attended DYP conducted by the Central Government of India. The contribution of youth towards society were exposed.', 'Regular Activities', '2019-01-17', 'Kongu Arts and Science College', 11, 'NSS Admin'),
('Republic Day Parade', 'Pre-Republic day parade (26.10.2018 to 04.11.2018) was conducted to select volunteers for republic day parade to honor the dignitaries. A volunteer from Kongu Engineering College was selected for the event. Republic day parade was performed in-front of our honorable Chief Minister Mr.E.Palanisamy.', 'Special Camps', '2019-01-26', 'Chennai, Tamil Nadu', 1, 'NSS Admin'),
('ACHAMILLAI - Self Defense Programme', 'Self-defense for women was educated. Various defense activities, twisters and lecture on defense mechanism was conducted. Handling tough situations by women were illustrated and an awareness programme was provided.', 'Regular Activities', '2019-02-01', 'Maharaja Auditorium, KEC', 150, 'NSS Admin'),
('Voting Awareness Programme', 'An awareness programme on the voting mechanism was conducted. Procedures carried out and the use of voting machine was demonstrated since a new voter should know all about the supreme importance of voting and claim their right. Erode Collector Shri. C. Kathiravan addressed all the NSS volunteers and demonstrated about the election voting.', 'Regular Activities', '2019-02-27', 'C K Prahalad Seminar Hall, MBA Block, KEC', 100, 'NSS Admin'),
('PENNIYAM 2K19 - Women''s Day Celebration', 'A Women needs to realize her self-worth, and once she realizes how strong and beautiful she is, She will not settle for less.', 'Regular Activities', '2019-03-07', 'Kalingarayan Seminar Hall, KEC', 120, 'NSS Admin'),
('Special Camp', 'Special appeal to the youth as it provides unique opportunities to the students for group living, collective experience sharing and constant interaction with community.', 'Special Camps', '2019-03-11', 'Ammapalayam, Chennimalai', 75, 'NSS Admin'),
('PRASIDHI 2K19 - National Level Technical Symposium', 'A National level technical symposium conducted by the NSS volunteers. Technical and non-technical events based on themes like green environment, youth contribution for society were conducted.', 'Regular Activities', '2019-03-22', 'Kalingarayan Seminar Hall, KEC', 180, 'NSS Admin'),
('Campus Cleaning', 'To sustain a healthy environment and maintain a clean surrounding for the institution. Separating bio-degradable and non-bio degradable wastes and disposing them safely. Periodical cleaning of surrounding to maintain cleanliness throughout the year.', 'Regular Activities', '2018-09-01', 'In and Around College Campus', 200, 'NSS Admin'),
('Emergency Blood Donation', 'BE A BLOOD DONOR, BE A HERO…!!! Donating blood at emergency situations and helping the patients. Donors are availed at necessary time and to respective hospitals.', 'Regular Activities', '2018-10-15', 'Nearby Hospitals', 50, 'NSS Admin'),
('Paper Bag Making', 'The motto of the work is to eradicate the use of plastic bags inside the campus. Paper bags are prepared and provided to shops and stores inside the college institution. The use of plastic are controlled to a considerable extent inside the campus.', 'Regular Activities', '2018-11-10', 'KEC Campus', 80, 'NSS Admin')
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE!
-- ============================================
-- Your database is now ready!
-- Next steps:
-- 1. Copy your Supabase URL and anon key
-- 2. Add them to .env.local file
-- 3. Start using Supabase in your app!
