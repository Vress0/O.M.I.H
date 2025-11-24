import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import KnowledgeCard from '../components/KnowledgeCard';
import apiService from '../services/api';
import './knowledge.css';

const KnowledgePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // 熱門話題標籤
  const popularTopics = [
    '五臟六腑', '經絡穴位', '中藥材', '食療養生', '季節養生',
    '體質調理', '針灸推拿', '氣功太極', '中醫診斷', '婦科調理'
  ];

  useEffect(() => {
    loadKnowledge();
    loadCategories();
    loadBookmarks();

    // 從 URL 參數獲取搜索關鍵詞
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [articles, selectedCategory, searchQuery, sortBy, showBookmarksOnly]);

  const loadKnowledge = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiService.getKnowledgeArticles({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined
      });
      
      if (response.success) {
        setArticles(response.data || getDefaultArticles());
      } else {
        setArticles(getDefaultArticles());
      }
    } catch (error) {
      console.error('載入知識庫失敗:', error);
      setArticles(getDefaultArticles());
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.getKnowledgeCategories();
      if (response.success) {
        setCategories(response.data || getDefaultCategories());
      } else {
        setCategories(getDefaultCategories());
      }
    } catch (error) {
      console.error('載入分類失敗:', error);
      setCategories(getDefaultCategories());
    }
  };

  const loadBookmarks = () => {
    const savedBookmarks = localStorage.getItem('knowledgeBookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  };

  const getDefaultArticles = () => [
    {
      id: 1,
      title: '中醫五臟六腑理論詳解',
      summary: '深入了解中醫學中五臟六腑的功能與相互關係，掌握中醫診斷的基礎理論。',
      category: '中醫基礎',
      author: '李中醫師',
      date: '2024-01-15',
      readTime: 8,
      views: 1543,
      likes: 89,
      image: '/images/knowledge/organs.jpg',
      tags: ['五臟六腑', '中醫基礎', '理論'],
      difficulty: '中級',
      content: `
# 中醫五臟六腑理論詳解

## 五臟的功能

### 心
心主血脈，主神志。心氣推動血液在脈管內運行，營養全身...

### 肝  
肝主疏泄，主藏血。肝氣條達，則氣機調暢，情志舒暢...

### 脾
脾主運化，主統血。脾胃為後天之本，氣血生化之源...

### 肺
肺主氣，主宣發肅降。肺朝百脈，助心行血...

### 腎
腎主藏精，主水液。腎為先天之本，生命之根...

## 六腑的功能

### 膽
膽主決斷，儲存膽汁...

### 胃  
胃主受納，腐熟水穀...

### 小腸
小腸主化物，分清濁...

### 大腸
大腸主傳導，排泄糟粕...

### 膀胱
膀胱主貯尿，氣化則出...

### 三焦
三焦主通調水道，氣化功能...
      `
    },
    {
      id: 2,
      title: '秋季養生要點與食療方法',
      summary: '秋季是收穫的季節，也是人體陽氣內收的時候，了解秋季養生的重點和食療方法。',
      category: '季節養生',
      author: '王養生專家',
      date: '2024-01-14',
      readTime: 6,
      views: 892,
      likes: 67,
      image: '/images/knowledge/autumn.jpg',
      tags: ['秋季養生', '食療', '潤燥'],
      difficulty: '初級',
      content: `
# 秋季養生要點與食療方法

## 秋季氣候特點

秋季天高氣爽，氣候乾燥，是人體陽氣內收、陰氣內藏的時節...

## 養生原則

### 養陰潤燥
秋季最重要的是養陰潤燥，預防秋燥傷人...

### 早睡早起
秋季應該早睡早起，與雞俱興...

## 食療方法

### 銀耳蓮子湯
功效：養陰潤肺，清心安神
材料：銀耳、蓮子、冰糖
做法：...

### 百合粥
功效：潤肺止咳，清心安神
材料：百合、粳米
做法：...
      `
    },
    {
      id: 3,
      title: '常用穴位按摩保健法',
      summary: '介紹日常生活中常用的保健穴位及按摩手法，簡單易學，效果顯著。',
      category: '穴位保健',
      author: '張針灸師',
      date: '2024-01-13',
      readTime: 10,
      views: 1234,
      likes: 78,
      image: '/images/knowledge/acupoints.jpg',
      tags: ['穴位', '按摩', '保健'],
      difficulty: '初級',
      content: `
# 常用穴位按摩保健法

## 頭面部穴位

### 百會穴
位置：頭頂正中央
功效：醒腦開竅，升陽舉陷
按摩方法：用中指輕柔按壓，順時針方向按摩...

### 印堂穴  
位置：兩眉中間
功效：清頭明目，通鼻開竅
按摩方法：...

## 四肢穴位

### 足三里
位置：小腿外側，外膝眼下3寸
功效：調理脾胃，補中益氣
按摩方法：...

### 合谷穴
位置：手背虎口處
功效：疏風解表，通經活絡  
按摩方法：...
      `
    },
    {
      id: 4,
      title: '中藥材的性味歸經與配伍',
      summary: '了解中藥材的基本屬性，掌握中藥配伍的基本原則，為安全用藥打下基礎。',
      category: '中藥學',
      author: '陈药师',
      date: '2024-01-12',
      readTime: 12,
      views: 756,
      likes: 45,
      image: '/images/knowledge/herbs.jpg',
      tags: ['中藥材', '性味', '配伍'],
      difficulty: '中級',
      content: `
# 中藥材的性味歸經與配伍

## 四氣五味

### 四氣
寒、熱、溫、涼四種性質，反映藥物對人體陰陽盛衰的影響...

### 五味  
酸、苦、甘、辛、鹹五種味道，代表不同的藥理作用...

## 歸經理論

歸經是指藥物對某些臟腑經絡有特殊的親和性...

## 配伍原則

### 七情配伍
單行、相須、相使、相畏、相殺、相惡、相反...

### 十八反十九畏
中藥配伍的禁忌...
      `
    },
    {
      id: 5,
      title: '九種體質的特點與調理方法',
      summary: '詳細介紹中醫九種體質的特徵表現和相應的調理方法，幫助您了解自己的體質。',
      category: '體質調理',
      author: '劉體質專家',
      date: '2024-01-11',
      readTime: 15,
      views: 2156,
      likes: 134,
      image: '/images/knowledge/constitution.jpg',
      tags: ['九種體質', '體質調理', '養生'],
      difficulty: '中級',
      content: `
# 九種體質的特點與調理方法

## 平和質（健康體質）

### 特點
精力充沛，睡眠良好，性格開朗，適應能力強...

### 調理方法
保持現有良好生活習慣，適量運動，飲食均衡...

## 氣虛質

### 特點  
容易疲勞，氣短懶言，容易感冒...

### 調理方法
補氣為主，適當運動，避免過勞...

## 陽虛質

### 特點
畏寒怕冷，手腳發涼，精神不振...

### 調理方法
溫陽散寒，多曬太陽，溫熱飲食...

## 陰虛質

### 特點
手心腳心發熱，口乾咽燥，失眠多夢...

### 調理方法
滋陰潤燥，避免熬夜，清潤飲食...

## 痰濕質

### 特點
體形肥胖，胸悶痰多，口黏膩...

### 調理方法
化痰祛濕，控制體重，清淡飲食...

## 濕熱質

### 特點
面部油膩，容易長痘，口苦口臭...

### 調理方法
清熱利濕，避免辛辣，保持乾爽...

## 血瘀質

### 特點
面色晦暗，容易瘀斑，月經不調...

### 調理方法
活血化瘀，適量運動，情志調暢...

## 氣鬱質

### 特點
情緒低落，多愁善感，胸脅脹痛...

### 調理方法
疏肝解鬱，情志調節，社交活動...

## 特稟質（過敏體質）

### 特點
容易過敏，皮膚敏感，適應能力差...

### 調理方法
預防過敏，增強體質，避免過敏原...
      `
    },
    {
      id: 6,
      title: '女性不同時期的中醫調理',
      summary: '從青春期到更年期，了解女性不同生理階段的中醫調理重點。',
      category: '婦科養生',
      author: '李婦科專家',
      date: '2024-01-10',
      readTime: 11,
      views: 1876,
      likes: 98,
      image: '/images/knowledge/women.jpg',
      tags: ['女性養生', '婦科', '調理'],
      difficulty: '中級'
    }
  ];

  const getDefaultCategories = () => [
    '中醫基礎', '季節養生', '穴位保健', '中藥學', '體質調理',
    '婦科養生', '兒科保健', '老年養生', '食療藥膳', '針灸推拿'
  ];

  const applyFilters = () => {
    let filtered = [...articles];

    // 書簽篩選
    if (showBookmarksOnly) {
      filtered = filtered.filter(article => bookmarks.includes(article.id));
    }

    // 分類篩選
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // 搜索篩選
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.author.toLowerCase().includes(query)
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.date) - new Date(a.date);
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'readTime':
          return (a.readTime || 0) - (b.readTime || 0);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const toggleBookmark = (articleId) => {
    const newBookmarks = bookmarks.includes(articleId)
      ? bookmarks.filter(id => id !== articleId)
      : [...bookmarks, articleId];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('knowledgeBookmarks', JSON.stringify(newBookmarks));
  };

  const handleTopicClick = (topic) => {
    setSearchQuery(topic);
    applyFilters();
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    
    // 增加閱讀量（模擬）
    setArticles(prev => 
      prev.map(a => 
        a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a
      )
    );
  };

  if (selectedArticle) {
    return (
      <div className="knowledge-page article-view">
        <div className="article-container">
          {/* 文章標題 */}
          <div className="article-header">
            <button 
              onClick={() => setSelectedArticle(null)}
              className="back-btn"
            >
              ← 返回知識庫
            </button>
            
            <div className="article-meta">
              <div className="article-category">{selectedArticle.category}</div>
              <div className="article-difficulty">{selectedArticle.difficulty}</div>
            </div>

            <h1 className="article-title">{selectedArticle.title}</h1>
            
            <div className="article-info">
              <div className="author-info">
                <span className="author-icon">👨‍⚕️</span>
                <span className="author-name">{selectedArticle.author}</span>
              </div>
              <div className="publish-info">
                <span className="date-icon">📅</span>
                <span className="publish-date">
                  {new Date(selectedArticle.date).toLocaleDateString('zh-TW')}
                </span>
              </div>
              <div className="read-info">
                <span className="time-icon">⏱️</span>
                <span className="read-time">{selectedArticle.readTime} 分鐘閱讀</span>
              </div>
            </div>

            <div className="article-stats">
              <div className="stat-item">
                <span className="stat-icon">👁️</span>
                <span className="stat-number">{selectedArticle.views}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">❤️</span>
                <span className="stat-number">{selectedArticle.likes}</span>
              </div>
              <button 
                onClick={() => toggleBookmark(selectedArticle.id)}
                className={`bookmark-btn ${bookmarks.includes(selectedArticle.id) ? 'bookmarked' : ''}`}
              >
                <span className="bookmark-icon">
                  {bookmarks.includes(selectedArticle.id) ? '🔖' : '📑'}
                </span>
                {bookmarks.includes(selectedArticle.id) ? '已收藏' : '收藏'}
              </button>
            </div>

            <div className="article-tags">
              {selectedArticle.tags.map((tag, index) => (
                <span key={index} className="article-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* 文章內容 */}
          <div className="article-content">
            {selectedArticle.content ? (
              <div className="content-text">
                {selectedArticle.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  if (paragraph.startsWith('#')) {
                    const level = paragraph.match(/^#+/)[0].length;
                    const text = paragraph.replace(/^#+\s*/, '');
                    const Tag = `h${Math.min(level, 6)}`;
                    return <Tag key={index} className={`content-heading h${level}`}>{text}</Tag>;
                  }
                  return <p key={index} className="content-paragraph">{paragraph}</p>;
                })}
              </div>
            ) : (
              <div className="content-placeholder">
                <p>詳細內容正在加載中...</p>
              </div>
            )}
          </div>

          {/* 相關推薦 */}
          <div className="related-articles">
            <h3 className="related-title">相關文章推薦</h3>
            <div className="related-list">
              {articles
                .filter(article => 
                  article.id !== selectedArticle.id && 
                  (article.category === selectedArticle.category ||
                   article.tags.some(tag => selectedArticle.tags.includes(tag)))
                )
                .slice(0, 3)
                .map(article => (
                  <div 
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className="related-item"
                  >
                    <div className="related-info">
                      <h4 className="related-item-title">{article.title}</h4>
                      <p className="related-item-summary">{article.summary}</p>
                      <div className="related-item-meta">
                        <span className="related-category">{article.category}</span>
                        <span className="related-time">{article.readTime}分鐘</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 底部操作 */}
          <div className="article-actions">
            <button 
              onClick={() => navigate('/doctors')}
              className="action-btn find-doctor"
            >
              🏥 尋找相關醫師
            </button>
            <button 
              onClick={() => navigate('/assistant')}
              className="action-btn ask-ai"
            >
              🤖 詢問 AI 助理
            </button>
            <button 
              onClick={() => navigate('/symptoms')}
              className="action-btn check-symptoms"
            >
              🩺 症狀自檢
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="knowledge-page">
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">📚</span>
            中醫知識庫
          </h1>
          <p className="page-description">
            探索傳統中醫智慧，學習養生保健知識
          </p>

          {/* 搜索欄 */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索文章、作者、標籤..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍 搜索
              </button>
            </div>
          </form>

          {/* 熱門話題 */}
          <div className="popular-topics">
            <h3 className="topics-title">🔥 熱門話題</h3>
            <div className="topics-list">
              {popularTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTopicClick(topic)}
                  className="topic-tag"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="knowledge-content">
        {/* 側邊欄篩選 */}
        <div className="sidebar">
          <div className="filter-section">
            <h3 className="filter-title">📂 文章分類</h3>
            <div className="category-list">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              >
                📑 全部文章 ({articles.length})
              </button>
              {categories.map((category, index) => {
                const count = articles.filter(article => article.category === category).length;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">⭐ 我的收藏</h3>
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`bookmark-filter-btn ${showBookmarksOnly ? 'active' : ''}`}
            >
              🔖 只看收藏 ({bookmarks.length})
            </button>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">📊 排序方式</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="latest">最新發布</option>
              <option value="popular">最多瀏覽</option>
              <option value="likes">最多點讚</option>
              <option value="readTime">閱讀時間</option>
            </select>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">👀 顯示方式</h3>
            <div className="view-mode-buttons">
              <button
                onClick={() => setViewMode('grid')}
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              >
                ⊞ 網格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              >
                ☰ 列表
              </button>
            </div>
          </div>
        </div>

        {/* 主要內容區 */}
        <div className="main-content">
          {isLoading ? (
            <div className="loading-section">
              <div className="loading-spinner">📚</div>
              <p className="loading-text">正在載入知識庫...</p>
            </div>
          ) : (
            <>
              {/* 結果統計 */}
              <div className="results-header">
                <div className="results-info">
                  <h2 className="results-count">
                    找到 {filteredArticles.length} 篇文章
                  </h2>
                  {searchQuery && (
                    <p className="search-info">
                      搜索 "{searchQuery}" 的結果
                    </p>
                  )}
                </div>
                
                <div className="view-controls">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setShowBookmarksOnly(false);
                    }}
                    className="clear-filters-btn"
                  >
                    🔄 清除篩選
                  </button>
                </div>
              </div>

              {/* 文章列表 */}
              {filteredArticles.length > 0 ? (
                <div className={`articles-container ${viewMode}`}>
                  {filteredArticles.map(article => (
                    <KnowledgeCard
                      key={article.id}
                      article={article}
                      viewMode={viewMode}
                      isBookmarked={bookmarks.includes(article.id)}
                      onBookmark={() => toggleBookmark(article.id)}
                      onClick={() => handleArticleClick(article)}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">📭</div>
                    <h3 className="no-results-title">沒有找到相關文章</h3>
                    <p className="no-results-description">
                      請嘗試調整搜索條件或瀏覽其他分類
                    </p>
                    <div className="no-results-actions">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                          setShowBookmarksOnly(false);
                        }}
                        className="reset-btn"
                      >
                        🔄 重置篩選
                      </button>
                      <button
                        onClick={() => navigate('/assistant')}
                        className="ask-ai-btn"
                      >
                        🤖 詢問 AI
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 浮動操作按鈕 */}
      <div className="floating-actions">
        <button 
          onClick={() => navigate('/assistant')}
          className="fab primary"
          title="AI 知識問答"
        >
          🤖
        </button>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fab secondary"
          title="回到頂部"
        >
          ⬆️
        </button>
      </div>
    </div>
  );
};

export default KnowledgePage;