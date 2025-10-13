import { Router } from 'express';
import { getRandomTopic, getRecommendedTopics } from '../controllers/topicController';

const router = Router();

/**
 * GET /api/topics/random
 * ランダムなお題を1つ生成
 */
router.get('/random', getRandomTopic);

/**
 * GET /api/topics/recommended
 * AIがおすすめするお題を3つ生成
 */
router.get('/recommended', getRecommendedTopics);

export default router;
