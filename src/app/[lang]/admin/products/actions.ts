
// src/app/[lang]/admin/products/actions.ts
'use server';

import { Pool } from 'pg';
import { ProductSchema, type ProductInput, type Product } from '@/lib/schemas/product-schema';
import { revalidatePath } from 'next/cache';
import type { Locale } from '@/lib/i18n-config';

const DB_NOT_CONFIGURED_ERROR_MSG = 'Database is not configured correctly. Please check server logs. Product operations are unavailable.';
const DB_NOT_CONFIGURED_RESULT = { success: false, error: DB_NOT_CONFIGURED_ERROR_MSG };

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function getProducts(): Promise<Product[] | { error: string }> {
  try {
    const result = await pool.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'Failed to fetch products from PostgreSQL.' };
  }
}

export async function addProduct(productData: ProductInput, lang: Locale) {
  if (!pool) {
    console.error("addProduct failed:", DB_NOT_CONFIGURED_ERROR_MSG);
    return DB_NOT_CONFIGURED_RESULT;
  }
  const validation = ProductSchema.safeParse(productData);
  if (!validation.success) {
    console.error('Validation failed:', validation.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid product data', errors: validation.error.flatten().fieldErrors };
  }
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING id',
      [validation.data.name, validation.data.description, validation.data.price, parseFloat(validation.data.price)]
    );
    revalidatePath(`/${lang}/admin/products`);
    revalidatePath(`/${lang}`);
    return { success: true, id: result.rows[0].id };
  } catch (error) {
    console.error('Error adding product:', error);
    return { success: false, error: 'Failed to add product' };
  }
}

export async function updateProduct(id: string, productData: ProductInput, lang: Locale) {
  if (!pool) {
    console.error("updateProduct failed:", DB_NOT_CONFIGURED_ERROR_MSG);
    return DB_NOT_CONFIGURED_RESULT;
  }
  const validation = ProductSchema.safeParse(productData);
  if (!validation.success) {
    console.error('Validation failed:', validation.error.flatten().fieldErrors);
    return { success: false, error: 'Invalid product data', errors: validation.error.flatten().fieldErrors };
  }
  try {
    await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5',
      [validation.data.name, validation.data.description, validation.data.price, parseFloat(validation.data.price), id]
    );
    revalidatePath(`/${lang}/admin/products`);
    revalidatePath(`/${lang}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(id: string, lang: Locale) {
  if (!pool) {
    console.error("deleteProduct failed:", DB_NOT_CONFIGURED_ERROR_MSG);
    return DB_NOT_CONFIGURED_RESULT;
  }
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    revalidatePath(`/${lang}/admin/products`);
    revalidatePath(`/${lang}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function findProductByName(productName: string): Promise<Product | null | { error: string }> {
  if (!pool) {
    console.error("findProductByName failed:", DB_NOT_CONFIGURED_ERROR_MSG);
    return DB_NOT_CONFIGURED_RESULT;
  }
  try {
    const result = await pool.query('SELECT * FROM products WHERE LOWER(name) = LOWER($1)', [productName]);
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error('Error finding product by name:', error);
    return { error: 'Failed to find product by name in PostgreSQL.' };
  }
}
