import { useState, useEffect } from 'react';
import { statsApi, aiApi } from '../services/api';
import type { Statistics, AIReport } from '../types/index';
import './Dashboard.css';

function Dashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [aiReport, setAiReport] = useState<AIReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, reportResponse] = await Promise.all([
        statsApi.get(),
        aiApi.getReport().catch(() => ({ data: { data: null } })),
      ]);
      setStatistics(statsResponse.data.data);
      setAiReport(reportResponse.data.data);
    } catch (err) {
      console.error(err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await aiApi.generateReport();
      setAiReport(response.data.data);
    } catch (err) {
      console.error(err);
      alert('レポート生成に失敗しました。もう一度お試しください。');
    } finally {
      setGeneratingReport(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-container dashboard-page">
          <h1 className="page-title">統計ダッシュボード</h1>
          <div className="loading-message">データを読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-container dashboard-page">
          <h1 className="page-title">統計ダッシュボード</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="page">
        <div className="page-container dashboard-page">
          <h1 className="page-title">統計ダッシュボード</h1>
          <div className="error-message">統計データがありません</div>
        </div>
      </div>
    );
  }

  const totalDifficulty =
    statistics.difficulty_distribution.初級 +
    statistics.difficulty_distribution.中級 +
    statistics.difficulty_distribution.上級;

  return (
    <div className="page">
      <div className="page-container dashboard-page">
        <h1 className="page-title">統計ダッシュボード</h1>

        {/* 統計概要 */}
        <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-label">総練習回数</div>
          <div className="stat-value">{statistics.total_practices}</div>
          <div className="stat-unit">回</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">連続練習日数</div>
          <div className="stat-value">{statistics.consecutive_days}</div>
          <div className="stat-unit">日</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">平均制作時間</div>
          <div className="stat-value">
            {formatTime(statistics.average_duration_seconds)}
          </div>
        </div>
      </div>

      {/* 難易度別分布 */}
      <div className="difficulty-distribution">
        <h2>難易度別練習分布</h2>
        <div className="difficulty-bars">
          <div className="difficulty-bar-item">
            <div className="difficulty-label">初級</div>
            <div className="difficulty-bar-container">
              <div
                className="difficulty-bar-fill"
                style={{
                  width: `${totalDifficulty > 0 ? (statistics.difficulty_distribution.初級 / totalDifficulty) * 100 : 0}%`,
                }}
              >
                {statistics.difficulty_distribution.初級}回
              </div>
            </div>
          </div>
          <div className="difficulty-bar-item">
            <div className="difficulty-label">中級</div>
            <div className="difficulty-bar-container">
              <div
                className="difficulty-bar-fill medium"
                style={{
                  width: `${totalDifficulty > 0 ? (statistics.difficulty_distribution.中級 / totalDifficulty) * 100 : 0}%`,
                }}
              >
                {statistics.difficulty_distribution.中級}回
              </div>
            </div>
          </div>
          <div className="difficulty-bar-item">
            <div className="difficulty-label">上級</div>
            <div className="difficulty-bar-container">
              <div
                className="difficulty-bar-fill hard"
                style={{
                  width: `${totalDifficulty > 0 ? (statistics.difficulty_distribution.上級 / totalDifficulty) * 100 : 0}%`,
                }}
              >
                {statistics.difficulty_distribution.上級}回
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* カレンダー */}
      <div className="calendar-section">
        <h2>練習カレンダー（最近30日）</h2>
        <div className="calendar-grid">
          {statistics.calendar_data.slice(0, 30).map((day) => (
            <div
              key={day.date}
              className={`calendar-day ${day.count > 0 ? 'has-practice' : ''}`}
              title={`${day.date}: ${day.count}回`}
            >
              {new Date(day.date).getDate()}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f0f0f0' }}></div>
            <span>練習なし</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>練習あり</span>
          </div>
        </div>
      </div>

      {/* AI診断レポート */}
      <div className="ai-report-section">
        <h2>AI診断レポート</h2>
        {aiReport ? (
          <div className="ai-report-content">{aiReport.report}</div>
        ) : (
          <div className="ai-report-empty">
            <p>まだAI診断レポートが生成されていません</p>
            <p>あなたの練習履歴を分析して、アドバイスを生成します</p>
            <button
              className="generate-report-btn"
              onClick={generateReport}
              disabled={generatingReport || statistics.total_practices === 0}
            >
              {generatingReport ? 'レポート生成中...' : 'レポートを生成する'}
            </button>
            {statistics.total_practices === 0 && (
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                ※ レポートを生成するには、少なくとも1回の練習記録が必要です
              </p>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
