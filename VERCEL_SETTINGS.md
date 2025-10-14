# Vercel設定情報（コピペ用）

## フロントエンド Project 設定

### 基本設定
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

### 環境変数（Environment Variables）

以下をコピーして、Vercelの環境変数セクションに貼り付けてください:

```
VITE_API_BASE_URL=[RenderのバックエンドURL]/api
```

**例**:
```
VITE_API_BASE_URL=https://dailydraw-backend.onrender.com/api
```

**注意**:
- RenderでバックエンドをデプロイしたURLを使用してください
- `/api` を忘れずに付けてください

---

## デプロイ後にやること

1. VercelのデプロイURLをコピー（例: https://dailydraw.vercel.app）
2. Renderに戻って、バックエンドの環境変数 `FRONTEND_URL` を更新
3. Renderで「Manual Deploy」から再デプロイ
