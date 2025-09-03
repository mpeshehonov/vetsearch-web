-- Fix RLS policies to prevent infinite recursion
-- Allow public read access to veterinarian profiles for search functionality

-- Create a policy for public read access to veterinarian profiles
DROP POLICY IF EXISTS "Allow public read access to veterinarian profiles" ON profiles;
CREATE POLICY "Allow public read access to veterinarian profiles" 
ON profiles FOR SELECT 
USING (role = 'veterinarian' AND is_active = true);

-- Ensure other policies don't conflict
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow authenticated users to update their own profiles
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow authenticated users to insert their own profiles
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to delete their own profiles
DROP POLICY IF EXISTS "profiles_delete_own" ON profiles;
CREATE POLICY "profiles_delete_own"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- Allow public read access to clinics for search
DROP POLICY IF EXISTS "Allow public read access to active clinics" ON clinics;
CREATE POLICY "Allow public read access to active clinics"
ON clinics FOR SELECT
USING (is_active = true);

-- Allow public read access to clinic_veterinarians for search
DROP POLICY IF EXISTS "Allow public read access to clinic_veterinarians" ON clinic_veterinarians;
CREATE POLICY "Allow public read access to clinic_veterinarians"
ON clinic_veterinarians FOR SELECT
USING (true);

-- Allow public read access to cities
DROP POLICY IF EXISTS "Allow public read access to cities" ON cities;
CREATE POLICY "Allow public read access to cities"
ON cities FOR SELECT
USING (true);

-- Allow public read access to services
DROP POLICY IF EXISTS "Allow public read access to services" ON services;
CREATE POLICY "Allow public read access to services"
ON services FOR SELECT
USING (is_active = true);

-- Allow public read access to reviews
DROP POLICY IF EXISTS "Allow public read access to reviews" ON reviews;
CREATE POLICY "Allow public read access to reviews"
ON reviews FOR SELECT
USING (true);
