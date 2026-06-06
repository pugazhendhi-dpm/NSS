# Geolocation Setup Instructions

## 🚀 Quick Start

### Step 1: Run Database Migration

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard: https://app.supabase.com
   - Navigate to: **SQL Editor** (in the left sidebar)

2. **Run the Geolocation Schema**
   - Open the file: `lib/supabase/geolocation_schema.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click **Run** button

3. **Verify Columns Added**
   - Go to **Table Editor** in Supabase
   - Open the `blood_donors` table
   - You should see new columns: `latitude`, `longitude`, `geocoded_at`, `geocode_source`

### Step 2: Geocode Existing Donors

The system will automatically geocode donor addresses when they register. For existing donors without coordinates, you have two options:

#### Option A: Automatic Batch Geocoding (Recommended)
Run this in your browser console on the blood donors page:

```javascript
// This will geocode all donors without coordinates
// Note: Takes ~1 second per donor due to rate limiting
await geocodeAllDonors()
```

#### Option B: Manual Geocoding
For specific donors, you can manually set coordinates:

```sql
UPDATE blood_donors 
SET 
  latitude = 13.0827,
  longitude = 80.2707,
  geocoded_at = NOW(),
  geocode_source = 'manual'
WHERE id = 'donor-id-here';
```

### Step 3: Test Emergency Search

1. **Access Emergency Search**
   - Go to: `http://localhost:3000/dashboard/blood-donors`
   - Click the "🚨 Emergency Search" button

2. **Search for Donors**
   - Enter emergency location (e.g., "Adyar, Chennai")
   - Select blood group (e.g., "O Positive (O+)")
   - Adjust radius (default: 20km)
   - Click "Find Donors"

3. **View Results**
   - See donors sorted by distance
   - Click "Call" to initiate phone call
   - Click "Directions" to get Google Maps route

## 📊 Features Implemented

### Database Layer
- ✅ `latitude` and `longitude` columns
- ✅ `geocoded_at` timestamp tracking
- ✅ `geocode_source` field (nominatim, manual, etc.)
- ✅ Indexes for fast location queries
- ✅ Constraints for valid coordinates
- ✅ `calculate_distance()` SQL function (Haversine)
- ✅ `find_donors_in_radius()` SQL function
- ✅ `blood_donors_with_location` view

### Geocoding Service
- ✅ OpenStreetMap Nominatim integration (free, no API key)
- ✅ Rate limiting (1 request/second)
- ✅ Address to coordinates conversion
- ✅ Reverse geocoding (coordinates to address)
- ✅ Haversine distance calculation
- ✅ Proximity filtering
- ✅ Batch geocoding support

### Emergency Search UI
- ✅ Location input with autocomplete
- ✅ Blood group filter
- ✅ Adjustable radius (5-50km)
- ✅ Real-time search
- ✅ Results sorted by distance
- ✅ Distance display (km/meters)
- ✅ Call button (tel: link)
- ✅ Get Directions button (Google Maps)
- ✅ Donor status indicators
- ✅ Responsive design

## 🗺️ How It Works

### 1. Geocoding Process
```
User enters address → Nominatim API → Coordinates (lat/lon) → Stored in database
```

### 2. Emergency Search Process
```
Emergency location → Geocode → Get coordinates → 
Filter donors by blood group → Calculate distances → 
Filter by radius → Sort by distance → Display results
```

### 3. Distance Calculation (Haversine Formula)
```
Takes two points (lat1, lon1) and (lat2, lon2) →
Accounts for Earth's curvature →
Returns accurate distance in kilometers
```

## 📍 Geocoding Details

### Free Service Used
- **Provider**: OpenStreetMap Nominatim
- **Cost**: 100% Free
- **API Key**: Not required
- **Rate Limit**: 1 request per second
- **Accuracy**: Very good for Indian addresses

### Address Format
For best results, addresses are formatted as:
```
{hometown}, {district}, Tamil Nadu, India
```

Example: "Adyar, Chennai, Tamil Nadu, India"

### Geocoding Sources
- `nominatim` - Automatic geocoding via OpenStreetMap
- `manual` - Manually entered coordinates
- `google` - If you later integrate Google Maps API

## 🔍 SQL Functions Available

### Calculate Distance
```sql
SELECT calculate_distance(13.0827, 80.2707, 13.0878, 80.2785) as distance_km;
-- Returns: 0.8 (km)
```

### Find Donors in Radius
```sql
SELECT * FROM find_donors_in_radius(
  13.0827,  -- center latitude
  80.2707,  -- center longitude
  20,       -- radius in km
  'O Positive (O+)'  -- blood group (optional)
);
```

## 🎯 Usage Examples

### Search for O+ donors within 20km of Adyar
1. Enter location: "Adyar, Chennai"
2. Select blood group: "O Positive (O+)"
3. Set radius: 20 km
4. Click "Find Donors"

### Search for AB- donors within 50km of Coimbatore
1. Enter location: "Coimbatore"
2. Select blood group: "AB Negative (AB-)"
3. Set radius: 50 km
4. Click "Find Donors"

## 🚧 Limitations & Solutions

| Limitation | Solution |
|------------|----------|
| Rate limit: 1 req/sec | Batch geocode during off-peak hours |
| Requires internet | Coordinates cached in database |
| Geocoding accuracy varies | Store multiple address formats |
| Some addresses may not geocode | Manual coordinate entry option |

## 🐛 Troubleshooting

### Issue: "Could not find the location"
**Solution**: 
- Try adding more context (e.g., "near Anna Nagar, Chennai")
- Use well-known landmarks
- Include district name
- Try different address formats

### Issue: No donors found
**Solution**:
- Increase search radius
- Check if donors have been geocoded
- Verify blood group spelling matches exactly
- Ensure donors have `is_available = true`

### Issue: Slow geocoding
**Solution**:
- This is normal due to 1 req/sec rate limit
- Geocode during off-peak hours
- Coordinates are cached, only need to geocode once

### Issue: Inaccurate distances
**Solution**:
- Verify donor coordinates are correct
- Check if donor address was geocoded properly
- Re-geocode if address has changed

## 📝 Database Schema Reference

```sql
blood_donors (
  ...existing columns...
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geocoded_at TIMESTAMP,
  geocode_source VARCHAR(50)
)
```

### Indexes
- `idx_blood_donors_location` - For fast location queries
- `idx_blood_donors_geocoded` - For tracking geocoding status

### Constraints
- `check_coordinates_together` - Both lat/lon or both null
- `check_latitude_range` - Latitude between -90 and 90
- `check_longitude_range` - Longitude between -180 and 180

## ✅ Verification Checklist

- [ ] SQL migration ran successfully in Supabase
- [ ] New columns exist in `blood_donors` table
- [ ] Indexes created successfully
- [ ] SQL functions `calculate_distance` and `find_donors_in_radius` exist
- [ ] Can access emergency search on blood donors page
- [ ] Can search for donors by location
- [ ] Results show distance from emergency location
- [ ] Call and Directions buttons work
- [ ] Geocoding respects rate limit (1 req/sec)

## 🎉 Next Steps

### Phase 2: Interactive Map (Coming Soon)
- Visual map showing donor locations
- Color-coded markers by blood group
- Radius circle overlay
- Click markers for donor info
- Real-time map updates

### Phase 3: Advanced Features (Future)
- Current location detection (GPS)
- Saved search locations
- Emergency contact list
- SMS notifications to nearby donors
- Route optimization for multiple donors
