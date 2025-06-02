import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool, QueryResult } from 'pg';
import { serverOnly } from '../../utils/server-only';

if (!serverOnly) {
  throw new Error('This module should only be used on the server');
}

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role = 'client' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query<{
      id: string;
      email: string;
      role: string;
    }>('INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role',
      [email, hashedPassword, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query<{
      id: string;
      email: string;
      password: string;
      role: string;
    }>('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) throw new Error('Usuario no encontrado');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Contraseña incorrecta');
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400') }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
    const result = await pool.query<{
      id: string;
      email: string;
      role: string;
    }>('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = result.rows[0];
    if (!user) throw new Error('Usuario no encontrado');
    res.json({ user, isValid: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.json({ isValid: false, error: error.message });
    } else {
      res.json({ isValid: false, error: 'Invalid token' });
    }
  }
});

export default router;
