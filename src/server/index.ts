
// src/server/index.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRouter from './routes'; // Your main router from src/server/routes/index.ts
import './firebaseAdmin'; // This ensures Firebase Admin SDK is initialized when the server starts

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT || 3001; // Different from Next.js default port (e.g. 9002)

// Middleware
app.use(cors()); // Configure CORS appropriately for your needs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount the main router under /api prefix
app.use('/api', mainRouter);

// Basic error handler (optional, can be more sophisticated)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`🚀 Express server listening on http://localhost:${port}`);
  console.log(`👉 API endpoints available at http://localhost:${port}/api`);
});

export default app; // Export for testing or other programmatic uses if needed
