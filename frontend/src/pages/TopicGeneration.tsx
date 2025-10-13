import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { topicsApi } from '../services/api';
import type { Topic } from '../types/index';
import './TopicGeneration.css';

function TopicGeneration() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'select' | 'random' | 'recommended'>('select');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRandom = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await topicsApi.getRandom();
      setTopics([response.data.data]);
      setMode('random');
    } catch (err) {
      setError('お題の生成に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommended = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await topicsApi.getRecommended();
      setTopics(response.data.data);
      setMode('recommended');
    } catch (err) {
      setError('お題の生成に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectTopic = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const startPractice = () => {
    if (selectedTopic) {
      navigate('/practice', { state: { topic: selectedTopic } });
    }
  };

  if (mode === 'select') {
    return (
      <div className="page">
        <div className="page-container topic-page">
          <h1 className="page-title">お題生成</h1>
          <p className="description">お題の生成方法を選択してください</p>

        {loading ? (
          <div className="loading">お題を生成中...</div>
        ) : (
          <div className="mode-selection">
            <div className="mode-card">
              <h3>AIおすすめ</h3>
              <p>あなたの練習履歴から最適なお題を3つ提案します</p>
              <button
                className="button button-primary"
                onClick={generateRecommended}
              >
                おすすめお題を生成
              </button>
            </div>

            <div className="mode-card">
              <h3>完全ランダム</h3>
              <p>AIがランダムにお題を1つ生成します</p>
              <button
                className="button button-primary"
                onClick={generateRandom}
              >
                ランダムお題を生成
              </button>
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-container topic-page">
        <h1 className="page-title">お題生成</h1>

      {loading && <div className="loading">お題を生成中...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && topics.length > 0 && (
        <>
          <div className="topics-container">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`topic-card ${selectedTopic?.id === topic.id ? 'selected' : ''}`}
                onClick={() => selectTopic(topic)}
              >
                <div className="topic-difficulty">{topic.difficulty}</div>
                <p className="topic-description">{topic.description}</p>
              </div>
            ))}
          </div>

          {selectedTopic && (
            <div className="action-buttons">
              <button
                className="button button-primary"
                onClick={startPractice}
              >
                このお題で練習を始める
              </button>
              <button
                className="button button-secondary"
                onClick={() => setMode('select')}
              >
                別のお題を生成する
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}

export default TopicGeneration;
