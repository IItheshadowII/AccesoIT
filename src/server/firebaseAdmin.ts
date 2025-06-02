// src/server/firebaseAdmin.ts
import pool from '../config/db.config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Export types for TypeScript
export type User = {
  id: number;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: Date;
  updated_at: Date;
};

// Database operations
export const db = {
  collection: (collectionName: string) => ({
    add: async (data: any) => {
      const result = await pool.query(
        `INSERT INTO ${collectionName} (${Object.keys(data).join(', ')}) VALUES (${Object.keys(data).map((_, i) => `$${i + 1}`).join(', ')}) RETURNING id`,
        Object.values(data)
      );
      return { id: result.rows[0].id };
    },
    get: async () => {
      const result = await pool.query(`SELECT * FROM ${collectionName}`);
      return result.rows;
    },
    getById: async (id: string | number) => {
      const result = await pool.query(`SELECT * FROM ${collectionName} WHERE id = $1`, [id]);
      return result.rows[0];
    },
    update: async (id: string | number, data: any) => {
      const setClause = Object.entries(data)
        .map(([key, _]) => `${key} = $${Object.keys(data).indexOf(key) + 1}`)
        .join(', ');
      
      const values = Object.values(data);
      values.push(id);
      
      await pool.query(
        `UPDATE ${collectionName} SET ${setClause} WHERE id = $${values.length}`,
        values
      );
    },
    delete: async (id: string | number) => {
      await pool.query(`DELETE FROM ${collectionName} WHERE id = $1`, [id]);
    }
  })
};

// Authentication operations
export const auth = {
  verifyIdToken: async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; role: string };
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
      const user = result.rows[0];
      if (!user) throw new Error('User not found');
      return { ...decoded, email: user.email };
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
  createUser: async (email: string, password: string, role: string = 'client') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id',
      [email, hashedPassword, role]
    );
    return { uid: result.rows[0].id.toString(), email, role };
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN as string }
    );
    
    return { user: { uid: user.id.toString(), email: user.email, role: user.role }, token };
  },
  signOut: async () => {
    // In a real implementation, you might want to invalidate the token
    return Promise.resolve();
  }
};

// Storage operations
export const storage = {
  // Implement storage operations using PostgreSQL
  // For example:
  uploadFile: async (file: any) => {
    // Implement file upload logic using PostgreSQL
  },
  getFile: async (fileId: string) => {
    // Implement file retrieval logic using PostgreSQL
  }
};

export default { db, auth, storage };
