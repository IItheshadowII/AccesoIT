import { Pool } from 'pg';

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export default pool;

// Función para verificar la conexión
export async function testConnection() {
  try {
    await pool.query('SELECT 1');
    return { success: true, message: 'PostgreSQL connection test passed successfully' };
  } catch (error: any) {
    return { 
      success: false, 
      message: 'Failed to connect to PostgreSQL database. Check server logs for more details.',
      details: error.message
    };
  }
}
