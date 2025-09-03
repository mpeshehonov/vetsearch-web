-- Добавляем таблицы для городов и клиник для трансформации в платформу поиска
-- Создание таблицы городов
CREATE TABLE IF NOT EXISTS cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  country TEXT DEFAULT 'Россия',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  timezone TEXT DEFAULT 'Europe/Moscow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы клиник
CREATE TABLE IF NOT EXISTS clinics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city_id UUID REFERENCES cities(id),
  phone TEXT,
  email TEXT,
  website TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  working_hours JSONB DEFAULT '{}',
  services_offered TEXT[],
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Обновление таблицы profiles для связи с клиниками
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;

-- Создание таблицы отзывов
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_id UUID REFERENCES clinics(id),
  veterinarian_id UUID REFERENCES profiles(id),
  patient_name TEXT NOT NULL,
  patient_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Вставка основных городов России
INSERT INTO cities (name, region, latitude, longitude) VALUES
('Москва', 'Москва', 55.7558, 37.6176),
('Санкт-Петербург', 'Ленинградская область', 59.9311, 30.3609),
('Новосибирск', 'Новосибирская область', 55.0084, 82.9357),
('Екатеринбург', 'Свердловская область', 56.8431, 60.6454),
('Казань', 'Республика Татарстан', 55.8304, 49.0661),
('Нижний Новгород', 'Нижегородская область', 56.2965, 43.9361),
('Челябинск', 'Челябинская область', 55.1644, 61.4368),
('Самара', 'Самарская область', 53.2001, 50.15),
('Омск', 'Омская область', 54.9885, 73.3242),
('Ростов-на-Дону', 'Ростовская область', 47.2357, 39.7015);

-- Создание индексов для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_clinics_city_id ON clinics(city_id);
CREATE INDEX IF NOT EXISTS idx_clinics_rating ON clinics(rating DESC);
CREATE INDEX IF NOT EXISTS idx_clinics_location ON clinics(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_profiles_clinic_id ON profiles(clinic_id);
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON profiles(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_id ON reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_veterinarian_id ON reviews(veterinarian_id);

-- Настройка RLS для новых таблиц
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Политики для городов (публичное чтение)
CREATE POLICY "Cities are viewable by everyone" ON cities FOR SELECT USING (true);

-- Политики для клиник (публичное чтение активных клиник)
CREATE POLICY "Active clinics are viewable by everyone" ON clinics 
  FOR SELECT USING (is_active = true);

-- Политики для отзывов (публичное чтение опубликованных отзывов)
CREATE POLICY "Published reviews are viewable by everyone" ON reviews 
  FOR SELECT USING (is_published = true);

-- Создание функции для обновления рейтинга клиник
CREATE OR REPLACE FUNCTION update_clinic_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE clinics 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE clinic_id = COALESCE(NEW.clinic_id, OLD.clinic_id) 
        AND is_published = true
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE clinic_id = COALESCE(NEW.clinic_id, OLD.clinic_id) 
        AND is_published = true
    )
  WHERE id = COALESCE(NEW.clinic_id, OLD.clinic_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Создание функции для обновления рейтинга ветеринаров
CREATE OR REPLACE FUNCTION update_veterinarian_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM reviews 
      WHERE veterinarian_id = COALESCE(NEW.veterinarian_id, OLD.veterinarian_id) 
        AND is_published = true
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE veterinarian_id = COALESCE(NEW.veterinarian_id, OLD.veterinarian_id) 
        AND is_published = true
    )
  WHERE id = COALESCE(NEW.veterinarian_id, OLD.veterinarian_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Создание триггеров для автоматического обновления рейтингов
CREATE TRIGGER update_clinic_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  WHEN (NEW.clinic_id IS NOT NULL OR OLD.clinic_id IS NOT NULL)
  EXECUTE FUNCTION update_clinic_rating();

CREATE TRIGGER update_veterinarian_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  WHEN (NEW.veterinarian_id IS NOT NULL OR OLD.veterinarian_id IS NOT NULL)
  EXECUTE FUNCTION update_veterinarian_rating();
