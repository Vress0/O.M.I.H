import React, { useState } from 'react';
import { Search, BookOpen, ArrowLeft, Tag, FileText, FlaskConical, Sprout, CircleDot, Heart } from 'lucide-react';
import { Button } from './Button';
import { searchKnowledge, getKnowledgeArticle } from '../services/geminiService';
import { KnowledgeItem } from '../types';

export const KnowledgeBase: React.FC = () => {
  const [view, setView] = useState<'home' | 'list' | 'detail'>('home');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<{title: string, content: string} | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

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

    try {
      const results = await searchKnowledge(query || categories.find(c => c.id === category)?.prompt || '中醫熱門話題', category);
      setItems(results);
    } catch (error) {
      console.error(error);
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
    <div className="space-y-12 animate-fadeIn">
      <div className="text-center space-y-6 py-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-tcm-900">中醫智慧知識庫</h2>
        <p className="text-stone-500 max-w-2xl mx-auto">
          探索千年傳承的醫學智慧，從本草經絡到現代養生，您的隨身中醫百科全書。
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <input 
            type="text" 
            className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-stone-200 shadow-sm focus:ring-2 focus:ring-tcm-500 focus:outline-none text-lg text-stone-800 placeholder-stone-400"
            placeholder="搜尋藥材、穴位、病症..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={24} />
          <Button 
            className="absolute right-2 top-2 rounded-full px-6" 
            onClick={() => handleSearch(searchQuery)}
            disabled={!searchQuery.trim()}
          >
            搜尋
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => handleSearch('', cat.id)}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-tcm-300 transition-all cursor-pointer flex items-center gap-6 group"
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
          {items.length === 0 && (
            <div className="col-span-2 text-center py-12 text-stone-400">
              沒有找到相關內容，請嘗試其他關鍵字。
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderDetail = () => (
    <div className="animate-fadeIn">
      <div className="sticky top-[72px] z-10 bg-stone-50/95 backdrop-blur py-4 border-b border-stone-200 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-stone-600" />
          </button>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-tcm-900 line-clamp-1">
            {selectedArticle?.title}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 max-w-4xl mx-auto">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-stone-100 rounded w-1/3"></div>
            <div className="h-4 bg-stone-100 rounded w-full"></div>
            <div className="h-4 bg-stone-100 rounded w-full"></div>
            <div className="h-4 bg-stone-100 rounded w-2/3"></div>
            <div className="h-64 bg-stone-100 rounded w-full"></div>
          </div>
        ) : (
          <article className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:text-tcm-900 prose-a:text-tcm-600">
            <div className="whitespace-pre-wrap leading-relaxed">
              {selectedArticle?.content}
            </div>
          </article>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto mt-8 text-center text-sm text-stone-400">
        <p>內容由 AI 生成，僅供參考，詳情請諮詢專業中醫師。</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      {view === 'home' && renderHome()}
      {view === 'list' && renderList()}
      {view === 'detail' && renderDetail()}
    </div>
  );
};