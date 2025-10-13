-- DailyDraw Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table (生成されたお題)
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('初級', '中級', '上級')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Practice sessions table (練習記録)
CREATE TABLE IF NOT EXISTS practice_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL,
  topic_description TEXT NOT NULL, -- お題の説明（topicが削除されても保持）
  topic_difficulty VARCHAR(20) NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  duration_seconds INTEGER NOT NULL, -- 制作時間（秒）
  reflection_good TEXT, -- 上手くできたところ
  reflection_struggled TEXT, -- 苦戦したところ
  reflection_learned TEXT, -- 今回の学び
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Reports table (AI分析レポート)
CREATE TABLE IF NOT EXISTS ai_reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  overall_assessment TEXT, -- 総合評価
  strengths TEXT, -- 得意分野
  weaknesses TEXT, -- 苦手分野
  growth_records TEXT, -- 成長の記録
  next_steps TEXT, -- 次のステップ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_practice_sessions_created_at ON practice_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_topics_difficulty ON topics(difficulty);
CREATE INDEX IF NOT EXISTS idx_ai_reports_user_id ON ai_reports(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_sessions_updated_at
  BEFORE UPDATE ON practice_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_reports_updated_at
  BEFORE UPDATE ON ai_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
