-- Заполнение базы данных тестовыми данными с правильными колонками

-- Очистка существующих данных (кроме городов)
DELETE FROM reviews;
DELETE FROM appointments;
DELETE FROM medical_records;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM clinics;
DELETE FROM services;

-- Вставка услуг
INSERT INTO services (name, description, price, duration_minutes, category, is_active) VALUES
('Общий осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 1500, 30, 'Консультации', true),
('Вакцинация', 'Профилактическая вакцинация от основных заболеваний', 2000, 20, 'Профилактика', true),
('Стерилизация кошек', 'Плановая операция по стерилизации кошек', 8000, 90, 'Хирургия', true),
('Кастрация котов', 'Плановая операция по кастрации котов', 6000, 60, 'Хирургия', true),
('УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 3000, 45, 'Диагностика', true),
('Рентген', 'Рентгенологическое исследование', 2500, 30, 'Диагностика', true),
('Чистка зубов', 'Профессиональная чистка зубов животного', 4000, 60, 'Стоматология', true),
('Лечение ран', 'Обработка и лечение ран различной сложности', 1800, 40, 'Терапия', true),
('Анализ крови', 'Общий и биохимический анализ крови', 2200, 15, 'Диагностика', true),
('Груминг', 'Комплексный уход за шерстью и когтями', 3500, 90, 'Груминг', true);

-- Вставка клиник
INSERT INTO clinics (name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) VALUES
('ВетЦентр Здоровье', 'Современная ветеринарная клиника с полным спектром услуг', 'ул. Ленина, 45', '+7 (495) 123-45-67', 'info@vetzentrzd.ru', 'https://vetzentrzd.ru', 
 (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), 55.7558, 37.6176, 4.5, 127, true,
 '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'),

('Айболит Плюс', 'Ветеринарная клиника с опытными специалистами', 'пр. Невский, 78', '+7 (812) 987-65-43', 'contact@aibolit-plus.ru', 'https://aibolit-plus.ru',
 (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), 59.9311, 30.3609, 4.3, 89, true,
 '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "09:00-17:00"}'),

('Четыре Лапы', 'Семейная ветеринарная клиника', 'ул. Красная, 123', '+7 (861) 555-77-88', 'info@4lapy-krd.ru', 'https://4lapy-krd.ru',
 (SELECT id FROM cities WHERE name = 'Краснодар' LIMIT 1), 45.0355, 38.9753, 4.7, 156, true,
 '{"monday": "09:00-19:00", "tuesday": "09:00-19:00", "wednesday": "09:00-19:00", "thursday": "09:00-19:00", "friday": "09:00-19:00", "saturday": "10:00-16:00", "sunday": "выходной"}');

-- Связь клиник с услугами
INSERT INTO clinic_services (clinic_id, service_id, price, is_available) 
SELECT c.id, s.id, s.price, true
FROM clinics c
CROSS JOIN services s;

-- Вставка владельцев животных
INSERT INTO pet_owners (full_name, email, phone, address, emergency_contact, notes) VALUES
('Иванова Мария Петровна', 'maria.ivanova@email.ru', '+7 (495) 111-22-33', 'г. Москва, ул. Тверская, 12, кв. 45', '+7 (495) 111-22-34', 'Предпочитает утренние приемы'),
('Петров Алексей Сергеевич', 'alex.petrov@email.ru', '+7 (812) 222-33-44', 'г. Санкт-Петербург, пр. Московский, 67, кв. 12', '+7 (812) 222-33-45', 'Животное боится громких звуков'),
('Сидорова Елена Викторовна', 'elena.sidorova@email.ru', '+7 (861) 333-44-55', 'г. Краснодар, ул. Красноармейская, 89, кв. 23', '+7 (861) 333-44-56', 'Регулярный клиент'),
('Козлов Дмитрий Андреевич', 'dmitry.kozlov@email.ru', '+7 (495) 444-55-66', 'г. Москва, ул. Арбат, 34, кв. 78', '+7 (495) 444-55-67', 'Предпочитает конкретного врача'),
('Морозова Анна Игоревна', 'anna.morozova@email.ru', '+7 (812) 555-66-77', 'г. Санкт-Петербург, ул. Рубинштейна, 45, кв. 56', '+7 (812) 555-66-78', 'Животное на диете');

-- Вставка животных
INSERT INTO pets (name, species, breed, gender, birth_date, weight, color, microchip_number, allergies, medical_notes, owner_id, is_active) VALUES
('Мурка', 'Кошка', 'Британская короткошерстная', 'Женский', '2020-03-15', 4.2, 'Серый', '123456789012345', 'Нет', 'Стерилизована', (SELECT id FROM pet_owners WHERE full_name = 'Иванова Мария Петровна'), true),
('Барсик', 'Кот', 'Мейн-кун', 'Мужской', '2019-07-22', 6.8, 'Рыжий', '234567890123456', 'Курица', 'Кастрирован', (SELECT id FROM pet_owners WHERE full_name = 'Петров Алексей Сергеевич'), true),
('Белка', 'Собака', 'Лабрадор', 'Женский', '2021-01-10', 28.5, 'Палевый', '345678901234567', 'Нет', 'Здорова', (SELECT id FROM pet_owners WHERE full_name = 'Сидорова Елена Викторовна'), true),
('Рекс', 'Собака', 'Немецкая овчарка', 'Мужской', '2018-11-05', 35.2, 'Черно-подпалый', '456789012345678', 'Говядина', 'Дисплазия тазобедренных суставов', (SELECT id FROM pet_owners WHERE full_name = 'Козлов Дмитрий Андреевич'), true),
('Пушок', 'Кролик', 'Декоративный', 'Мужской', '2022-05-18', 1.8, 'Белый', NULL, 'Нет', 'Здоров', (SELECT id FROM pet_owners WHERE full_name = 'Морозова Анна Игоревна'), true);

-- Вставка записей на прием
INSERT INTO appointments (pet_id, service_id, appointment_date, appointment_time, status, reason, duration_minutes, total_cost, follow_up_needed) VALUES
((SELECT id FROM pets WHERE name = 'Мурка'), (SELECT id FROM services WHERE name = 'Общий осмотр'), '2024-01-15', '10:00', 'Завершен', 'Плановый осмотр', 30, 1500, false),
((SELECT id FROM pets WHERE name = 'Барсик'), (SELECT id FROM services WHERE name = 'Вакцинация'), '2024-01-16', '14:30', 'Завершен', 'Ежегодная вакцинация', 20, 2000, true),
((SELECT id FROM pets WHERE name = 'Белка'), (SELECT id FROM services WHERE name = 'УЗИ брюшной полости'), '2024-01-17', '11:15', 'Завершен', 'Проверка после операции', 45, 3000, false),
((SELECT id FROM pets WHERE name = 'Рекс'), (SELECT id FROM services WHERE name = 'Рентген'), '2024-01-18', '16:00', 'Запланирован', 'Проверка суставов', 30, 2500, true),
((SELECT id FROM pets WHERE name = 'Пушок'), (SELECT id FROM services WHERE name = 'Общий осмотр'), '2024-01-19', '09:30', 'Запланирован', 'Первичный осмотр', 30, 1500, false);

-- Вставка отзывов
INSERT INTO reviews (clinic_id, author_name, author_email, title, content, rating, is_verified, is_helpful_count) VALUES
((SELECT id FROM clinics WHERE name = 'ВетЦентр Здоровье'), 'Мария И.', 'maria.i@email.ru', 'Отличная клиника!', 'Очень довольна обслуживанием. Врачи профессиональные, оборудование современное. Мурка чувствует себя отлично после лечения.', 5, true, 12),
((SELECT id FROM clinics WHERE name = 'ВетЦентр Здоровье'), 'Дмитрий К.', 'dmitry.k@email.ru', 'Хорошие специалисты', 'Рекса лечили от дисплазии. Врач все подробно объяснил, назначил правильное лечение. Рекомендую!', 4, true, 8),
((SELECT id FROM clinics WHERE name = 'Айболит Плюс'), 'Алексей П.', 'alex.p@email.ru', 'Профессиональный подход', 'Барсика вакцинировали без проблем. Персонал вежливый, цены адекватные. Обязательно вернемся.', 5, true, 15),
((SELECT id FROM clinics WHERE name = 'Четыре Лапы'), 'Елена С.', 'elena.s@email.ru', 'Семейная атмосфера', 'Очень уютная клиника, врачи относятся к животным с любовью. Белка не боялась процедур. Спасибо!', 5, true, 20),
((SELECT id FROM clinics WHERE name = 'Четыре Лапы'), 'Анна М.', 'anna.m@email.ru', 'Хорошее обслуживание', 'Пушка осмотрели быстро и качественно. Дали полезные рекомендации по уходу. Довольна результатом.', 4, true, 6);

-- Обновление счетчиков отзывов и рейтингов клиник
UPDATE clinics SET 
    rating = (SELECT AVG(rating::numeric) FROM reviews WHERE clinic_id = clinics.id),
    reviews_count = (SELECT COUNT(*) FROM reviews WHERE clinic_id = clinics.id)
WHERE id IN (SELECT DISTINCT clinic_id FROM reviews);

-- Вставка медицинских записей
INSERT INTO medical_records (pet_id, appointment_id, record_type, title, description, record_date, medications) VALUES
((SELECT id FROM pets WHERE name = 'Мурка'), (SELECT id FROM appointments WHERE pet_id = (SELECT id FROM pets WHERE name = 'Мурка') LIMIT 1), 'Осмотр', 'Плановый осмотр', 'Животное здорово, рекомендации по питанию даны', '2024-01-15', 'Витамины для шерсти'),
((SELECT id FROM pets WHERE name = 'Барсик'), (SELECT id FROM appointments WHERE pet_id = (SELECT id FROM pets WHERE name = 'Барсик') LIMIT 1), 'Вакцинация', 'Комплексная вакцинация', 'Проведена вакцинация от бешенства и комплексная', '2024-01-16', 'Нобивак'),
((SELECT id FROM pets WHERE name = 'Белка'), (SELECT id FROM appointments WHERE pet_id = (SELECT id FROM pets WHERE name = 'Белка') LIMIT 1), 'Диагностика', 'УЗИ брюшной полости', 'Органы в норме, послеоперационный период проходит хорошо', '2024-01-17', 'Нет');
