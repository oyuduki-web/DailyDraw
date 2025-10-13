# DailyDraw デプロイ手順

無料プランで DailyDraw をデプロイする手順です。

## 必要なアカウント

1. **GitHub** - コードの管理
2. **Render** - バックエンド・データベース
3. **Vercel** - フロントエンド
4. **Cloudinary** - 画像保存

---

## ステップ1: Cloudinaryの設定

### 1.1 アカウント作成
1. https://cloudinary.com/ にアクセス
2. 「Sign Up for Free」をクリック
3. アカウント情報を入力して登録

### 1.2 認証情報の取得
1. ダッシュボードにログイン
2. 「Dashboard」で以下の情報をメモ:
   - Cloud Name
   - API Key  
   - API Secret

---

## ステップ2: GitHubリポジトリの作成

### 2.1 ローカルでGit初期化
```bash
cd /Users/ogawayuduki/develop/DailyDraw
git init
git add .
git commit -m "Initial commit: DailyDraw app"
```

### 2.2 GitHubリポジトリ作成
1. https://github.com/new にアクセス
2. Repository name: `DailyDraw`
3. Public/Privateを選択
4. 「Create repository」をクリック

### 2.3 リモートリポジトリに接続してプッシュ
```bash
git remote add origin https://github.com/YOUR_USERNAME/DailyDraw.git
git branch -M main
git push -u origin main
```

---

## ステップ3: Renderでバックエンド・DBをデプロイ

### 3.1 アカウント作成
1. https://render.com/ にアクセス
2. 「Get Started for Free」をクリック
3. GitHubアカウントで認証

### 3.2 PostgreSQLデータベースの作成
1. ダッシュボードで「New +」→「PostgreSQL」をクリック
2. 設定:
   - Name: `dailydraw-db`
   - Region: `Singapore (Southeast Asia)` (日本に近い)
   - Instance Type: `Free`
3. 「Create Database」をクリック
4. 作成後、「Internal Database URL」をコピー（後で使用）

### 3.3 データベーステーブルの作成
1. Renderのダッシュボードで作成したDBをクリック
2. 「Connect」タブの「PSQL Command」をコピー
3. ローカルターミナルで実行:
```bash
# PSQLコマンドを実行してデータベースに接続
# 接続後、以下のコマンドでスキーマを適用
\i /Users/ogawayuduki/develop/DailyDraw/database/schema.sql
```

または、Renderの「Shell」タブから直接SQL実行も可能

### 3.4 Webサービスの作成（バックエンド）
1. 「New +」→「Web Service」をクリック
2. GitHubリポジトリを選択: `DailyDraw`
3. 設定:
   - Name: `dailydraw-backend`
   - Region: `Singapore`
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: `Free`

4. 「Environment Variables」を追加:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=[手順3.2でコピーしたInternal Database URL]
   OPENAI_API_KEY=[あなたのOpenAI APIキー]
   CLOUDINARY_CLOUD_NAME=[手順1.2のCloud Name]
   CLOUDINARY_API_KEY=[手順1.2のAPI Key]
   CLOUDINARY_API_SECRET=[手順1.2のAPI Secret]
   FRONTEND_URL=[後で設定: Vercelのデプロイ後のURL]
   MAX_FILE_SIZE=10485760
   ```

5. 「Create Web Service」をクリック
6. デプロイ完了後、URLをコピー（例: https://dailydraw-backend.onrender.com）

**重要**: 無料プランは15分間アクセスがないとスリープします。初回アクセス時は起動に時間がかかります。

---

## ステップ4: Vercelでフロントエンドをデプロイ

### 4.1 アカウント作成
1. https://vercel.com/ にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントで認証

### 4.2 プロジェクトをインポート
1. ダッシュボードで「Add New」→「Project」をクリック
2. GitHubリポジトリ `DailyDraw` を選択
3. 「Import」をクリック

### 4.3 設定
1. Configure Project:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. Environment Variables を追加:
   ```
   VITE_API_BASE_URL=[手順3.4でコピーしたバックエンドURL]/api
   ```
   例: `https://dailydraw-backend.onrender.com/api`

3. 「Deploy」をクリック

### 4.4 デプロイ完了後
1. デプロイが完了したらURLをコピー（例: https://dailydraw.vercel.app）
2. **Renderに戻って** バックエンドの環境変数を更新:
   - `FRONTEND_URL` に Vercel の URL を設定
3. Renderでバックエンドを再デプロイ（Manual Deploy から）

---

## ステップ5: 動作確認

### 5.1 バックエンドのヘルスチェック
ブラウザで以下にアクセス:
```
https://dailydraw-backend.onrender.com/api/health
```
`{"status":"ok"}` が返ればOK

### 5.2 フロントエンドの確認
Vercel の URL にアクセスしてアプリが正常に動作するか確認

### 5.3 テストフロー
1. お題生成が動作するか
2. 画像アップロードが動作するか（Cloudinaryに保存される）
3. ダッシュボードで統計が表示されるか
4. AI分析レポートが生成されるか

---

## トラブルシューティング

### バックエンドが起動しない
- Renderのログを確認: Dashboard → Logs
- 環境変数が正しく設定されているか確認
- データベース接続文字列が正しいか確認

### フロントエンドがAPIに接続できない
- `VITE_API_BASE_URL` が正しく設定されているか確認
- バックエンドの `FRONTEND_URL` が正しく設定されているか確認（CORS）
- ブラウザの開発者ツールでネットワークエラーを確認

### 画像アップロードが失敗する
- Cloudinaryの認証情報が正しいか確認
- ファイルサイズ制限（10MB）を超えていないか確認

---

## カスタムドメインの設定（オプション）

### Vercel（フロントエンド）
1. Vercelダッシュボード → Project Settings → Domains
2. カスタムドメインを追加
3. DNSレコードを設定

### Render（バックエンド）
1. Renderダッシュボード → Settings → Custom Domains
2. カスタムドメインを追加
3. DNSレコードを設定

---

## 更新・再デプロイ

### コードを更新した場合
```bash
git add .
git commit -m "Update: 変更内容"
git push origin main
```

- Vercel: 自動的に再デプロイされます
- Render: 自動的に再デプロイされます

### 環境変数を変更した場合
1. Vercel/Renderのダッシュボードで環境変数を更新
2. 手動で再デプロイ

---

## コスト

### 無料プランの制限
- **Render**: 
  - 750時間/月（1つのサービスなら十分）
  - 15分間アクセスがないとスリープ
- **Vercel**: 
  - 100GB帯域幅/月
  - 商用利用は制限あり
- **Cloudinary**: 
  - 25GB ストレージ
  - 25GB 転送量/月

### アップグレードが必要になる場合
- アクセスが増えた場合
- 画像が25GBを超えた場合
- スリープさせたくない場合（Render: $7/月〜）

