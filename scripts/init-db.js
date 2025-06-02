require('dotenv').config();

const { Client } = require('pg');

// Construir URL de conexión
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Configuración simple usando URL
const client = new Client({
  connectionString: connectionString,
  ssl: false, // Deshabilitar SSL
  connectionTimeoutMillis: 10000, // Timeout de 10 segundos
});

async function initializeDatabase() {
  try {
    console.log('Conectando a PostgreSQL...');
    await client.connect();
    console.log('Conexión exitosa');
    
    // Crear tabla users si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'client',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla users creada/verificada');

    // Crear usuario administrador si no existe
    const bcrypt = require('bcryptjs');
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const saltRounds = 10;
    const hash = await bcrypt.hash(adminPassword, saltRounds);

    const exists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (exists.rows.length === 0) {
      await client.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [adminEmail, hash, 'admin']
      );
      console.log('Usuario administrador creado');
    } else {
      console.log('Usuario administrador ya existe');
    }

    await client.end();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

initializeDatabase();
