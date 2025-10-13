import { Request, Response } from 'express';
import { getUserStatistics } from '../services/statsService';

/**
 * GET /api/stats
 * ユーザーの統計データを取得
 */
export async function getStatistics(req: Request, res: Response) {
  try {
    // 暫定的に user_id = 1 として扱う
    const userId = 1;

    const statistics = await getUserStatistics(userId);

    res.json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({
      status: 'error',
      message: '統計データの取得に失敗しました'
    });
  }
}
