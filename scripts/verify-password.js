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

async function verifyPassword() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    const result = await client.query('SELECT * FROM users WHERE email = $1', ['admin@accesoit.com']);
    if (result.rows.length === 0) {
      console.log('Usuario no encontrado');
      return;
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare('admin123', user.password);

    console.log('Usuario encontrado:', user);
    console.log('Contraseña válida:', isMatch);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

verifyPassword();
