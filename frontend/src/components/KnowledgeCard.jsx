import React, { useState } from 'react';
import apiService from '../services/api';
import './KnowledgeCard.css';

const KnowledgeCard = ({ 
  article, 
  onRead, 
  showActions = true, 
  isExpanded = false,
  showCategories = true 
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [isBookmarked, setIsBookmarked] = useState(article.is_bookmarked || false);
  const [isLoading, setIsLoading] = useState(false);
  const [readingTime, setReadingTime] = useState(null);

  // 計算閱讀時間（基於字數，平均每分鐘200字）
  const calculateReadingTime = (content) => {
    if (!content) return '未知';
    const wordCount = content.length;
    const minutes = Math.ceil(wordCount / 200);
    return minutes < 1 ? '1 分鐘' : `${minutes} 分鐘`;
  };

  // 獲取文章摘要
  const getArticleExcerpt = (content, maxLength = 150) => {
    if (!content) return '暫無內容預覽';
    const cleanContent = content.replace(/<[^>]*>/g, ''); // 移除 HTML 標籤
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent;
  };

  // 獲取難度等級顯示
  const getDifficultyInfo = (level) => {
    const levels = {
      'beginner': { text: '入門', color: '#10b981', icon: '🌱' },
      'intermediate': { text: '進階', color: '#f59e0b', icon: '🌿' },
      'advanced': { text: '專業', color: '#ef4444', icon: '🌳' }
    };
    return levels[level] || levels['beginner'];
  };

  // 切換收藏狀態
  const toggleBookmark = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      const response = await apiService.toggleArticleBookmark(article.id);
      if (response.success) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error('切換收藏狀態失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 記錄閱讀
  const handleRead = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    
    try {
      // 記錄閱讀歷史
      await apiService.recordArticleRead(article.id);
      
      if (onRead) {
        onRead(article);
      } else {
        // 預設行為：展開文章或跳轉到詳情頁
        setExpanded(!expanded);
      }
    } catch (error) {
      console.error('記錄閱讀失敗:', error);
      // 即使記錄失敗也允許閱讀
      if (onRead) {
        onRead(article);
      } else {
        setExpanded(!expanded);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 分享文章
  const shareArticle = async (e) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: getArticleExcerpt(article.content, 100),
          url: window.location.origin + `/knowledge/${article.id}`
        });
      } catch (error) {
        // 用戶取消分享
        console.log('分享取消');
      }
    } else {
      // 備用方案：複製連結
      const url = window.location.origin + `/knowledge/${article.id}`;
      try {
        await navigator.clipboard.writeText(url);
        alert('文章連結已複製到剪貼簿');
      } catch (error) {
        console.error('複製連結失敗:', error);
        alert('分享功能暫不可用');
      }
    }
  };

  // 獲取相關文章
  const getRelatedArticles = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getRelatedArticles(article.id);
      return response.data || [];
    } catch (error) {
      console.error('獲取相關文章失敗:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyInfo = getDifficultyInfo(article.difficulty || 'beginner');
  const excerpt = getArticleExcerpt(article.content || article.summary);
  const estimatedReadTime = readingTime || calculateReadingTime(article.content);

  return (
    <article className={`knowledge-card ${expanded ? 'expanded' : ''}`}>
      {/* 文章標題區域 */}
      <header className="card-header" onClick={handleRead}>
        <div className="header-content">
          <div className="title-row">
            <h3 className="article-title">{article.title || '未命名文章'}</h3>
            
            {showActions && (
              <button
                onClick={toggleBookmark}
                disabled={isLoading}
                className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                title={isBookmarked ? '取消收藏' : '加入收藏'}
              >
                {isBookmarked ? '⭐' : '☆'}
              </button>
            )}
          </div>

          <div className="article-meta">
            <div className="meta-left">
              {article.author && (
                <span className="author">
                  <span className="author-icon">👨‍⚕️</span>
                  {article.author}
                </span>
              )}
              
              <span className="publish-date">
                <span className="date-icon">📅</span>
                {article.published_date || article.created_at || '最近'}
              </span>
              
              <span className="reading-time">
                <span className="time-icon">⏱️</span>
                閱讀時間 {estimatedReadTime}
              </span>
            </div>

            <div className="meta-right">
              <div 
                className="difficulty-badge"
                style={{ color: difficultyInfo.color }}
              >
                <span className="difficulty-icon">{difficultyInfo.icon}</span>
                <span className="difficulty-text">{difficultyInfo.text}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="expand-icon">
          {expanded ? '🔽' : '▶️'}
        </div>
      </header>

      {/* 文章分類標籤 */}
      {showCategories && (article.categories || article.tags) && (
        <div className="article-categories">
          {(article.categories || article.tags || []).slice(0, 3).map((category, index) => (
            <span key={index} className="category-tag">
              {category}
            </span>
          ))}
          {(article.categories || article.tags || []).length > 3 && (
            <span className="more-categories">
              +{(article.categories || article.tags).length - 3}
            </span>
          )}
        </div>
      )}

      {/* 文章摘要/預覽 */}
      <div className="article-preview">
        <p className="article-excerpt">{excerpt}</p>
        
        {article.key_points && article.key_points.length > 0 && (
          <div className="key-points">
            <h4 className="key-points-title">重點摘要：</h4>
            <ul className="key-points-list">
              {article.key_points.slice(0, expanded ? article.key_points.length : 3).map((point, index) => (
                <li key={index} className="key-point-item">
                  <span className="point-marker">▪</span>
                  <span className="point-text">{point}</span>
                </li>
              ))}
              {!expanded && article.key_points.length > 3 && (
                <li className="more-points">
                  還有 {article.key_points.length - 3} 個重點...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* 展開內容 */}
      {expanded && (
        <div className="expanded-content">
          {/* 完整內容 */}
          {article.content && (
            <div className="article-content">
              <h4>完整內容</h4>
              <div 
                className="content-text"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          )}

          {/* 相關症狀 */}
          {article.related_symptoms && article.related_symptoms.length > 0 && (
            <div className="related-symptoms">
              <h4>相關症狀</h4>
              <div className="symptoms-list">
                {article.related_symptoms.map((symptom, index) => (
                  <span key={index} className="symptom-tag">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 推薦方劑 */}
          {article.recommended_formulas && article.recommended_formulas.length > 0 && (
            <div className="recommended-formulas">
              <h4>推薦方劑</h4>
              <div className="formulas-list">
                {article.recommended_formulas.map((formula, index) => (
                  <div key={index} className="formula-item">
                    <span className="formula-name">{formula.name || formula}</span>
                    {formula.description && (
                      <span className="formula-description">{formula.description}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 注意事項 */}
          {article.warnings && article.warnings.length > 0 && (
            <div className="article-warnings">
              <h4>注意事項</h4>
              <ul className="warnings-list">
                {article.warnings.map((warning, index) => (
                  <li key={index} className="warning-item">
                    <span className="warning-icon">⚠️</span>
                    <span className="warning-text">{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 文章統計 */}
      <div className="article-stats">
        <div className="stat-item">
          <span className="stat-icon">👁️</span>
          <span className="stat-text">閱讀 {article.view_count || 0}</span>
        </div>
        
        <div className="stat-item">
          <span className="stat-icon">⭐</span>
          <span className="stat-text">收藏 {article.bookmark_count || 0}</span>
        </div>
        
        {article.rating && (
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-text">評分 {article.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* 操作按鈕 */}
      {showActions && (
        <div className="card-actions">
          <button
            onClick={handleRead}
            disabled={isLoading}
            className="read-btn"
          >
            {isLoading ? (
              <>
                <span className="loading-spinner">⏳</span>
                載入中...
              </>
            ) : expanded ? (
              <>
                <span className="action-icon">📖</span>
                收起文章
              </>
            ) : (
              <>
                <span className="action-icon">📖</span>
                閱讀全文
              </>
            )}
          </button>

          <button
            onClick={shareArticle}
            className="share-btn"
            title="分享文章"
          >
            <span className="action-icon">📤</span>
            分享
          </button>

          {article.external_link && (
            <a
              href={article.external_link}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link-btn"
              title="查看原文"
            >
              <span className="action-icon">🔗</span>
              原文
            </a>
          )}
        </div>
      )}

      {/* 載入覆層 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">⏳</div>
        </div>
      )}
    </article>
  );
};

export default KnowledgeCard;