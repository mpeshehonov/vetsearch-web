-- Создание представлений для поиска и заполнение тестовыми данными

-- Создание представления для поиска клиник
CREATE OR REPLACE VIEW clinic_search_view AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.address,
    c.phone,
    c.email,
    c.website,
    c.rating,
    c.reviews_count,
    c.latitude,
    c.longitude,
    c.working_hours,
    c.is_active,
    cities.name as city_name,
    cities.region,
    -- Агрегированная информация о ветеринарах
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', p.id,
                'full_name', p.full_name,
                'specialization', p.specialization,
                'is_primary', cv.is_primary
            )
        ) FILTER (WHERE p.id IS NOT NULL), 
        '[]'::json
    ) as veterinarians,
    -- Агрегированная информация об услугах
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', s.id,
                'name', s.name,
                'category', s.category,
                'price', cs.price,
                'duration_minutes', s.duration_minutes
            )
        ) FILTER (WHERE s.id IS NOT NULL), 
        '[]'::json
    ) as services
FROM clinics c
LEFT JOIN cities ON c.city_id = cities.id
LEFT JOIN clinic_veterinarians cv ON c.id = cv.clinic_id
LEFT JOIN profiles p ON cv.veterinarian_id = p.id AND p.role IN ('veterinarian', 'admin')
LEFT JOIN clinic_services cs ON c.id = cs.clinic_id AND cs.is_available = true
LEFT JOIN services s ON cs.service_id = s.id AND s.is_active = true
WHERE c.is_active = true
GROUP BY c.id, cities.name, cities.region;

-- Создание представления для поиска ветеринаров
CREATE OR REPLACE VIEW veterinarian_search_view AS
SELECT 
    p.id,
    p.full_name,
    p.specialization,
    p.phone,
    p.email,
    p.license_number,
    p.is_active,
    -- Информация о клиниках где работает
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'address', c.address,
                'city_name', cities.name,
                'rating', c.rating,
                'is_primary', cv.is_primary
            )
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'::json
    ) as clinics,
    -- Средний рейтинг по отзывам
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as reviews_count
FROM profiles p
LEFT JOIN clinic_veterinarians cv ON p.id = cv.veterinarian_id
LEFT JOIN clinics c ON cv.clinic_id = c.id AND c.is_active = true
LEFT JOIN cities ON c.city_id = cities.id
LEFT JOIN reviews r ON p.id = r.veterinarian_id
WHERE p.role IN ('veterinarian', 'admin') AND p.is_active = true
GROUP BY p.id;

-- Заполнение таблицы услуг
INSERT INTO services (id, name, description, category, price, duration_minutes, is_active) VALUES
(gen_random_uuid(), 'Первичный осмотр', 'Комплексный осмотр животного с консультацией', 'Консультации', 1500, 30, true),
(gen_random_uuid(), 'Повторный осмотр', 'Контрольный осмотр после лечения', 'Консультации', 1000, 20, true),
(gen_random_uuid(), 'Вакцинация комплексная', 'Комплексная вакцинация от основных заболеваний', 'Профилактика', 2500, 15, true),
(gen_random_uuid(), 'Вакцинация от бешенства', 'Обязательная вакцинация от бешенства', 'Профилактика', 800, 10, true),
(gen_random_uuid(), 'Стерилизация кошки', 'Плановая стерилизация кошки', 'Хирургия', 8000, 60, true),
(gen_random_uuid(), 'Кастрация кота', 'Плановая кастрация кота', 'Хирургия', 5000, 30, true),
(gen_random_uuid(), 'Стерилизация собаки', 'Плановая стерилизация собаки', 'Хирургия', 12000, 90, true),
(gen_random_uuid(), 'Кастрация собаки', 'Плановая кастрация собаки', 'Хирургия', 8000, 60, true),
(gen_random_uuid(), 'УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 'Диагностика', 2000, 30, true),
(gen_random_uuid(), 'Рентген', 'Рентгенологическое исследование', 'Диагностика', 1800, 20, true),
(gen_random_uuid(), 'Анализ крови общий', 'Общий клинический анализ крови', 'Лабораторные исследования', 1200, 15, true),
(gen_random_uuid(), 'Анализ крови биохимический', 'Биохимический анализ крови', 'Лабораторные исследования', 2200, 15, true),
(gen_random_uuid(), 'Чистка зубов', 'Профессиональная чистка зубов под наркозом', 'Стоматология', 6000, 45, true),
(gen_random_uuid(), 'Удаление зуба', 'Удаление больного зуба', 'Стоматология', 3000, 30, true),
(gen_random_uuid(), 'Груминг полный', 'Полный комплекс груминга', 'Груминг', 4000, 120, true),
(gen_random_uuid(), 'Стрижка когтей', 'Подрезание когтей', 'Груминг', 500, 10, true),
(gen_random_uuid(), 'Чипирование', 'Установка микрочипа для идентификации', 'Профилактика', 1500, 15, true),
(gen_random_uuid(), 'Обработка от паразитов', 'Комплексная обработка от блох и клещей', 'Профилактика', 800, 10, true),
(gen_random_uuid(), 'Вызов на дом', 'Выезд ветеринара на дом', 'Консультации', 3000, 60, true),
(gen_random_uuid(), 'Экстренная помощь', 'Неотложная ветеринарная помощь', 'Неотложная помощь', 5000, 45, true)
ON CONFLICT (id) DO NOTHING;

-- Создание тестовых клиник
WITH city_ids AS (
    SELECT id, name FROM cities WHERE name IN ('Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону')
)
INSERT INTO clinics (id, name, description, address, phone, email, website, city_id, latitude, longitude, working_hours, rating, reviews_count, is_active) 
SELECT 
    gen_random_uuid(),
    clinic_data.name,
    clinic_data.description,
    clinic_data.address,
    clinic_data.phone,
    clinic_data.email,
    clinic_data.website,
    city_ids.id,
    clinic_data.latitude,
    clinic_data.longitude,
    clinic_data.working_hours,
    clinic_data.rating,
    clinic_data.reviews_count,
    true
FROM city_ids
CROSS JOIN (
    VALUES 
    ('ВетКлиника "Доктор Айболит"', 'Современная ветеринарная клиника с полным спектром услуг', 'ул. Ветеринарная, 15', '+7 (495) 123-45-67', 'info@aibolit-vet.ru', 'https://aibolit-vet.ru', 55.7558, 37.6176, '{"пн-пт": "08:00-20:00", "сб": "09:00-18:00", "вс": "10:00-16:00"}', 4.8, 156),
    ('Ветеринарный центр "Зоомир"', 'Круглосуточная ветеринарная помощь', 'пр. Мира, 42', '+7 (495) 234-56-78', 'contact@zoomir.ru', 'https://zoomir.ru', 55.7887, 37.6343, '{"пн-вс": "00:00-23:59"}', 4.6, 203),
    ('Клиника "Четыре лапы"', 'Специализируемся на лечении собак и кошек', 'ул. Собачья, 8', '+7 (495) 345-67-89', 'info@4lapy.ru', 'https://4lapy.ru', 55.7308, 37.6267, '{"пн-пт": "09:00-19:00", "сб-вс": "10:00-17:00"}', 4.7, 89),
    ('ВетЦентр "Здоровье животных"', 'Комплексная диагностика и лечение', 'ул. Здоровья, 23', '+7 (495) 456-78-90', 'clinic@zdorovie-animal.ru', 'https://zdorovie-animal.ru', 55.7423, 37.6156, '{"пн-пт": "08:30-20:30", "сб": "09:00-18:00", "вс": "выходной"}', 4.5, 134)
) AS clinic_data(name, description, address, phone, email, website, latitude, longitude, working_hours, rating, reviews_count)
ON CONFLICT (id) DO NOTHING;

-- Создание профилей ветеринаров
INSERT INTO profiles (id, full_name, email, phone, role, specialization, license_number, is_active) VALUES
(gen_random_uuid(), 'Иванова Елена Сергеевна', 'ivanova@aibolit-vet.ru', '+7 (495) 123-45-67', 'veterinarian', 'Терапевт', 'ВЕТ-12345', true),
(gen_random_uuid(), 'Петров Михаил Александрович', 'petrov@aibolit-vet.ru', '+7 (495) 123-45-68', 'veterinarian', 'Хирург', 'ВЕТ-12346', true),
(gen_random_uuid(), 'Сидорова Анна Викторовна', 'sidorova@zoomir.ru', '+7 (495) 234-56-78', 'veterinarian', 'Дерматолог', 'ВЕТ-12347', true),
(gen_random_uuid(), 'Козлов Дмитрий Иванович', 'kozlov@zoomir.ru', '+7 (495) 234-56-79', 'veterinarian', 'Кардиолог', 'ВЕТ-12348', true),
(gen_random_uuid(), 'Морозова Ольга Петровна', 'morozova@4lapy.ru', '+7 (495) 345-67-89', 'veterinarian', 'Офтальмолог', 'ВЕТ-12349', true),
(gen_random_uuid(), 'Волков Сергей Николаевич', 'volkov@zdorovie-animal.ru', '+7 (495) 456-78-90', 'veterinarian', 'Онколог', 'ВЕТ-12350', true),
(gen_random_uuid(), 'Лебедева Мария Андреевна', 'lebedeva@aibolit-vet.ru', '+7 (495) 123-45-69', 'veterinarian', 'Стоматолог', 'ВЕТ-12351', true),
(gen_random_uuid(), 'Новиков Алексей Владимирович', 'novikov@zoomir.ru', '+7 (495) 234-56-80', 'veterinarian', 'Невролог', 'ВЕТ-12352', true)
ON CONFLICT (id) DO NOTHING;

-- Связывание ветеринаров с клиниками
WITH clinic_vet_data AS (
    SELECT 
        c.id as clinic_id,
        p.id as vet_id,
        ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY p.full_name) as rn
    FROM clinics c
    CROSS JOIN profiles p
    WHERE p.role = 'veterinarian'
    AND c.name LIKE '%' || 
        CASE 
            WHEN p.email LIKE '%aibolit%' THEN 'Айболит'
            WHEN p.email LIKE '%zoomir%' THEN 'Зоомир'
            WHEN p.email LIKE '%4lapy%' THEN 'лапы'
            WHEN p.email LIKE '%zdorovie%' THEN 'Здоровье'
            ELSE 'none'
        END || '%'
)
INSERT INTO clinic_veterinarians (id, clinic_id, veterinarian_id, is_primary)
SELECT 
    gen_random_uuid(),
    clinic_id,
    vet_id,
    rn = 1
FROM clinic_vet_data
WHERE rn <= 2
ON CONFLICT (clinic_id, veterinarian_id) DO NOTHING;

-- Связывание услуг с клиниками
WITH clinic_service_data AS (
    SELECT 
        c.id as clinic_id,
        s.id as service_id,
        s.price * (0.8 + random() * 0.4) as adjusted_price -- Вариация цен ±20%
    FROM clinics c
    CROSS JOIN services s
    WHERE random() > 0.2 -- 80% услуг доступны в каждой клинике
)
INSERT INTO clinic_services (id, clinic_id, service_id, price, is_available)
SELECT 
    gen_random_uuid(),
    clinic_id,
    service_id,
    ROUND(adjusted_price::numeric, 0),
    true
FROM clinic_service_data
ON CONFLICT (clinic_id, service_id) DO NOTHING;

-- Создание тестовых владельцев животных
INSERT INTO pet_owners (id, full_name, email, phone, address, emergency_contact, notes) VALUES
(gen_random_uuid(), 'Смирнов Иван Петрович', 'smirnov@example.com', '+7 (495) 111-22-33', 'ул. Пушкина, 10, кв. 15', '+7 (495) 111-22-34', 'Предпочитает утренние приемы'),
(gen_random_uuid(), 'Кузнецова Мария Ивановна', 'kuznetsova@example.com', '+7 (495) 222-33-44', 'пр. Ленина, 25, кв. 8', '+7 (495) 222-33-45', 'Животное боится громких звуков'),
(gen_random_uuid(), 'Попов Алексей Сергеевич', 'popov@example.com', '+7 (495) 333-44-55', 'ул. Гагарина, 5, кв. 22', '+7 (495) 333-44-56', 'Просьба звонить после 18:00'),
(gen_random_uuid(), 'Васильева Елена Александровна', 'vasilieva@example.com', '+7 (495) 444-55-66', 'ул. Мира, 33, кв. 7', '+7 (495) 444-55-67', 'Владелец нескольких животных'),
(gen_random_uuid(), 'Михайлов Дмитрий Николаевич', 'mikhailov@example.com', '+7 (495) 555-66-77', 'пр. Победы, 18, кв. 45', '+7 (495) 555-66-78', 'Регулярный клиент')
ON CONFLICT (id) DO NOTHING;

-- Создание тестовых животных
WITH owner_data AS (
    SELECT id, full_name FROM pet_owners LIMIT 5
)
INSERT INTO pets (id, name, species, breed, gender, birth_date, weight, color, microchip_number, allergies, medical_notes, owner_id, is_active)
SELECT 
    gen_random_uuid(),
    pet_data.name,
    pet_data.species,
    pet_data.breed,
    pet_data.gender,
    pet_data.birth_date,
    pet_data.weight,
    pet_data.color,
    pet_data.microchip_number,
    pet_data.allergies,
    pet_data.medical_notes,
    owner_data.id,
    true
FROM owner_data
CROSS JOIN (
    VALUES 
    ('Мурка', 'Кошка', 'Британская короткошерстная', 'Женский', '2020-03-15', 4.2, 'Серый', '123456789012345', 'Нет', 'Здоровое животное'),
    ('Барсик', 'Кот', 'Мейн-кун', 'Мужской', '2019-07-22', 6.8, 'Рыжий', '234567890123456', 'Курица', 'Склонность к МКБ'),
    ('Рекс', 'Собака', 'Немецкая овчарка', 'Мужской', '2018-11-10', 32.5, 'Черно-рыжий', '345678901234567', 'Нет', 'Активная собака'),
    ('Лайка', 'Собака', 'Лабрадор', 'Женский', '2021-01-08', 28.3, 'Золотистый', '456789012345678', 'Говядина', 'Дружелюбная'),
    ('Кеша', 'Попугай', 'Корелла', 'Мужской', '2022-05-12', 0.09, 'Серо-желтый', NULL, 'Нет', 'Говорящий попугай')
) AS pet_data(name, species, breed, gender, birth_date, weight, color, microchip_number, allergies, medical_notes)
ON CONFLICT (id) DO NOTHING;

-- Создание тестовых отзывов
WITH review_data AS (
    SELECT 
        c.id as clinic_id,
        p.id as vet_id,
        c.name as clinic_name,
        p.full_name as vet_name
    FROM clinics c
    JOIN clinic_veterinarians cv ON c.id = cv.clinic_id
    JOIN profiles p ON cv.veterinarian_id = p.id
    LIMIT 20
)
INSERT INTO reviews (id, clinic_id, veterinarian_id, author_name, author_email, title, content, rating, is_verified, is_helpful_count)
SELECT 
    gen_random_uuid(),
    clinic_id,
    vet_id,
    review_content.author_name,
    review_content.author_email,
    review_content.title,
    review_content.content,
    review_content.rating,
    review_content.is_verified,
    review_content.helpful_count
FROM review_data
CROSS JOIN (
    VALUES 
    ('Анна К.', 'anna.k@example.com', 'Отличный врач!', 'Доктор очень внимательно осмотрел моего кота, все объяснил понятно. Лечение помогло быстро. Рекомендую!', 5, true, 12),
    ('Михаил С.', 'mikhail.s@example.com', 'Профессиональный подход', 'Клиника современная, оборудование новое. Врач компетентный, но цены немного высоковаты.', 4, true, 8),
    ('Елена В.', 'elena.v@example.com', 'Спасли нашу собаку', 'Обратились в экстренной ситуации. Врачи сработали быстро и профессионально. Собака здорова!', 5, true, 15),
    ('Дмитрий П.', 'dmitry.p@example.com', 'Хорошая клиника', 'Удобное расположение, вежливый персонал. Единственный минус - долго ждали приема.', 4, false, 5),
    ('Ольга М.', 'olga.m@example.com', 'Рекомендую всем', 'Уже несколько лет обслуживаемся в этой клинике. Всегда качественное лечение и разумные цены.', 5, true, 20)
) AS review_content(author_name, author_email, title, content, rating, is_verified, helpful_count)
WHERE random() > 0.7 -- Не все комбинации, чтобы не было слишком много отзывов
ON CONFLICT (id) DO NOTHING;

-- Обновление счетчиков отзывов и рейтингов клиник
UPDATE clinics 
SET 
    reviews_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE reviews.clinic_id = clinics.id
    ),
    rating = (
        SELECT COALESCE(ROUND(AVG(rating::numeric), 1), 0)
        FROM reviews 
        WHERE reviews.clinic_id = clinics.id
    );

-- Создание индексов для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_clinics_city_rating ON clinics(city_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_clinics_active ON clinics(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_rating ON reviews(clinic_id, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_vet_rating ON reviews(veterinarian_id, rating);
CREATE INDEX IF NOT EXISTS idx_clinic_services_available ON clinic_services(clinic_id, is_available) WHERE is_available = true;

-- Обновление статистики таблиц
ANALYZE clinics;
ANALYZE reviews;
ANALYZE clinic_services;
ANALYZE clinic_veterinarians;
