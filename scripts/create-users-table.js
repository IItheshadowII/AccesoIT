require('dotenv').config();

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: false
});

async function createUsersTable() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    await client.query(`
      CREATE TABLE users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'USER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear el usuario administrador
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      ['admin@accesoit.com', hashedPassword, 'ADMIN']
    );

    console.log('Tabla users creada y usuario administrador creado exitosamente');
    console.log('Email: admin@accesoit.com');
    console.log('Password: admin123');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

createUsersTable();
