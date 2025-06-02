require('dotenv').config();

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function checkUsers() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos');

    const res = await client.query('SELECT * FROM users');
    console.log('Usuarios encontrados:', res.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

checkUsers();
