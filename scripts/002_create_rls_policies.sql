-- Политики Row Level Security для безопасности данных

-- Политики для profiles (только свой профиль и для админов/ветеринаров)
CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'veterinarian', 'receptionist')
    )
  );

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Политики для pet_owners (доступ для персонала клиники)
CREATE POLICY "pet_owners_staff_access" ON public.pet_owners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'veterinarian', 'receptionist')
    )
  );

-- Политики для pets (доступ для персонала клиники)
CREATE POLICY "pets_staff_access" ON public.pets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'veterinarian', 'receptionist')
    )
  );

-- Политики для services (чтение для всех, изменение только для админов)
CREATE POLICY "services_read_all" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "services_admin_modify" ON public.services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Политики для appointments (доступ для персонала клиники)
CREATE POLICY "appointments_staff_access" ON public.appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'veterinarian', 'receptionist')
    )
  );

-- Политики для medical_records (доступ для ветеринаров и админов)
CREATE POLICY "medical_records_vet_admin_access" ON public.medical_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'veterinarian')
    )
  );
