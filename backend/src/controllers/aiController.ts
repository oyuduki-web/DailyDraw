import { Request, Response } from 'express';
import { generateAIReport, saveAIReport } from '../services/aiAnalysisService';
import db from '../config/database';

/**
 * POST /api/ai/report
 * AI診断レポートを生成して保存
 */
export async function createAIReport(req: Request, res: Response) {
  try {
    // 暫定的に user_id = 1 として扱う
    const userId = 1;

    // AI診断レポート生成
    const report = await generateAIReport(userId);

    // データベースに保存
    const savedReport = await saveAIReport(userId, report);

    res.json({
      status: 'success',
      message: 'AI診断レポートが生成されました',
      data: {
        id: savedReport.id,
        report: savedReport.overall_assessment,
        created_at: savedReport.created_at,
        updated_at: savedReport.updated_at
      }
    });
  } catch (error) {
    console.error('Error in createAIReport:', error);
    res.status(500).json({
      status: 'error',
      message: 'AI診断レポートの生成に失敗しました'
    });
  }
}

/**
 * GET /api/ai/report
 * 最新のAI診断レポートを取得
 */
export async function getAIReport(req: Request, res: Response) {
  try {
    // 暫定的に user_id = 1 として扱う
    const userId = 1;

    const result = await db.query(
      'SELECT * FROM ai_reports WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'AI診断レポートがまだ生成されていません。先に練習記録を追加してください。'
      });
    }

    const report = result.rows[0];

    res.json({
      status: 'success',
      data: {
        id: report.id,
        report: report.overall_assessment,
        created_at: report.created_at,
        updated_at: report.updated_at
      }
    });
  } catch (error) {
    console.error('Error in getAIReport:', error);
    res.status(500).json({
      status: 'error',
      message: 'AI診断レポートの取得に失敗しました'
    });
  }
}
