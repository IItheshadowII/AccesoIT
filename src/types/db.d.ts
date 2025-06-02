import { Pool, QueryResult } from 'pg';

export type DBPool = Pool;
export type DBQueryResult<T> = QueryResult<T>;

export interface DBConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
}
