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

async function createAdmin() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      ['admin@accesoit.com', hashedPassword, 'ADMIN']
    );

    console.log('Usuario administrador creado exitosamente');
    console.log('Email: admin@accesoit.com');
    console.log('Password: admin123');

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

createAdmin();
