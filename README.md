# DailyDraw

イラストレーターの継続的な画力向上を支援するWebアプリケーション

## プロジェクト概要

「お題生成→描画→振り返り→AI分析→最適化されたお題提案」のサイクルを通じて、効果的な練習習慣を構築します。

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Node.js + Express + TypeScript
- **データベース**: PostgreSQL
- **AI**: OpenAI API

## プロジェクト構造

```
DailyDraw/
├── frontend/          # React フロントエンド
├── backend/           # Node.js バックエンド
├── database/          # データベース設定・マイグレーション
└── uploads/           # アップロードされた画像保存用
```

## セットアップ

### 前提条件

- Node.js (v18以上)
- PostgreSQL (v14以上)
- npm または yarn

### インストール

#### フロントエンド
```bash
cd frontend
npm install
npm run dev
```

#### バックエンド
```bash
cd backend
npm install
npm run dev
```

## 開発状況

現在Phase 1（基盤構築）を実施中
