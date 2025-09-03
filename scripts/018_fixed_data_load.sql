-- Исправленный скрипт загрузки тестовых данных без foreign key ошибок
-- Создаем только базовые данные без привязки к конкретным пользователям

-- Очищаем существующие данные (кроме городов)
DELETE FROM reviews;
DELETE FROM appointments;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM clinics;
DELETE FROM services;

-- Создаем услуги
INSERT INTO services (name, description, price_from, price_to, duration_minutes) VALUES
('Первичный осмотр', 'Комплексный осмотр животного с консультацией ветеринара', 800, 1500, 30),
('Вакцинация', 'Профилактическая вакцинация собак и кошек', 1200, 2500, 20),
('Стерилизация кошек', 'Плановая стерилизация кошек с анестезией', 3500, 6000, 60),
('Кастрация котов', 'Плановая кастрация котов с анестезией', 2500, 4000, 45),
('Стерилизация собак', 'Плановая стерилизация собак с анестезией', 5000, 12000, 90),
('Кастрация кобелей', 'Плановая кастрация кобелей с анестезией', 4000, 8000, 75),
('УЗИ брюшной полости', 'Ультразвуковое исследование органов брюшной полости', 1800, 2500, 30),
('Рентген', 'Рентгенологическое исследование', 1500, 3000, 20),
('Анализ крови общий', 'Общий клинический анализ крови', 800, 1200, 15),
('Анализ крови биохимический', 'Биохимический анализ крови', 1500, 2200, 15),
('Чистка зубов', 'Профессиональная чистка зубов под седацией', 3000, 5000, 60),
('Удаление зубов', 'Хирургическое удаление зубов', 1000, 3000, 45),
('Обрезка когтей', 'Гигиеническая обрезка когтей', 300, 500, 15),
('Груминг кошек', 'Полный груминг кошек (мытье, стрижка, сушка)', 2000, 4000, 90),
('Груминг собак', 'Полный груминг собак (мытье, стрижка, сушка)', 2500, 6000, 120),
('Лечение дерматитов', 'Диагностика и лечение кожных заболеваний', 1200, 3000, 45),
('Офтальмологический осмотр', 'Осмотр глаз и диагностика глазных заболеваний', 1000, 1800, 30),
('Кардиологическое обследование', 'ЭКГ и эхокардиография', 2500, 4000, 45),
('Неврологический осмотр', 'Диагностика неврологических нарушений', 2000, 3500, 60),
('Эндоскопия', 'Эндоскопическое исследование ЖКТ', 4000, 7000, 60);

-- Создаем клиники в разных городах
INSERT INTO clinics (name, address, phone, email, description, rating, reviews_count, city_id, working_hours, website) VALUES
('ВетЦентр "Здоровье"', 'ул. Ленина, 45', '+7 (495) 123-45-67', 'info@vetzd.ru', 'Современная ветеринарная клиника с полным спектром услуг', 4.8, 156, (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), '{"пн-пт": "9:00-21:00", "сб-вс": "10:00-18:00"}', 'https://vetzd.ru'),
('Клиника "Лапки"', 'пр. Невский, 78', '+7 (812) 987-65-43', 'contact@lapki.spb.ru', 'Семейная ветклиника с индивидуальным подходом', 4.6, 89, (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), '{"пн-сб": "8:00-20:00", "вс": "10:00-16:00"}', 'https://lapki.spb.ru'),
('ВетМед Новосибирск', 'ул. Красный проспект, 156', '+7 (383) 555-12-34', 'info@vetmed-nsk.ru', 'Крупнейшая ветклиника Сибири с современным оборудованием', 4.7, 203, (SELECT id FROM cities WHERE name = 'Новосибирск' LIMIT 1), '{"пн-вс": "24/7"}', 'https://vetmed-nsk.ru'),
('Клиника "Айболит"', 'ул. Мира, 23', '+7 (495) 777-88-99', 'help@aibolit.vet', 'Экстренная ветеринарная помощь круглосуточно', 4.5, 134, (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), '{"пн-вс": "24/7"}', 'https://aibolit.vet'),
('ВетКлиника "Друг"', 'ул. Московская, 67', '+7 (812) 444-55-66', 'info@drug-vet.ru', 'Специализируемся на лечении экзотических животных', 4.9, 78, (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), '{"пн-пт": "9:00-19:00", "сб": "10:00-16:00", "вс": "выходной"}', 'https://drug-vet.ru');

-- Создаем связи клиник с услугами (все клиники предоставляют все услуги)
INSERT INTO clinic_services (clinic_id, service_id)
SELECT c.id, s.id 
FROM clinics c 
CROSS JOIN services s;

-- Создаем владельцев животных
INSERT INTO pet_owners (full_name, phone, email, address) VALUES
('Иванов Петр Сергеевич', '+7 (495) 111-22-33', 'ivanov@mail.ru', 'г. Москва, ул. Тверская, 12, кв. 45'),
('Петрова Анна Владимировна', '+7 (812) 222-33-44', 'petrova@gmail.com', 'г. Санкт-Петербург, пр. Литейный, 34, кв. 78'),
('Сидоров Михаил Александрович', '+7 (383) 333-44-55', 'sidorov@yandex.ru', 'г. Новосибирск, ул. Ленина, 56, кв. 12'),
('Козлова Елена Дмитриевна', '+7 (495) 444-55-66', 'kozlova@mail.ru', 'г. Москва, ул. Арбат, 23, кв. 67'),
('Морозов Алексей Игоревич', '+7 (812) 555-66-77', 'morozov@gmail.com', 'г. Санкт-Петербург, ул. Рубинштейна, 45, кв. 89'),
('Волкова Ольга Николаевна', '+7 (383) 666-77-88', 'volkova@yandex.ru', 'г. Новосибирск, пр. Маркса, 78, кв. 34'),
('Лебедев Дмитрий Петрович', '+7 (495) 777-88-99', 'lebedev@mail.ru', 'г. Москва, ул. Покровка, 67, кв. 12'),
('Соколова Мария Сергеевна', '+7 (812) 888-99-00', 'sokolova@gmail.com', 'г. Санкт-Петербург, наб. Фонтанки, 89, кв. 45');

-- Создаем животных
INSERT INTO pets (name, species, breed, age_years, weight_kg, gender, color, owner_id, medical_notes) VALUES
('Мурка', 'Кошка', 'Британская короткошерстная', 3, 4.2, 'Самка', 'Серая', (SELECT id FROM pet_owners WHERE full_name = 'Иванов Петр Сергеевич'), 'Стерилизована, прививки актуальны'),
('Барсик', 'Кот', 'Мейн-кун', 5, 7.8, 'Самец', 'Рыжий с белым', (SELECT id FROM pet_owners WHERE full_name = 'Петрова Анна Владимировна'), 'Кастрирован, склонность к МКБ'),
('Рекс', 'Собака', 'Немецкая овчарка', 4, 32.5, 'Самец', 'Черно-подпалый', (SELECT id FROM pet_owners WHERE full_name = 'Сидоров Михаил Александрович'), 'Дисплазия тазобедренных суставов'),
('Белка', 'Кошка', 'Сиамская', 2, 3.1, 'Самка', 'Сил-пойнт', (SELECT id FROM pet_owners WHERE full_name = 'Козлова Елена Дмитриевна'), 'Молодая, здоровая'),
('Джек', 'Собака', 'Джек-рассел-терьер', 6, 8.9, 'Самец', 'Белый с рыжими пятнами', (SELECT id FROM pet_owners WHERE full_name = 'Морозов Алексей Игоревич'), 'Кастрирован, аллергия на курицу'),
('Дымка', 'Кошка', 'Русская голубая', 1, 2.8, 'Самка', 'Голубая', (SELECT id FROM pet_owners WHERE full_name = 'Волкова Ольга Николаевна'), 'Котенок, первые прививки'),
('Граф', 'Собака', 'Лабрадор', 8, 28.3, 'Самец', 'Палевый', (SELECT id FROM pet_owners WHERE full_name = 'Лебедев Дмитрий Петрович'), 'Пожилой, артрит'),
('Принцесса', 'Кошка', 'Персидская', 4, 4.8, 'Самка', 'Белая', (SELECT id FROM pet_owners WHERE full_name = 'Соколова Мария Сергеевна'), 'Длинная шерсть, регулярный груминг');

-- Создаем записи на прием
INSERT INTO appointments (clinic_id, pet_id, service_id, appointment_date, appointment_time, status, notes, total_cost) VALUES
((SELECT id FROM clinics WHERE name = 'ВетЦентр "Здоровье"' LIMIT 1), (SELECT id FROM pets WHERE name = 'Мурка'), (SELECT id FROM services WHERE name = 'Первичный осмотр'), CURRENT_DATE + INTERVAL '1 day', '10:00', 'Запланирована', 'Плановый осмотр', 1200),
((SELECT id FROM clinics WHERE name = 'Клиника "Лапки"' LIMIT 1), (SELECT id FROM pets WHERE name = 'Барсик'), (SELECT id FROM services WHERE name = 'УЗИ брюшной полости'), CURRENT_DATE + INTERVAL '2 days', '14:30', 'Запланирована', 'Проверка почек', 2200),
((SELECT id FROM clinics WHERE name = 'ВетМед Новосибирск' LIMIT 1), (SELECT id FROM pets WHERE name = 'Рекс'), (SELECT id FROM services WHERE name = 'Рентген'), CURRENT_DATE + INTERVAL '3 days', '16:00', 'Запланирована', 'Рентген суставов', 2500),
((SELECT id FROM clinics WHERE name = 'Клиника "Айболит"' LIMIT 1), (SELECT id FROM pets WHERE name = 'Белка'), (SELECT id FROM services WHERE name = 'Вакцинация'), CURRENT_DATE - INTERVAL '5 days', '11:00', 'Завершена', 'Ревакцинация', 1800),
((SELECT id FROM clinics WHERE name = 'ВетКлиника "Друг"' LIMIT 1), (SELECT id FROM pets WHERE name = 'Джек'), (SELECT id FROM services WHERE name = 'Груминг собак'), CURRENT_DATE - INTERVAL '10 days', '15:00', 'Завершена', 'Полный груминг', 4500);

-- Создаем отзывы
INSERT INTO reviews (clinic_id, pet_owner_id, rating, comment, is_verified, created_at) VALUES
((SELECT id FROM clinics WHERE name = 'ВетЦентр "Здоровье"' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Иванов Петр Сергеевич'), 5, 'Отличная клиника! Врачи очень внимательные, все объяснили подробно. Мурка чувствует себя прекрасно после лечения.', true, CURRENT_TIMESTAMP - INTERVAL '2 days'),
((SELECT id FROM clinics WHERE name = 'Клиника "Лапки"' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Петрова Анна Владимировна'), 4, 'Хорошая клиника, но долго ждали приема. Врач компетентный, Барсику помогли.', true, CURRENT_TIMESTAMP - INTERVAL '5 days'),
((SELECT id FROM clinics WHERE name = 'ВетМед Новосибирск' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Сидоров Михаил Александрович'), 5, 'Современное оборудование, профессиональные врачи. Рекса обследовали очень тщательно.', true, CURRENT_TIMESTAMP - INTERVAL '7 days'),
((SELECT id FROM clinics WHERE name = 'Клиника "Айболит"' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Козлова Елена Дмитриевна'), 4, 'Круглосуточная работа - это большой плюс. Белке сделали прививку быстро и качественно.', true, CURRENT_TIMESTAMP - INTERVAL '12 days'),
((SELECT id FROM clinics WHERE name = 'ВетКлиника "Друг"' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Морозов Алексей Игоревич'), 5, 'Лучшая клиника в городе! Джека привели на груминг - результат превосходный. Персонал очень дружелюбный.', true, CURRENT_TIMESTAMP - INTERVAL '15 days'),
((SELECT id FROM clinics WHERE name = 'ВетЦентр "Здоровье"' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Лебедев Дмитрий Петрович'), 4, 'Хорошие врачи, но цены высоковаты. Графу помогли с артритом.', true, CURRENT_TIMESTAMP - INTERVAL '20 days'),
((SELECT id FROM clinics WHERE name = 'Клиника "Лапки"' LIMIT 1), (SELECT id FROM pet_owners WHERE full_name = 'Соколова Мария Сергеевна'), 5, 'Принцессу привожу сюда уже несколько лет. Всегда довольна обслуживанием!', true, CURRENT_TIMESTAMP - INTERVAL '25 days');

-- Обновляем рейтинги клиник на основе отзывов
UPDATE clinics SET 
  rating = (
    SELECT ROUND(AVG(rating::numeric), 1) 
    FROM reviews 
    WHERE reviews.clinic_id = clinics.id
  ),
  reviews_count = (
    SELECT COUNT(*) 
    FROM reviews 
    WHERE reviews.clinic_id = clinics.id
  )
WHERE id IN (SELECT DISTINCT clinic_id FROM reviews);

-- Создаем медицинские карты для завершенных приемов
INSERT INTO medical_records (pet_id, appointment_id, diagnosis, treatment, medications, notes, created_at) VALUES
((SELECT id FROM pets WHERE name = 'Белка'), (SELECT id FROM appointments WHERE status = 'Завершена' AND pet_id = (SELECT id FROM pets WHERE name = 'Белка')), 'Здоровое животное', 'Профилактическая вакцинация', 'Вакцина Nobivac DHPPi', 'Следующая вакцинация через год', CURRENT_TIMESTAMP - INTERVAL '5 days'),
((SELECT id FROM pets WHERE name = 'Джек'), (SELECT id FROM appointments WHERE status = 'Завершена' AND pet_id = (SELECT id FROM pets WHERE name = 'Джек')), 'Гигиеническая процедура', 'Полный груминг', 'Шампунь гипоаллергенный', 'Рекомендован груминг каждые 2 месяца', CURRENT_TIMESTAMP - INTERVAL '10 days');

COMMIT;
