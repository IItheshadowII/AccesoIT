
// src/server/middleware/authMiddleware.ts
import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../lib/auth';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { 
        userId: number; 
        role: string; 
        email: string;
      } | null;
    }
  }
}

export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided or invalid format.' });
    return;
  }

  const token = authorizationHeader.split('Bearer ')[1];

  try {
    const decoded = await verifyToken(token);
    if (!decoded) {
      res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(403).json({ error: 'Forbidden: Invalid or expired token.' });
  }
};
