import openai from '../config/openai';
import { GeneratedTopic } from '../types';
import pool from '../config/database';

/**
 * お題のカテゴリー一覧
 */
const TOPIC_CATEGORIES = [
  {
    name: '日常動作',
    description: '日常生活での動作やポーズ',
    examples: '料理をする、本を読む、ストレッチをする、掃除をする、電話をかける'
  },
  {
    name: 'スポーツ・運動',
    description: 'スポーツや運動の動作',
    examples: 'サッカーのシュート、バスケのドリブル、ヨガのポーズ、ダンス、水泳'
  },
  {
    name: '感情表現',
    description: '様々な感情を表現するポーズや表情',
    examples: '驚いて飛び上がる、悲しんで泣く、喜んでガッツポーズ、怒って腕組み、照れて顔を隠す'
  },
  {
    name: '職業・仕事',
    description: '様々な職業の特徴的な動作やポーズ',
    examples: 'シェフが料理を盛り付ける、美容師がカットする、医師が診察する、画家が絵を描く'
  },
  {
    name: 'リラックス・休息',
    description: 'くつろぎや休憩のポーズ',
    examples: 'ソファで寝転ぶ、お風呂に浸かる、ハンモックで昼寝、芝生に寝そべる'
  },
  {
    name: 'アクション・動的',
    description: '動きのある激しいポーズ',
    examples: '走る、ジャンプする、戦う、よける、転ぶ、飛び込む'
  },
  {
    name: '対人関係',
    description: '人と人との関わりを表現',
    examples: '握手をする、ハグする、肩を組む、背中を押す、手を引く、おんぶする'
  },
  {
    name: 'ファンタジー・創作',
    description: '魔法や非現実的な動作',
    examples: '魔法を唱える、剣を振るう、空を飛ぶ、変身する、召喚する'
  },
  {
    name: '座る・寝る',
    description: '様々な座り方や寝方',
    examples: '体育座り、あぐら、正座、椅子に座る、うつ伏せ、仰向け、横向き'
  },
  {
    name: '手の表現',
    description: '手や指の動きに焦点を当てた表現',
    examples: 'ピースサイン、指差し、手を広げる、拳を握る、指を組む、何かをつかむ'
  },
  {
    name: '季節・イベント',
    description: '季節やイベント特有の動作',
    examples: '傘を差す、雪だるまを作る、花火を見上げる、紅葉を拾う、プレゼントを開ける'
  },
  {
    name: '音楽・芸術',
    description: '音楽や芸術活動のポーズ',
    examples: 'ギターを弾く、ピアノを弾く、歌う、踊る、楽器を演奏する'
  }
];

/**
 * ランダムにカテゴリーを選択
 */
function getRandomCategory() {
  return TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)];
}

/**
 * AIでランダムなお題を1つ生成する
 */
export async function generateRandomTopic(): Promise<GeneratedTopic> {
  try {
    const category = getRandomCategory();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたはイラスト練習用のお題を生成するアシスタントです。
以下の形式でJSONを返してください：
{
  "description": "詳細なポーズ・構図の説明",
  "difficulty": "初級 or 中級 or 上級"
}

## お題生成のガイドライン

### 文字数制限：
- **descriptionは100文字以内**で簡潔に表現してください
- 重要な情報を優先し、冗長な表現は避けてください

### 必ず含めるべき要素：
1. **具体的なポーズ・動作**: 体のどの部分がどう動いているか明確に
2. **構図・アングル**: 正面/側面/背面/俯瞰/煽りなど視点を指定
3. **手足の位置**: 右手は○○、左手は○○のように具体的に
4. **シチュエーション**: どんな場所・状況での動作か

### バリエーションを持たせる要素（ランダムに組み合わせる）：
- **場所**: 室内/屋外/カフェ/公園/駅/学校/職場など
- **時間帯**: 朝/昼/夕方/夜
- **天候**: 晴れ/雨/雪/風が強いなど
- **服装**: カジュアル/フォーマル/制服/部屋着など
- **持ち物**: 本/スマホ/カバン/傘/飲み物など
- **表情**: 笑顔/真剣/驚き/リラックスなど

### 難易度の目安：
- **初級**: 正面または側面の静止ポーズ、シンプルな動作
- **中級**: 斜めアングル、やや複雑な動作、小物を持つ
- **上級**: 俯瞰・煽り、複雑な動作、激しい動き、複数の要素の組み合わせ

### 重要な注意点：
- 毎回異なる要素を組み合わせて、ユニークなお題を作ってください
- ありきたりな表現を避け、具体的で想像しやすい説明にしてください
- 同じパターンの繰り返しにならないよう、創造性を発揮してください
- 100文字以内に収めつつ、必要な情報は全て含めてください`
        },
        {
          role: 'user',
          content: `「${category.name}」カテゴリーのイラスト練習用お題を1つ生成してください。

カテゴリー説明: ${category.description}
参考例: ${category.examples}

このカテゴリーの特徴を活かしつつ、参考例とは異なる独創的で具体的なお題を作ってください。`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 1.0,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    const topic = JSON.parse(content) as GeneratedTopic;

    // バリデーション
    if (!topic.description || !topic.difficulty) {
      throw new Error('Invalid topic format from OpenAI');
    }

    if (!['初級', '中級', '上級'].includes(topic.difficulty)) {
      throw new Error(`Invalid difficulty: ${topic.difficulty}`);
    }

    return topic;
  } catch (error) {
    console.error('Error generating random topic:', error);
    throw new Error('Failed to generate topic');
  }
}

/**
 * お題の説明文からカテゴリーを推測
 */
function detectCategory(description: string): string {
  for (const category of TOPIC_CATEGORIES) {
    const keywords = category.examples.split('、');
    for (const keyword of keywords) {
      if (description.includes(keyword.trim())) {
        return category.name;
      }
    }
  }
  // カテゴリー判定できない場合は説明文からキーワードマッチング
  if (description.match(/料理|食事|読書|掃除|電話/)) return '日常動作';
  if (description.match(/走る|ジャンプ|スポーツ|運動|ヨガ|ダンス/)) return 'スポーツ・運動';
  if (description.match(/笑|泣|怒|驚|喜|悲しい|嬉しい|感情/)) return '感情表現';
  if (description.match(/職業|仕事|医師|シェフ|美容師/)) return '職業・仕事';
  if (description.match(/休憩|リラックス|寝転|お風呂|昼寝/)) return 'リラックス・休息';
  if (description.match(/戦う|よける|アクション|激しい/)) return 'アクション・動的';
  if (description.match(/握手|ハグ|肩を組|二人|対話/)) return '対人関係';
  if (description.match(/魔法|剣|ファンタジー|変身/)) return 'ファンタジー・創作';
  if (description.match(/座|椅子|正座|あぐら|寝る|うつ伏せ|仰向け/)) return '座る・寝る';
  if (description.match(/手|指|ピース|握る|つかむ/)) return '手の表現';
  if (description.match(/傘|雪|花火|季節|イベント|紅葉/)) return '季節・イベント';
  if (description.match(/音楽|楽器|ピアノ|ギター|歌|演奏/)) return '音楽・芸術';

  return '日常動作'; // デフォルト
}

/**
 * ユーザーの練習履歴を分析
 */
interface UserStats {
  totalPractices: number;
  categoryStats: Map<string, { count: number; lastPracticed: Date | null }>;
  difficultyStats: Map<string, number>;
  recentCategories: string[]; // 直近7日間
}

async function analyzeUserHistory(userId: number): Promise<UserStats> {
  const result = await pool.query(
    `SELECT
      topic_description,
      topic_difficulty,
      created_at
     FROM practice_sessions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  const stats: UserStats = {
    totalPractices: result.rows.length,
    categoryStats: new Map(),
    difficultyStats: new Map(),
    recentCategories: []
  };

  // 初期化
  TOPIC_CATEGORIES.forEach(cat => {
    stats.categoryStats.set(cat.name, { count: 0, lastPracticed: null });
  });
  stats.difficultyStats.set('初級', 0);
  stats.difficultyStats.set('中級', 0);
  stats.difficultyStats.set('上級', 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  result.rows.forEach((row: any) => {
    const category = detectCategory(row.topic_description);
    const difficulty = row.topic_difficulty;
    const createdAt = new Date(row.created_at);

    // カテゴリー統計
    const catStat = stats.categoryStats.get(category)!;
    catStat.count++;
    if (!catStat.lastPracticed || createdAt > catStat.lastPracticed) {
      catStat.lastPracticed = createdAt;
    }

    // 難易度統計
    stats.difficultyStats.set(difficulty, (stats.difficultyStats.get(difficulty) || 0) + 1);

    // 直近7日間のカテゴリー
    if (createdAt >= sevenDaysAgo) {
      stats.recentCategories.push(category);
    }
  });

  return stats;
}

/**
 * ユーザーの練習回数に応じた適切な難易度を決定
 */
function determineDifficulty(totalPractices: number, type: 'weak' | 'strong' | 'new'): string {
  if (type === 'new') {
    return totalPractices < 20 ? '初級' : '初級'; // 新規は基本初級
  }

  if (type === 'weak') {
    // 苦手克服: 現在のレベルに応じて
    if (totalPractices < 10) return '初級';
    if (totalPractices < 30) return Math.random() < 0.7 ? '初級' : '中級';
    if (totalPractices < 50) return '中級';
    return Math.random() < 0.6 ? '中級' : '上級';
  }

  if (type === 'strong') {
    // 得意強化: 少し難易度を上げる
    if (totalPractices < 10) return '初級';
    if (totalPractices < 30) return '中級';
    if (totalPractices < 50) return Math.random() < 0.5 ? '中級' : '上級';
    return '上級';
  }

  return '中級';
}

/**
 * カテゴリー名からカテゴリーオブジェクトを取得
 */
function getCategoryByName(name: string) {
  return TOPIC_CATEGORIES.find(cat => cat.name === name) || TOPIC_CATEGORIES[0];
}

/**
 * AIでおすすめのお題を3つ生成する
 * ユーザーの練習履歴を分析して最適なお題を提案
 */
export async function generateRecommendedTopics(userId: number): Promise<GeneratedTopic[]> {
  try {
    const stats = await analyzeUserHistory(userId);

    // 練習記録がない場合は初心者向けのランダムお題
    if (stats.totalPractices === 0) {
      const topics: GeneratedTopic[] = [];
      const beginnerCategories = ['日常動作', '座る・寝る', '手の表現'];
      for (const catName of beginnerCategories) {
        const category = getCategoryByName(catName);
        const topic = await generateTopicForCategory(category, '初級', '新規挑戦', 0);
        topics.push(topic);
      }
      return topics;
    }

    // お題1: 苦手克服（練習回数が少ないカテゴリー）
    const weakCategory = Array.from(stats.categoryStats.entries())
      .filter(([name]) => !stats.recentCategories.includes(name)) // 直近7日で練習していない
      .sort((a, b) => a[1].count - b[1].count)[0]; // 練習回数が少ない順

    const weakCat = getCategoryByName(weakCategory[0]);
    const weakDifficulty = determineDifficulty(stats.totalPractices, 'weak');
    const topic1 = await generateTopicForCategory(
      weakCat,
      weakDifficulty,
      '苦手克服',
      weakCategory[1].count
    );

    // お題2: 得意強化（練習回数が多いが、直近7日練習していないカテゴリー）
    const strongCategory = Array.from(stats.categoryStats.entries())
      .filter(([name]) =>
        !stats.recentCategories.includes(name) &&
        name !== weakCategory[0]
      )
      .sort((a, b) => b[1].count - a[1].count)[0];

    const strongCat = getCategoryByName(strongCategory[0]);
    const strongDifficulty = determineDifficulty(stats.totalPractices, 'strong');
    const topic2 = await generateTopicForCategory(
      strongCat,
      strongDifficulty,
      '得意強化',
      strongCategory[1].count
    );

    // お題3: バランス調整（未経験または1-2回のカテゴリー）
    const newCategory = Array.from(stats.categoryStats.entries())
      .filter(([name]) =>
        name !== weakCategory[0] &&
        name !== strongCategory[0]
      )
      .sort((a, b) => a[1].count - b[1].count)[0];

    const newCat = getCategoryByName(newCategory[0]);
    const newDifficulty = determineDifficulty(stats.totalPractices, 'new');
    const topic3 = await generateTopicForCategory(
      newCat,
      newDifficulty,
      '新規挑戦',
      newCategory[1].count
    );

    return [topic1, topic2, topic3];
  } catch (error) {
    console.error('Error generating recommended topics:', error);
    // エラー時はランダム生成にフォールバック
    const topics: GeneratedTopic[] = [];
    for (let i = 0; i < 3; i++) {
      const topic = await generateRandomTopic();
      topics.push(topic);
    }
    return topics;
  }
}

/**
 * 指定されたカテゴリー・難易度・目的でお題を生成
 */
async function generateTopicForCategory(
  category: typeof TOPIC_CATEGORIES[0],
  difficulty: string,
  purpose: string,
  practiceCount: number
): Promise<GeneratedTopic> {
  try {
    const purposeText =
      purpose === '苦手克服' ? `このユーザーは「${category.name}」カテゴリーの練習が${practiceCount}回と少なく、苦手分野の可能性があります。基礎を意識しつつ、楽しく取り組めるお題を作成してください。` :
      purpose === '得意強化' ? `このユーザーは「${category.name}」カテゴリーを${practiceCount}回練習しており、得意分野です。さらなる上達を目指して、少しチャレンジングなお題を作成してください。` :
      `このユーザーは「${category.name}」カテゴリーの練習経験が${practiceCount}回と少なく、新しい挑戦として適しています。取り組みやすい基本的なお題を作成してください。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `あなたはイラスト練習用のお題を生成するアシスタントです。
以下の形式でJSONを返してください：
{
  "description": "詳細なポーズ・構図の説明",
  "difficulty": "${difficulty}"
}

## お題生成のガイドライン

### 文字数制限：
- **descriptionは100文字以内**で簡潔に表現してください
- 重要な情報を優先し、冗長な表現は避けてください

### 必ず含めるべき要素：
1. **具体的なポーズ・動作**: 体のどの部分がどう動いているか明確に
2. **構図・アングル**: 正面/側面/背面/俯瞰/煽りなど視点を指定
3. **手足の位置**: 右手は○○、左手は○○のように具体的に
4. **シチュエーション**: どんな場所・状況での動作か

### バリエーションを持たせる要素（ランダムに組み合わせる）：
- **場所**: 室内/屋外/カフェ/公園/駅/学校/職場など
- **時間帯**: 朝/昼/夕方/夜
- **天候**: 晴れ/雨/雪/風が強いなど
- **服装**: カジュアル/フォーマル/制服/部屋着など
- **持ち物**: 本/スマホ/カバン/傘/飲み物など
- **表情**: 笑顔/真剣/驚き/リラックスなど

### 難易度の目安：
- **初級**: 正面または側面の静止ポーズ、シンプルな動作
- **中級**: 斜めアングル、やや複雑な動作、小物を持つ
- **上級**: 俯瞰・煽り、複雑な動作、激しい動き、複数の要素の組み合わせ

### 重要な注意点：
- 毎回異なる要素を組み合わせて、ユニークなお題を作ってください
- ありきたりな表現を避け、具体的で想像しやすい説明にしてください
- 同じパターンの繰り返しにならないよう、創造性を発揮してください
- 100文字以内に収めつつ、必要な情報は全て含めてください
- 難易度は必ず「${difficulty}」で固定してください`
        },
        {
          role: 'user',
          content: `「${category.name}」カテゴリーのイラスト練習用お題を1つ生成してください。

カテゴリー説明: ${category.description}
参考例: ${category.examples}
難易度: ${difficulty}

${purposeText}

このカテゴリーの特徴を活かしつつ、参考例とは異なる独創的で具体的なお題を作ってください。`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 1.0,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty content');
    }

    const topic = JSON.parse(content) as GeneratedTopic;

    // バリデーション
    if (!topic.description || !topic.difficulty) {
      throw new Error('Invalid topic format from OpenAI');
    }

    // 難易度を強制的に指定された値にする
    topic.difficulty = difficulty;

    return topic;
  } catch (error) {
    console.error('Error generating topic for category:', error);
    // エラー時はランダム生成にフォールバック
    return generateRandomTopic();
  }
}
