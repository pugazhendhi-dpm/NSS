-- Add geolocation fields to blood_donors table
-- This enables location-based donor search

-- Add new columns
ALTER TABLE blood_donors 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
ADD COLUMN IF NOT EXISTS geocoded_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS geocode_source VARCHAR(50) DEFAULT 'nominatim';

-- Add comment to columns
COMMENT ON COLUMN blood_donors.latitude IS 'Latitude coordinate from geocoding donor address';
COMMENT ON COLUMN blood_donors.longitude IS 'Longitude coordinate from geocoding donor address';
COMMENT ON COLUMN blood_donors.geocoded_at IS 'Timestamp when address was geocoded';
COMMENT ON COLUMN blood_donors.geocode_source IS 'Source of geocoding (nominatim, manual, etc)';

-- Create index for faster location-based queries
CREATE INDEX IF NOT EXISTS idx_blood_donors_location 
ON blood_donors(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create index for geocoding status
CREATE INDEX IF NOT EXISTS idx_blood_donors_geocoded 
ON blood_donors(geocoded_at) 
WHERE geocoded_at IS NOT NULL;

-- Add constraint to ensure both lat/lon are set together or both null
ALTER TABLE blood_donors 
ADD CONSTRAINT check_coordinates_together 
CHECK (
    (latitude IS NULL AND longitude IS NULL) OR 
    (latitude IS NOT NULL AND longitude IS NOT NULL)
);

-- Add constraint for valid latitude range (-90 to 90)
ALTER TABLE blood_donors 
ADD CONSTRAINT check_latitude_range 
CHECK (latitude >= -90 AND latitude <= 90);

-- Add constraint for valid longitude range (-180 to 180)
ALTER TABLE blood_donors 
ADD CONSTRAINT check_longitude_range 
CHECK (longitude >= -180 AND longitude <= 180);

-- Create a view for donors with location data
-- Only includes essential columns that exist in blood_donors table
CREATE OR REPLACE VIEW blood_donors_with_location AS
SELECT 
    id,
    name,
    email,
    roll_number,
    blood_group,
    phone,
    district,
    hometown,
    latitude,
    longitude,
    geocoded_at,
    is_available
FROM blood_donors
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Create a function to calculate distance between two points (Haversine formula)
-- This can be used in SQL queries for server-side filtering
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    R CONSTANT DECIMAL := 6371; -- Earth's radius in km
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dLat := RADIANS(lat2 - lat1);
    dLon := RADIANS(lon2 - lon1);
    
    a := SIN(dLat/2) * SIN(dLat/2) + 
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
         SIN(dLon/2) * SIN(dLon/2);
    
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    
    RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create a function to find donors within radius
-- Usage: SELECT * FROM find_donors_in_radius(13.0827, 80.2707, 20, 'O Positive (O+)')
CREATE OR REPLACE FUNCTION find_donors_in_radius(
    center_lat DECIMAL,
    center_lon DECIMAL,
    radius_km DECIMAL,
    blood_group_filter TEXT DEFAULT NULL
) RETURNS TABLE (
    id UUID,
    name TEXT,
    blood_group TEXT,
    phone TEXT,
    district TEXT,
    hometown TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bd.id,
        bd.name,
        bd.blood_group,
        bd.phone,
        bd.district,
        bd.hometown,
        bd.latitude,
        bd.longitude,
        calculate_distance(center_lat, center_lon, bd.latitude, bd.longitude) as distance_km
    FROM blood_donors bd
    WHERE 
        bd.latitude IS NOT NULL 
        AND bd.longitude IS NOT NULL
        AND calculate_distance(center_lat, center_lon, bd.latitude, bd.longitude) <= radius_km
        AND (blood_group_filter IS NULL OR bd.blood_group = blood_group_filter)
        AND bd.is_available = true
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust based on your RLS policies)
-- These allow authenticated users to read location data
ALTER TABLE blood_donors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read location data" ON blood_donors;
DROP POLICY IF EXISTS "Allow authenticated users to update location data" ON blood_donors;

-- Policy to allow reading location data
CREATE POLICY "Allow authenticated users to read location data"
ON blood_donors
FOR SELECT
USING (true);

-- Policy to allow updating location data (for geocoding)
CREATE POLICY "Allow authenticated users to update location data"
ON blood_donors
FOR UPDATE
USING (true)
WITH CHECK (true);
