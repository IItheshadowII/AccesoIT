const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'clave123'}@${process.env.DB_HOST || '144.91.85.243'}:${process.env.DB_PORT || '5433'}/${process.env.DB_NAME || 'accesoit'}?sslmode=disable`;

const client = new Client({
  connectionString: connectionString
});

async function createProductsTable() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database successfully');
    
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ language 'plpgsql';

        CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
      `);
      console.log('Products table created successfully');
    } catch (error) {
      console.error('Error creating products table:', error);
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

createProductsTable();
