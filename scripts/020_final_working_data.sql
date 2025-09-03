-- Очистка существующих данных (кроме городов)
DELETE FROM reviews;
DELETE FROM appointments;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM profiles WHERE role != 'admin';
DELETE FROM clinics;
DELETE FROM services;

-- Создание услуг
INSERT INTO services (name, description, price, duration_minutes, category, is_active) VALUES
('Общий осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 1500.00, 30, 'Консультации', true),
('Вакцинация', 'Профилактическая вакцинация от основных заболеваний', 2000.00, 20, 'Профилактика', true),
('Стерилизация кошек', 'Плановая стерилизация кошек с анестезией', 8000.00, 90, 'Хирургия', true),
('Кастрация котов', 'Плановая кастрация котов с анестезией', 6000.00, 60, 'Хирургия', true),
('УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 3000.00, 45, 'Диагностика', true),
('Рентген', 'Рентгенологическое исследование', 2500.00, 30, 'Диагностика', true),
('Лечение зубов', 'Санация ротовой полости, удаление зубного камня', 4000.00, 60, 'Стоматология', true),
('Груминг', 'Полный комплекс груминга: стрижка, мытье, сушка', 3500.00, 120, 'Груминг', true),
('Анализ крови', 'Общий и биохимический анализ крови', 2200.00, 15, 'Диагностика', true),
('Чипирование', 'Установка микрочипа для идентификации животного', 1800.00, 15, 'Профилактика', true);

-- Создание клиник
INSERT INTO clinics (name, address, phone, email, description, rating, review_count, city_id, is_active) 
SELECT 
    clinic_data.name,
    clinic_data.address,
    clinic_data.phone,
    clinic_data.email,
    clinic_data.description,
    clinic_data.rating,
    clinic_data.review_count,
    c.id,
    true
FROM (VALUES
    ('ВетЦентр Здоровье', 'ул. Ленина, 45', '+7 (495) 123-45-67', 'info@vetzd.ru', 'Современная ветеринарная клиника с полным спектром услуг', 4.8, 156, 'Москва'),
    ('Айболит Плюс', 'пр. Невский, 78', '+7 (812) 987-65-43', 'contact@aibolit.spb.ru', 'Ветеринарная клиника с опытными специалистами', 4.6, 89, 'Санкт-Петербург'),
    ('Четыре Лапы', 'ул. Красная, 12', '+7 (861) 555-33-22', 'info@4lapy.ru', 'Семейная ветклиника с домашней атмосферой', 4.7, 67, 'Краснодар'),
    ('ВетМед Центр', 'ул. Тверская, 89', '+7 (495) 777-88-99', 'admin@vetmed.moscow', 'Многопрофильный ветеринарный центр', 4.9, 203, 'Москва'),
    ('Доктор Вет', 'ул. Рубинштейна, 34', '+7 (812) 444-55-66', 'hello@drvet.spb', 'Клиника экстренной ветеринарной помощи', 4.5, 124, 'Санкт-Петербург')
) AS clinic_data(name, address, phone, email, description, rating, review_count, city_name)
JOIN cities c ON c.name = clinic_data.city_name;

-- Создание профилей ветеринаров (без привязки к auth.users)
INSERT INTO profiles (id, full_name, phone, role, specialization, experience_years, education, about, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Иванова Анна Сергеевна', '+7 (495) 123-11-11', 'veterinarian', 'Терапевт', 8, 'МГАВМиБ им. К.И. Скрябина', 'Опытный ветеринар-терапевт, специализируется на лечении кошек и собак', true),
    ('22222222-2222-2222-2222-222222222222', 'Петров Михаил Александрович', '+7 (812) 456-22-22', 'veterinarian', 'Хирург', 12, 'СПбГАВМ', 'Ветеринарный хирург высшей категории, более 1000 успешных операций', true),
    ('33333333-3333-3333-3333-333333333333', 'Сидорова Елена Викторовна', '+7 (861) 789-33-33', 'veterinarian', 'Дерматолог', 6, 'КубГАУ', 'Специалист по дерматологии и аллергологии животных', true),
    ('44444444-4444-4444-4444-444444444444', 'Козлов Дмитрий Иванович', '+7 (495) 321-44-44', 'veterinarian', 'Кардиолог', 10, 'МГАВМиБ им. К.И. Скрябина', 'Ветеринарный кардиолог, эксперт по заболеваниям сердца у животных', true),
    ('55555555-5555-5555-5555-555555555555', 'Морозова Ольга Петровна', '+7 (812) 654-55-55', 'veterinarian', 'Офтальмолог', 7, 'СПбГАВМ', 'Ветеринарный офтальмолог, специалист по глазным болезням', true);

-- Связывание ветеринаров с клиниками
INSERT INTO clinic_veterinarians (clinic_id, veterinarian_id, is_primary)
SELECT c.id, p.id, true
FROM clinics c
CROSS JOIN profiles p
WHERE p.role = 'veterinarian'
AND (
    (c.name = 'ВетЦентр Здоровье' AND p.full_name IN ('Иванова Анна Сергеевна', 'Козлов Дмитрий Иванович')) OR
    (c.name = 'Айболит Плюс' AND p.full_name IN ('Петров Михаил Александрович', 'Морозова Ольга Петровна')) OR
    (c.name = 'Четыре Лапы' AND p.full_name = 'Сидорова Елена Викторовна') OR
    (c.name = 'ВетМед Центр' AND p.full_name IN ('Иванова Анна Сергеевна', 'Петров Михаил Александрович')) OR
    (c.name = 'Доктор Вет' AND p.full_name = 'Морозова Ольга Петровна')
);

-- Связывание клиник с услугами
INSERT INTO clinic_services (clinic_id, service_id, is_available)
SELECT c.id, s.id, true
FROM clinics c
CROSS JOIN services s;

-- Создание владельцев животных
INSERT INTO pet_owners (full_name, phone, email, address, notes)
VALUES
    ('Смирнов Алексей Владимирович', '+7 (495) 111-22-33', 'smirnov@email.ru', 'г. Москва, ул. Арбат, 15', 'Постоянный клиент'),
    ('Кузнецова Мария Ивановна', '+7 (812) 222-33-44', 'kuznetsova@mail.ru', 'г. Санкт-Петербург, пр. Мира, 67', 'Владелец двух кошек'),
    ('Попов Сергей Николаевич', '+7 (861) 333-44-55', 'popov@gmail.com', 'г. Краснодар, ул. Красная, 89', 'Заводчик собак'),
    ('Васильева Анна Петровна', '+7 (495) 444-55-66', 'vasilieva@yandex.ru', 'г. Москва, ул. Тверская, 123', 'Первое посещение'),
    ('Николаев Игорь Сергеевич', '+7 (812) 555-66-77', 'nikolaev@inbox.ru', 'г. Санкт-Петербург, ул. Невская, 45', 'Владелец экзотических животных');

-- Создание питомцев
INSERT INTO pets (name, species, breed, age_years, weight_kg, gender, color, microchip_number, medical_notes, owner_id)
SELECT 
    pet_data.name,
    pet_data.species,
    pet_data.breed,
    pet_data.age_years,
    pet_data.weight_kg,
    pet_data.gender,
    pet_data.color,
    pet_data.microchip_number,
    pet_data.medical_notes,
    po.id
FROM (VALUES
    ('Мурка', 'Кошка', 'Британская короткошерстная', 3, 4.2, 'Женский', 'Серый', '123456789012345', 'Склонность к аллергии', 'Смирнов Алексей Владимирович'),
    ('Барсик', 'Кот', 'Мейн-кун', 5, 7.8, 'Мужской', 'Рыжий', '234567890123456', 'Здоров', 'Кузнецова Мария Ивановна'),
    ('Рекс', 'Собака', 'Немецкая овчарка', 4, 32.5, 'Мужской', 'Черно-коричневый', '345678901234567', 'Дисплазия тазобедренных суставов', 'Попов Сергей Николаевич'),
    ('Белка', 'Кошка', 'Сиамская', 2, 3.1, 'Женский', 'Кремовый', '456789012345678', 'Здорова', 'Васильева Анна Петровна'),
    ('Чарли', 'Собака', 'Лабрадор', 6, 28.3, 'Мужской', 'Золотистый', '567890123456789', 'Избыточный вес', 'Николаев Игорь Сергеевич')
) AS pet_data(name, species, breed, age_years, weight_kg, gender, color, microchip_number, medical_notes, owner_name)
JOIN pet_owners po ON po.full_name = pet_data.owner_name;

-- Создание записей на прием
INSERT INTO appointments (clinic_id, veterinarian_id, pet_id, service_id, appointment_date, appointment_time, duration_minutes, status, reason, diagnosis, treatment, notes, is_emergency, emergency_fee, total_cost)
SELECT 
    c.id,
    p.id,
    pet.id,
    s.id,
    appt_data.appointment_date,
    appt_data.appointment_time,
    appt_data.duration_minutes,
    appt_data.status,
    appt_data.reason,
    appt_data.diagnosis,
    appt_data.treatment,
    appt_data.notes,
    appt_data.is_emergency,
    appt_data.emergency_fee,
    appt_data.total_cost
FROM (VALUES
    ('ВетЦентр Здоровье', 'Иванова Анна Сергеевна', 'Мурка', 'Общий осмотр', '2024-01-15', '10:00:00', 30, 'Завершен', 'Плановый осмотр', 'Здорова', 'Профилактические рекомендации', 'Рекомендован повторный осмотр через 6 месяцев', false, null, 1500.00),
    ('Айболит Плюс', 'Петров Михаил Александрович', 'Рекс', 'Стерилизация кошек', '2024-01-20', '14:00:00', 90, 'Завершен', 'Плановая операция', 'Успешная операция', 'Стерилизация выполнена', 'Послеоперационный уход 7 дней', false, null, 8000.00),
    ('Четыре Лапы', 'Сидорова Елена Викторовна', 'Белка', 'УЗИ брюшной полости', '2024-01-25', '11:30:00', 45, 'Завершен', 'Диагностика', 'Норма', 'Органы в норме', 'Патологий не выявлено', false, null, 3000.00),
    ('ВетМед Центр', 'Козлов Дмитрий Иванович', 'Чарли', 'Анализ крови', '2024-02-01', '09:00:00', 15, 'Запланирован', 'Профилактика', null, null, 'Плановое обследование', false, null, 2200.00),
    ('Доктор Вет', 'Морозова Ольга Петровна', 'Барсик', 'Общий осмотр', '2024-02-05', '16:00:00', 30, 'Запланирован', 'Консультация', null, null, 'Первичный прием', false, null, 1500.00)
) AS appt_data(clinic_name, vet_name, pet_name, service_name, appointment_date, appointment_time, duration_minutes, status, reason, diagnosis, treatment, notes, is_emergency, emergency_fee, total_cost)
JOIN clinics c ON c.name = appt_data.clinic_name
JOIN profiles p ON p.full_name = appt_data.vet_name
JOIN pets pet ON pet.name = appt_data.pet_name
JOIN services s ON s.name = appt_data.service_name;

-- Создание отзывов
INSERT INTO reviews (clinic_id, veterinarian_id, pet_owner_id, rating, comment, is_verified, is_anonymous)
SELECT 
    c.id,
    p.id,
    po.id,
    review_data.rating,
    review_data.comment,
    review_data.is_verified,
    review_data.is_anonymous
FROM (VALUES
    ('ВетЦентр Здоровье', 'Иванова Анна Сергеевна', 'Смирнов Алексей Владимирович', 5, 'Отличный врач! Мурка чувствует себя прекрасно после лечения. Очень внимательное отношение к животному и владельцу.', true, false),
    ('Айболит Плюс', 'Петров Михаил Александрович', 'Попов Сергей Николаевич', 5, 'Профессиональный хирург. Операция прошла успешно, Рекс быстро восстановился. Рекомендую!', true, false),
    ('Четыре Лапы', 'Сидорова Елена Викторовна', 'Васильева Анна Петровна', 4, 'Хорошая клиника, квалифицированные специалисты. Белке провели качественное УЗИ. Единственный минус - долго ждали в очереди.', true, false),
    ('ВетМед Центр', 'Козлов Дмитрий Иванович', 'Николаев Игорь Сергеевич', 5, 'Лучший кардиолог в городе! Чарли теперь чувствует себя намного лучше. Спасибо за профессионализм!', true, false),
    ('Доктор Вет', 'Морозова Ольга Петровна', 'Кузнецова Мария Ивановна', 4, 'Компетентный офтальмолог. Барсику помогли с проблемами глаз. Цены немного высоковаты, но результат того стоит.', true, false)
) AS review_data(clinic_name, vet_name, owner_name, rating, comment, is_verified, is_anonymous)
JOIN clinics c ON c.name = review_data.clinic_name
JOIN profiles p ON p.full_name = review_data.vet_name
JOIN pet_owners po ON po.full_name = review_data.owner_name;

-- Обновление рейтингов клиник на основе отзывов
UPDATE clinics 
SET rating = subquery.avg_rating,
    review_count = subquery.review_count
FROM (
    SELECT 
        clinic_id,
        ROUND(AVG(rating::numeric), 1) as avg_rating,
        COUNT(*) as review_count
    FROM reviews 
    GROUP BY clinic_id
) AS subquery
WHERE clinics.id = subquery.clinic_id;
