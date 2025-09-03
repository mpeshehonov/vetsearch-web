-- Создание недостающих таблиц для платформы поиска ветеринарных клиник

-- Таблица городов
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    region TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, region)
);

-- Таблица клиник
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    website TEXT,
    city_id UUID REFERENCES cities(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    working_hours JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица отзывов
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id),
    veterinarian_id UUID REFERENCES profiles(id),
    author_name TEXT NOT NULL,
    author_email TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Связь ветеринаров с клиниками
CREATE TABLE IF NOT EXISTS clinic_veterinarians (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id),
    veterinarian_id UUID REFERENCES profiles(id),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(clinic_id, veterinarian_id)
);

-- Связь услуг с клиниками
CREATE TABLE IF NOT EXISTS clinic_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clinic_id UUID REFERENCES clinics(id),
    service_id UUID REFERENCES services(id),
    price DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(clinic_id, service_id)
);

-- Индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_clinics_city_id ON clinics(city_id);
CREATE INDEX IF NOT EXISTS idx_clinics_rating ON clinics(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_id ON reviews(clinic_id);
CREATE INDEX IF NOT EXISTS idx_reviews_veterinarian_id ON reviews(veterinarian_id);
CREATE INDEX IF NOT EXISTS idx_clinic_veterinarians_clinic_id ON clinic_veterinarians(clinic_id);
CREATE INDEX IF NOT EXISTS idx_clinic_services_clinic_id ON clinic_services(clinic_id);

-- Функция для обновления рейтинга клиники
CREATE OR REPLACE FUNCTION update_clinic_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE clinics 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating::DECIMAL), 0)
            FROM reviews 
            WHERE clinic_id = COALESCE(NEW.clinic_id, OLD.clinic_id)
        ),
        reviews_count = (
            SELECT COUNT(*)
            FROM reviews 
            WHERE clinic_id = COALESCE(NEW.clinic_id, OLD.clinic_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.clinic_id, OLD.clinic_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления рейтинга
DROP TRIGGER IF EXISTS trigger_update_clinic_rating_insert ON reviews;
CREATE TRIGGER trigger_update_clinic_rating_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_clinic_rating();

DROP TRIGGER IF EXISTS trigger_update_clinic_rating_update ON reviews;
CREATE TRIGGER trigger_update_clinic_rating_update
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_clinic_rating();

DROP TRIGGER IF EXISTS trigger_update_clinic_rating_delete ON reviews;
CREATE TRIGGER trigger_update_clinic_rating_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_clinic_rating();

-- Вставка тестовых городов
INSERT INTO cities (name, region, latitude, longitude) VALUES
('Москва', 'Московская область', 55.7558, 37.6176),
('Санкт-Петербург', 'Ленинградская область', 59.9311, 30.3609),
('Новосибирск', 'Новосибирская область', 55.0084, 82.9357),
('Екатеринбург', 'Свердловская область', 56.8431, 60.6454),
('Казань', 'Республика Татарстан', 55.8304, 49.0661)
ON CONFLICT (name, region) DO NOTHING;

-- Вставка тестовых клиник
INSERT INTO clinics (name, description, address, phone, email, city_id, working_hours, rating, reviews_count) VALUES
(
    'ВетПоиск "Доброе сердце"',
    'Современная ветеринарная клиника с полным спектром услуг для ваших питомцев',
    'ул. Пушкина, д. 15',
    '+7 (495) 123-45-67',
    'info@dobroe-serdce.ru',
    (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1),
    '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}',
    4.8,
    127
),
(
    'Ветеринарный центр "Здоровье+"',
    'Круглосуточная ветеринарная помощь с современным оборудованием',
    'пр. Невский, д. 88',
    '+7 (812) 987-65-43',
    'contact@zdorovie-plus.ru',
    (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1),
    '{"monday": "00:00-23:59", "tuesday": "00:00-23:59", "wednesday": "00:00-23:59", "thursday": "00:00-23:59", "friday": "00:00-23:59", "saturday": "00:00-23:59", "sunday": "00:00-23:59"}',
    4.6,
    89
)
ON CONFLICT DO NOTHING;
