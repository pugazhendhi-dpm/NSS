# NSS KEC — National Service Scheme, Kongu Engineering College

**Motto: Not Me But You**

Official web platform for the NSS unit of Kongu Engineering College (KEC), Erode.

---

## Features

- **Public Website** — Home, About, Activities, Gallery, Resources pages
- **Blood Donor Registration** — Students can self-register as blood donors
- **Volunteer Registration** — Students can apply to join NSS
- **Admin Dashboard** — Manage donors, volunteers, attendance, campaigns, gallery, statistics
- **Role-Based Access** — Admin & Super Senior roles with different permissions
- **Blood Donor Map** — Geocoded donor locations using OpenStreetMap

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (gallery images)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/pugazhendhi-dpm/NSS.git
cd NSS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database
Run the SQL files in the Supabase SQL editor in this order:
1. `lib/supabase/schema.sql` — Main tables
2. `lib/supabase/attendance_schema.sql` — Attendance feature
3. `lib/supabase/campaigns_schema.sql` — Campaigns feature
4. `lib/supabase/geolocation_schema.sql` — Donor map feature
5. `lib/supabase/migration_blood_donors_extended.sql` — Extended donor fields

### 5. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Dashboard Access

| Role | Email | Password |
|---|---|---|
| Administrator | `nsskec@kongu.edu` | `pugazh` |
| Super Senior | `supersenior@kongu.edu` | `nss` |

> To add more admins or super seniors, update `lib/mockData.ts`.

## Project Structure

```
app/           — Next.js pages (public + dashboard)
components/    — Reusable UI components
lib/           — Business logic, services, Supabase client
public/        — Static assets (images, documents)
```

## Production Build

```bash
npm run build
npm start
```