import { useState, useEffect } from 'react';
import { practiceApi } from '../services/api';
import type { PracticeSession } from '../types/index';
import './Gallery.css';

function Gallery() {
  const [practices, setPractices] = useState<PracticeSession[]>([]);
  const [filteredPractices, setFilteredPractices] = useState<PracticeSession[]>([]);
  const [selectedPractice, setSelectedPractice] = useState<PracticeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    fetchPractices();
  }, []);

  useEffect(() => {
    filterPractices();
  }, [practices, difficultyFilter]);

  const fetchPractices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await practiceApi.getAll();
      setPractices(response.data.data);
    } catch (err) {
      console.error(err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const filterPractices = () => {
    if (difficultyFilter === 'all') {
      setFilteredPractices(practices);
    } else {
      setFilteredPractices(
        practices.filter((p) => p.topic_difficulty === difficultyFilter)
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    }
    return `${minutes}分`;
  };

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case '中級':
        return 'medium';
      case '上級':
        return 'hard';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-container gallery-page">
          <h1 className="page-title">ギャラリー</h1>
          <div className="loading-message">データを読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="page-container gallery-page">
          <h1 className="page-title">ギャラリー</h1>
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-container gallery-page">
        <h1 className="page-title">ギャラリー</h1>

      {practices.length > 0 && (
        <div className="gallery-filters">
          <div className="filter-group">
            <label htmlFor="difficulty-filter">難易度:</label>
            <select
              id="difficulty-filter"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">すべて</option>
              <option value="初級">初級</option>
              <option value="中級">中級</option>
              <option value="上級">上級</option>
            </select>
          </div>
          <div style={{ marginLeft: 'auto', color: '#666' }}>
            {filteredPractices.length}件の作品
          </div>
        </div>
      )}

      {filteredPractices.length === 0 ? (
        <div className="empty-message">
          <h2>まだ練習記録がありません</h2>
          <p>お題を生成して、練習を始めましょう！</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredPractices.map((practice) => (
            <div
              key={practice.id}
              className="gallery-card"
              onClick={() => setSelectedPractice(practice)}
            >
              <img
                src={practice.image_path}
                alt={practice.topic_description}
                className="gallery-image"
              />
              <div className="gallery-card-content">
                <div className="gallery-card-header">
                  <span
                    className={`gallery-difficulty ${getDifficultyClass(practice.topic_difficulty)}`}
                  >
                    {practice.topic_difficulty}
                  </span>
                  <span className="gallery-date">
                    {formatDate(practice.created_at)}
                  </span>
                </div>
                <div className="gallery-topic">{practice.topic_description}</div>
                <div className="gallery-duration">
                  ⏱️ {formatTime(practice.duration_seconds)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPractice && (
        <div className="modal-overlay" onClick={() => setSelectedPractice(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedPractice(null)}
            >
              ×
            </button>
            <img
              src={selectedPractice.image_path}
              alt={selectedPractice.topic_description}
              className="modal-image"
            />
            <div className="modal-details">
              <div className="modal-header">
                <div className="modal-topic">
                  {selectedPractice.topic_description}
                </div>
                <div className="modal-meta">
                  <span
                    className={`gallery-difficulty ${getDifficultyClass(selectedPractice.topic_difficulty)}`}
                  >
                    {selectedPractice.topic_difficulty}
                  </span>
                </div>
              </div>

              <div className="modal-info">
                <div className="info-item">
                  <span className="info-label">制作日:</span>
                  <span className="info-value">
                    {formatDate(selectedPractice.created_at)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">制作時間:</span>
                  <span className="info-value">
                    {formatTime(selectedPractice.duration_seconds)}
                  </span>
                </div>
              </div>

              <div className="modal-reflection">
                {selectedPractice.reflection_good && (
                  <div className="reflection-item">
                    <h3>良かった点</h3>
                    <p>{selectedPractice.reflection_good}</p>
                  </div>
                )}
                {selectedPractice.reflection_struggled && (
                  <div className="reflection-item">
                    <h3>苦労した点</h3>
                    <p>{selectedPractice.reflection_struggled}</p>
                  </div>
                )}
                {selectedPractice.reflection_learned && (
                  <div className="reflection-item">
                    <h3>学んだこと</h3>
                    <p>{selectedPractice.reflection_learned}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Gallery;
