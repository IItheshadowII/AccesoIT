
// src/server/routes/emailRoutes.ts
import { Router } from 'express';
import { sendEmail } from '../handlers/emailHandlers';
// import { verifyFirebaseToken } from '../middleware/authMiddleware'; // Optional: if email endpoints need auth

const router = Router();

// router.post('/send', verifyFirebaseToken, sendEmail); // Example with auth
router.post('/email/send', sendEmail);

export default router;
