-- Финальный скрипт с правильными названиями колонок из схемы БД
-- Очищаем существующие данные (кроме cities)
DELETE FROM reviews;
DELETE FROM appointments;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM clinics;
DELETE FROM services;

-- 1. Создаем услуги
INSERT INTO services (name, description, price, duration_minutes, category, is_active) VALUES
('Общий осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 1500.00, 30, 'Консультации', true),
('Вакцинация', 'Профилактическая вакцинация животных', 2000.00, 20, 'Профилактика', true),
('Стерилизация кошек', 'Хирургическая стерилизация кошек', 8000.00, 60, 'Хирургия', true),
('Кастрация котов', 'Хирургическая кастрация котов', 6000.00, 45, 'Хирургия', true),
('УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 3000.00, 30, 'Диагностика', true),
('Рентген', 'Рентгенологическое исследование', 2500.00, 20, 'Диагностика', true),
('Чистка зубов', 'Профессиональная чистка зубов животного', 4000.00, 45, 'Стоматология', true),
('Груминг', 'Полный комплекс груминга для собак и кошек', 3500.00, 90, 'Груминг', true);

-- 2. Создаем клиники в разных городах
INSERT INTO clinics (name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) 
SELECT 
    'ВетПоиск "Здоровые Лапки"',
    'Современная ветеринарная клиника с полным спектром услуг для ваших питомцев',
    'ул. Пушкина, 15',
    '+7 (495) 123-45-67',
    'info@healthypaws.ru',
    'https://healthypaws.ru',
    c.id,
    55.7558,
    37.6176,
    4.8,
    156,
    true,
    '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'::jsonb
FROM cities c WHERE c.name = 'Москва' LIMIT 1;

INSERT INTO clinics (name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) 
SELECT 
    'ВетЦентр "Доктор Айболит"',
    'Круглосуточная ветеринарная помощь с опытными специалистами',
    'Невский проспект, 88',
    '+7 (812) 987-65-43',
    'help@aibolit-vet.ru',
    'https://aibolit-vet.ru',
    c.id,
    59.9311,
    30.3609,
    4.6,
    203,
    true,
    '{"monday": "00:00-23:59", "tuesday": "00:00-23:59", "wednesday": "00:00-23:59", "thursday": "00:00-23:59", "friday": "00:00-23:59", "saturday": "00:00-23:59", "sunday": "00:00-23:59"}'::jsonb
FROM cities c WHERE c.name = 'Санкт-Петербург' LIMIT 1;

INSERT INTO clinics (name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) 
SELECT 
    'Ветклиника "Четыре Лапы"',
    'Семейная ветеринарная клиника с индивидуальным подходом к каждому питомцу',
    'ул. Красная, 101',
    '+7 (861) 555-77-99',
    'care@fourpaws.ru',
    'https://fourpaws.ru',
    c.id,
    45.0355,
    38.9753,
    4.7,
    89,
    true,
    '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "09:00-17:00"}'::jsonb
FROM cities c WHERE c.name = 'Краснодар' LIMIT 1;

-- 3. Связываем клиники с услугами
INSERT INTO clinic_services (clinic_id, service_id, price, is_available)
SELECT c.id, s.id, s.price, true
FROM clinics c
CROSS JOIN services s;

-- 4. Создаем владельцев животных
INSERT INTO pet_owners (full_name, email, phone, address, emergency_contact, notes) VALUES
('Иванова Мария Петровна', 'maria.ivanova@email.ru', '+7 (495) 111-22-33', 'г. Москва, ул. Ленина, 25, кв. 15', '+7 (495) 111-22-34', 'Предпочитает утренние приемы'),
('Петров Алексей Сергеевич', 'alex.petrov@email.ru', '+7 (812) 222-33-44', 'г. Санкт-Петербург, пр. Мира, 45, кв. 78', '+7 (812) 222-33-45', 'Кот очень пугливый'),
('Сидорова Елена Владимировна', 'elena.sidorova@email.ru', '+7 (861) 333-44-55', 'г. Краснодар, ул. Советская, 12, кв. 5', '+7 (861) 333-44-56', 'Собака агрессивна к незнакомцам'),
('Козлов Дмитрий Иванович', 'dmitry.kozlov@email.ru', '+7 (495) 444-55-66', 'г. Москва, ул. Гагарина, 33, кв. 91', '+7 (495) 444-55-67', 'Аллергия на некоторые препараты'),
('Морозова Анна Александровна', 'anna.morozova@email.ru', '+7 (812) 555-66-77', 'г. Санкт-Петербург, ул. Пушкина, 67, кв. 12', '+7 (812) 555-66-78', 'Первый визит к ветеринару');

-- 5. Создаем питомцев (используем правильные названия колонок)
INSERT INTO pets (name, species, breed, birth_date, weight, gender, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    'Мурка', 'Кошка', 'Британская короткошерстная', '2020-03-15', 4.2, 'Женский', 'Серый', 
    po.id, '123456789012345', 'Нет', 'Здорова', true
FROM pet_owners po WHERE po.full_name = 'Иванова Мария Петровна' LIMIT 1;

INSERT INTO pets (name, species, breed, birth_date, weight, gender, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    'Барсик', 'Кот', 'Мейн-кун', '2019-07-22', 6.8, 'Мужской', 'Рыжий', 
    po.id, '234567890123456', 'Курица', 'Склонность к МКБ', true
FROM pet_owners po WHERE po.full_name = 'Петров Алексей Сергеевич' LIMIT 1;

INSERT INTO pets (name, species, breed, birth_date, weight, gender, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    'Рекс', 'Собака', 'Немецкая овчарка', '2018-11-10', 32.5, 'Мужской', 'Черно-коричневый', 
    po.id, '345678901234567', 'Нет', 'Дисплазия тазобедренных суставов', true
FROM pet_owners po WHERE po.full_name = 'Сидорова Елена Владимировна' LIMIT 1;

INSERT INTO pets (name, species, breed, birth_date, weight, gender, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    'Пушок', 'Кот', 'Персидская', '2021-01-08', 3.9, 'Мужской', 'Белый', 
    po.id, '456789012345678', 'Рыба', 'Проблемы с дыханием', true
FROM pet_owners po WHERE po.full_name = 'Козлов Дмитрий Иванович' LIMIT 1;

INSERT INTO pets (name, species, breed, birth_date, weight, gender, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    'Лайка', 'Собака', 'Хаски', '2022-05-20', 18.3, 'Женский', 'Черно-белый', 
    po.id, '567890123456789', 'Нет', 'Здорова', true
FROM pet_owners po WHERE po.full_name = 'Морозова Анна Александровна' LIMIT 1;

-- 6. Создаем записи на прием (без veterinarian_id, так как нет профилей ветеринаров)
INSERT INTO appointments (pet_id, service_id, appointment_date, appointment_time, duration_minutes, status, reason, total_cost)
SELECT 
    p.id, s.id, '2024-01-15', '10:00:00', 30, 'Завершен', 'Плановый осмотр', 1500.00
FROM pets p, services s 
WHERE p.name = 'Мурка' AND s.name = 'Общий осмотр' LIMIT 1;

INSERT INTO appointments (pet_id, service_id, appointment_date, appointment_time, duration_minutes, status, reason, total_cost)
SELECT 
    p.id, s.id, '2024-01-20', '14:30:00', 20, 'Завершен', 'Вакцинация', 2000.00
FROM pets p, services s 
WHERE p.name = 'Барсик' AND s.name = 'Вакцинация' LIMIT 1;

INSERT INTO appointments (pet_id, service_id, appointment_date, appointment_time, duration_minutes, status, reason, total_cost)
SELECT 
    p.id, s.id, '2024-02-01', '11:00:00', 30, 'Завершен', 'УЗИ брюшной полости', 3000.00
FROM pets p, services s 
WHERE p.name = 'Рекс' AND s.name = 'УЗИ брюшной полости' LIMIT 1;

-- 7. Создаем отзывы
INSERT INTO reviews (clinic_id, author_name, author_email, title, content, rating, is_verified, is_helpful_count)
SELECT 
    c.id, 'Мария И.', 'maria.i@email.ru', 'Отличная клиника!', 
    'Очень довольна обслуживанием. Врачи профессиональные, персонал вежливый. Мурка чувствует себя отлично после лечения.', 
    5, true, 12
FROM clinics c WHERE c.name = 'ВетПоиск "Здоровые Лапки"' LIMIT 1;

INSERT INTO reviews (clinic_id, author_name, author_email, title, content, rating, is_verified, is_helpful_count)
SELECT 
    c.id, 'Алексей П.', 'alex.p@email.ru', 'Круглосуточная помощь', 
    'Обратились ночью с экстренной ситуацией. Врачи сразу приняли, оказали помощь. Барсик здоров, спасибо!', 
    5, true, 8
FROM clinics c WHERE c.name = 'ВетЦентр "Доктор Айболит"' LIMIT 1;

INSERT INTO reviews (clinic_id, author_name, author_email, title, content, rating, is_verified, is_helpful_count)
SELECT 
    c.id, 'Елена С.', 'elena.s@email.ru', 'Хорошие специалисты', 
    'Рекса лечили от дисплазии. Врачи очень внимательные, объяснили все подробно. Результатом довольны.', 
    4, true, 6
FROM clinics c WHERE c.name = 'Ветклиника "Четыре Лапы"' LIMIT 1;

-- Обновляем счетчики отзывов в клиниках
UPDATE clinics SET reviews_count = (
    SELECT COUNT(*) FROM reviews WHERE reviews.clinic_id = clinics.id
);

-- Обновляем рейтинги клиник на основе отзывов
UPDATE clinics SET rating = (
    SELECT ROUND(AVG(rating::numeric), 1) FROM reviews WHERE reviews.clinic_id = clinics.id
) WHERE id IN (SELECT DISTINCT clinic_id FROM reviews);
