# Vercel + GitHub でのデプロイ手順（簡単版）

Renderは使わず、**Vercel + GitHub だけ**でデプロイします。

---

## ステップ1: Vercelにサインアップ

1. https://vercel.com/ にアクセス
2. **「Sign Up」** をクリック
3. **「Continue with GitHub」** を選択してGitHubアカウントで認証

---

## ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで **「Add New...」** → **「Project」** をクリック
2. **「Import Git Repository」** から `oyuduki-web/DailyDraw` を選択
3. **「Import」** をクリック

---

## ステップ3: プロジェクト設定

### フレームワーク設定
- **Framework Preset**: `Other` を選択
- **Root Directory**: そのまま（空欄でOK）
- **Build Command**:
  ```
  cd frontend && npm install && npm run build
  ```
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

---

## ステップ4: 環境変数の設定

**「Environment Variables」** セクションで以下を追加:

| Variable Name | Value |
|---------------|-------|
| `NODE_ENV` | `production` |
| `OPENAI_API_KEY` | `[あなたのOpenAI APIキー]` |
| `CLOUDINARY_CLOUD_NAME` | `[Cloudinary Cloud Name]` |
| `CLOUDINARY_API_KEY` | `[Cloudinary API Key]` |
| `CLOUDINARY_API_SECRET` | `[Cloudinary API Secret]` |
| `VITE_API_BASE_URL` | `/api` (相対パスにすることでフロントとバックエンドを同じドメインで動かせる) |

**注意**: Cloudinaryの認証情報は、先ほど取得した値を使用してください:
- Cloud Name: `drk4ij69z`
- API Key: `946624257571217`
- API Secret: `IWEZ2jMliYdVdj5g74ODsMcCEMc`

**注意**: データベースURLは後で追加します。

---

## ステップ5: デプロイ

1. **「Deploy」** ボタンをクリック
2. デプロイが完了するまで待つ（数分）
3. デプロイURLをコピー（例: `https://daily-draw.vercel.app`）

---

## ステップ6: Vercel PostgreSQL を追加

1. プロジェクトダッシュボードで **「Storage」** タブをクリック
2. **「Create Database」** をクリック
3. **「Postgres」** を選択
4. データベース名: `dailydraw-db`
5. Region: `Tokyo (Japan)` を選択
6. **「Create」** をクリック
7. 自動的に `POSTGRES_URL` などの環境変数が追加されます

---

## ステップ7: データベーススキーマの適用

1. Vercel のプロジェクトダッシュボードで **「Storage」** → 作成したデータベースをクリック
2. **「Query」** タブをクリック
3. 以下のSQLを実行:

```sql
-- ここにschema.sqlの内容をコピペ
```

または、ローカルから接続:
```bash
# Vercelから取得した接続文字列を使用
psql "postgres://default:xxxxx@xxxxx-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?sslmode=require"

# 接続後
\i /Users/ogawayuduki/develop/DailyDraw/database/schema.sql
```

---

## ステップ8: 再デプロイ

データベースを追加したので、再デプロイが必要です:

1. プロジェクトダッシュボードで **「Deployments」** タブ
2. 最新のデプロイの **「...」** メニューから **「Redeploy」** をクリック

---

## 完了！

ブラウザでVercelのURLにアクセスして、アプリが動作するか確認してください:
- お題生成
- 画像アップロード
- ダッシュボード表示
- AI分析レポート

---

## トラブルシューティング

### ビルドエラーが出る場合
1. Vercelのデプロイログを確認
2. 環境変数が正しく設定されているか確認

### APIが動かない場合
1. `VITE_API_BASE_URL` が `/api` になっているか確認
2. データベース接続文字列が正しいか確認

### 画像アップロードが失敗する
1. Cloudinaryの認証情報を再確認
2. ファイルサイズ制限（10MB）を確認
