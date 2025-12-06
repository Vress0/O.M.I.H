import React, { useState } from 'react';
import { AppMode } from './types';
import { Analyzer } from './components/Analyzer';
import { Editor } from './components/Editor';
import { ChatBot } from './components/ChatBot';
import { Constitution } from './components/Constitution';
import { FindDoctor } from './components/FindDoctor';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Leaf, Activity, Camera, Palette, MessageCircle, ClipboardCheck, BookOpen, User, MapPin } from 'lucide-react';

// 開場動畫元件 - Alicia Style 淡出過場
const IntroOverlay: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [isEnding, setIsEnding] = useState(false);

  const handleFinish = () => {
    setIsEnding(true);
    // 等待動畫完成後再關閉
    setTimeout(onFinish, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer transition-opacity duration-500 ${
        isEnding ? 'opacity-0' : 'opacity-100'
      }`}
      onDoubleClick={handleFinish}
    >
      <video
        src="/opening.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={handleFinish}
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs md:text-sm px-4 py-2 rounded-full font-serif font-light">
        雙擊畫面即可跳過開場動畫
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Home);
  const [showIntro, setShowIntro] = useState(true);
  const renderContent = () => {
    switch (mode) {
      case AppMode.Chat:
        return <ChatBot />;
      case AppMode.Constitution:
        return <Constitution />;
      case AppMode.Analyze:
        return <Analyzer />;
      case AppMode.Edit:
        return <Editor />;
      case AppMode.FindDoctor:
        return <FindDoctor />;
      case AppMode.KnowledgeBase:
        return <KnowledgeBase />;
      case AppMode.Home:
      default:
        return (
          <div className="animate-fadeIn space-y-12">
            {/* Hero Section - Alicia Style */}
            <div className="text-center py-16 px-4 relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl border border-pink-200/50 shadow-xl shadow-pink-200/20">
              {/* Soft glow background */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-100/40 via-purple-100/20 to-blue-100/20 pointer-events-none"></div>
              
              {/* Decorative blur ball */}
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h1 className="text-5xl md:text-6xl font-serif font-light bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 relative z-10">
                O.M.I.H 東方醫智館
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed font-light">
                Oriental MedIntelli Hub - 融合千年傳統智慧與現代 AI 科技，為您打造個人化的全方位健康管理方案。
              </p>
              <button 
                onClick={() => setMode(AppMode.Chat)}
                className="bg-gradient-to-r from-pink-300 to-purple-300 text-white px-10 py-4 rounded-full font-medium hover:scale-105 hover:shadow-lg hover:shadow-pink-300/50 transition-all duration-300 relative z-10 font-serif font-light"
              >
                開始健康諮詢
              </button>
            </div>

            {/* Feature Grid - Glass Morphism */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => setMode(AppMode.Chat)}
                className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-pink-200/50 hover:scale-105 hover:shadow-lg hover:shadow-pink-200/50 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-lg font-serif font-medium text-pink-700 mb-2">AI 健康小助理</h3>
                <p className="text-slate-600 text-sm leading-relaxed">24/7 智能問答，即時分析症狀並提供養生建議。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.KnowledgeBase)}
                className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-purple-200/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-200/50 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-serif font-medium text-purple-700 mb-2">中醫知識庫</h3>
                <p className="text-slate-600 text-sm leading-relaxed">包含中藥、方劑、穴位與養生的結構化百科全書。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.Constitution)}
                className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-pink-200/50 hover:scale-105 hover:shadow-lg hover:shadow-pink-200/50 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardCheck size={24} />
                </div>
                <h3 className="text-lg font-serif font-medium text-pink-700 mb-2">體質檢測</h3>
                <p className="text-slate-600 text-sm leading-relaxed">分析九大體質，提供專屬的飲食與調理方案。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.FindDoctor)}
                className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-red-200/50 hover:scale-105 hover:shadow-lg hover:shadow-red-200/50 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-serif font-medium text-pink-700 mb-2">尋找醫師</h3>
                <p className="text-slate-600 text-sm leading-relaxed">根據地區與專科，尋找最適合您的中醫專家。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.Analyze)}
                className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-green-200/50 hover:scale-105 hover:shadow-lg hover:shadow-green-200/50 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <h3 className="text-lg font-serif font-medium text-pink-700 mb-2">智能望診</h3>
                <p className="text-slate-600 text-sm leading-relaxed">上傳藥材或舌象照片，獲得專業的 AI 視覺分析。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.Edit)}
                className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl border border-purple-200/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-200/50 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette size={24} />
                </div>
                <h3 className="text-lg font-serif font-medium text-purple-700 mb-2">影像工作室</h3>
                <p className="text-slate-600 text-sm leading-relaxed">視覺化治療方案與古風醫學圖像創作。</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-rose-50 via-purple-50 to-indigo-50 font-sans text-stone-800 flex flex-col overflow-hidden">
      {/* 光暈背景裝飾層 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* 左上角玫瑰粉光暈 */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-300/30 rounded-full blur-3xl opacity-70"></div>
        
        {/* 右下角淡紫藍光暈 */}
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-300/25 rounded-full blur-3xl opacity-60"></div>
        
        {/* 中間偏右上的淡紫光暈 */}
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-fuchsia-200/25 rounded-full blur-3xl opacity-50"></div>
        
        {/* 中間下方的淡藍光暈 */}
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* 主要內容容器 */}
      <div className="relative z-0 flex flex-col flex-1">
        {/* Intro Overlay */}
        {showIntro && (
          <IntroOverlay onFinish={() => setShowIntro(false)} />
        )}
      {/* Header - Alicia Style */}
      <header className="bg-white/40 backdrop-blur-md border-b border-pink-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setMode(AppMode.Home)}
          >
            <div className="bg-gradient-to-br from-pink-400 to-purple-400 p-2 rounded-lg text-white group-hover:shadow-lg group-hover:shadow-pink-300/50 transition-all">
              <Leaf size={24} />
            </div>
            <h1 className="text-xl font-serif font-light bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent tracking-wide">
              O.M.I.H <span className="text-pink-600 font-sans font-normal text-sm ml-1 hidden sm:inline">東方醫智館</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-white/40 backdrop-blur-md p-1 rounded-lg overflow-x-auto border border-pink-200/30">
            <NavButton active={mode === AppMode.Home} onClick={() => setMode(AppMode.Home)} icon={<Leaf size={16} />} label="首頁" />
            <NavButton active={mode === AppMode.KnowledgeBase} onClick={() => setMode(AppMode.KnowledgeBase)} icon={<BookOpen size={16} />} label="知識庫" />
            <NavButton active={mode === AppMode.Chat} onClick={() => setMode(AppMode.Chat)} icon={<MessageCircle size={16} />} label="諮詢" />
            <NavButton active={mode === AppMode.Constitution} onClick={() => setMode(AppMode.Constitution)} icon={<ClipboardCheck size={16} />} label="體質" />
            <NavButton active={mode === AppMode.FindDoctor} onClick={() => setMode(AppMode.FindDoctor)} icon={<MapPin size={16} />} label="醫師" />
            <NavButton active={mode === AppMode.Analyze} onClick={() => setMode(AppMode.Analyze)} icon={<Activity size={16} />} label="望診" />
            <NavButton active={mode === AppMode.Edit} onClick={() => setMode(AppMode.Edit)} icon={<Palette size={16} />} label="創作" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      {/* Footer - Alicia Style */}
      <footer className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-slate-100 py-12 mt-auto overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Leaf size={24} className="text-pink-300" />
            <span className="font-serif font-light text-2xl bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">O.M.I.H</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm text-slate-300 border-b border-purple-700/50 pb-8">
            <div>
              <h4 className="font-serif font-medium text-pink-200 mb-3">服務項目</h4>
              <p className="leading-relaxed">AI 症狀檢查</p>
              <p className="leading-relaxed">體質檢測</p>
              <p className="leading-relaxed">中醫知識庫</p>
            </div>
            <div>
              <h4 className="font-serif font-medium text-pink-200 mb-3">關於我們</h4>
              <p className="leading-relaxed">O.M.I.H 致力於將傳統醫學現代化，讓每個人都能享受智慧化的中醫健康管理。</p>
            </div>
            <div>
              <h4 className="font-serif font-medium text-pink-200 mb-3">聯絡資訊</h4>
              <p className="leading-relaxed">Email: contact@omih.hub</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            免責聲明：本平台提供的所有資訊僅供參考，不構成專業醫療建議、診斷或治療。如感身體不適，請務必諮詢合格醫師。
          </p>
          <p className="text-xs text-slate-500 mt-2">
            © 2024 Oriental MedIntelli Hub. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
      active 
        ? 'bg-pink-100/70 text-pink-700 shadow-md shadow-pink-200/30' 
        : 'text-slate-500 hover:text-pink-600 hover:bg-pink-50/50'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default App;