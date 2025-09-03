-- Завершение адаптации схемы БД для множественных клиник
-- Добавляем тестовые клиники в разных городах
INSERT INTO clinics (name, description, address, city_id, phone, email, latitude, longitude, working_hours, services_offered, is_verified) 
SELECT 
  clinic_name,
  clinic_description,
  clinic_address,
  cities.id as city_id,
  clinic_phone,
  clinic_email,
  cities.latitude + (RANDOM() - 0.5) * 0.1, -- Небольшое смещение от центра города
  cities.longitude + (RANDOM() - 0.5) * 0.1,
  '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "10:00-16:00", "sunday": "closed"}'::jsonb,
  ARRAY['Терапия', 'Хирургия', 'Вакцинация', 'Диагностика'],
  true
FROM (
  VALUES 
    ('ВетПоиск "Здоровый Питомец"', 'Современная ветеринарная клиника с полным спектром услуг', 'ул. Ленина, 15', '+7 (495) 123-45-67', 'info@healthypet.ru', 'Москва'),
    ('Ветеринарный центр "Айболит"', 'Круглосуточная ветеринарная помощь', 'пр. Невский, 88', '+7 (812) 987-65-43', 'help@aibolit.spb.ru', 'Санкт-Петербург'),
    ('Клиника "Четыре Лапы"', 'Специализируемся на лечении кошек и собак', 'ул. Красный проспект, 45', '+7 (383) 555-12-34', 'info@4paws.nsk.ru', 'Новосибирск'),
    ('ВетЦентр "Доктор Вет"', 'Опытные ветеринары, современное оборудование', 'ул. Малышева, 78', '+7 (343) 777-88-99', 'clinic@doctorvet.ekb.ru', 'Екатеринбург'),
    ('Ветклиника "Лапка"', 'Заботливое отношение к каждому пациенту', 'ул. Баумана, 23', '+7 (843) 444-55-66', 'care@lapka.kazan.ru', 'Казань'),
    ('Центр "ВетПомощь"', 'Экстренная и плановая ветеринарная помощь', 'ул. Большая Покровская, 12', '+7 (831) 333-22-11', 'emergency@vethelp.nn.ru', 'Нижний Новгород'),
    ('Клиника "Зоомир"', 'Полный спектр ветеринарных услуг', 'ул. Кирова, 67', '+7 (351) 666-77-88', 'info@zoomir.chel.ru', 'Челябинск'),
    ('ВетПоиск "Друг"', 'Ваш надежный друг в заботе о питомцах', 'ул. Молодогвардейская, 34', '+7 (846) 222-33-44', 'friend@drug.samara.ru', 'Самара')
) AS clinic_data(clinic_name, clinic_description, clinic_address, clinic_phone, clinic_email, city_name)
JOIN cities ON cities.name = clinic_data.city_name;

-- Обновляем существующих ветеринаров, привязывая их к клиникам
WITH clinic_assignments AS (
  SELECT 
    p.id as profile_id,
    c.id as clinic_id,
    ROW_NUMBER() OVER (ORDER BY p.created_at) as rn,
    COUNT(*) OVER () as total_profiles
  FROM profiles p
  CROSS JOIN (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as clinic_rn FROM clinics) c
  WHERE p.role IN ('veterinarian', 'admin')
)
UPDATE profiles 
SET 
  clinic_id = ca.clinic_id,
  bio = CASE 
    WHEN profiles.specialization = 'Терапевт' THEN 'Опытный ветеринар-терапевт с 10+ летним стажем. Специализируюсь на диагностике и лечении внутренних болезней животных.'
    WHEN profiles.specialization = 'Хирург' THEN 'Ветеринарный хирург высшей категории. Провожу сложные операции, специализируюсь на ортопедии и абдоминальной хирургии.'
    WHEN profiles.specialization = 'Дерматолог' THEN 'Ветеринарный дерматолог. Лечу кожные заболевания, аллергии, проблемы с шерстью у домашних животных.'
    ELSE 'Квалифицированный ветеринарный специалист с многолетним опытом работы.'
  END,
  experience_years = FLOOR(RANDOM() * 15) + 5, -- От 5 до 20 лет опыта
  education = 'Московская государственная академия ветеринарной медицины и биотехнологии им. К.И. Скрябина'
FROM clinic_assignments ca
WHERE profiles.id = ca.profile_id 
  AND ca.rn % (SELECT COUNT(*) FROM clinics) + 1 = ca.clinic_rn;

-- Добавляем тестовые отзывы для клиник и ветеринаров
INSERT INTO reviews (clinic_id, veterinarian_id, patient_name, patient_email, rating, title, comment, is_verified, is_published)
SELECT 
  c.id,
  p.id,
  patient_names.name,
  patient_names.email,
  (ARRAY[4, 5, 5, 5, 4, 5, 3, 4, 5, 5])[FLOOR(RANDOM() * 10) + 1], -- Преимущественно хорошие оценки
  review_titles.title,
  review_comments.comment,
  true,
  true
FROM clinics c
JOIN profiles p ON p.clinic_id = c.id AND p.role = 'veterinarian'
CROSS JOIN (
  VALUES 
    ('Анна Петрова', 'anna.petrova@email.ru'),
    ('Михаил Сидоров', 'mikhail.sidorov@email.ru'),
    ('Елена Козлова', 'elena.kozlova@email.ru'),
    ('Дмитрий Волков', 'dmitry.volkov@email.ru'),
    ('Ольга Морозова', 'olga.morozova@email.ru'),
    ('Александр Новиков', 'alex.novikov@email.ru'),
    ('Татьяна Лебедева', 'tatyana.lebedeva@email.ru'),
    ('Сергей Орлов', 'sergey.orlov@email.ru')
) AS patient_names(name, email)
CROSS JOIN (
  VALUES 
    ('Отличный врач!'),
    ('Профессиональный подход'),
    ('Спасибо за помощь'),
    ('Рекомендую всем'),
    ('Внимательное отношение'),
    ('Качественное лечение'),
    ('Быстрая диагностика'),
    ('Заботливый персонал')
) AS review_titles(title)
CROSS JOIN (
  VALUES 
    ('Очень довольны качеством обслуживания. Врач внимательно осмотрел нашего кота, поставил точный диагноз и назначил эффективное лечение.'),
    ('Профессиональный подход к лечению. Все объяснили понятно, дали рекомендации по уходу. Питомец быстро пошел на поправку.'),
    ('Отличная клиника с современным оборудованием. Персонал вежливый и компетентный. Обязательно обратимся еще.'),
    ('Спасибо большое за спасение нашей собаки! Операция прошла успешно, восстановление идет хорошо.'),
    ('Удобная запись онлайн, не пришлось долго ждать. Врач опытный, сразу понял в чем проблема.'),
    ('Хорошие условия, чистота, профессиональное оборудование. Цены адекватные за качественные услуги.'),
    ('Внимательное отношение к животным и их хозяевам. Чувствуется, что люди любят свою работу.'),
    ('Быстро поставили диагноз и назначили лечение. Результат не заставил себя ждать. Рекомендую!')
) AS review_comments(comment)
WHERE RANDOM() < 0.3; -- Добавляем отзывы примерно для 30% комбинаций

-- Обновляем услуги, привязывая их к клиникам
ALTER TABLE services ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES clinics(id);

-- Распределяем существующие услуги между клиниками
WITH service_clinic_assignment AS (
  SELECT 
    s.id as service_id,
    c.id as clinic_id,
    ROW_NUMBER() OVER (ORDER BY s.created_at) as service_rn
  FROM services s
  CROSS JOIN (SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as clinic_rn FROM clinics) c
)
UPDATE services 
SET clinic_id = sca.clinic_id
FROM service_clinic_assignment sca
WHERE services.id = sca.service_id 
  AND sca.service_rn % (SELECT COUNT(*) FROM clinics) + 1 = sca.clinic_rn;

-- Добавляем дополнительные услуги для каждой клиники
INSERT INTO services (name, description, category, price, duration_minutes, clinic_id, is_active)
SELECT 
  service_name,
  service_description,
  service_category,
  service_price,
  service_duration,
  c.id,
  true
FROM clinics c
CROSS JOIN (
  VALUES 
    ('Груминг кошек', 'Профессиональная стрижка и уход за шерстью кошек', 'Груминг', 2500, 90),
    ('Груминг собак', 'Стрижка, мытье и уход за шерстью собак всех пород', 'Груминг', 3500, 120),
    ('Стоматология', 'Лечение зубов, удаление зубного камня', 'Стоматология', 4500, 60),
    ('Кастрация кота', 'Плановая кастрация котов под наркозом', 'Хирургия', 3000, 45),
    ('Стерилизация кошки', 'Плановая стерилизация кошек', 'Хирургия', 5000, 90),
    ('Чипирование', 'Установка микрочипа для идентификации животного', 'Процедуры', 1500, 15),
    ('Анализ крови', 'Общий и биохимический анализ крови', 'Диагностика', 2000, 30)
) AS additional_services(service_name, service_description, service_category, service_price, service_duration)
WHERE RANDOM() < 0.7; -- Добавляем услуги примерно в 70% клиник

-- Создаем индексы для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_services_clinic_id ON services(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON appointments(veterinarian_id);

-- Обновляем политики RLS для services с учетом клиник
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Active services are viewable by everyone" ON services 
  FOR SELECT USING (is_active = true);

-- Создаем представление для удобного поиска клиник с рейтингами
CREATE OR REPLACE VIEW clinic_search_view AS
SELECT 
  c.*,
  cities.name as city_name,
  cities.region,
  COALESCE(c.rating, 0) as rating,
  COALESCE(c.reviews_count, 0) as reviews_count,
  COUNT(DISTINCT p.id) as veterinarians_count,
  COUNT(DISTINCT s.id) as services_count,
  ARRAY_AGG(DISTINCT p.specialization) FILTER (WHERE p.specialization IS NOT NULL) as specializations
FROM clinics c
LEFT JOIN cities ON c.city_id = cities.id
LEFT JOIN profiles p ON p.clinic_id = c.id AND p.role = 'veterinarian' AND p.is_active = true
LEFT JOIN services s ON s.clinic_id = c.id AND s.is_active = true
WHERE c.is_active = true
GROUP BY c.id, cities.name, cities.region;

-- Создаем представление для поиска ветеринаров
CREATE OR REPLACE VIEW veterinarian_search_view AS
SELECT 
  p.*,
  c.name as clinic_name,
  c.address as clinic_address,
  c.phone as clinic_phone,
  cities.name as city_name,
  cities.region,
  COALESCE(p.rating, 0) as rating,
  COALESCE(p.reviews_count, 0) as reviews_count
FROM profiles p
JOIN clinics c ON p.clinic_id = c.id
LEFT JOIN cities ON c.city_id = cities.id
WHERE p.role = 'veterinarian' 
  AND p.is_active = true 
  AND c.is_active = true;
