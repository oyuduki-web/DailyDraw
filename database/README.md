# DailyDraw Database Setup

## データベース構造

### テーブル一覧

1. **users** - ユーザー情報
   - id, username, email, created_at, updated_at

2. **topics** - 生成されたお題
   - id, description, difficulty, created_at

3. **practice_sessions** - 練習記録
   - id, user_id, topic_id, topic_description, topic_difficulty
   - image_path, duration_seconds
   - reflection_good, reflection_struggled, reflection_learned
   - created_at, updated_at

4. **ai_reports** - AI分析レポート
   - id, user_id, overall_assessment, strengths, weaknesses
   - growth_records, next_steps
   - created_at, updated_at

## セットアップ手順

### 1. PostgreSQLのインストール

macOSの場合：
```bash
brew install postgresql@14
brew services start postgresql@14
```

### 2. データベースの作成

```bash
psql postgres
CREATE DATABASE dailydraw;
\c dailydraw
```

### 3. スキーマの適用

```bash
psql -U your_username -d dailydraw -f schema.sql
```

または、psql内で：
```sql
\i schema.sql
```

### 4. 動作確認

```sql
\dt  -- テーブル一覧を表示
```

## 環境変数の設定

backend/.envファイルに以下を設定：
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dailydraw
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```
