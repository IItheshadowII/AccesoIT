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

async function testConnection() {
  try {
    console.log('Intentando conectar a PostgreSQL...');
    console.log('URL de conexión:', connectionString);

    console.log('Conectando...');
    await client.connect();
    console.log('Conexión exitosa');

    console.log('Ejecutando consulta...');
    const res = await client.query('SELECT NOW()');
    console.log('Hora del servidor:', res.rows[0].now);

    console.log('Conexión exitosa y consulta completada');
  } catch (err) {
    console.error('Error detallado al conectar a PostgreSQL:', err);
    console.error('Stack trace:', err.stack);
    console.error('Código de error:', err.code);
    console.error('Mensaje:', err.message);
    if (err.detail) console.error('Detalles:', err.detail);
    if (err.hint) console.error('Sugerencia:', err.hint);
  } finally {
    console.log('Liberando conexión...');
    await client.end();
  }
}

testConnection();
