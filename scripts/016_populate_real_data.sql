-- Заполнение базы данных реальными данными для ВетПоиск

-- Очистка существующих данных (кроме городов)
DELETE FROM reviews;
DELETE FROM medical_records;
DELETE FROM appointments;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinics;
DELETE FROM services;
DELETE FROM profiles WHERE role != 'admin';

-- Сброс счетчиков
ALTER SEQUENCE IF EXISTS appointments_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS reviews_id_seq RESTART WITH 1;

-- Вставка услуг
INSERT INTO services (id, name, description, category, price, duration_minutes, is_active) VALUES
(gen_random_uuid(), 'Первичный осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 'Консультации', 1500, 30, true),
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
(gen_random_uuid(), 'Удаление зуба', 'Удаление больного зуба', 'Стоматология', 2500, 30, true),
(gen_random_uuid(), 'Груминг полный', 'Полный комплекс груминга', 'Груминг', 3500, 120, true),
(gen_random_uuid(), 'Стрижка когтей', 'Подрезание когтей', 'Груминг', 500, 15, true),
(gen_random_uuid(), 'Чипирование', 'Установка микрочипа для идентификации', 'Профилактика', 1500, 10, true),
(gen_random_uuid(), 'Обработка от паразитов', 'Обработка от блох и клещей', 'Профилактика', 800, 10, true),
(gen_random_uuid(), 'Дегельминтизация', 'Профилактика глистных инвазий', 'Профилактика', 600, 10, true),
(gen_random_uuid(), 'Вызов на дом', 'Выезд ветеринара на дом', 'Консультации', 3000, 60, true);

-- Вставка профилей ветеринаров
INSERT INTO profiles (id, full_name, email, phone, role, specialization, license_number, is_active) VALUES
(gen_random_uuid(), 'Иванова Елена Сергеевна', 'ivanova@vetpoisk.ru', '+7 (495) 123-45-67', 'veterinarian', 'Терапевт', 'ВЕТ-12345', true),
(gen_random_uuid(), 'Петров Михаил Александрович', 'petrov@vetpoisk.ru', '+7 (495) 234-56-78', 'veterinarian', 'Хирург', 'ВЕТ-23456', true),
(gen_random_uuid(), 'Сидорова Анна Викторовна', 'sidorova@vetpoisk.ru', '+7 (495) 345-67-89', 'veterinarian', 'Дерматолог', 'ВЕТ-34567', true),
(gen_random_uuid(), 'Козлов Дмитрий Игоревич', 'kozlov@vetpoisk.ru', '+7 (495) 456-78-90', 'veterinarian', 'Кардиолог', 'ВЕТ-45678', true),
(gen_random_uuid(), 'Морозова Ольга Петровна', 'morozova@vetpoisk.ru', '+7 (495) 567-89-01', 'veterinarian', 'Офтальмолог', 'ВЕТ-56789', true),
(gen_random_uuid(), 'Волков Алексей Николаевич', 'volkov@vetpoisk.ru', '+7 (495) 678-90-12', 'veterinarian', 'Онколог', 'ВЕТ-67890', true),
(gen_random_uuid(), 'Лебедева Мария Андреевна', 'lebedeva@vetpoisk.ru', '+7 (495) 789-01-23', 'veterinarian', 'Невролог', 'ВЕТ-78901', true),
(gen_random_uuid(), 'Новиков Сергей Владимирович', 'novikov@vetpoisk.ru', '+7 (495) 890-12-34', 'veterinarian', 'Ортопед', 'ВЕТ-89012', true),
(gen_random_uuid(), 'Федорова Татьяна Михайловна', 'fedorova@vetpoisk.ru', '+7 (495) 901-23-45', 'veterinarian', 'Эндокринолог', 'ВЕТ-90123', true),
(gen_random_uuid(), 'Соколов Игорь Анатольевич', 'sokolov@vetpoisk.ru', '+7 (495) 012-34-56', 'veterinarian', 'Стоматолог', 'ВЕТ-01234', true),
(gen_random_uuid(), 'Павлова Екатерина Дмитриевна', 'pavlova@vetpoisk.ru', '+7 (495) 123-45-68', 'veterinarian', 'Репродуктолог', 'ВЕТ-12346', true),
(gen_random_uuid(), 'Григорьев Андрей Сергеевич', 'grigoriev@vetpoisk.ru', '+7 (495) 234-56-79', 'veterinarian', 'Анестезиолог', 'ВЕТ-23457', true),
(gen_random_uuid(), 'Романова Светлана Александровна', 'romanova@vetpoisk.ru', '+7 (495) 345-67-80', 'veterinarian', 'Терапевт', 'ВЕТ-34568', true),
(gen_random_uuid(), 'Кузнецов Владимир Петрович', 'kuznetsov@vetpoisk.ru', '+7 (495) 456-78-91', 'veterinarian', 'Хирург', 'ВЕТ-45679', true),
(gen_random_uuid(), 'Васильева Наталья Игоревна', 'vasilieva@vetpoisk.ru', '+7 (495) 567-89-02', 'veterinarian', 'Дерматолог', 'ВЕТ-56780', true);

-- Вставка клиник
INSERT INTO clinics (id, name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) VALUES
(gen_random_uuid(), 'ВетЦентр "Здоровье"', 'Современная ветеринарная клиника с полным спектром услуг', 'ул. Тверская, 15', '+7 (495) 111-22-33', 'info@vetzdorovie.ru', 'https://vetzdorovie.ru', (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), 55.7558, 37.6176, 4.8, 156, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'),
(gen_random_uuid(), 'Клиника "Доктор Айболит"', 'Семейная ветеринарная клиника с 20-летним опытом', 'пр. Невский, 45', '+7 (812) 222-33-44', 'contact@aibolit-spb.ru', 'https://aibolit-spb.ru', (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), 59.9311, 30.3609, 4.7, 203, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "09:00-17:00"}'),
(gen_random_uuid(), 'ВетКлиника "Лапа"', 'Специализируемся на лечении кошек и собак', 'ул. Красная, 123', '+7 (861) 333-44-55', 'info@lapa-krasnodar.ru', 'https://lapa-krasnodar.ru', (SELECT id FROM cities WHERE name = 'Краснодар' LIMIT 1), 45.0355, 38.9753, 4.6, 89, true, '{"monday": "09:00-19:00", "tuesday": "09:00-19:00", "wednesday": "09:00-19:00", "thursday": "09:00-19:00", "friday": "09:00-19:00", "saturday": "10:00-16:00", "sunday": "выходной"}'),
(gen_random_uuid(), 'Центр ветеринарии "Пушистик"', 'Круглосуточная ветеринарная помощь', 'ул. Ленина, 67', '+7 (343) 444-55-66', 'help@pushistic-ekb.ru', 'https://pushistic-ekb.ru', (SELECT id FROM cities WHERE name = 'Екатеринбург' LIMIT 1), 56.8431, 60.6454, 4.9, 178, true, '{"monday": "24/7", "tuesday": "24/7", "wednesday": "24/7", "thursday": "24/7", "friday": "24/7", "saturday": "24/7", "sunday": "24/7"}'),
(gen_random_uuid(), 'ВетСервис "Друг"', 'Доступная ветеринарная помощь для всех', 'ул. Советская, 89', '+7 (383) 555-66-77', 'service@drug-nsk.ru', 'https://drug-nsk.ru', (SELECT id FROM cities WHERE name = 'Новосибирск' LIMIT 1), 55.0084, 82.9357, 4.5, 134, true, '{"monday": "08:30-20:30", "tuesday": "08:30-20:30", "wednesday": "08:30-20:30", "thursday": "08:30-20:30", "friday": "08:30-20:30", "saturday": "09:00-18:00", "sunday": "09:00-18:00"}'),
(gen_random_uuid(), 'Клиника "ВетМир"', 'Современное оборудование и опытные врачи', 'пр. Мира, 234', '+7 (495) 666-77-88', 'info@vetmir-msk.ru', 'https://vetmir-msk.ru', (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), 55.7887, 37.6343, 4.7, 267, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-19:00", "sunday": "10:00-19:00"}'),
(gen_random_uuid(), 'ВетЦентр "Забота"', 'Индивидуальный подход к каждому питомцу', 'ул. Московская, 156', '+7 (812) 777-88-99', 'care@zabota-spb.ru', 'https://zabota-spb.ru', (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), 59.9386, 30.3141, 4.8, 192, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-18:00", "sunday": "10:00-17:00"}'),
(gen_random_uuid(), 'Клиника "Четыре лапы"', 'Полный спектр ветеринарных услуг', 'ул. Челюскинцев, 78', '+7 (846) 888-99-00', 'info@4lapy-samara.ru', 'https://4lapy-samara.ru', (SELECT id FROM cities WHERE name = 'Самара' LIMIT 1), 53.2001, 50.15, 4.6, 145, true, '{"monday": "09:00-20:00", "tuesday": "09:00-20:00", "wednesday": "09:00-20:00", "thursday": "09:00-20:00", "friday": "09:00-20:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}');

-- Связывание ветеринаров с клиниками
INSERT INTO clinic_veterinarians (id, clinic_id, veterinarian_id, is_primary)
SELECT 
    gen_random_uuid(),
    c.id,
    p.id,
    (ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) = 1) as is_primary
FROM clinics c
CROSS JOIN profiles p
WHERE p.role = 'veterinarian'
AND RANDOM() < 0.4; -- 40% вероятность работы ветеринара в клинике

-- Связывание услуг с клиниками
INSERT INTO clinic_services (id, clinic_id, service_id, price, is_available)
SELECT 
    gen_random_uuid(),
    c.id,
    s.id,
    s.price * (0.8 + RANDOM() * 0.4), -- цена ±20% от базовой
    true
FROM clinics c
CROSS JOIN services s
WHERE RANDOM() < 0.8; -- 80% услуг доступны в каждой клинике

-- Вставка владельцев животных
INSERT INTO pet_owners (id, full_name, email, phone, address, emergency_contact, notes) VALUES
(gen_random_uuid(), 'Александров Петр Иванович', 'alexandrov@email.ru', '+7 (495) 111-11-11', 'г. Москва, ул. Арбат, 25, кв. 15', '+7 (495) 222-22-22', 'Предпочитает утренние приемы'),
(gen_random_uuid(), 'Смирнова Елена Александровна', 'smirnova@email.ru', '+7 (812) 333-33-33', 'г. Санкт-Петербург, пр. Невский, 78, кв. 42', '+7 (812) 444-44-44', 'Боится уколов, нужна предварительная подготовка'),
(gen_random_uuid(), 'Козлов Дмитрий Сергеевич', 'kozlov@email.ru', '+7 (343) 555-55-55', 'г. Екатеринбург, ул. Ленина, 134, кв. 67', '+7 (343) 666-66-66', 'Владелец нескольких животных'),
(gen_random_uuid(), 'Морозова Анна Викторовна', 'morozova@email.ru', '+7 (861) 777-77-77', 'г. Краснодар, ул. Красная, 89, кв. 23', '+7 (861) 888-88-88', 'Регулярно посещает груминг'),
(gen_random_uuid(), 'Волков Михаил Петрович', 'volkov@email.ru', '+7 (383) 999-99-99', 'г. Новосибирск, ул. Советская, 156, кв. 78', '+7 (383) 000-00-00', 'Предпочитает одного врача'),
(gen_random_uuid(), 'Лебедева Ольга Дмитриевна', 'lebedeva@email.ru', '+7 (846) 111-22-33', 'г. Самара, ул. Челюскинцев, 45, кв. 12', '+7 (846) 444-55-66', 'Животное на специальной диете'),
(gen_random_uuid(), 'Новиков Алексей Игоревич', 'novikov@email.ru', '+7 (495) 777-88-99', 'г. Москва, ул. Тверская, 67, кв. 89', '+7 (495) 000-11-22', 'Часто путешествует с питомцем'),
(gen_random_uuid(), 'Федорова Светлана Андреевна', 'fedorova@email.ru', '+7 (812) 333-44-55', 'г. Санкт-Петербург, ул. Московская, 123, кв. 45', '+7 (812) 666-77-88', 'Предпочитает женщин-врачей'),
(gen_random_uuid(), 'Соколов Владимир Николаевич', 'sokolov@email.ru', '+7 (343) 999-00-11', 'г. Екатеринбург, пр. Мира, 234, кв. 56', '+7 (343) 222-33-44', 'Животное пожилое, требует особого ухода'),
(gen_random_uuid(), 'Павлова Наталья Сергеевна', 'pavlova@email.ru', '+7 (861) 555-66-77', 'г. Краснодар, ул. Ленина, 78, кв. 90', '+7 (861) 888-99-00', 'Владелец породистых животных');

-- Вставка животных
INSERT INTO pets (id, name, species, breed, gender, birth_date, weight, color, microchip_number, allergies, medical_notes, owner_id, is_active) VALUES
(gen_random_uuid(), 'Мурка', 'Кошка', 'Британская короткошерстная', 'Женский', '2020-03-15', 4.2, 'Серый', 'RU123456789', 'Аллергия на курицу', 'Стерилизована', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Барсик', 'Кот', 'Мейн-кун', 'Мужской', '2019-07-22', 6.8, 'Рыжий с белым', 'RU234567890', NULL, 'Кастрирован, склонен к мочекаменной болезни', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Рекс', 'Собака', 'Немецкая овчарка', 'Мужской', '2018-11-08', 32.5, 'Черно-коричневый', 'RU345678901', 'Аллергия на говядину', 'Дисплазия тазобедренных суставов', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Лайка', 'Собака', 'Хаски', 'Женский', '2021-01-30', 22.3, 'Серо-белый', 'RU456789012', NULL, 'Стерилизована, активная', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Пушок', 'Кот', 'Персидская', 'Мужской', '2020-09-12', 5.1, 'Белый', 'RU567890123', 'Аллергия на рыбу', 'Длинная шерсть, требует регулярного груминга', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Белка', 'Кошка', 'Сиамская', 'Женский', '2019-05-18', 3.8, 'Кремовый с темными отметинами', 'RU678901234', NULL, 'Стерилизована, очень активная', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Джек', 'Собака', 'Джек-рассел-терьер', 'Мужской', '2020-12-03', 8.9, 'Белый с коричневыми пятнами', 'RU789012345', NULL, 'Кастрирован, энергичный', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Луна', 'Собака', 'Лабрадор', 'Женский', '2019-08-25', 28.7, 'Золотистый', 'RU890123456', 'Аллергия на пшеницу', 'Стерилизована, склонна к полноте', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Симба', 'Кот', 'Мейн-кун', 'Мужской', '2021-04-10', 7.2, 'Рыжий', 'RU901234567', NULL, 'Молодой, игривый', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Нюша', 'Кошка', 'Шотландская вислоухая', 'Женский', '2020-06-14', 4.5, 'Серый', 'RU012345678', NULL, 'Стерилизована, спокойная', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Тузик', 'Собака', 'Дворняжка', 'Мужской', '2018-03-20', 15.6, 'Коричневый', 'RU123450987', NULL, 'Кастрирован, найден на улице', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Мася', 'Кошка', 'Дворовая', 'Женский', '2019-10-05', 3.9, 'Трехцветная', 'RU234561098', NULL, 'Стерилизована, очень ласковая', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Арчи', 'Собака', 'Золотистый ретривер', 'Мужской', '2020-02-28', 31.2, 'Золотистый', 'RU345672109', NULL, 'Кастрирован, дружелюбный', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Кися', 'Кошка', 'Русская голубая', 'Женский', '2021-07-16', 4.1, 'Серо-голубой', 'RU456783210', NULL, 'Стерилизована, независимая', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Бобик', 'Собака', 'Французский бульдог', 'Мужской', '2019-12-11', 12.8, 'Палевый', 'RU567894321', 'Проблемы с дыханием', 'Кастрирован, требует особого ухода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true);

-- Вставка записей на прием
INSERT INTO appointments (id, pet_id, veterinarian_id, service_id, appointment_date, appointment_time, status, reason, duration_minutes, total_cost, notes)
SELECT 
    gen_random_uuid(),
    p.id,
    (SELECT cv.veterinarian_id FROM clinic_veterinarians cv JOIN clinics c ON cv.clinic_id = c.id ORDER BY RANDOM() LIMIT 1),
    s.id,
    CURRENT_DATE + (RANDOM() * 30)::int,
    ('09:00'::time + (RANDOM() * 10 * interval '1 hour')),
    CASE 
        WHEN RANDOM() < 0.3 THEN 'scheduled'
        WHEN RANDOM() < 0.6 THEN 'completed'
        WHEN RANDOM() < 0.8 THEN 'confirmed'
        ELSE 'cancelled'
    END,
    CASE s.category
        WHEN 'Консультации' THEN 'Плановый осмотр'
        WHEN 'Профилактика' THEN 'Вакцинация'
        WHEN 'Хирургия' THEN 'Плановая операция'
        WHEN 'Диагностика' THEN 'Обследование'
        ELSE 'Лечение'
    END,
    s.duration_minutes,
    (SELECT cs.price FROM clinic_services cs WHERE cs.service_id = s.id ORDER BY RANDOM() LIMIT 1),
    'Автоматически созданная запись'
FROM pets p
CROSS JOIN services s
WHERE RANDOM() < 0.1 -- 10% вероятность записи для каждой комбинации питомец-услуга
LIMIT 50;

-- Вставка отзывов
INSERT INTO reviews (id, clinic_id, veterinarian_id, author_name, author_email, rating, title, content, is_verified, is_helpful_count) VALUES
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Мария К.', 'maria.k@email.ru', 5, 'Отличная клиника!', 'Очень довольна обслуживанием. Врачи профессиональные, внимательные. Мой кот чувствует себя прекрасно после лечения. Обязательно буду обращаться еще!', true, 12),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Алексей П.', 'alex.p@email.ru', 4, 'Хорошие врачи', 'Качественное лечение, но долго ждали в очереди. В целом рекомендую, особенно доктора Иванову - очень компетентный специалист.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Елена С.', 'elena.s@email.ru', 5, 'Спасли нашего питомца', 'Экстренно обратились с собакой. Врачи сработали быстро и профессионально. Операция прошла успешно. Огромное спасибо всему персоналу!', true, 15),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Дмитрий В.', 'dmitry.v@email.ru', 3, 'Средне', 'Лечение помогло, но цены высоковаты. Врач хороший, но администратор была не очень вежливая. В целом результатом доволен.', true, 5),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Ольга М.', 'olga.m@email.ru', 5, 'Лучшая клиника в городе', 'Уже несколько лет обслуживаемся здесь. Всегда качественно, быстро, с пониманием. Особенно нравится доктор Петров - настоящий профессионал!', true, 20),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Игорь Л.', 'igor.l@email.ru', 4, 'Рекомендую', 'Хорошая клиника с современным оборудованием. Врачи знают свое дело. Единственный минус - не всегда удобное время записи.', true, 7),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Наталья Р.', 'natalia.r@email.ru', 5, 'Профессионалы своего дела', 'Стерилизовали кошку. Все прошло отлично, быстрое восстановление. Врач подробно объяснил послеоперационный уход. Очень благодарна!', true, 11),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Сергей К.', 'sergey.k@email.ru', 4, 'Хорошее обслуживание', 'Регулярно делаем прививки нашим питомцам. Всегда все проходит гладко. Персонал дружелюбный, цены адекватные.', true, 6),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Анна Т.', 'anna.t@email.ru', 5, 'Спасибо за заботу', 'Лечили собаку от дерматита. Врач очень внимательно отнесся к проблеме, назначил эффективное лечение. Результат превзошел ожидания!', true, 14),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Владимир Н.', 'vladimir.n@email.ru', 4, 'Качественная диагностика', 'Делали УЗИ коту. Современное оборудование, квалифицированный врач. Диагноз поставили точно, лечение помогло.', true, 9),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Татьяна Ж.', 'tatiana.zh@email.ru', 5, 'Отличный сервис', 'Круглосуточная клиника - это большой плюс. Ночью привезли кота с отравлением, сразу оказали помощь. Врачи работают профессионально в любое время!', true, 18),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Михаил Б.', 'mikhail.b@email.ru', 3, 'Неплохо, но есть нюансы', 'Лечение эффективное, но пришлось долго ждать результатов анализов. В остальном все хорошо, врач компетентный.', true, 4),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Светлана Д.', 'svetlana.d@email.ru', 5, 'Рекомендую всем', 'Уже третий год обслуживаемся в этой клинике. Всегда довольны качеством услуг. Особенно хочется отметить доктора Сидорову - золотые руки!', true, 16),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Андрей Г.', 'andrey.g@email.ru', 4, 'Хорошая клиника', 'Чистота, порядок, вежливый персонал. Цены средние по городу. Врачи знающие, но иногда торопятся на приеме.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Екатерина Ф.', 'ekaterina.f@email.ru', 5, 'Превосходно!', 'Кастрировали кота. Операция прошла идеально, быстрое заживление. Врач дал подробные рекомендации по уходу. Очень довольны результатом!', true, 13);

-- Обновление рейтингов клиник на основе отзывов
UPDATE clinics SET 
    rating = subq.avg_rating,
    reviews_count = subq.review_count
FROM (
    SELECT 
        clinic_id,
        ROUND(AVG(rating::numeric), 1) as avg_rating,
        COUNT(*) as review_count
    FROM reviews 
    WHERE clinic_id IS NOT NULL
    GROUP BY clinic_id
) subq
WHERE clinics.id = subq.clinic_id;

-- Создание индексов для оптимизации поиска
CREATE INDEX IF NOT EXISTS idx_clinics_city_rating ON clinics(city_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_clinic_rating ON reviews(clinic_id, rating DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX IF NOT EXISTS idx_pets_owner_active ON pets(owner_id, is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role, is_active);

-- Обновление статистики
ANALYZE;
