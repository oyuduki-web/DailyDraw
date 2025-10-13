import { Router } from 'express';
import { createAIReport, getAIReport } from '../controllers/aiController';

const router = Router();

/**
 * POST /api/ai/report
 * AI診断レポートを生成して保存
 */
router.post('/report', createAIReport);

/**
 * GET /api/ai/report
 * 最新のAI診断レポートを取得
 */
router.get('/report', getAIReport);

export default router;
