// scripts/populate_db.js
// Скрипт для наполнения базы данных Supabase данными из 016_populate_real_data.sql

const { createClient } = require('@supabase/supabase-js');
const { readFileSync } = require('fs');
const https = require('https');

async function main() {
  // Загрузка переменных окружения из .env.local
  const envContent = readFileSync('.env.local', 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key] = valueParts.join('=');
    }
  });

  const supabaseUrl = envVars.SUPABASE_URL;
  const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log('Подключение к Supabase выполнено...');

  // Попытка создания RPC функции для выполнения SQL, если она не существует
  try {
    await createExecFunction(supabaseUrl, serviceRoleKey);
    console.log('RPC функция exec_raw_sql создана или уже существует');
  } catch (error) {
    console.log('Не удалось создать RPC функцию:', error.message);
  }

  // Чтение файла с данными
  const sqlContent = readFileSync('./scripts/016_populate_real_data.sql', 'utf8');
  console.log('Файл SQL прочитан. Длина содержимого:', sqlContent.length, 'символов');

  // Разделение файла на отдельные SQL команды по ';'
  const commands = sqlContent
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd && !cmd.startsWith('--'));

  console.log(`Найдено ${commands.length} команд для выполнения.`);

  let executedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i].replace(/;$/g, '').trim();

    if (!command) continue;

    console.log(`\nВыполнение команды ${i + 1}/${commands.length}:`);
    console.log(command.substring(0, 80) + (command.length > 80 ? '...' : ''));

    try {
      // Использование RPC функции для выполнения любой SQL команды
      const { data, error } = await supabase.rpc('exec_raw_sql', { sql: command });
      if (error) throw error;

      console.log('✅ Команда выполнена успешно');
      executedCount++;
    } catch (error) {
      console.log('❌ Ошибка выполнения:', error.message);
      failedCount++;
      // Продолжить выполнение остальных команд
    }
  }

  console.log(`\n========== РЕЗУЛЬТАТ ==========\n✅ Успешно выполнено команд: ${executedCount}\n❌ Ошибок: ${failedCount}\nВсего обработано команд: ${commands.length}`);
}

async function createExecFunction(supabaseUrl, serviceRoleKey) {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION exec_raw_sql(sql TEXT) RETURNS JSON AS $$
    BEGIN
      EXECUTE sql;
      RETURN json_build_object('success', true);
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  const options = {
    hostname: new URL(supabaseUrl).hostname,
    port: 443,
    path: '/rest/v1/rpc/exec_raw_sql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve();
      } else {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (data) reject(new Error(data));
          else reject(new Error(`HTTP ${res.statusCode}`));
        });
      }
    });

    req.on('error', reject);
    req.write(JSON.stringify({ sql: createFunctionSql }));
    req.end();
  });
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };