
// src/server/routes/userRoutes.ts
import { Router } from 'express';
import { getUserProfile } from '../handlers/userHandlers';
// import { verifyFirebaseToken } from '../middleware/authMiddleware'; // Optional: if user endpoints need auth

const router = Router();

// Example: Protect this route
// router.get('/profile/:userId', verifyFirebaseToken, getUserProfile);
router.get('/user/profile/:userId', getUserProfile); // Example route, adjust as needed
// Add more user-related routes here

export default router;
