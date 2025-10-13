import { Request, Response } from 'express';
import { generateRandomTopic, generateRecommendedTopics } from '../services/topicService';
import db from '../config/database';

/**
 * GET /api/topics/random
 * ランダムなお題を1つ生成
 */
export async function getRandomTopic(req: Request, res: Response) {
  try {
    const topic = await generateRandomTopic();

    // お題をデータベースに保存
    const result = await db.query(
      'INSERT INTO topics (description, difficulty) VALUES ($1, $2) RETURNING *',
      [topic.description, topic.difficulty]
    );

    const savedTopic = result.rows[0];

    res.json({
      status: 'success',
      data: {
        id: savedTopic.id,
        description: savedTopic.description,
        difficulty: savedTopic.difficulty,
        created_at: savedTopic.created_at
      }
    });
  } catch (error) {
    console.error('Error in getRandomTopic:', error);
    res.status(500).json({
      status: 'error',
      message: 'お題の生成に失敗しました'
    });
  }
}

/**
 * GET /api/topics/recommended
 * AIがおすすめするお題を3つ生成
 * TODO: ユーザー認証が実装されたら userId を取得
 */
export async function getRecommendedTopics(req: Request, res: Response) {
  try {
    // 暫定的に userId = 1 として扱う（今後認証実装後に修正）
    const userId = 1;

    const topics = await generateRecommendedTopics(userId);

    // お題をデータベースに保存
    const savedTopics = [];
    for (const topic of topics) {
      const result = await db.query(
        'INSERT INTO topics (description, difficulty) VALUES ($1, $2) RETURNING *',
        [topic.description, topic.difficulty]
      );
      savedTopics.push(result.rows[0]);
    }

    res.json({
      status: 'success',
      data: savedTopics.map(t => ({
        id: t.id,
        description: t.description,
        difficulty: t.difficulty,
        created_at: t.created_at
      }))
    });
  } catch (error) {
    console.error('Error in getRecommendedTopics:', error);
    res.status(500).json({
      status: 'error',
      message: 'おすすめお題の生成に失敗しました'
    });
  }
}
