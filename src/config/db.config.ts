import pool from '../server/config/db.config';

export default pool;

// Export types for TypeScript
export type DatabaseConfig = {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
};

export const dbConfig: DatabaseConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'accesoit',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
};
