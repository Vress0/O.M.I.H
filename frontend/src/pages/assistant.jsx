import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/ChatBox';
import '../pages/assistant.css';

const AssistantPage = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="assistant-page">
      <div className="assistant-container">
        <div className="assistant-header">
          <h1 className="assistant-title">
            <span className="title-icon">🤖</span>
            AI 中醫助理
          </h1>
          <p className="assistant-description">
            您的個人中醫健康顧問，隨時為您答疑解惑
          </p>
        </div>

        <div className="assistant-content">
          <ChatBox 
            isMinimized={isMinimized}
            onMinimize={() => setIsMinimized(!isMinimized)}
          />
        </div>

        <div className="quick-actions">
          <h3 className="actions-title">快速功能</h3>
          <div className="actions-grid">
            <button 
              onClick={() => navigate('/symptoms')}
              className="action-card"
            >
              <div className="action-icon">🩺</div>
              <div className="action-title">症狀分析</div>
              <div className="action-desc">AI 智能症狀分析</div>
            </button>

            <button 
              onClick={() => navigate('/constitution')}
              className="action-card"
            >
              <div className="action-icon">🧬</div>
              <div className="action-title">體質檢測</div>
              <div className="action-desc">九種體質評估</div>
            </button>

            <button 
              onClick={() => navigate('/doctors')}
              className="action-card"
            >
              <div className="action-icon">👨‍⚕️</div>
              <div className="action-title">找醫師</div>
              <div className="action-desc">專業醫師推薦</div>
            </button>

            <button 
              onClick={() => navigate('/knowledge')}
              className="action-card"
            >
              <div className="action-icon">📚</div>
              <div className="action-title">知識庫</div>
              <div className="action-desc">中醫養生知識</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;