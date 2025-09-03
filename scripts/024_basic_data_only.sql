-- Очистка существующих данных (кроме cities)
DELETE FROM reviews;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM services;
DELETE FROM clinics;

-- Создание услуг
INSERT INTO services (name, description, price, duration_minutes, category, is_active) VALUES
('Общий осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 1500.00, 30, 'Консультации', true),
('Вакцинация', 'Профилактическая вакцинация животных', 2000.00, 20, 'Профилактика', true),
('Стерилизация кошек', 'Хирургическая стерилизация кошек', 8000.00, 60, 'Хирургия', true),
('Кастрация котов', 'Хирургическая кастрация котов', 6000.00, 45, 'Хирургия', true),
('УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 3000.00, 30, 'Диагностика', true),
('Рентген', 'Рентгенологическое исследование', 2500.00, 20, 'Диагностика', true),
('Чистка зубов', 'Профессиональная чистка зубов животного', 4000.00, 45, 'Стоматология', true),
('Груминг', 'Полный комплекс груминга для собак и кошек', 3500.00, 90, 'Груминг', true);

-- Создание клиник
INSERT INTO clinics (name, description, address, phone, email, website, city_id, latitude, longitude, working_hours, rating, reviews_count, is_active) 
SELECT 
    clinic_data.name,
    clinic_data.description,
    clinic_data.address,
    clinic_data.phone,
    clinic_data.email,
    clinic_data.website,
    c.id,
    clinic_data.latitude,
    clinic_data.longitude,
    -- Исправляю working_hours на правильный JSONB формат
    clinic_data.working_hours::jsonb,
    clinic_data.rating,
    clinic_data.reviews_count,
    clinic_data.is_active
FROM (VALUES
    ('ВетКлиника "Здоровые Лапки"', 'Современная ветеринарная клиника с полным спектром услуг', 'ул. Пушкина, 15', '+7 (495) 123-45-67', 'info@healthypaws.ru', 'https://healthypaws.ru', 'Москва', 55.7558, 37.6176, '{"пн-пт": "9:00-21:00", "сб-вс": "10:00-18:00"}', 4.8, 0, true),
    ('Ветеринарный центр "Айболит"', 'Круглосуточная ветеринарная помощь', 'пр. Невский, 88', '+7 (812) 987-65-43', 'help@aibolit-spb.ru', 'https://aibolit-spb.ru', 'Санкт-Петербург', 59.9311, 30.3609, '{"пн-вс": "24/7"}', 4.6, 0, true),
    ('Клиника "Верный друг"', 'Семейная ветеринарная клиника', 'ул. Красная, 101', '+7 (861) 555-77-99', 'contact@loyalfriend.ru', 'https://loyalfriend.ru', 'Краснодар', 45.0355, 38.9753, '{"пн-пт": "8:00-20:00", "сб": "9:00-17:00", "вс": "выходной"}', 4.9, 0, true)
) AS clinic_data(name, description, address, phone, email, website, city_name, latitude, longitude, working_hours, rating, reviews_count, is_active)
JOIN cities c ON c.name = clinic_data.city_name;

-- Создание владельцев животных
INSERT INTO pet_owners (full_name, phone, email, address, notes) VALUES
('Иванов Петр Сергеевич', '+7 (495) 111-22-33', 'ivanov@email.ru', 'г. Москва, ул. Ленина, 10, кв. 25', 'Постоянный клиент'),
('Петрова Анна Михайловна', '+7 (812) 444-55-66', 'petrova@email.ru', 'г. Санкт-Петербург, пр. Мира, 45, кв. 12', 'Аллергия на некоторые препараты'),
('Сидоров Алексей Владимирович', '+7 (861) 777-88-99', 'sidorov@email.ru', 'г. Краснодар, ул. Советская, 33, кв. 8', 'Владелец нескольких животных'),
('Козлова Елена Дмитриевна', '+7 (495) 222-33-44', 'kozlova@email.ru', 'г. Москва, ул. Гагарина, 77, кв. 15', 'Предпочитает утренние приемы'),
('Морозов Дмитрий Александрович', '+7 (812) 666-77-88', 'morozov@email.ru', 'г. Санкт-Петербург, ул. Пушкина, 22, кв. 5', 'Новый клиент');

-- Создание питомцев
INSERT INTO pets (name, species, breed, birth_date, weight, gender, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    pet_data.name,
    pet_data.species,
    pet_data.breed,
    -- Добавляю явное приведение к типу date
    pet_data.birth_date::date,
    pet_data.weight,
    pet_data.gender,
    pet_data.color,
    po.id,
    pet_data.microchip_number,
    pet_data.allergies,
    pet_data.medical_notes,
    pet_data.is_active
FROM (VALUES
    ('Мурзик', 'Кошка', 'Британская короткошерстная', '2020-03-15', 4.2, 'Мужской', 'Серый', 'Иванов Петр Сергеевич', '123456789012345', null, 'Здоров', true),
    ('Белка', 'Собака', 'Лабрадор', '2019-07-22', 28.5, 'Женский', 'Золотистый', 'Петрова Анна Михайловна', '234567890123456', 'Аллергия на курицу', 'Склонность к ожирению', true),
    ('Рыжик', 'Кошка', 'Мейн-кун', '2021-01-10', 6.8, 'Мужской', 'Рыжий', 'Сидоров Алексей Владимирович', '345678901234567', null, 'Здоров', true),
    ('Лаки', 'Собака', 'Немецкая овчарка', '2018-11-05', 32.1, 'Мужской', 'Черно-коричневый', 'Козлова Елена Дмитриевна', '456789012345678', null, 'Артрит задних лап', true),
    ('Снежка', 'Кошка', 'Персидская', '2022-05-18', 3.9, 'Женский', 'Белый', 'Морозов Дмитрий Александрович', '567890123456789', null, 'Здорова', true)
) AS pet_data(name, species, breed, birth_date, weight, gender, color, owner_name, microchip_number, allergies, medical_notes, is_active)
JOIN pet_owners po ON po.full_name = pet_data.owner_name;

-- Создание отзывов
INSERT INTO reviews (clinic_id, author_name, rating, content, is_verified, is_helpful_count, created_at)
SELECT 
    c.id,
    review_data.author_name,
    review_data.rating,
    review_data.content,
    review_data.is_verified,
    review_data.is_helpful_count,
    -- Добавляю явное приведение к типу timestamp
    review_data.created_at::timestamp
FROM (VALUES
    ('ВетКлиника "Здоровые Лапки"', 'Мария К.', 5, 'Отличная клиника! Врачи очень внимательные, быстро поставили диагноз моему коту. Цены адекватные.', true, 12, '2024-01-15 14:30:00'),
    ('ВетКлиника "Здоровые Лапки"', 'Александр П.', 4, 'Хорошее обслуживание, но долго ждали в очереди. В целом довольны результатом лечения.', true, 8, '2024-01-20 16:45:00'),
    ('Ветеринарный центр "Айболит"', 'Елена С.', 5, 'Спасибо огромное! Ночью привезли собаку в критическом состоянии, врачи спасли. Профессионалы!', true, 25, '2024-01-18 02:15:00'),
    ('Ветеринарный центр "Айболит"', 'Дмитрий В.', 4, 'Круглосуточная работа - это большой плюс. Врачи компетентные, но цены выше среднего.', true, 6, '2024-01-22 19:20:00'),
    ('Клиника "Верный друг"', 'Анна М.', 5, 'Семейная атмосфера, врачи относятся к животным как к своим. Очень рекомендую!', true, 18, '2024-01-25 11:10:00'),
    ('Клиника "Верный друг"', 'Игорь Л.', 5, 'Лучшая клиника в городе! Доктор Смирнова - настоящий профессионал. Кот здоров и счастлив.', true, 15, '2024-01-28 15:30:00')
) AS review_data(clinic_name, author_name, rating, content, is_verified, is_helpful_count, created_at)
JOIN clinics c ON c.name = review_data.clinic_name;

-- Обновление рейтингов клиник на основе отзывов
UPDATE clinics 
SET 
    rating = subquery.avg_rating,
    reviews_count = subquery.review_count
FROM (
    SELECT 
        clinic_id,
        ROUND(AVG(rating::numeric), 1) as avg_rating,
        COUNT(*) as review_count
    FROM reviews 
    GROUP BY clinic_id
) AS subquery
WHERE clinics.id = subquery.clinic_id;

-- Связывание клиник с услугами
INSERT INTO clinic_services (clinic_id, service_id, is_available)
SELECT c.id, s.id, true
FROM clinics c
CROSS JOIN services s;
