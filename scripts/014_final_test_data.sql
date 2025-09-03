-- Финальный скрипт с полными тестовыми данными для ветеринарной платформы

-- Очистка существующих данных (кроме cities)
DELETE FROM reviews;
DELETE FROM appointments;
DELETE FROM medical_records;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM services;
DELETE FROM clinics;
DELETE FROM profiles WHERE role != 'admin';

-- Сброс счетчиков
ALTER SEQUENCE IF EXISTS services_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS clinics_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;

-- Вставка услуг
INSERT INTO services (name, description, category, price, duration_minutes, is_active) VALUES
('Общий осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 'Консультация', 1500, 30, true),
('Вакцинация', 'Профилактическая вакцинация от основных заболеваний', 'Профилактика', 2000, 20, true),
('Стерилизация кошек', 'Хирургическая стерилизация кошек', 'Хирургия', 8000, 90, true),
('Кастрация котов', 'Хирургическая кастрация котов', 'Хирургия', 5000, 60, true),
('Стерилизация собак', 'Хирургическая стерилизация собак', 'Хирургия', 12000, 120, true),
('УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 'Диагностика', 3000, 45, true),
('Рентген', 'Рентгенологическое исследование', 'Диагностика', 2500, 30, true),
('Анализ крови общий', 'Общий клинический анализ крови', 'Лабораторная диагностика', 1200, 15, true),
('Чистка зубов', 'Профессиональная чистка зубов под наркозом', 'Стоматология', 6000, 90, true),
('Лечение отита', 'Диагностика и лечение воспаления уха', 'Терапия', 2500, 40, true);

-- Получаем ID городов для создания клиник
DO $$
DECLARE
    moscow_id uuid;
    spb_id uuid;
    nsk_id uuid;
    ekb_id uuid;
    kazan_id uuid;
BEGIN
    SELECT id INTO moscow_id FROM cities WHERE name = 'Москва' LIMIT 1;
    SELECT id INTO spb_id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1;
    SELECT id INTO nsk_id FROM cities WHERE name = 'Новосибирск' LIMIT 1;
    SELECT id INTO ekb_id FROM cities WHERE name = 'Екатеринбург' LIMIT 1;
    SELECT id INTO kazan_id FROM cities WHERE name = 'Казань' LIMIT 1;

    -- Вставка клиник
    INSERT INTO clinics (name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) VALUES
    ('ВетЦентр "Доктор Айболит"', 'Современная ветеринарная клиника с полным спектром услуг. Опытные врачи, современное оборудование.', 'ул. Тверская, 15', '+7 (495) 123-45-67', 'info@aibolit-vet.ru', 'https://aibolit-vet.ru', moscow_id, 55.7558, 37.6176, 4.8, 156, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'),
    ('Клиника "Четыре лапы"', 'Семейная ветеринарная клиника с индивидуальным подходом к каждому пациенту.', 'пр. Мира, 45', '+7 (495) 234-56-78', 'contact@4paws.ru', 'https://4paws.ru', moscow_id, 55.7887, 37.6343, 4.6, 89, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "09:00-17:00"}'),
    ('ВетПоиск "Северная"', 'Специализируемся на лечении экзотических животных и птиц. Круглосуточная помощь.', 'Невский пр., 78', '+7 (812) 345-67-89', 'help@north-vet.ru', 'https://north-vet.ru', spb_id, 59.9311, 30.3609, 4.7, 124, true, '{"monday": "00:00-23:59", "tuesday": "00:00-23:59", "wednesday": "00:00-23:59", "thursday": "00:00-23:59", "friday": "00:00-23:59", "saturday": "00:00-23:59", "sunday": "00:00-23:59"}'),
    ('Центр "ЗооМедик"', 'Многопрофильный ветеринарный центр с собственной лабораторией и стационаром.', 'ул. Красный пр., 12', '+7 (383) 456-78-90', 'info@zoomedic-nsk.ru', 'https://zoomedic-nsk.ru', nsk_id, 55.0084, 82.9357, 4.5, 67, true, '{"monday": "09:00-19:00", "tuesday": "09:00-19:00", "wednesday": "09:00-19:00", "thursday": "09:00-19:00", "friday": "09:00-19:00", "saturday": "10:00-16:00", "sunday": "выходной"}'),
    ('Клиника "Уральский ветеринар"', 'Ведущая ветеринарная клиника Екатеринбурга с 20-летним опытом работы.', 'ул. Ленина, 33', '+7 (343) 567-89-01', 'clinic@ural-vet.ru', 'https://ural-vet.ru', ekb_id, 56.8431, 60.6454, 4.9, 203, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-18:00", "sunday": "10:00-16:00"}'),
    ('ВетЦентр "Татарстан"', 'Современная клиника с европейскими стандартами лечения животных.', 'ул. Баумана, 67', '+7 (843) 678-90-12', 'info@vet-tatarstan.ru', 'https://vet-tatarstan.ru', kazan_id, 55.7887, 49.1221, 4.4, 78, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}');

END $$;

-- Создание профилей ветеринаров
INSERT INTO profiles (full_name, email, phone, role, specialization, license_number, is_active) VALUES
('Иванова Елена Сергеевна', 'ivanova@aibolit-vet.ru', '+7 (495) 123-45-67', 'veterinarian', 'Терапевт', 'ВЕТ-12345', true),
('Петров Михаил Александрович', 'petrov@aibolit-vet.ru', '+7 (495) 123-45-68', 'veterinarian', 'Хирург', 'ВЕТ-12346', true),
('Сидорова Анна Викторовна', 'sidorova@4paws.ru', '+7 (495) 234-56-78', 'veterinarian', 'Дерматолог', 'ВЕТ-12347', true),
('Козлов Дмитрий Игоревич', 'kozlov@north-vet.ru', '+7 (812) 345-67-89', 'veterinarian', 'Экзотические животные', 'ВЕТ-12348', true),
('Морозова Ольга Петровна', 'morozova@north-vet.ru', '+7 (812) 345-67-90', 'veterinarian', 'Кардиолог', 'ВЕТ-12349', true),
('Волков Сергей Николаевич', 'volkov@zoomedic-nsk.ru', '+7 (383) 456-78-90', 'veterinarian', 'Онколог', 'ВЕТ-12350', true),
('Лебедева Мария Андреевна', 'lebedeva@ural-vet.ru', '+7 (343) 567-89-01', 'veterinarian', 'Офтальмолог', 'ВЕТ-12351', true),
('Новиков Алексей Владимирович', 'novikov@ural-vet.ru', '+7 (343) 567-89-02', 'veterinarian', 'Ортопед', 'ВЕТ-12352', true),
('Федорова Татьяна Михайловна', 'fedorova@vet-tatarstan.ru', '+7 (843) 678-90-12', 'veterinarian', 'Стоматолог', 'ВЕТ-12353', true);

-- Связывание ветеринаров с клиниками
INSERT INTO clinic_veterinarians (clinic_id, veterinarian_id, is_primary)
SELECT c.id, p.id, true
FROM clinics c, profiles p
WHERE (c.name = 'ВетЦентр "Доктор Айболит"' AND p.full_name IN ('Иванова Елена Сергеевна', 'Петров Михаил Александрович'))
   OR (c.name = 'Клиника "Четыре лапы"' AND p.full_name = 'Сидорова Анна Викторовна')
   OR (c.name = 'ВетПоиск "Северная"' AND p.full_name IN ('Козлов Дмитрий Игоревич', 'Морозова Ольга Петровна'))
   OR (c.name = 'Центр "ЗооМедик"' AND p.full_name = 'Волков Сергей Николаевич')
   OR (c.name = 'Клиника "Уральский ветеринар"' AND p.full_name IN ('Лебедева Мария Андреевна', 'Новиков Алексей Владимирович'))
   OR (c.name = 'ВетЦентр "Татарстан"' AND p.full_name = 'Федорова Татьяна Михайловна');

-- Связывание услуг с клиниками
INSERT INTO clinic_services (clinic_id, service_id, price, is_available)
SELECT c.id, s.id, s.price, true
FROM clinics c
CROSS JOIN services s;

-- Создание владельцев животных
INSERT INTO pet_owners (full_name, email, phone, address, emergency_contact) VALUES
('Смирнов Иван Петрович', 'smirnov@email.ru', '+7 (495) 111-22-33', 'г. Москва, ул. Арбат, 25, кв. 15', '+7 (495) 111-22-34'),
('Кузнецова Мария Ивановна', 'kuznetsova@email.ru', '+7 (495) 222-33-44', 'г. Москва, пр. Мира, 78, кв. 42', '+7 (495) 222-33-45'),
('Попов Алексей Сергеевич', 'popov@email.ru', '+7 (812) 333-44-55', 'г. Санкт-Петербург, Невский пр., 120, кв. 8', '+7 (812) 333-44-56'),
('Васильева Елена Андреевна', 'vasilieva@email.ru', '+7 (383) 444-55-66', 'г. Новосибирск, ул. Ленина, 45, кв. 23', '+7 (383) 444-55-67'),
('Михайлов Дмитрий Владимирович', 'mikhailov@email.ru', '+7 (343) 555-66-77', 'г. Екатеринбург, ул. Малышева, 12, кв. 67', '+7 (343) 555-66-78');

-- Создание животных
INSERT INTO pets (name, species, breed, gender, birth_date, weight, color, owner_id, microchip_number, allergies, medical_notes, is_active)
SELECT 
    pet_data.name,
    pet_data.species,
    pet_data.breed,
    pet_data.gender,
    pet_data.birth_date,
    pet_data.weight,
    pet_data.color,
    po.id,
    pet_data.microchip_number,
    pet_data.allergies,
    pet_data.medical_notes,
    true
FROM (VALUES
    ('Мурка', 'Кошка', 'Британская короткошерстная', 'Женский', '2020-03-15', 4.2, 'Серый', 'Смирнов Иван Петрович', '123456789012345', 'Аллергия на курицу', 'Стерилизована'),
    ('Барсик', 'Кот', 'Мейн-кун', 'Мужской', '2019-07-22', 6.8, 'Рыжий', 'Кузнецова Мария Ивановна', '234567890123456', NULL, 'Кастрирован'),
    ('Рекс', 'Собака', 'Немецкая овчарка', 'Мужской', '2018-11-10', 32.5, 'Черно-коричневый', 'Попов Алексей Сергеевич', '345678901234567', 'Аллергия на говядину', 'Активный, любит долгие прогулки'),
    ('Белка', 'Собака', 'Джек-рассел-терьер', 'Женский', '2021-05-08', 8.3, 'Белый с коричневыми пятнами', 'Васильева Елена Андреевна', '456789012345678', NULL, 'Стерилизована, очень игривая'),
    ('Пушок', 'Кот', 'Персидская', 'Мужской', '2020-12-03', 5.1, 'Белый', 'Михайлов Дмитрий Владимирович', '567890123456789', 'Аллергия на рыбу', 'Длинношерстный, требует регулярного груминга')
) AS pet_data(name, species, breed, gender, birth_date, weight, color, owner_name, microchip_number, allergies, medical_notes)
JOIN pet_owners po ON po.full_name = pet_data.owner_name;

-- Создание отзывов
INSERT INTO reviews (clinic_id, veterinarian_id, author_name, author_email, title, content, rating, is_verified, is_helpful_count)
SELECT 
    c.id,
    p.id,
    review_data.author_name,
    review_data.author_email,
    review_data.title,
    review_data.content,
    review_data.rating,
    true,
    review_data.helpful_count
FROM (VALUES
    ('ВетЦентр "Доктор Айболит"', 'Иванова Елена Сергеевна', 'Анна К.', 'anna.k@email.ru', 'Отличный врач!', 'Доктор Иванова очень внимательно осмотрела мою кошку, объяснила все проблемы и назначила эффективное лечение. Клиника современная, персонал вежливый.', 5, 12),
    ('ВетЦентр "Доктор Айболит"', 'Петров Михаил Александрович', 'Сергей М.', 'sergey.m@email.ru', 'Профессиональная операция', 'Петров М.А. провел стерилизацию моей собаки. Операция прошла отлично, собака быстро восстановилась. Врач очень опытный.', 5, 8),
    ('Клиника "Четыре лапы"', 'Сидорова Анна Викторовна', 'Мария П.', 'maria.p@email.ru', 'Помогли с кожными проблемами', 'У кота была аллергия, долго не могли найти причину. Доктор Сидорова быстро поставила диагноз и назначила лечение. Очень благодарны!', 5, 15),
    ('ВетПоиск "Северная"', 'Козлов Дмитрий Игоревич', 'Елена В.', 'elena.v@email.ru', 'Специалист по экзотическим животным', 'Лечили попугая у доктора Козлова. Очень редко встретишь такого специалиста по птицам. Попугай здоров, спасибо!', 5, 6),
    ('Клиника "Уральский ветеринар"', 'Лебедева Мария Андреевна', 'Дмитрий К.', 'dmitry.k@email.ru', 'Спасли зрение собаке', 'У собаки были проблемы с глазами. Доктор Лебедева провела сложную операцию, зрение удалось сохранить. Профессионал высокого класса!', 5, 20)
) AS review_data(clinic_name, vet_name, author_name, author_email, title, content, rating, helpful_count)
JOIN clinics c ON c.name = review_data.clinic_name
JOIN profiles p ON p.full_name = review_data.vet_name;

-- Обновление рейтингов клиник на основе отзывов
UPDATE clinics SET 
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

-- Создание записей на прием
INSERT INTO appointments (pet_id, veterinarian_id, service_id, appointment_date, appointment_time, reason, status, duration_minutes, total_cost)
SELECT 
    p.id,
    pr.id,
    s.id,
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    'Плановый осмотр',
    'scheduled',
    30,
    1500
FROM pets p
JOIN pet_owners po ON p.owner_id = po.id
JOIN profiles pr ON pr.role = 'veterinarian'
JOIN services s ON s.name = 'Общий осмотр'
LIMIT 3;

COMMIT;
