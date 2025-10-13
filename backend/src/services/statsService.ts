import db from '../config/database';
import { UserStatistics, CalendarDay } from '../types';

/**
 * ユーザーの統計データを取得
 */
export async function getUserStatistics(userId: number): Promise<UserStatistics> {
  try {
    // 総練習回数
    const totalResult = await db.query(
      'SELECT COUNT(*) as count FROM practice_sessions WHERE user_id = $1',
      [userId]
    );
    const total_practices = parseInt(totalResult.rows[0].count);

    // 連続練習日数を計算
    const consecutive_days = await calculateConsecutiveDays(userId);

    // 平均制作時間
    const avgResult = await db.query(
      'SELECT AVG(duration_seconds) as avg FROM practice_sessions WHERE user_id = $1',
      [userId]
    );
    const average_duration_seconds = Math.round(parseFloat(avgResult.rows[0].avg) || 0);

    // 難易度別の練習回数
    const difficultyResult = await db.query(
      `SELECT topic_difficulty, COUNT(*) as count
       FROM practice_sessions
       WHERE user_id = $1
       GROUP BY topic_difficulty`,
      [userId]
    );

    const difficulty_distribution = {
      初級: 0,
      中級: 0,
      上級: 0
    };

    difficultyResult.rows.forEach(row => {
      if (row.topic_difficulty in difficulty_distribution) {
        difficulty_distribution[row.topic_difficulty as '初級' | '中級' | '上級'] = parseInt(row.count);
      }
    });

    // カレンダーデータ（過去90日分）
    const calendar_data = await getCalendarData(userId, 90);

    return {
      total_practices,
      consecutive_days,
      average_duration_seconds,
      difficulty_distribution,
      calendar_data
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    throw new Error('統計データの取得に失敗しました');
  }
}

/**
 * 連続練習日数を計算
 */
async function calculateConsecutiveDays(userId: number): Promise<number> {
  try {
    const result = await db.query(
      `SELECT DATE(created_at) as practice_date
       FROM practice_sessions
       WHERE user_id = $1
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) DESC`,
      [userId]
    );

    if (result.rows.length === 0) {
      return 0;
    }

    let consecutive = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < result.rows.length; i++) {
      const practiceDate = new Date(result.rows[i].practice_date);
      practiceDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (practiceDate.getTime() === expectedDate.getTime()) {
        consecutive++;
      } else {
        break;
      }
    }

    return consecutive;
  } catch (error) {
    console.error('Error calculating consecutive days:', error);
    return 0;
  }
}

/**
 * カレンダーデータを取得（過去N日分）
 */
async function getCalendarData(userId: number, days: number): Promise<CalendarDay[]> {
  try {
    const result = await db.query(
      `SELECT DATE(created_at) as practice_date, COUNT(*) as count
       FROM practice_sessions
       WHERE user_id = $1
         AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`,
      [userId]
    );

    return result.rows.map(row => ({
      date: row.practice_date.toISOString().split('T')[0],
      count: parseInt(row.count)
    }));
  } catch (error) {
    console.error('Error getting calendar data:', error);
    return [];
  }
}
