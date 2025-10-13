import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="page">
      <div className="page-container home-page">
        <h1 className="page-title">DailyDraw へようこそ</h1>
        <p className="subtitle">イラストレーターの継続的な画力向上を支援するWebアプリケーション</p>

        <div className="feature-grid">
        <div className="feature-card">
          <h3>お題生成</h3>
          <p>AIがあなたに最適なお題を生成します</p>
          <Link to="/topic">
            <button className="button button-primary">お題を生成する</button>
          </Link>
        </div>

        <div className="feature-card">
          <h3>ダッシュボード</h3>
          <p>統計データとAI分析レポートを確認</p>
          <Link to="/dashboard">
            <button className="button button-primary">ダッシュボードを見る</button>
          </Link>
        </div>

        <div className="feature-card">
          <h3>ギャラリー</h3>
          <p>過去の練習記録を振り返る</p>
          <Link to="/gallery">
            <button className="button button-primary">ギャラリーを見る</button>
          </Link>
        </div>
      </div>

        <div className="how-it-works">
          <h2>使い方</h2>
          <ol>
            <li>AIがお題を生成</li>
            <li>お題に沿って絵を描く</li>
            <li>完成したら画像をアップロード</li>
            <li>振り返りを記録</li>
            <li>AIが分析してアドバイス</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Home;
