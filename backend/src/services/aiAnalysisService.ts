import openai from '../config/openai';
import db from '../config/database';

/**
 * ユーザーの練習履歴を分析してAI診断レポートを生成
 */
export async function generateAIReport(userId: number): Promise<string> {
  try {
    // ユーザーの練習セッションを取得
    const sessionsResult = await db.query(
      `SELECT topic_description, topic_difficulty, duration_seconds,
              reflection_good, reflection_struggled, reflection_learned, created_at
       FROM practice_sessions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    const sessions = sessionsResult.rows;

    // データが少ない場合は励ましメッセージ
    if (sessions.length === 0) {
      return '練習を始めましょう！継続することで、AIがあなたの成長をサポートします。';
    }

    if (sessions.length < 3) {
      return `練習を${sessions.length}回記録しました！もう少し練習を続けると、より詳細な分析ができるようになります。継続が大切です！`;
    }

    // 練習データをテキストに整形
    const practiceData = sessions.map((s, i) => {
      return `
【練習${i + 1}】
- お題: ${s.topic_description}
- 難易度: ${s.topic_difficulty}
- 制作時間: ${Math.floor(s.duration_seconds / 60)}分
- 上手くできたところ: ${s.reflection_good || 'なし'}
- 苦戦したところ: ${s.reflection_struggled || 'なし'}
- 学び: ${s.reflection_learned || 'なし'}
`;
    }).join('\n');

    // OpenAI APIでレポート生成
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたはイラスト練習の分析アシスタントです。
ユーザーの練習履歴と振り返りを分析して、以下の形式で診断レポートを生成してください。

【総合評価】
最近の練習の様子を総合的に評価します。

【得意分野】
✨ 項目: 具体的な内容
（複数項目を箇条書き）

【苦手分野・改善ポイント】
⚠️ 項目: 具体的な内容
（複数項目を箇条書き）

【成長の記録】
📈 具体的な成長のポイント
（複数項目を箇条書き）

【次のステップ】
💡 具体的なアドバイス
（複数項目を箇条書き）

分析は具体的かつ前向きに、ユーザーのモチベーションを高める内容にしてください。`
        },
        {
          role: 'user',
          content: `以下は私の最近の練習記録です。分析して診断レポートを生成してください。\n\n${practiceData}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const report = completion.choices[0].message.content;
    if (!report) {
      throw new Error('OpenAI returned empty report');
    }

    return report;
  } catch (error) {
    console.error('Error generating AI report:', error);
    throw new Error('AI診断レポートの生成に失敗しました');
  }
}

/**
 * AI診断レポートをデータベースに保存
 */
export async function saveAIReport(userId: number, report: string): Promise<any> {
  try {
    // 既存のレポートを確認
    const existing = await db.query(
      'SELECT id FROM ai_reports WHERE user_id = $1',
      [userId]
    );

    let result;
    if (existing.rows.length > 0) {
      // 更新
      result = await db.query(
        `UPDATE ai_reports
         SET overall_assessment = $1, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $2
         RETURNING *`,
        [report, userId]
      );
    } else {
      // 新規作成
      result = await db.query(
        `INSERT INTO ai_reports (user_id, overall_assessment)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, report]
      );
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error saving AI report:', error);
    throw new Error('AI診断レポートの保存に失敗しました');
  }
}
