// src/server/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import aiRoutes from './aiRoutes';
import userRoutes from './userRoutes';
import emailRoutes from './emailRoutes';

const router = Router();

// Rutas de autenticación
router.use('/auth', authRoutes);

// Otras rutas
router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/notifications', emailRoutes);

// Endpoint de salud
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

export default router;
