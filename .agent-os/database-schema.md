# Database Schema Documentation

## Overview
ВетПоиск uses Supabase (PostgreSQL) with Row Level Security (RLS) enabled for data protection. The schema supports a multi-tenant veterinary services platform with geolocation, reviews, and appointment booking.

## Core Tables

### cities
Stores Russian cities with geographic coordinates for location-based search.

\`\`\`sql
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Key Features**:
- Contains major Russian cities
- Latitude/longitude for distance calculations
- Used for geolocation-based search

### clinics
Veterinary clinics with comprehensive business information.

\`\`\`sql
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  city_id UUID REFERENCES cities(id),
  working_hours JSONB,
  contact_info JSONB,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Key Features**:
- JSONB fields for flexible working hours and contact info
- Automatic rating calculation via triggers
- Verification status for trusted clinics

### services
Available veterinary services with pricing information.

\`\`\`sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  duration_minutes INTEGER,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### profiles
User profiles extending Supabase auth.users with role-based information.

\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'veterinarian', 'admin')),
  specialization TEXT,
  bio TEXT,
  experience_years INTEGER,
  license_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Key Features**:
- Links to Supabase auth.users
- Role-based access control
- Veterinarian-specific fields (specialization, license)

### pet_owners
Pet owner information for appointment booking.

\`\`\`sql
CREATE TABLE pet_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT,
  emergency_contact TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### pets
Pet information linked to owners.

\`\`\`sql
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  birth_date DATE,
  weight NUMERIC(5,2),
  gender TEXT CHECK (gender IN ('male', 'female')),
  color TEXT,
  owner_id UUID REFERENCES pet_owners(id) ON DELETE CASCADE,
  microchip_number TEXT,
  allergies TEXT,
  medical_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### appointments
Appointment bookings linking pets, owners, clinics, and veterinarians.

\`\`\`sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  veterinarian_id UUID NOT NULL REFERENCES profiles(id),
  service_id UUID REFERENCES services(id),
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'Запланирован' CHECK (status IN ('Запланирован', 'Подтвержден', 'Завершен', 'Отменен')),
  reason TEXT,
  diagnosis TEXT,
  treatment TEXT,
  notes TEXT,
  is_emergency BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  price NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Key Features**:
- Links all entities (clinic, vet, service, pet)
- Status tracking for appointment lifecycle
- Emergency appointment support
- Pricing and treatment information

### reviews
Review system for clinics and veterinarians.

\`\`\`sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  veterinarian_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  pet_owner_id UUID REFERENCES pet_owners(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Key Features**:
- 5-star rating system
- Can review clinics and/or specific veterinarians
- Verification system for authentic reviews
- Helpful vote counting

## Relationship Tables

### clinic_veterinarians
Many-to-many relationship between clinics and veterinarians.

\`\`\`sql
CREATE TABLE clinic_veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  veterinarian_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id, veterinarian_id)
);
\`\`\`

### clinic_services
Many-to-many relationship between clinics and services.

\`\`\`sql
CREATE TABLE clinic_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  price NUMERIC(10,2),
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id, service_id)
);
\`\`\`

## Indexes

### Performance Indexes
\`\`\`sql
-- Geolocation search
CREATE INDEX idx_cities_location ON cities(latitude, longitude);

-- Clinic search
CREATE INDEX idx_clinics_city ON clinics(city_id);
CREATE INDEX idx_clinics_active ON clinics(is_active);
CREATE INDEX idx_clinics_rating ON clinics(rating DESC);

-- Appointment queries
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_clinic ON appointments(clinic_id);
CREATE INDEX idx_appointments_vet ON appointments(veterinarian_id);

-- Review queries
CREATE INDEX idx_reviews_clinic ON reviews(clinic_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
\`\`\`

## Triggers & Functions

### Rating Update Trigger
Automatically updates clinic ratings when reviews are added/updated.

\`\`\`sql
CREATE OR REPLACE FUNCTION update_clinic_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clinics 
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2) 
      FROM reviews 
      WHERE clinic_id = COALESCE(NEW.clinic_id, OLD.clinic_id)
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE clinic_id = COALESCE(NEW.clinic_id, OLD.clinic_id)
    )
  WHERE id = COALESCE(NEW.clinic_id, OLD.clinic_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clinic_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_clinic_rating();
\`\`\`

## Row Level Security (RLS)

### Public Read Access
\`\`\`sql
-- Allow public read access to active clinics
CREATE POLICY "Public clinics are viewable by everyone" 
ON clinics FOR SELECT 
USING (is_active = true);

-- Allow public read access to services
CREATE POLICY "Services are viewable by everyone" 
ON services FOR SELECT 
USING (is_active = true);

-- Allow public read access to reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON reviews FOR SELECT 
USING (true);
\`\`\`

### User-specific Access
\`\`\`sql
-- Users can manage their own profiles
CREATE POLICY "Users can view and update own profile" 
ON profiles FOR ALL 
USING (auth.uid() = id);

-- Pet owners can manage their own data
CREATE POLICY "Pet owners can manage own pets" 
ON pets FOR ALL 
USING (owner_id IN (
  SELECT id FROM pet_owners 
  WHERE email = auth.jwt() ->> 'email'
));
\`\`\`

## Data Validation

### Constraints
- Phone numbers: Russian format validation
- Email addresses: Standard email format
- Ratings: 1-5 scale enforcement
- Appointment times: Business hours validation
- Geographic coordinates: Valid latitude/longitude ranges

### Business Rules
- Veterinarians must have valid license numbers
- Appointments cannot be double-booked
- Reviews require completed appointments
- Clinic verification requires document upload
- Emergency appointments bypass normal scheduling rules

## Migration Strategy

### Version Control
- All schema changes tracked in `/scripts` folder
- Sequential numbering: `001_initial_schema.sql`, `002_add_reviews.sql`
- Rollback scripts for major changes
- Test data included in migration scripts

### Deployment Process
1. Test migration on staging database
2. Backup production database
3. Apply migration during low-traffic period
4. Verify data integrity post-migration
5. Monitor performance for 24 hours
