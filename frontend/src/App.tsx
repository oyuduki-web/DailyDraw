import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TopicGeneration from './pages/TopicGeneration';
import PracticeRecord from './pages/PracticeRecord';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              DailyDraw
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">ホーム</Link>
              </li>
              <li className="nav-item">
                <Link to="/topic" className="nav-link">お題生成</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">ダッシュボード</Link>
              </li>
              <li className="nav-item">
                <Link to="/gallery" className="nav-link">ギャラリー</Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topic" element={<TopicGeneration />} />
            <Route path="/practice" element={<PracticeRecord />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
