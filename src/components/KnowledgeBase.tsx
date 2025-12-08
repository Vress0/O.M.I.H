import React, { useState } from 'react';
import { Search, BookOpen, ArrowLeft, Tag, FileText, FlaskConical, Sprout, CircleDot, Heart } from 'lucide-react';
import { Button } from './Button';
import { searchKnowledge, getKnowledgeArticle } from '../services/geminiService';
import { KnowledgeItem } from '../types';
import { DecoratedWrapper } from './DecoratedWrapper';

export const KnowledgeBase: React.FC = () => {
  const [view, setView] = useState<'home' | 'list' | 'detail'>('home');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<{title: string, content: string} | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const categories = [
    { id: 'herbs', name: '中藥本草', icon: <Sprout size={32} />, color: 'bg-green-100 text-green-700', prompt: '常見中藥材' },
    { id: 'formulas', name: '經典方劑', icon: <FlaskConical size={32} />, color: 'bg-amber-100 text-amber-700', prompt: '著名中醫方劑' },
    { id: 'acupoints', name: '經絡穴位', icon: <CircleDot size={32} />, color: 'bg-blue-100 text-blue-700', prompt: '人體重要穴位' },
    { id: 'wellness', name: '養生食療', icon: <Heart size={32} />, color: 'bg-rose-100 text-rose-700', prompt: '中醫養生與食療' },
  ];

  const handleSearch = async (query: string, category: string = '') => {
    if (!query && !category) return;
    
    setLoading(true);
    setSearchQuery(query);
    setActiveCategory(category);
    setView('list');
    setErrorMessage('');

    try {
      const results = await searchKnowledge(query || categories.find(c => c.id === category)?.prompt || '中醫熱門話題', category);
      console.log('搜尋結果:', results);
      setItems(results);
    } catch (error: any) {
      console.error('搜尋錯誤:', error);
      setItems([]);
      
      // 檢查是否為配額錯誤
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        setErrorMessage('API 使用額度已達上限，請稍後再試。建議等待 1-2 分鐘後重新搜尋。');
      } else {
        setErrorMessage('搜尋時發生錯誤，請稍後再試或檢查網路連線。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = async (item: KnowledgeItem) => {
    setLoading(true);
    try {
      const content = await getKnowledgeArticle(item.title);
      setSelectedArticle({ title: item.title, content });
      setView('detail');
    } catch (error) {
      alert("無法載入文章");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (view === 'detail') {
      setView('list');
      setSelectedArticle(null);
    } else {
      setView('home');
      setSearchQuery('');
      setItems([]);
      setActiveCategory('');
    }
  };

  // --- Views ---

  const renderHome = () => (
    <div className="space-y-6 animate-fadeIn">
      <DecoratedWrapper className="text-center space-y-12 py-4" imgOpacity={0.06} imgObjectFit="contain">
        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-light bg-gradient-to-r from-pink-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">中醫智慧知識庫</h2>
          <div className="flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 rounded-full"></div>
          </div>
        </div>
        <br></br>
        
        <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed font-light text-lg">
          探索千年傳承的醫學智慧，從本草經絡到現代養生，您的隨身中醫百科全書。
        </p>
        <br></br>
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            className="w-full pl-12 pr-4 py-4 rounded-full bg-white/70 backdrop-blur-sm border border-pink-200/50 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none text-lg text-slate-800 placeholder-slate-400"
            placeholder="搜尋藥材、穴位、病症..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" size={24} />
          <Button 
            className="absolute right-2 top-2 rounded-full px-6" 
            onClick={() => handleSearch(searchQuery)}
            disabled={!searchQuery.trim()}
          >
            搜尋
          </Button>
        </div>
      </DecoratedWrapper>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => handleSearch('', cat.id)}
            className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-pink-200/50 hover:shadow-lg hover:scale-105 hover:bg-white/60 transition-all cursor-pointer flex items-center gap-6 group"
          >
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${cat.color}`}>
              {cat.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-1 group-hover:text-tcm-700 transition-colors">{cat.name}</h3>
              <p className="text-stone-500 text-sm">點擊瀏覽{cat.prompt}相關知識</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderList = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-stone-600" />
        </button>
        <h2 className="text-2xl font-serif font-bold text-stone-800">
          {activeCategory ? categories.find(c => c.id === activeCategory)?.name : `搜尋：${searchQuery}`}
        </h2>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-stone-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => handleArticleClick(item)}
              className="bg-white p-6 rounded-xl border border-stone-200 hover:border-tcm-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-tcm-50 text-tcm-700 rounded-md">
                  {item.category}
                </span>
                <BookOpen size={16} className="text-stone-300 group-hover:text-tcm-500" />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-tcm-800">{item.title}</h3>
              <p className="text-stone-600 text-sm line-clamp-2 mb-3">{item.summary}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="flex items-center gap-1 text-xs text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {items.length === 0 && !errorMessage && (
            <div className="col-span-2 text-center py-12 text-stone-400">
              沒有找到相關內容，請嘗試其他關鍵字。
            </div>
          )}
          {errorMessage && (
            <div className="col-span-2 text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium mb-2">⚠️ 搜尋失敗</p>
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDetail = () => (
    <div className="animate-fadeIn max-w-5xl mx-auto">
      {/* 返回按鈕 */}
      <button 
        onClick={goBack} 
        className="mb-6 flex items-center gap-2 px-4 py-2 hover:bg-white/60 rounded-lg transition-colors group"
      >
        <ArrowLeft size={20} className="text-stone-600 group-hover:text-tcm-600" />
        <span className="text-stone-600 group-hover:text-tcm-600 font-medium">返回列表</span>
      </button>

      {/* 書本容器 */}
      <div className="relative">
        {/* 書本陰影效果 */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-orange-100/40 rounded-2xl transform translate-x-2 translate-y-2 -z-10"></div>
        
        {/* 書本主體 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl border-4 border-amber-200/50 overflow-hidden">
          {/* 書本裝飾線條 */}
          <div className="h-2 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300"></div>
          
          {/* 書頁效果 */}
          <div className="relative bg-white">
            {/* 左側書脊效果 */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-amber-100/30 to-transparent pointer-events-none"></div>
            
            {/* 內容區域 */}
            <div className="p-8 md:p-12 lg:p-16">
              {/* 書本標題 */}
              <div className="text-center mb-12 border-b-2 border-amber-200 pb-8">
                <div className="inline-block mb-4">
                  <BookOpen size={48} className="text-amber-600 mx-auto mb-3" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-700 to-amber-700 mb-4">
                  {selectedArticle?.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <div className="h-px w-12 bg-amber-300"></div>
                  <span className="text-sm font-serif">中醫古籍</span>
                  <div className="h-px w-12 bg-amber-300"></div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 bg-amber-50 rounded w-1/3"></div>
                  <div className="h-4 bg-amber-50 rounded w-full"></div>
                  <div className="h-4 bg-amber-50 rounded w-full"></div>
                  <div className="h-4 bg-amber-50 rounded w-2/3"></div>
                  <div className="h-64 bg-amber-50 rounded w-full"></div>
                </div>
              ) : (
                <article className="space-y-4 text-stone-700 leading-relaxed">
                  {selectedArticle?.content.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={idx} className="h-4"></div>;
                    
                    // 移除所有 ** 星號
                    const cleaned = trimmed.replace(/\*\*/g, '');
                    
                    // 一級標題 (# 開頭)
                    if (cleaned.startsWith('# ')) {
                      return (
                        <h1 key={idx} className="text-3xl font-serif font-bold text-amber-900 mt-8 first:mt-0 mb-4">
                          {cleaned.replace(/^#\s+/, '')}
                        </h1>
                      );
                    }
                    
                    // 二級標題 (## 開頭)
                    if (cleaned.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-2xl font-serif font-bold text-amber-800 mt-6 mb-3">
                          {cleaned.replace(/^##\s+/, '')}
                        </h2>
                      );
                    }
                    
                    // 三級標題 (### 開頭)
                    if (cleaned.startsWith('### ')) {
                      return (
                        <h3 key={idx} className="text-xl font-serif font-semibold text-amber-700 mt-4 mb-2">
                          {cleaned.replace(/^###\s+/, '')}
                        </h3>
                      );
                    }
                    
                    // 數字編號列表 (1. 2. 3. 開頭)
                    const numberedMatch = cleaned.match(/^(\d+)\.\s+(.+)$/);
                    if (numberedMatch) {
                      return (
                        <div key={idx} className="flex items-start gap-3 mb-2 pl-4">
                          <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                            {numberedMatch[1]}
                          </span>
                          <span className="flex-1">{numberedMatch[2]}</span>
                        </div>
                      );
                    }
                    
                    // 項目符號列表 (• * - 開頭)
                    if (cleaned.match(/^[•\*\-]\s+/)) {
                      const content = cleaned.replace(/^[•\*\-]\s+/, '');
                      
                      // 檢查是否包含冒號 (重點項目)
                      const colonMatch = content.match(/^([^：:]+)[：:]\s*(.+)$/);
                      if (colonMatch) {
                        return (
                          <div key={idx} className="flex items-start gap-3 mb-3 pl-4">
                            <span className="text-amber-500 mt-1.5 flex-shrink-0">•</span>
                            <div className="flex-1">
                              <span className="font-bold text-amber-800">{colonMatch[1]}：</span>
                              <span className="text-stone-700">{colonMatch[2]}</span>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={idx} className="flex items-start gap-3 mb-2 pl-4">
                          <span className="text-amber-500 mt-1.5 flex-shrink-0">•</span>
                          <span className="flex-1">{content}</span>
                        </div>
                      );
                    }
                    
                    // 檢查是否為「標籤：內容」格式 (不在列表中)
                    const colonMatch = cleaned.match(/^([^：:]+)[：:]\s*(.+)$/);
                    if (colonMatch && !cleaned.startsWith(' ')) {
                      return (
                        <p key={idx} className="mb-3">
                          <span className="font-bold text-amber-800">{colonMatch[1]}：</span>
                          <span className="text-stone-700">{colonMatch[2]}</span>
                        </p>
                      );
                    }
                    
                    // 一般段落
                    return (
                      <p key={idx} className="mb-4 indent-0">
                        {cleaned}
                      </p>
                    );
                  })}
                </article>
              )}
              
              {/* 書本底部裝飾 */}
              <div className="mt-16 pt-8 border-t-2 border-amber-200 text-center">
                <p className="text-amber-600 text-sm font-serif italic">— 東方醫智館藏 —</p>
              </div>
            </div>
          </div>
          
          {/* 書本裝飾線條 */}
          <div className="h-2 bg-gradient-to-r from-amber-300 via-orange-300 to-amber-300"></div>
        </div>
      </div>
      
      {/* 免責聲明 */}
      <div className="max-w-5xl mx-auto mt-8 text-center">
        <p className="text-sm text-amber-600/70 italic">內容由 AI 生成，僅供參考，詳情請諮詢專業中醫師。</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      {loading && <LoadingOverlay />}
      {view === 'home' && renderHome()}
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
    </div>
  );
};

// 艾莉西亞風格 Loading Overlay 元件
const LoadingOverlay: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-100 p-12 text-center space-y-6 max-w-sm mx-4">
      {/* 旋轉圈圈 */}
      <div className="flex justify-center">
        <div className="relative">
          {/* 外層漸層光環 */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300/40 via-purple-300/40 to-pink-300/40 rounded-full blur-lg animate-pulse"></div>
          
          {/* 旋轉圈圈 */}
          <div className="relative h-16 w-16 rounded-full border-4 border-pink-200 border-t-pink-500 border-r-purple-500 animate-spin"></div>
        </div>
      </div>

      {/* 提示文字 */}
      <h3 className="text-xl font-serif font-light text-pink-700">
        正在為你翻找中醫典籍，請稍候…
      </h3>

      {/* 跳動光點 */}
      <div className="flex justify-center items-center gap-3 h-6">
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>

      {/* 底部提示 */}
      <p className="text-xs text-slate-500 font-light">資料加載中，請勿關閉頁面...</p>
    </div>
  </div>
);