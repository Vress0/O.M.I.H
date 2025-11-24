import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 導入組件
import NavBar from './components/NavBar';

// 導入所有頁面  
import HomePage from './pages/index';
import SymptomsPage from './pages/symptoms';
import AnalysisPage from './pages/analysis';
import DoctorsPage from './pages/doctors';
import ConstitutionPage from './pages/constitution';
import KnowledgePage from './pages/knowledge';
import AssistantPage from './pages/assistant';

// 導入全域樣式
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/symptoms" element={<SymptomsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/constitution" element={<ConstitutionPage />} />
            <Route path="/knowledge" element={<KnowledgePage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            {/* 404 頁面 */}
            <Route path="*" element={
              <div className="not-found-page">
                <div className="not-found-content">
                  <h1>404 - 頁面未找到</h1>
                  <p>抱歉，您訪問的頁面不存在。</p>
                  <a href="/" className="home-link">返回首頁</a>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;