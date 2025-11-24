import React, { useState, useRef, useEffect } from 'react';
import apiService from '../services/api';
import './ChatBox.css';

const ChatBox = ({ 
  isMinimized = false, 
  onToggleMinimize, 
  initialMessage = null,
  className = '' 
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: '您好！我是您的中醫健康小助理。我可以幫您分析症狀、提供養生建議，或回答中醫相關問題。請告訴我您有什麼需要幫助的？',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 自動滾動到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 處理初始消息
  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage]);

  // 發送消息
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await apiService.chatWithAssistant(messageText.trim());
      
      // 模擬打字效果
      setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response.data?.message || '抱歉，我現在無法回應。請稍後再試。',
          timestamp: new Date(),
          suggestions: response.data?.suggestions || []
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('聊天錯誤:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: '抱歉，服務暫時無法使用。請檢查網路連線或稍後再試。',
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 處理 Enter 鍵發送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 快速回復選項
  const quickReplies = [
    '我想了解我的體質',
    '我有頭痛的症狀',
    '推薦適合的中醫師',
    '四季養生建議',
    '飲食調理方法'
  ];

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  // 清除聊天記錄
  const handleClearChat = () => {
    if (window.confirm('確定要清除聊天記錄嗎？')) {
      setMessages([
        {
          id: 1,
          type: 'assistant',
          content: '聊天記錄已清除。有什麼我可以幫助您的嗎？',
          timestamp: new Date()
        }
      ]);
    }
  };

  if (isMinimized) {
    return (
      <div className={`chatbox-minimized ${className}`}>
        <button 
          className="restore-chat-btn"
          onClick={onToggleMinimize}
          title="展開聊天窗口"
        >
          <span className="chat-icon">💬</span>
          <span className="chat-text">AI 助理</span>
          {messages.length > 1 && (
            <span className="message-count">{messages.length - 1}</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`chatbox ${className}`}>
      {/* 聊天標題欄 */}
      <div className="chatbox-header">
        <div className="header-info">
          <div className="assistant-avatar">🤖</div>
          <div className="assistant-details">
            <h3 className="assistant-name">中醫小助理</h3>
            <p className="assistant-status">
              {isTyping ? '正在輸入...' : '線上'}
            </p>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="header-btn"
            onClick={handleClearChat}
            title="清除聊天記錄"
          >
            🗑️
          </button>
          {onToggleMinimize && (
            <button 
              className="header-btn"
              onClick={onToggleMinimize}
              title="最小化"
            >
              ➖
            </button>
          )}
        </div>
      </div>

      {/* 聊天訊息區域 */}
      <div className="chatbox-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === 'user' ? '👤' : '🤖'}
            </div>
            
            <div className="message-content">
              <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                <p className="message-text">{message.content}</p>
                
                {/* 建議選項 */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="message-suggestions">
                    <p className="suggestions-title">相關建議：</p>
                    <ul className="suggestions-list">
                      {message.suggestions.map((suggestion, index) => (
                        <li key={index} className="suggestion-item">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('zh-TW', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}

        {/* 打字指示器 */}
        {isTyping && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 快速回復區域 */}
      {messages.length <= 1 && (
        <div className="quick-replies">
          <p className="quick-replies-title">快速開始：</p>
          <div className="quick-replies-list">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply)}
                disabled={isLoading}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 輸入區域 */}
      <div className="chatbox-input">
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="輸入您的問題或症狀..."
            rows="1"
            disabled={isLoading}
            className="message-input"
          />
          
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="send-btn"
            title="發送消息"
          >
            {isLoading ? (
              <div className="loading-spinner">⏳</div>
            ) : (
              '📤'
            )}
          </button>
        </div>
        
        <div className="input-footer">
          <p className="disclaimer">
            ⚠️ AI 建議僅供參考，如有嚴重症狀請及時就醫
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;