import { Router } from 'express';
import upload from '../middleware/upload';
import {
  createPracticeSession,
  getAllPracticeSessions,
  getPracticeSession,
  updateReflection
} from '../controllers/practiceController';

const router = Router();

/**
 * POST /api/practice
 * 練習セッションを作成（画像アップロード付き）
 */
router.post('/', upload.single('image'), createPracticeSession);

/**
 * GET /api/practice
 * すべての練習セッションを取得
 */
router.get('/', getAllPracticeSessions);

/**
 * GET /api/practice/:id
 * 特定の練習セッションを取得
 */
router.get('/:id', getPracticeSession);

/**
 * PATCH /api/practice/:id/reflection
 * 振り返りを追加・編集
 */
router.patch('/:id/reflection', updateReflection);

export default router;
