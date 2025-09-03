-- Functions for featured vets and clinics with proper avg_rating calculation and sorting

-- Function to get featured vets
CREATE OR REPLACE FUNCTION get_featured_vets()
RETURNS TABLE (
  id TEXT,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  avg_rating NUMERIC,
  review_count BIGINT,
  clinic_name TEXT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    sub.id,
    sub.email,
    sub.name,
    sub.avatar_url,
    sub.role,
    sub.created_at,
    sub.updated_at,
    sub.avg_rating,
    sub.review_count::BIGINT,
    c.name AS clinic_name
  FROM (
    SELECT
      p.id,
      p.email,
      p.name,
      p.avatar_url,
      p.role,
      p.created_at,
      p.updated_at,
      CASE
        WHEN COUNT(r.id) > 0 THEN AVG(r.rating)::NUMERIC
        ELSE NULL
      END AS avg_rating,
      COUNT(DISTINCT r.id) AS review_count
    FROM profiles p
    LEFT JOIN reviews r ON r.doctor_id = p.id
    WHERE p.role = 'veterinarian'
    GROUP BY p.id, p.email, p.name, p.avatar_url, p.role, p.created_at, p.updated_at
  ) sub
  LEFT JOIN clinic_veterinarians cv ON cv.veterinarian_id = sub.id
  LEFT JOIN clinics c ON c.id = cv.clinic_id
  ORDER BY sub.avg_rating DESC NULLS LAST
  LIMIT 10;
$$;

-- Function to get featured clinics
CREATE OR REPLACE FUNCTION get_featured_clinics()
RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  city_id TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  working_hours JSONB,
  rating DOUBLE PRECISION,
  reviews_count BIGINT,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  avg_rating NUMERIC,
  review_count BIGINT,
  vets_count BIGINT,
  services_count BIGINT,
  avg_price NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT
    sub.id,
    sub.name,
    sub.description,
    sub.address,
    sub.phone,
    sub.email,
    sub.website,
    sub.city_id,
    sub.latitude,
    sub.longitude,
    sub.working_hours,
    sub.rating,
    sub.reviews_count,
    sub.is_active,
    sub.created_at,
    sub.updated_at,
    sub.avg_rating,
    sub.review_count::BIGINT,
    sub.vets_count::BIGINT,
    sub.services_count::BIGINT,
    sub.avg_price
  FROM (
    SELECT
      c.id,
      c.name,
      c.description,
      c.address,
      c.phone,
      c.email,
      c.website,
      c.city_id,
      c.latitude,
      c.longitude,
      c.working_hours,
      c.rating,
      c.reviews_count,
      c.is_active,
      c.created_at,
      c.updated_at,
      CASE
        WHEN COUNT(r.id) > 0 THEN AVG(r.rating)::NUMERIC
        ELSE NULL
      END AS avg_rating,
      COUNT(DISTINCT r.id) AS review_count,
      COUNT(DISTINCT cv.veterinarian_id) AS vets_count,
      COUNT(DISTINCT cs.service_id) AS services_count,
      CASE
        WHEN COUNT(s.price) > 0 THEN AVG(s.price)::NUMERIC
        ELSE NULL
      END AS avg_price
    FROM clinics c
    LEFT JOIN reviews r ON r.clinic_id = c.id
    LEFT JOIN clinic_veterinarians cv ON cv.clinic_id = c.id
    LEFT JOIN clinic_services cs ON cs.clinic_id = c.id
    LEFT JOIN services s ON s.id = cs.service_id
    WHERE c.is_active = true
    GROUP BY c.id, c.name, c.description, c.address, c.phone, c.email, c.website, c.city_id, c.latitude, c.longitude, c.working_hours, c.rating, c.reviews_count, c.is_active, c.created_at, c.updated_at
  ) sub
  ORDER BY sub.avg_rating DESC NULLS LAST
  LIMIT 10;
$$;