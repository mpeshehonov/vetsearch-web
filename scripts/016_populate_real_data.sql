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
(gen_random_uuid(), 'Васильева Наталья Игоревна', 'vasilieva@vetpoisk.ru', '+7 (495) 567-89-02', 'veterinarian', 'Дерматолог', 'ВЕТ-56780', true),
-- Новые ветеринары для расширения данных
(gen_random_uuid(), 'Попов Сергей Викторович', 'popov@vetpoisk.ru', '+7 (843) 111-22-33', 'veterinarian', 'Терапевт', 'ВЕТ-11111', true),
(gen_random_uuid(), 'Соколова Мария Дмитриевна', 'sokolova@vetpoisk.ru', '+7 (831) 222-33-44', 'veterinarian', 'Хирург', 'ВЕТ-22222', true),
(gen_random_uuid(), 'Михайлов Александр Сергеевич', 'mikhailov@vetpoisk.ru', '+7 (863) 333-44-55', 'veterinarian', 'Терапевт', 'ВЕТ-33333', true),
(gen_random_uuid(), 'Кузьмина Ольга Андреевна', 'kuzmina@vetpoisk.ru', '+7 (351) 444-55-66', 'veterinarian', 'Кардиолог', 'ВЕТ-44444', true),
(gen_random_uuid(), 'Воронов Дмитрий Петрович', 'voronov@vetpoisk.ru', '+7 (381) 555-66-77', 'veterinarian', 'Хирург', 'ВЕТ-55555', true),
(gen_random_uuid(), 'Никитина Анна Михайловна', 'nikitina@vetpoisk.ru', '+7 (843) 666-77-88', 'veterinarian', 'Офтальмолог', 'ВЕТ-66666', true),
(gen_random_uuid(), 'Зайцев Владимир Иванович', 'zaitsev@vetpoisk.ru', '+7 (831) 777-88-99', 'veterinarian', 'Дерматолог', 'ВЕТ-77777', true),
(gen_random_uuid(), 'Андреева Светлана Павловна', 'andreeva@vetpoisk.ru', '+7 (863) 888-99-00', 'veterinarian', 'Терапевт', 'ВЕТ-88888', true),
(gen_random_uuid(), 'Прохоров Алексей Константинович', 'prokhorov@vetpoisk.ru', '+7 (351) 999-00-11', 'veterinarian', 'Невролог', 'ВЕТ-99999', true),
(gen_random_uuid(), 'Морозов Илья Владимирович', 'morozov@vetpoisk.ru', '+7 (381) 000-11-22', 'veterinarian', 'Стоматолог', 'ВЕТ-00000', true);

-- Вставка клиник
INSERT INTO clinics (id, name, description, address, phone, email, website, city_id, latitude, longitude, rating, reviews_count, is_active, working_hours) VALUES
(gen_random_uuid(), 'ВетЦентр "Здоровье"', 'Современная ветеринарная клиника с полным спектром услуг', 'ул. Тверская, 15', '+7 (495) 111-22-33', 'info@vetzdorovie.ru', 'https://vetzdorovie.ru', (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), 55.7558, 37.6176, 4.8, 156, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'),
(gen_random_uuid(), 'Клиника "Доктор Айболит"', 'Семейная ветеринарная клиника с 20-летним опытом', 'пр. Невский, 45', '+7 (812) 222-33-44', 'contact@aibolit-spb.ru', 'https://aibolit-spb.ru', (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), 59.9311, 30.3609, 4.7, 203, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "09:00-17:00"}'),
(gen_random_uuid(), 'ВетПоиск "Лапа"', 'Специализируемся на лечении кошек и собак', 'ул. Красная, 123', '+7 (861) 333-44-55', 'info@lapa-krasnodar.ru', 'https://lapa-krasnodar.ru', (SELECT id FROM cities WHERE name = 'Краснодар' LIMIT 1), 45.0355, 38.9753, 4.6, 89, true, '{"monday": "09:00-19:00", "tuesday": "09:00-19:00", "wednesday": "09:00-19:00", "thursday": "09:00-19:00", "friday": "09:00-19:00", "saturday": "10:00-16:00", "sunday": "выходной"}'),
(gen_random_uuid(), 'Центр ветеринарии "Пушистик"', 'Круглосуточная ветеринарная помощь', 'ул. Ленина, 67', '+7 (343) 444-55-66', 'help@pushistic-ekb.ru', 'https://pushistic-ekb.ru', (SELECT id FROM cities WHERE name = 'Екатеринбург' LIMIT 1), 56.8431, 60.6454, 4.9, 178, true, '{"monday": "24/7", "tuesday": "24/7", "wednesday": "24/7", "thursday": "24/7", "friday": "24/7", "saturday": "24/7", "sunday": "24/7"}'),
(gen_random_uuid(), 'ВетСервис "Друг"', 'Доступная ветеринарная помощь для всех', 'ул. Советская, 89', '+7 (383) 555-66-77', 'service@drug-nsk.ru', 'https://drug-nsk.ru', (SELECT id FROM cities WHERE name = 'Новосибирск' LIMIT 1), 55.0084, 82.9357, 4.5, 134, true, '{"monday": "08:30-20:30", "tuesday": "08:30-20:30", "wednesday": "08:30-20:30", "thursday": "08:30-20:30", "friday": "08:30-20:30", "saturday": "09:00-18:00", "sunday": "09:00-18:00"}'),
(gen_random_uuid(), 'Клиника "ВетМир"', 'Современное оборудование и опытные врачи', 'пр. Мира, 234', '+7 (495) 666-77-88', 'info@vetmir-msk.ru', 'https://vetmir-msk.ru', (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), 55.7887, 37.6343, 4.7, 267, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-19:00", "sunday": "10:00-19:00"}'),
(gen_random_uuid(), 'ВетЦентр "Забота"', 'Индивидуальный подход к каждому питомцу', 'ул. Московская, 156', '+7 (812) 777-88-99', 'care@zabota-spb.ru', 'https://zabota-spb.ru', (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), 59.9386, 30.3141, 4.8, 192, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-18:00", "sunday": "10:00-17:00"}'),
(gen_random_uuid(), 'Клиника "Четыре лапы"', 'Полный спектр ветеринарных услуг', 'ул. Челюскинцев, 78', '+7 (846) 888-99-00', 'info@4lapy-samara.ru', 'https://4lapy-samara.ru', (SELECT id FROM cities WHERE name = 'Самара' LIMIT 1), 53.2001, 50.15, 4.6, 145, true, '{"monday": "09:00-20:00", "tuesday": "09:00-20:00", "wednesday": "09:00-20:00", "thursday": "09:00-20:00", "friday": "09:00-20:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'),
-- Новые клиники в дополнительных городах
(gen_random_uuid(), 'ВетЦентр "Казанский"', 'Современная клиника с широким спектром услуг', 'ул. Баумана, 45', '+7 (843) 123-45-67', 'info@kazanvet.ru', 'https://kazanvet.ru', (SELECT id FROM cities WHERE name = 'Казань' LIMIT 1), 55.8304, 49.0661, 4.4, 87, true, '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "выходной"}'),
(gen_random_uuid(), 'Клиника "Волга-Вет"', 'Специализация на хирургии и терапии', 'пр. Ленина, 78', '+7 (831) 234-56-78', 'contact@volgavet-nn.ru', 'https://volgavet-nn.ru', (SELECT id FROM cities WHERE name = 'Нижний Новгород' LIMIT 1), 56.2965, 43.9361, 4.6, 112, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-18:00", "sunday": "10:00-18:00"}'),
(gen_random_uuid(), 'ВетСервис "Южный"', 'Круглосуточная ветпомощь', 'ул. Большая Садовая, 123', '+7 (863) 345-67-89', 'help@southvet.ru', 'https://southvet.ru', (SELECT id FROM cities WHERE name = 'Ростов-на-Дону' LIMIT 1), 47.2357, 39.7015, 4.7, 156, true, '{"monday": "24/7", "tuesday": "24/7", "wednesday": "24/7", "thursday": "24/7", "friday": "24/7", "saturday": "24/7", "sunday": "24/7"}'),
(gen_random_uuid(), 'Центр "ЗооМед"', 'Инновационные методы лечения животных', 'пр. Ленина, 267', '+7 (351) 456-78-90', 'info@zoomd-chelyabinsk.ru', 'https://zoomd-chelyabinsk.ru', (SELECT id FROM cities WHERE name = 'Челябинск' LIMIT 1), 55.1644, 61.4368, 4.5, 98, true, '{"monday": "09:00-20:00", "tuesday": "09:00-20:00", "wednesday": "09:00-20:00", "thursday": "09:00-20:00", "friday": "09:00-20:00", "saturday": "10:00-17:00", "sunday": "выходной"}'),
(gen_random_uuid(), 'Клиника "Омский ветеринар"', 'Комплексная ветеринарная помощь', 'ул. Ленина, 89', '+7 (381) 567-89-01', 'service@omskvet.ru', 'https://omskvet.ru', (SELECT id FROM cities WHERE name = 'Омск' LIMIT 1), 54.9885, 73.3242, 4.3, 76, true, '{"monday": "08:00-19:00", "tuesday": "08:00-19:00", "wednesday": "08:00-19:00", "thursday": "08:00-19:00", "friday": "08:00-19:00", "saturday": "09:00-16:00", "sunday": "выходной"}'),
(gen_random_uuid(), 'ВетПоиск "Центральный"', 'Современная клиника в центре Казани', 'ул. Кремлевская, 12', '+7 (843) 678-90-12', 'info@central-kazan.ru', 'https://central-kazan.ru', (SELECT id FROM cities WHERE name = 'Казань' LIMIT 1), 55.7879, 49.1233, 4.8, 134, true, '{"monday": "09:00-21:00", "tuesday": "09:00-21:00", "wednesday": "09:00-21:00", "thursday": "09:00-21:00", "friday": "09:00-21:00", "saturday": "10:00-20:00", "sunday": "11:00-18:00"}');

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
(gen_random_uuid(), 'Павлова Наталья Сергеевна', 'pavlova@email.ru', '+7 (861) 555-66-77', 'г. Краснодар, ул. Ленина, 78, кв. 90', '+7 (861) 888-99-00', 'Владелец породистых животных'),
-- Новые владельцы животных с географическим распределением
(gen_random_uuid(), 'Александрова Мария Ивановна', 'alexandrovam@email.ru', '+7 (495) 111-00-11', 'г. Москва, ул. Пушкина, 25, кв. 45', '+7 (495) 222-00-11', 'Регулярные визиты с кошкой'),
(gen_random_uuid(), 'Борисов Андрей Петрович', 'borisov@email.ru', '+7 (812) 333-00-22', 'г. Санкт-Петербург, ул. Невского, 78, кв. 12', '+7 (812) 444-00-22', 'Работает допоздна, предпочитает вечерние приемы'),
(gen_random_uuid(), 'Владимирова Ольга Сергеевна', 'vladimirova@email.ru', '+7 (343) 555-00-33', 'г. Екатеринбург, ул. Мира, 134, кв. 67', '+7 (343) 666-00-33', 'Животное пожилое, требует особого ухода'),
(gen_random_uuid(), 'Григорьева Анна Дмитриевна', 'grigorieva@email.ru', '+7 (383) 777-00-44', 'г. Новосибирск, ул. Советская, 156, кв. 89', '+7 (383) 888-00-44', 'Аллергия на шерсть, предпочитает скоординированные приемы'),
(gen_random_uuid(), 'Дмитриев Михаил Владимирович', 'dmitriev@email.ru', '+7 (846) 999-00-55', 'г. Самара, ул. Московская, 78, кв. 23', '+7 (846) 000-00-55', 'Есть опыт лечения экзотических животных'),
(gen_random_uuid(), 'Егорова Екатерина Андреевна', 'egorova@email.ru', '+7 (843) 111-00-66', 'г. Казань, ул. Баумана, 45, кв. 78', '+7 (843) 222-00-66', 'Нужен врач с опытом работы с щенками'),
(gen_random_uuid(), 'Жуков Сергей Иванович', 'zhukov@email.ru', '+7 (831) 333-00-77', 'г. Нижний Новгород, пр. Ленина, 123, кв. 45', '+7 (831) 444-00-77', 'Спортсмен, есть собака-спортсмен'),
(gen_random_uuid(), 'Зайцева Наталья Петровна', 'zaitseva@email.ru', '+7 (863) 555-00-88', 'г. Ростов-на-Дону, ул. Красноармейская, 67, кв. 90', '+7 (863) 666-00-88', 'Живет в частном доме, животное с доступом на улицу'),
(gen_random_uuid(), 'Иванов Алексей Сергеевич', 'ivanova@email.ru', '+7 (351) 777-00-99', 'г. Челябинск, пр. Победы, 89, кв. 12', '+7 (351) 888-00-99', 'Требует подробной консультации по питанию'),
(gen_random_uuid(), 'Климова Мария Дмитриевна', 'klimova@email.ru', '+7 (381) 999-00-00', 'г. Омск, ул. Ленина, 156, кв. 34', '+7 (381) 000-00-00', 'Ищет клинику с хорошими отзывами'),
(gen_random_uuid(), 'Лазарева Ольга Викторовна', 'lazareva@email.ru', '+7 (495) 111-00-22', 'г. Москва, ул. Арбата, 78, кв. 56', '+7 (495) 222-00-22', 'Животное с хроническим заболеванием'),
(gen_random_uuid(), 'Медведев Дмитрий Андреевич', 'medvedev@email.ru', '+7 (812) 333-00-33', 'г. Санкт-Петербург, ул. Литейная, 23, кв. 14', '+7 (812) 444-00-33', 'Предпочитает одного постоянного врача'),
(gen_random_uuid(), 'Николаева Светлана Павловна', 'nikolaeva@email.ru', '+7 (861) 555-00-44', 'г. Краснодар, ул. Красноармейская, 89, кв. 67', '+7 (861) 666-00-44', 'Животное очень активное, нуждается в регулярных прививках'),
(gen_random_uuid(), 'Орлов Виктор Иванович', 'orlov@email.ru', '+7 (343) 777-00-55', 'г. Екатеринбург, ул. Вайнера, 45, кв. 78', '+7 (343) 888-00-55', 'Второй владелец, опыт обращения в ветклиники'),
(gen_random_uuid(), 'Петрова Анна Михайловна', 'petrova@email.ru', '+7 (383) 999-00-66', 'г. Новосибирск, ул. Фрунзе, 12, кв. 23', '+7 (383) 000-00-66', 'Нужен врач с хорошими рекомендациями'),
(gen_random_uuid(), 'Романов Сергей Владимирович', 'romanov@email.ru', '+7 (846) 111-00-77', 'г. Самара, ул. Самарская, 34, кв. 45', '+7 (846) 222-00-77', 'Животное пожилое, требует профилактики'),
(gen_random_uuid(), 'Сергеева Марина Андреевна', 'sergeeva@email.ru', '+7 (843) 333-00-88', 'г. Казань, ул. Островского, 67, кв. 89', '+7 (843) 444-00-88', 'Ищет клинику с современным оборудованием'),
(gen_random_uuid(), 'Тимофеев Алексей Иванович', 'timofeev@email.ru', '+7 (831) 555-00-99', 'г. Нижний Новгород, ул. Горького, 12, кв. 34', '+7 (831) 666-00-99', 'Животное с аллергией на корм'),
(gen_random_uuid(), 'Уварова Наталья Сергеевна', 'uvarova@email.ru', '+7 (863) 777-00-00', 'г. Ростов-на-Дону, ул. Соколова, 45, кв. 67', '+7 (863) 888-00-00', 'Нуждаетесь в услугах груминга'),
(gen_random_uuid(), 'Филиппов Михаил Петрович', 'filippov@email.ru', '+7 (351) 999-00-11', 'г. Челябинск, ул. Труда, 78, кв. 90', '+7 (351) 000-00-11', 'Животное породистое, участие в выставках'),
(gen_random_uuid(), 'Харитонова Ольга Дмитриевна', 'kharitonova@email.ru', '+7 (381) 111-00-22', 'г. Омск, пр. Карла Маркса, 23, кв. 45', '+7 (381) 222-00-22', 'Регулярное обслуживание нескольких животных'),
(gen_random_uuid(), 'Цветкова Мария Сергеевна', 'tsvetkova@email.ru', '+7 (495) 333-00-33', 'г. Москва, ул. Тверская, 89, кв. 12', '+7 (495) 444-00-33', 'Требует срочной ветпомощи'),
(gen_random_uuid(), 'Чайкин Дмитрий Викторович', 'chaikin@email.ru', '+7 (812) 555-00-44', 'г. Санкт-Петербург, ул. Гороховая, 34, кв. 56', '+7 (812) 666-00-44', 'Ищет клинику с хорошей репутацией'),
(gen_random_uuid(), 'Шевченко Анна Павловна', 'shevchenko@email.ru', '+7 (861) 777-00-55', 'г. Краснодар, ул. Ставропольская, 67, кв. 78', '+7 (861) 888-00-55', 'Животное с проблемами кожи'),
(gen_random_uuid(), 'Щербакова Наталья Ивановна', 'scherbakova@email.ru', '+7 (343) 999-00-66', 'г. Екатеринбург, ул. Щорса, 12, кв. 34', '+7 (343) 000-00-66', 'Нужен комплексный осмотр');

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
(gen_random_uuid(), 'Бобик', 'Собака', 'Французский бульдог', 'Мужской', '2019-12-11', 12.8, 'Палевый', 'RU567894321', 'Проблемы с дыханием', 'Кастрирован, требует особого ухода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
-- Новые животные с разнообразием пород и медицинских показаний
(gen_random_uuid(), 'Тоби', 'Собака', 'Бишон фризе', 'Мужской', '2020-05-14', 8.5, 'Белый', 'RU100000000', NULL, 'Стерилизован, регулярный груминг', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Снежинка', 'Кошка', 'Сфинкс', 'Женский', '2021-01-25', 3.2, 'Розовый', 'RU100000001', NULL, 'Стерилизована, требует специальный уход за кожей', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Маркиз', 'Кот', 'Абиссинский', 'Мужской', '2019-08-30', 4.8, 'Шоколадный', 'RU100000002', NULL, 'Кастрирован, очень активный', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Герда', 'Собака', 'Бигль', 'Женский', '2020-11-08', 14.2, 'Трехцветный', 'RU100000003', 'Корм для собак с чувствительным пищеварением', 'Стерилизована, склонна к полноте', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Марс', 'Кот', 'Бенгальский', 'Мужской', '2021-03-12', 5.5, 'Браун', 'RU100000004', NULL, 'Кастрирован, требует много активности', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Звезда', 'Кошка', 'Ориентальная', 'Женский', '2019-06-18', 3.9, 'Блю', 'RU100000005', NULL, 'Стерилизована, вокальная', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Шарик', 'Собака', 'Шарпей', 'Мужской', '2018-09-05', 25.3, 'Серый', 'RU100000006', 'Особенности кожи шарпея', 'Кастрирован, регулярная чистка складок кожи', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Лили', 'Собака', 'Лабрадор', 'Женский', '2020-12-01', 4.6, 'Лиловый', 'RU100000007', NULL, 'Стерилизована, спокойная', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Бруно', 'Собака', 'Боксер', 'Мужской', '2019-04-22', 28.7, 'Тигровый', 'RU100000008', 'Дважды в год обработка от паразитов', 'Кастрирован, редкая порода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Найда', 'Собака', 'Самоед', 'Женский', '2021-02-14', 19.8, 'Белый', 'RU100000009', NULL, 'Стерилизована, любит снег', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Мурзик', 'Кот', 'Экзотическая', 'Мужской', '2020-07-09', 4.9, 'Голубой', 'RU100000010', 'Особый уход за шерстью', 'Кастрирован, короткий нос', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Принцесса', 'Кошка', 'Тонкинская', 'Женский', '2021-06-03', 3.1, 'Тонкинез', 'RU100000011', 'Гиперактивность', 'Стерилизована, любит играть', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Рокки', 'Собака', 'Аляскинский маламут', 'Мужской', '2019-11-27', 42.5, 'Серо-белый', 'RU100000012', NULL, 'Кастрирован, ездовой chien', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Шэди', 'Кошка', 'Сибирская', 'Женский', '2020-04-16', 5.2, 'Небесная', 'RU100000013', NULL, 'Стерилизована, длинная шерсть', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Джордж', 'Кот', 'Американская короткошерстная', 'Мужской', '2018-12-10', 5.8, 'Серебристый', 'RU100000014', 'Проблемы с зубами', 'Кастрирован, взрослый', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Миссис', 'Собака', 'Йоркширский терьер', 'Женский', '2022-01-08', 3.2, 'Золотистый', 'RU100000015', NULL, 'Не стерилизована, активная', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Всеволод', 'Кот', 'Невская маскарадная', 'Мужской', '2019-09-21', 6.1, 'Голубой', 'RU100000016', NULL, 'Кастрирован, страдает почечными коликами', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Даша', 'Собака', 'Австралийская овчарка', 'Женский', '2020-08-13', 23.4, 'Блю мerle', 'RU100000017', 'Глаза требуют регулярного обследования', 'Стерилизована, рабочая собака', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Кеша', 'Кот', 'Манчкин', 'Мужской', '2021-05-27', 4.5, 'Калико', 'RU100000018', 'Короткие лапы - особая анатомия', 'Кастрирован, игривый', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Люси', 'Собака', 'Кавалер Кинг Чарльз спаниель', 'Женский', '2019-07-04', 8.6, 'Кёрл', 'RU100000019', NULL, 'Стерилизована, спокойная порода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Граф', 'Кот', 'Азиатская табби', 'Мужской', '2020-10-19', 4.7, 'Браун табби', 'RU100000020', NULL, 'Кастрирован, гиперактивный', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Адель', 'Кошка', 'Бомбейская', 'Женский', '2021-08-11', 3.8, 'Черная', 'RU100000021', NULL, 'Стерилизована, любит ласку', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Цезарь', 'Собака', 'Ротвейлер', 'Мужской', '2018-03-30', 35.6, 'Черный с коричневыми подпалинами', 'RU100000022', 'Крупная порода - нагрузка на суставы', 'Кастрирован, крупная собака', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Джулия', 'Кошка', 'Японский бобтейл', 'Женский', '2020-01-16', 3.4, 'Ми-к', 'RU100000023', NULL, 'Стерилизована, короткий хвост', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Бакс', 'Собака', 'Басенджи', 'Мужской', '2019-02-05', 11.2, 'Красный белый', 'RU100000024', 'Особенности породы - вой вместо лая', 'Кастрирован, редкая порода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Фея', 'Кошка', 'Бурмезская', 'Женский', '2021-09-28', 4.2, 'Голубая кремовая', 'RU100000025', NULL, 'Стерилизована, сиамский тип', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Рекс', 'Собака', 'Доберман', 'Мужской', '2020-06-22', 29.8, 'Черный', 'RU100000026', NULL, 'Кастрирован, крупных размеров', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Вольт', 'Собака', 'Сибирский хаски', 'Мужской', '2020-03-17', 27.5, 'Серо-белый', 'RU100000028', 'Проблемы с суставами', 'Кастрирован, активная собака', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Мила', 'Кошка', 'Шотландская вислоухая', 'Женский', '2019-05-09', 4.3, 'Блю', 'RU100000029', NULL, 'Стерилизована, плюшевые уши', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Лучик', 'Собака', 'Китайская хохлатая', 'Женский', '2022-04-25', 4.1, 'Голден', 'RU100000030', 'Уход за шерстью - частично лысая порода', 'Не стерилизована, маленькая порода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Барон', 'Кот', 'Корат', 'Мужской', '2019-10-31', 4.0, 'Серебристый', 'RU100000031', 'Глаза - зелёные вишни', 'Кастрирован, спокойный', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Шанти', 'Собака', 'Акита-ину', 'Женский', '2021-07-06', 32.1, 'Белый', 'RU100000032', NULL, 'Стерилизована, крупная японская порода', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Мурчало', 'Кот', 'Русская голубая', 'Мужской', '2020-12-03', 4.8, 'Серо-голубой', 'RU100000033', 'Стандартное состояние здоровья', 'Кастрирован, здоровый', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true),
(gen_random_uuid(), 'Рокси', 'Собака', 'Бультерьер', 'Женский', '2019-01-28', 26.3, 'Белый', 'RU100000034', 'Особенности породы - яйцевидная голова', 'Стерилизована, мускулистая', (SELECT id FROM pet_owners ORDER BY RANDOM() LIMIT 1), true);

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
WHERE RANDOM() < 0.25 -- 25% вероятность записи для каждой комбинации питомец-услуга
LIMIT 300;

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
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Екатерина Ф.', 'ekaterina.f@email.ru', 5, 'Превосходно!', 'Кастрировали кота. Операция прошла идеально, быстрое заживление. Врач дал подробные рекомендации по уходу. Очень довольны результатом!', true, 13),
-- Новые отзывы с более реалистичными оценками
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Антон К.', 'anton.k@email.ru', 4, 'Хороший сервис', 'Делали УЗИ собаки. Всё быстро и качественно. Врач объяснил результаты. Цена приемлемая.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Марина Л.', 'marina.l@email.ru', 5, 'Отличная помощь', 'Специалисты помогли с отравлением кота. Работали ночью, спасли животное. Огромная благодарность!', true, 12),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Денис М.', 'denis.m@email.ru', 3, 'Среднее впечатление', 'Лечили аллергию у хомяка. Подобрали лечение, но хотелось бы больше информации о профилактике.', true, 4),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Ольга С.', 'olga.s@email.ru', 4, 'Довольна обслуживанием', 'Делали вакцину собаке. Всё прошло безупречно. Персонал вежливый, условия чистые.', true, 6),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Павел И.', 'pavel.i@email.ru', 5, 'Профессионалы', 'Хирургическое вмешательство у кошки. Всё на высоком уровне. Рекомендую!', true, 15),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Нина Р.', 'nina.r@email.ru', 4, 'Хорошие врачи', 'Лечили кожное заболевание. Диагностика точная, лечение эффективное. Ценник выше среднего.', true, 7),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Сергей В.', 'sergey.v@email.ru', 5, 'Лучшая клиника!', 'Стерилизовали нашего щенка. Весь процесс от А до Я. Спасибо за заботу!', true, 10),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Тамара Ж.', 'tamara.zh@email.ru', 4, 'Качественная работа', 'Регулярные осмотры у стоматолога. Зубы в порядке, всё чисто и аккуратно.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Виктор Г.', 'viktor.g@email.ru', 3, 'Неплохо', 'Анализы крови для кота. Результаты точные, но очередь была немалая.', true, 5),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Юлия Ш.', 'yulia.sh@email.ru', 5, 'Экстренная помощь', 'Попали с болями у собаки. Приняли сразу, спасли зуб. Большое спасибо!', true, 14),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Андрей Т.', 'andrey.t@email.ru', 4, 'Хорошо отзываются', 'Груминг для шпица. Стрижка качественная, цена kaydet ресурс.', true, 9),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Елена Б.', 'elena.b@email.ru', 5, 'Супер!', 'Привили всех наших животных. Всё быстро, без стресса. Врач общительная.', true, 16),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Максим Ф.', 'maksim.f@email.ru', 4, 'Доверяю', 'Лечили глисты у кошки. Подобрали комплекс, всё прошло хорошо.', true, 11),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Алла У.', 'alla.u@email.ru', 3, 'Популярное место', 'УЗИ брюшной полости. Оборудование хорошее, но хочется больше консультации.', true, 4),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Роман Х.', 'roman.kh@email.ru', 5, 'Топовая клиника', 'Сложная операция у птицы. Сохранили пернатого друга. Врачи - герои!', true, 18),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Инна Ц.', 'inna.ts@email.ru', 4, 'Все по делу', 'Рентген для таксы. Диагностировали патологию, начали лечение. Эффективно.', true, 7),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Станислав Ч.', 'stanislav.ch@email.ru', 5, 'Рекомендую', 'Стрижка когтей и профилактика. Всё сделали качественно и аккуратно.', true, 12),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Лидия Ш.', 'lidiya.sh@email.ru', 4, 'Надежно', 'Дегулизация паразитов. Обработка прошла без проблем, животное здорово.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Кирилл Щ.', 'kirill.shch@email.ru', 3, 'Обычная история', 'Лечили уши у кота. Помогло, но хотелось бы больше внимания к деталям.', true, 5),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Валентина Э.', 'valentina.e@email.ru', 5, 'Великолепно!', 'Первичный осмотр и вакцинация щенка. Всё объяснили, показали. Довольна!', true, 20),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Николай Ю.', 'nikolai.y@email.ru', 4, 'Хорошо', 'Повторный осмотр after лечения. Врач констатировал улучшения. Планируем завершить курс.', true, 9),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Анастасия Я.', 'anastasia.a@email.ru', 5, 'Отличная команда', 'Вызывали на дом для попугая. Приехали быстро, оказали помощь. Профессионально!', true, 13),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Владислав О.', 'vladislav.o@email.ru', 4, 'Положительный опыт', 'Анализы крови и биохимия. Диагностика уточнена, лечение скорректировано.', true, 6),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Галина П.', 'galina.p@email.ru', 5, 'Спасли животное', 'Экстренная помощь ночью с закупоркой ЖКТ. Операция удалась, питомец дома!', true, 17),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Дмитрий Р.', 'dmitry.r@email.ru', 4, 'Удобно', 'Обработка от блōх и клещей. Услуги доступны, персонал квалифицированный.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Евгения С.', 'evgenia.s@email.ru', 3, 'Средне', 'Удаление зуба у собаки. Выполнено, но реабилитация затянулась.', true, 4),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Илья К.', 'ilya.k@email.ru', 5, 'Мастер своего дела', 'Стоматолог провел комплексную чистку. Зубы как новые! Спасибо за заботу.', true, 15),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Ксения Л.', 'ksenia.l@email.ru', 4, 'Довольна результатом', 'Комплексная вакцинация всех моих кошек. Всё по графику, без осложнений.', true, 10),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Леонид М.', 'leonid.m@email.ru', 5, 'Высокий уровень', 'Хирургия удаления опухоли. Всё прошло успешно, восстановление нормальное.', true, 12),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Надежда Н.', 'nadezhda.n@email.ru', 4, 'Доверяю специалистам', 'Терапевтическое лечение хронического заболевания. Продолжаем поддерживающую терапию.', true, 7),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Олег А.', 'oleg.a@email.ru', 3, 'Цена соответствует качеству', 'Дерматолог диагностировал аллергию. Лечение помогает, но дорого.', true, 5),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Полина Б.', 'polina.b@email.ru', 5, 'Идеально!', 'Кастрация кота без осложнений. Врач всё объяснил, заживление быстрое.', true, 14),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Рустам В.', 'rustam.v@email.ru', 4, 'Хороший выбор', 'Чипирование и регистрация. Всё по закону, документы готовы.', true, 9),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Софья Г.', 'sofya.g@email.ru', 5, 'Благодарю', 'Помогли с мочекаменной болезнью у кота. Диета подобрана, состояние улучшилось.', true, 16),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Тимур Д.', 'timur.d@email.ru', 4, 'Профессионально', 'Кардиолог осмотрел собаку с шумом в сердце. Назначил обследование.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Ульяна Е.', 'ulyana.e@email.ru', 3, 'Нормально', 'Офтальмолог проверил глаза. Всё в порядке, но приём был торопливым.', true, 4),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Фёдор Ж.', 'fedor.zh@email.ru', 5, 'Лучшее место', 'Онколог помог с диагностикой. Ранняя стадия, начали лечение. Очень благодарен!', true, 18),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Христина З.', 'kristina.z@email.ru', 4, 'Хорошее отношение', 'Невролог проконсультировал по эпилепсии. Подобрали препараты.', true, 7),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Эдуард И.', 'eduard.i@email.ru', 5, 'Отлично', 'Стерилизация кошки с мониторингом. Всё прошло гладко, уход за животным комфортный.', true, 11),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Юрий К.', 'yuri.k@email.ru', 4, 'Рекомендуют', 'Ортопед посмотрел на лапу после травмы. Рентген показал перелом, наложили гипс.', true, 9),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Ярослав Л.', 'yaroslav.l@email.ru', 5, 'Высокий класс', 'Анестезиолог обеспечил безболезненную процедуру чистки зубов. Результат на высоте!', true, 15),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Александр М.', 'aleksandr.m@email.ru', 4, 'Удовлетворен', 'Эндокринолог проконтрoliровал сахар у собаки. Всё под контролем.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Вера Н.', 'vera.n@email.ru', 3, 'Средний уровень', 'Репродуктолог помог с планированием вязки. Информация есть, но хотелось бы подробнее.', true, 4),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Геннадий О.', 'gennadiy.o@email.ru', 5, 'Прекрасная клиника', 'Стоматолог вылечил зубы птице. Такой мелкий пациент - восхищаюсь мастерством!', true, 13),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Дарья П.', 'daria.p@email.ru', 4, 'Хорошо', 'Вызд ли на дом для прививки. Удобно и недорого.', true, 10),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Егор Р.', 'egor.r@email.ru', 5, 'Отличное обслуживание', 'Комплексный осмотр всех животных семьи. Всё детально, с рекомендациями.', true, 12),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Жанна С.', 'zhanna.s@email.ru', 4, 'Доволюсь', 'Обработка от паразитов для экзотики. Специалисты знают своё дело.', true, 7),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Зинаида Т.', 'zinaida.t@email.ru', 3, 'Оценка 3', 'Лечённое обследование несколько дней. Результаты пришли поздно.', true, 5),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Иван У.', 'ivan.u@email.ru', 5, 'Спасибо большое!', 'Спасли собаку от обезвоживания. Капельница и лечение - животное поправилось!', true, 17),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Клара Ф.', 'klara.f@email.ru', 4, 'Хороший сервис', 'Груминг для длинношерстной породы. Мастер деликатный, результат отличный.', true, 8),
(gen_random_uuid(), (SELECT id FROM clinics ORDER BY RANDOM() LIMIT 1), (SELECT id FROM profiles WHERE role = 'veterinarian' ORDER BY RANDOM() LIMIT 1), 'Лариса Х.', 'larisa.kh@email.ru', 5, 'Профи', 'Оказали неотложную помощь иппотерапии. Всё быстро и профессионально.', true, 14);

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
