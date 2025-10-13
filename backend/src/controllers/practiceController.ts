import { Request, Response } from 'express';
import db from '../config/database';
import { generateAIReport, saveAIReport } from '../services/aiAnalysisService';

/**
 * POST /api/practice
 * 練習セッションを作成（画像アップロード付き）
 */
export async function createPracticeSession(req: Request, res: Response) {
  try {
    // ファイルがアップロードされているか確認
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: '画像ファイルが必要です'
      });
    }

    const {
      topic_description,
      topic_difficulty,
      duration_seconds,
      reflection_good,
      reflection_struggled,
      reflection_learned
    } = req.body;

    // バリデーション
    if (!topic_description || !topic_difficulty || !duration_seconds) {
      return res.status(400).json({
        status: 'error',
        message: 'お題の説明、難易度、制作時間は必須です'
      });
    }

    if (!['初級', '中級', '上級'].includes(topic_difficulty)) {
      return res.status(400).json({
        status: 'error',
        message: '難易度は「初級」「中級」「上級」のいずれかである必要があります'
      });
    }

    // 画像パス（相対パス）
    const imagePath = `/uploads/${req.file.filename}`;

    // 暫定的に user_id = 1 として扱う（今後認証実装後に修正）
    const userId = 1;

    // データベースに保存
    const result = await db.query(
      `INSERT INTO practice_sessions
       (user_id, topic_description, topic_difficulty, image_path, duration_seconds,
        reflection_good, reflection_struggled, reflection_learned)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        userId,
        topic_description,
        topic_difficulty,
        imagePath,
        duration_seconds,
        reflection_good || null,
        reflection_struggled || null,
        reflection_learned || null
      ]
    );

    const session = result.rows[0];

    // レスポンスを返す
    res.status(201).json({
      status: 'success',
      message: '練習セッションが記録されました',
      data: {
        id: session.id,
        topic_description: session.topic_description,
        topic_difficulty: session.topic_difficulty,
        image_path: session.image_path,
        duration_seconds: session.duration_seconds,
        reflection_good: session.reflection_good,
        reflection_struggled: session.reflection_struggled,
        reflection_learned: session.reflection_learned,
        created_at: session.created_at
      }
    });

    // AI分析を非同期でバックグラウンド実行（レスポンスには影響させない）
    generateAIReport(userId)
      .then(report => saveAIReport(userId, report))
      .then(() => {
        console.log(`AI診断レポートが自動生成されました (user_id: ${userId})`);
      })
      .catch(error => {
        console.error('AI診断レポートの自動生成に失敗:', error);
        // エラーが発生してもユーザーには影響させない
      });
  } catch (error) {
    console.error('Error in createPracticeSession:', error);
    res.status(500).json({
      status: 'error',
      message: '練習セッションの記録に失敗しました'
    });
  }
}

/**
 * GET /api/practice
 * すべての練習セッションを取得
 */
export async function getAllPracticeSessions(req: Request, res: Response) {
  try {
    // 暫定的に user_id = 1 として扱う
    const userId = 1;

    const result = await db.query(
      `SELECT * FROM practice_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error in getAllPracticeSessions:', error);
    res.status(500).json({
      status: 'error',
      message: '練習セッションの取得に失敗しました'
    });
  }
}

/**
 * GET /api/practice/:id
 * 特定の練習セッションを取得
 */
export async function getPracticeSession(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM practice_sessions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '練習セッションが見つかりません'
      });
    }

    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in getPracticeSession:', error);
    res.status(500).json({
      status: 'error',
      message: '練習セッションの取得に失敗しました'
    });
  }
}

/**
 * PATCH /api/practice/:id/reflection
 * 振り返りを追加・編集
 */
export async function updateReflection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { reflection_good, reflection_struggled, reflection_learned } = req.body;

    // 少なくとも1つの振り返り項目が必要
    if (!reflection_good && !reflection_struggled && !reflection_learned) {
      return res.status(400).json({
        status: 'error',
        message: '少なくとも1つの振り返り項目が必要です'
      });
    }

    // セッションの存在確認
    const checkResult = await db.query(
      'SELECT id FROM practice_sessions WHERE id = $1',
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: '練習セッションが見つかりません'
      });
    }

    // 更新
    const result = await db.query(
      `UPDATE practice_sessions
       SET reflection_good = COALESCE($1, reflection_good),
           reflection_struggled = COALESCE($2, reflection_struggled),
           reflection_learned = COALESCE($3, reflection_learned),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [reflection_good, reflection_struggled, reflection_learned, id]
    );

    res.json({
      status: 'success',
      message: '振り返りが更新されました',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in updateReflection:', error);
    res.status(500).json({
      status: 'error',
      message: '振り返りの更新に失敗しました'
    });
  }
}
