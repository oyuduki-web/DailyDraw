import { Router } from 'express';
import { getStatistics } from '../controllers/statsController';

const router = Router();

/**
 * GET /api/stats
 * ユーザーの統計データを取得
 */
router.get('/', getStatistics);

export default router;
