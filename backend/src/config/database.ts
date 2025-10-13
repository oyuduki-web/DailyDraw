import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 本番環境ではDATABASE_URLを使用、開発環境では個別の設定を使用
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
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
