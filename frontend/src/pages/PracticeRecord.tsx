import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { practiceApi } from '../services/api';
import type { Topic } from '../types/index';
import './PracticeRecord.css';

function PracticeRecord() {
  const navigate = useNavigate();
  const location = useLocation();
  const topic = location.state?.topic as Topic | undefined;

  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [reflectionGood, setReflectionGood] = useState('');
  const [reflectionStruggled, setReflectionStruggled] = useState('');
  const [reflectionLearned, setReflectionLearned] = useState('');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // タイマー処理
  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning && startTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedSeconds(diff);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, startTime]);

  // 保存完了後のカウントダウンと自動遷移
  useEffect(() => {
    if (completed) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // カウントダウン終了後、ダッシュボードへ遷移
        navigate('/dashboard');
      }
    }
  }, [completed, countdown, navigate]);

  // お題がない場合はお題生成画面へ
  if (!topic) {
    return (
      <div className="page">
        <div className="page-container practice-page">
          <h1 className="page-title">描画記録</h1>
          <div className="error" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>お題が選択されていません。</p>
            <button
              className="button button-primary"
              onClick={() => navigate('/topic')}
              style={{ marginTop: '1rem' }}
            >
              お題を生成する
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startTimer = () => {
    setStartTime(new Date());
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setStartTime(null);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      alert('画像をアップロードしてください');
      return;
    }

    if (elapsedSeconds === 0) {
      alert('制作時間を記録してください');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('user_id', '1'); // 仮のユーザーID
      formData.append('topic_id', topic.id.toString());
      formData.append('topic_description', topic.description);
      formData.append('topic_difficulty', topic.difficulty);
      formData.append('duration_seconds', elapsedSeconds.toString());
      formData.append('reflection_good', reflectionGood);
      formData.append('reflection_struggled', reflectionStruggled);
      formData.append('reflection_learned', reflectionLearned);

      await practiceApi.create(formData);
      setCompleted(true);
    } catch (err) {
      console.error(err);
      alert('保存に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="page">
        <div className="page-container practice-page">
          <div className="success-message">
          <h2>練習記録を保存しました！</h2>
          <p>お疲れ様でした。素晴らしい作品ですね。</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
            {countdown}秒後に統計ダッシュボードへ自動的に移動します...
          </p>
          <div className="success-actions">
            <button
              className="button button-primary"
              onClick={() => navigate('/gallery')}
            >
              ギャラリーを見る
            </button>
            <button
              className="button button-primary"
              onClick={() => navigate('/dashboard')}
            >
              統計を見る
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate('/topic')}
            >
              新しいお題を生成
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-container practice-page">
        <h1 className="page-title">描画記録</h1>

      <div className="practice-steps">
        {/* ステップ1: お題確認 */}
        <div className={`step ${currentStep < 1 ? 'disabled' : ''}`}>
          <div className="step-header">
            <div className={`step-number ${currentStep > 1 ? 'completed' : ''}`}>1</div>
            <div className="step-title">お題を確認</div>
          </div>
          <div className="topic-display">
            <div className="difficulty">{topic.difficulty}</div>
            <div className="description">{topic.description}</div>
          </div>
          {currentStep === 1 && (
            <button
              className="button button-primary"
              onClick={() => setCurrentStep(2)}
            >
              制作を開始する
            </button>
          )}
        </div>

        {/* ステップ2: 制作時間 */}
        <div className={`step ${currentStep < 2 ? 'disabled' : ''}`}>
          <div className="step-header">
            <div className={`step-number ${currentStep > 2 ? 'completed' : ''}`}>2</div>
            <div className="step-title">制作時間を記録</div>
          </div>
          {currentStep >= 2 && (
            <>
              <p style={{ marginBottom: '1rem', color: '#666' }}>
                タイマーを開始して、お題に沿った絵を描きましょう
              </p>
              <div className="timer-display">{formatTime(elapsedSeconds)}</div>
              <div className="timer-buttons">
                {!isTimerRunning && elapsedSeconds === 0 && (
                  <button className="button button-primary" onClick={startTimer}>
                    計測開始
                  </button>
                )}
                {isTimerRunning && (
                  <button className="button button-secondary" onClick={pauseTimer}>
                    一時停止
                  </button>
                )}
                {!isTimerRunning && elapsedSeconds > 0 && (
                  <>
                    <button className="button button-primary" onClick={startTimer}>
                      再開
                    </button>
                    <button className="button button-secondary" onClick={resetTimer}>
                      リセット
                    </button>
                  </>
                )}
              </div>
              {currentStep === 2 && elapsedSeconds > 0 && (
                <button
                  className="button button-primary"
                  onClick={() => {
                    if (isTimerRunning) pauseTimer();
                    setCurrentStep(3);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  制作完了・次へ進む
                </button>
              )}
            </>
          )}
        </div>

        {/* ステップ3: 画像アップロード */}
        <div className={`step ${currentStep < 3 ? 'disabled' : ''}`}>
          <div className="step-header">
            <div className={`step-number ${currentStep > 3 ? 'completed' : ''}`}>3</div>
            <div className="step-title">完成した作品をアップロード</div>
          </div>
          {currentStep >= 3 && (
            <>
              <div className="file-upload">
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`file-input-label ${imageFile ? 'has-file' : ''}`}
                  >
                    {imageFile ? (
                      <div>
                        <div>✓ {imageFile.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                          クリックして別の画像を選択
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>📁</div>
                        <div>クリックして画像を選択</div>
                        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                          JPG, PNG, GIF対応
                        </div>
                      </div>
                    )}
                  </label>
                </div>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
              {currentStep === 3 && imageFile && (
                <button
                  className="button button-primary"
                  onClick={() => setCurrentStep(4)}
                  style={{ marginTop: '1rem' }}
                >
                  次へ進む
                </button>
              )}
            </>
          )}
        </div>

        {/* ステップ4: 振り返り */}
        <div className={`step ${currentStep < 4 ? 'disabled' : ''}`}>
          <div className="step-header">
            <div className="step-number">4</div>
            <div className="step-title">振り返りを記入</div>
          </div>
          {currentStep >= 4 && (
            <div className="reflection-form">
              <div className="form-group">
                <label htmlFor="good">良かった点</label>
                <textarea
                  id="good"
                  value={reflectionGood}
                  onChange={(e) => setReflectionGood(e.target.value)}
                  placeholder="今回の練習で良かった点や上手くできた部分を記録しましょう"
                />
              </div>
              <div className="form-group">
                <label htmlFor="struggled">苦労した点</label>
                <textarea
                  id="struggled"
                  value={reflectionStruggled}
                  onChange={(e) => setReflectionStruggled(e.target.value)}
                  placeholder="難しかった点や改善が必要だと感じた部分を記録しましょう"
                />
              </div>
              <div className="form-group">
                <label htmlFor="learned">学んだこと</label>
                <textarea
                  id="learned"
                  value={reflectionLearned}
                  onChange={(e) => setReflectionLearned(e.target.value)}
                  placeholder="今回の練習から学んだことや次回に活かせることを記録しましょう"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {currentStep === 4 && (
        <div className="submit-section">
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            すべての項目を確認して、練習記録を保存しましょう
          </p>
          <button
            className="button button-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '保存中...' : '練習記録を保存'}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

export default PracticeRecord;
