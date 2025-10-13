import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import db from './config/database';
import topicsRouter from './routes/topics';
import practiceRouter from './routes/practice';
import statsRouter from './routes/stats';
import aiRouter from './routes/ai';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'DailyDraw API is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection endpoint
app.get('/api/db-test', async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'ok',
      message: 'Database connection successful',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed'
    });
  }
});

// Routes
app.use('/api/topics', topicsRouter);
app.use('/api/practice', practiceRouter);
app.use('/api/stats', statsRouter);
app.use('/api/ai', aiRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/db-test\n`);
});

export default app;
