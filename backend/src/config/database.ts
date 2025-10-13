import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 本番環境ではDATABASE_URL または POSTGRES_URL を使用、開発環境では個別の設定を使用
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'dailydraw',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

// Test database connection
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

export default pool;
