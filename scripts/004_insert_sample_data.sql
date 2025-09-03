-- Вставка тестовых данных

-- Добавление базовых услуг
INSERT INTO public.services (name, description, duration_minutes, price, category) VALUES
('Общий осмотр', 'Комплексный осмотр животного', 30, 1500.00, 'examination'),
('Вакцинация', 'Профилактическая вакцинация', 15, 800.00, 'vaccination'),
('Стерилизация кошки', 'Хирургическая стерилизация', 60, 5000.00, 'surgery'),
('Кастрация кота', 'Хирургическая кастрация', 45, 3500.00, 'surgery'),
('Чистка зубов', 'Профессиональная чистка зубов', 45, 2500.00, 'dental'),
('УЗИ брюшной полости', 'Ультразвуковое исследование', 30, 2000.00, 'diagnostic'),
('Рентген', 'Рентгенологическое исследование', 20, 1800.00, 'diagnostic'),
('Анализ крови общий', 'Общий анализ крови', 10, 1200.00, 'laboratory'),
('Консультация по питанию', 'Рекомендации по кормлению', 20, 1000.00, 'consultation'),
('Экстренный прием', 'Неотложная помощь', 60, 3000.00, 'emergency')
ON CONFLICT DO NOTHING;

-- Добавление тестовых владельцев животных
INSERT INTO public.pet_owners (full_name, email, phone, address) VALUES
('Иванов Петр Сергеевич', 'ivanov@example.com', '+7-900-123-45-67', 'ул. Ленина, 15, кв. 23'),
('Петрова Анна Михайловна', 'petrova@example.com', '+7-900-234-56-78', 'пр. Мира, 45, кв. 12'),
('Сидоров Алексей Владимирович', 'sidorov@example.com', '+7-900-345-67-89', 'ул. Пушкина, 8, кв. 5'),
('Козлова Елена Дмитриевна', 'kozlova@example.com', '+7-900-456-78-90', 'ул. Гагарина, 22, кв. 18'),
('Морозов Дмитрий Александрович', 'morozov@example.com', '+7-900-567-89-01', 'пр. Победы, 33, кв. 7')
ON CONFLICT DO NOTHING;

-- Добавление тестовых животных
INSERT INTO public.pets (name, species, breed, gender, birth_date, weight, color, owner_id) 
SELECT 
  pet_data.name,
  pet_data.species,
  pet_data.breed,
  pet_data.gender,
  pet_data.birth_date,
  pet_data.weight,
  pet_data.color,
  owners.id
FROM (VALUES
  ('Мурка', 'кошка', 'Британская короткошерстная', 'female', '2020-05-15', 4.2, 'серый'),
  ('Барсик', 'кот', 'Мейн-кун', 'male', '2019-03-22', 6.8, 'рыжий'),
  ('Рекс', 'собака', 'Немецкая овчарка', 'male', '2018-08-10', 35.5, 'черно-коричневый'),
  ('Белка', 'собака', 'Джек-рассел-терьер', 'female', '2021-01-30', 8.2, 'белый с коричневыми пятнами'),
  ('Кеша', 'попугай', 'Волнистый попугайчик', 'male', '2022-06-12', 0.04, 'зелено-желтый')
) AS pet_data(name, species, breed, gender, birth_date, weight, color),
(SELECT id, ROW_NUMBER() OVER () as rn FROM public.pet_owners LIMIT 5) AS owners
WHERE owners.rn = (
  CASE pet_data.name
    WHEN 'Мурка' THEN 1
    WHEN 'Барсик' THEN 2
    WHEN 'Рекс' THEN 3
    WHEN 'Белка' THEN 4
    WHEN 'Кеша' THEN 5
  END
)
ON CONFLICT DO NOTHING;
