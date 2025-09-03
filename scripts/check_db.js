// scripts/check_db.js
// Скрипт для проверки состояния базы данных Supabase

const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');

async function main() {
  // Загрузка переменных окружения из .env.local
  const envContent = readFileSync('.env.local', 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length && !key.startsWith('#')) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  const supabaseUrl = envVars.SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    console.error('Ошибка: Не удалось найти переменные SUPABASE_URL или SUPABASE_ANON_KEY в .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, anonKey);

  console.log('Используется anon key');

  console.log('Подключение к Supabase выполнено...');
  console.log('Проверка текущего состояния базы данных...\n');

  const queries = [
    { name: 'Количество уникальных клиник', query: async () => {
      const { data, error } = await supabase.from('clinics').select('name');
      if (error) throw error;
      const distinctNames = data ? new Set(data.map(c => c.name)) : new Set();
      return { count: distinctNames.size };
    }},
    { name: 'Количество ветеринаров', query: () => supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'veterinarian') },
    { name: 'Количество владельцев питомцев', query: () => supabase.from('pet_owners').select('*', { count: 'exact', head: true }) },
    { name: 'Количество питомцев', query: () => supabase.from('pets').select('*', { count: 'exact', head: true }) },
    { name: 'Количество записей на прием', query: () => supabase.from('appointments').select('*', { count: 'exact', head: true }) },
    { name: 'Количество отзывов', query: () => supabase.from('reviews').select('*', { count: 'exact', head: true }) },
    { name: 'Количество услуг', query: () => supabase.from('services').select('*', { count: 'exact', head: true }) }
  ];

  const results = [];

  for (const { name, query } of queries) {
    try {
      const result = await query();
      const count = result.count ?? 0;
      if (result.error) throw result.error;
      results.push({ name, count });
      console.log(`${name}: ${count}`);
    } catch (error) {
      console.log(`${name}: Ошибка - ${error.message}`);
      results.push({ name, count: 'Ошибка', error: error.message });
    }
  }

  console.log('\n========== ОТЧЕТ О ТЕКУЩЕМ СОСТОЯНИИ БАЗЫ ДАННЫХ ==========');
  results.forEach(({ name, count }) => {
    console.log(`${name}: ${count}`);
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };