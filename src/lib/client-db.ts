import { Pool, QueryResult, QueryResultRow } from 'pg';
import { serverOnly } from '../utils/server-only';

if (!serverOnly) {
  throw new Error('This module should only be used on the server');
}

// Exportando un objeto vacío para el cliente
if (!serverOnly) {
  const exports = {
    pool: null as unknown as Pool,
    query: () => Promise.reject(new Error('Server-only function'))
  };
  Object.assign(module.exports, exports);
}

// Configuración de la base de datos
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
};

// Crear el pool de conexiones
const pool = new Pool(dbConfig);

// Función de consulta que usa el pool
export const query = async <T extends QueryResultRow>(text: string, values?: any[]): Promise<QueryResult<T>> => {
  if (!serverOnly) {
    return Promise.reject(new Error('Server-only function'));
  }
  return pool.query<T>(text, values);
};

export { pool };
