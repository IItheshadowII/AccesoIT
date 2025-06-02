
// src/server/routes/aiRoutes.ts
import { Router } from 'express';
import { handleAutomationAdvice, handleChatWithBot } from '../handlers/aiHandlers';
// import { verifyFirebaseToken } from '../middleware/authMiddleware'; // Optional: if AI endpoints need auth

const router = Router();

// Example: If you want to protect these routes with Firebase Auth token
// router.use(verifyFirebaseToken);

router.post('/automation-advisor', handleAutomationAdvice);
router.post('/customer-support', handleChatWithBot);

export default router;
