-- Простой скрипт данных без создания профилей ветеринаров
-- Избегаем foreign key ошибок с auth.users

-- Очистка существующих данных
DELETE FROM reviews;
DELETE FROM appointments;
DELETE FROM pets;
DELETE FROM pet_owners;
DELETE FROM clinic_services;
DELETE FROM clinic_veterinarians;
DELETE FROM clinics WHERE id != '00000000-0000-0000-0000-000000000000';
DELETE FROM services;

-- Создаем услуги
INSERT INTO services (name, description, price, duration_minutes, category, is_active) VALUES
('Общий осмотр', 'Комплексный осмотр животного', 1500.00, 30, 'Диагностика', true),
('Вакцинация', 'Профилактическая вакцинация', 2000.00, 20, 'Профилактика', true),
('Стерилизация кошек', 'Хирургическая стерилизация', 8000.00, 60, 'Хирургия', true),
('Кастрация котов', 'Хирургическая кастрация', 5000.00, 45, 'Хирургия', true),
('Чистка зубов', 'Профессиональная чистка зубов', 3000.00, 40, 'Стоматология', true),
('УЗИ брюшной полости', 'Ультразвуковое исследование', 2500.00, 30, 'Диагностика', true),
('Рентген', 'Рентгенологическое исследование', 2000.00, 15, 'Диагностика', true),
('Анализ крови', 'Общий анализ крови', 1200.00, 10, 'Лабораторная диагностика', true);

-- Создаем клиники
INSERT INTO clinics (name, address, phone, email, description, rating, reviews_count, city_id, is_active) VALUES
('ВетЦентр Здоровье', 'ул. Ленина, 45', '+7 (495) 123-45-67', 'info@vetzdorovie.ru', 'Современная ветеринарная клиника с полным спектром услуг', 4.8, 156, (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), true),
('Клиника Доктор Айболит', 'пр. Невский, 78', '+7 (812) 987-65-43', 'contact@aibolit.spb.ru', 'Ветеринарная клиника с опытными специалистами', 4.6, 89, (SELECT id FROM cities WHERE name = 'Санкт-Петербург' LIMIT 1), true),
('ВетМед Плюс', 'ул. Красная, 123', '+7 (861) 555-77-88', 'info@vetmedplus.ru', 'Круглосуточная ветеринарная помощь', 4.7, 234, (SELECT id FROM cities WHERE name = 'Краснодар' LIMIT 1), true),
('Четыре Лапы', 'ул. Мира, 56', '+7 (495) 777-88-99', 'info@4lapy.ru', 'Специализируемся на лечении кошек и собак', 4.5, 67, (SELECT id FROM cities WHERE name = 'Москва' LIMIT 1), true);

-- Создаем владельцев животных
INSERT INTO pet_owners (full_name, phone, email, address) VALUES
('Иванова Анна Сергеевна', '+7 (495) 111-22-33', 'anna.ivanova@email.ru', 'г. Москва, ул. Тверская, 12'),
('Петров Михаил Александрович', '+7 (812) 444-55-66', 'mikhail.petrov@email.ru', 'г. Санкт-Петербург, ул. Садовая, 34'),
('Сидорова Елена Викторовна', '+7 (861) 777-88-99', 'elena.sidorova@email.ru', 'г. Краснодар, ул. Красная, 78'),
('Козлов Дмитрий Иванович', '+7 (495) 333-44-55', 'dmitry.kozlov@email.ru', 'г. Москва, ул. Арбат, 23'),
('Морозова Ольга Петровна', '+7 (812) 666-77-88', 'olga.morozova@email.ru', 'г. Санкт-Петербург, пр. Литейный, 45');

-- Создаем животных
INSERT INTO pets (name, species, breed, age_years, weight_kg, gender, color, owner_id) VALUES
('Мурка', 'Кошка', 'Британская короткошерстная', 3, 4.2, 'Женский', 'Серый', (SELECT id FROM pet_owners WHERE full_name = 'Иванова Анна Сергеевна')),
('Барсик', 'Кот', 'Мейн-кун', 5, 7.8, 'Мужской', 'Рыжий', (SELECT id FROM pet_owners WHERE full_name = 'Петров Михаил Александрович')),
('Белка', 'Собака', 'Лабрадор', 2, 28.5, 'Женский', 'Золотистый', (SELECT id FROM pet_owners WHERE full_name = 'Сидорова Елена Викторовна')),
('Рекс', 'Собака', 'Немецкая овчарка', 4, 35.2, 'Мужской', 'Черно-коричневый', (SELECT id FROM pet_owners WHERE full_name = 'Козлов Дмитрий Иванович')),
('Пушок', 'Кот', 'Персидский', 1, 3.1, 'Мужской', 'Белый', (SELECT id FROM pet_owners WHERE full_name = 'Морозова Ольга Петровна'));

-- Создаем связи клиник и услуг
INSERT INTO clinic_services (clinic_id, service_id) 
SELECT c.id, s.id 
FROM clinics c 
CROSS JOIN services s 
WHERE c.name IN ('ВетЦентр Здоровье', 'Клиника Доктор Айболит', 'ВетМед Плюс', 'Четыре Лапы');

-- Создаем записи на прием БЕЗ veterinarian_id (делаем его nullable или используем NULL)
INSERT INTO appointments (clinic_id, pet_id, service_id, appointment_date, appointment_time, duration_minutes, status, notes, total_cost) VALUES
((SELECT id FROM clinics WHERE name = 'ВетЦентр Здоровье'), (SELECT id FROM pets WHERE name = 'Мурка'), (SELECT id FROM services WHERE name = 'Общий осмотр'), '2024-01-15', '10:00', 30, 'Завершен', 'Плановый осмотр', 1500.00),
((SELECT id FROM clinics WHERE name = 'Клиника Доктор Айболит'), (SELECT id FROM pets WHERE name = 'Барсик'), (SELECT id FROM services WHERE name = 'Вакцинация'), '2024-01-16', '14:30', 20, 'Завершен', 'Ежегодная вакцинация', 2000.00),
((SELECT id FROM clinics WHERE name = 'ВетМед Плюс'), (SELECT id FROM pets WHERE name = 'Белка'), (SELECT id FROM services WHERE name = 'УЗИ брюшной полости'), '2024-01-17', '11:15', 30, 'Завершен', 'Диагностическое обследование', 2500.00);

-- Создаем отзывы
INSERT INTO reviews (clinic_id, pet_owner_id, rating, comment, is_verified, created_at) VALUES
((SELECT id FROM clinics WHERE name = 'ВетЦентр Здоровье'), (SELECT id FROM pet_owners WHERE full_name = 'Иванова Анна Сергеевна'), 5, 'Отличная клиника! Врачи очень внимательные и профессиональные. Мурка чувствует себя прекрасно после лечения.', true, '2024-01-16 15:30:00'),
((SELECT id FROM clinics WHERE name = 'Клиника Доктор Айболит'), (SELECT id FROM pet_owners WHERE full_name = 'Петров Михаил Александрович'), 4, 'Хорошее обслуживание, но пришлось немного подождать. В целом довольны результатом.', true, '2024-01-17 12:45:00'),
((SELECT id FROM clinics WHERE name = 'ВетМед Плюс'), (SELECT id FROM pet_owners WHERE full_name = 'Сидорова Елена Викторовна'), 5, 'Современное оборудование, квалифицированные специалисты. Рекомендую!', true, '2024-01-18 09:20:00'),
((SELECT id FROM clinics WHERE name = 'ВетЦентр Здоровье'), (SELECT id FROM pet_owners WHERE full_name = 'Козлов Дмитрий Иванович'), 4, 'Хорошая клиника, но цены немного высоковаты. Качество услуг на уровне.', true, '2024-01-19 16:10:00');

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
