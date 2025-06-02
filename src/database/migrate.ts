import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function runMigration(file: string) {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    await pool.query(content);
    console.log(`Migration ${path.basename(file)} executed successfully`);
  } catch (error) {
    console.error(`Error executing migration ${path.basename(file)}:`, error);
    throw error;
  }
}

async function migrate() {
  try {
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const files = fs.readdirSync(migrationsDir);
    
    // Ordenar los archivos por nombre (asumiendo que están numerados)
    const migrationFiles = files
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      await runMigration(filePath);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
