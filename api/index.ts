import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Request, Response } from 'express';
import cors from 'cors';
import topicsRouter from '../backend/src/routes/topics';
import practiceRouter from '../backend/src/routes/practice';
import statsRouter from '../backend/src/routes/stats';
import aiRouter from '../backend/src/routes/ai';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'DailyDraw API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/topics', topicsRouter);
app.use('/api/practice', practiceRouter);
app.use('/api/stats', statsRouter);
app.use('/api/ai', aiRouter);

// Error handling
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve(undefined);
    });
  });
}
