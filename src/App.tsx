import React, { useState } from 'react';
import { AppMode } from './types';
import { Analyzer } from './components/Analyzer';
import { Editor } from './components/Editor';
import { ChatBot } from './components/ChatBot';
import { Constitution } from './components/Constitution';
import { FindDoctor } from './components/FindDoctor';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Leaf, Activity, Camera, Palette, MessageCircle, ClipboardCheck, BookOpen, User, MapPin } from 'lucide-react';

// 開場動畫元件
const IntroOverlay: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer"
      onDoubleClick={onFinish}
    >
      <video
        src="/opening.mp4"
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        onEnded={onFinish}
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs md:text-sm px-4 py-2 rounded-full">
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
            {/* Hero Section */}
            <div className="text-center py-12 px-4 relative overflow-hidden rounded-3xl bg-tcm-50 border border-tcm-100">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-tcm-900 mb-6 relative z-10">
                O.M.I.H 東方醫智館
              </h1>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-8 relative z-10">
                Oriental MedIntelli Hub - 融合千年傳統智慧與現代 AI 科技，為您打造個人化的全方位健康管理方案。
              </p>
              <button 
                onClick={() => setMode(AppMode.Chat)}
                className="bg-tcm-600 text-white px-8 py-3 rounded-full font-medium hover:bg-tcm-700 transition-colors shadow-lg relative z-10"
              >
                開始健康諮詢
              </button>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => setMode(AppMode.Chat)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">AI 健康小助理</h3>
                <p className="text-stone-500 text-sm">24/7 智能問答，即時分析症狀並提供養生建議。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.KnowledgeBase)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">中醫知識庫</h3>
                <p className="text-stone-500 text-sm">包含中藥、方劑、穴位與養生的結構化百科全書。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.Constitution)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ClipboardCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">體質檢測</h3>
                <p className="text-stone-500 text-sm">分析九大體質，提供專屬的飲食與調理方案。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.FindDoctor)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">尋找醫師</h3>
                <p className="text-stone-500 text-sm">根據地區與專科，尋找最適合您的中醫專家。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.Analyze)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">智能望診</h3>
                <p className="text-stone-500 text-sm">上傳藥材或舌象照片，獲得專業的 AI 視覺分析。</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.Edit)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette size={24} />
                </div>
                <h3 className="text-lg font-bold text-stone-800 mb-2">影像工作室</h3>
                <p className="text-stone-500 text-sm">視覺化治療方案與古風醫學圖像創作。</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      {/* Intro Overlay */}
      {showIntro && (
        <IntroOverlay onFinish={() => setShowIntro(false)} />
      )}
      {/* Header */}
      <header className="bg-white border-b border-tcm-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setMode(AppMode.Home)}
          >
            <div className="bg-tcm-600 p-2 rounded-lg text-white">
              <Leaf size={24} />
            </div>
            <h1 className="text-xl font-serif font-bold text-tcm-900 tracking-wide">
              O.M.I.H <span className="text-tcm-500 font-sans font-normal text-sm ml-1 hidden sm:inline">東方醫智館</span>
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-stone-100/50 p-1 rounded-lg overflow-x-auto">
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
      <footer className="bg-tcm-900 text-tcm-100 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Leaf size={24} className="text-tcm-400" />
            <span className="font-serif font-bold text-2xl">O.M.I.H</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm text-tcm-300 border-b border-tcm-800 pb-8">
            <div>
              <h4 className="font-bold text-white mb-2">服務項目</h4>
              <p>AI 症狀檢查</p>
              <p>體質檢測</p>
              <p>中醫知識庫</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">關於我們</h4>
              <p>O.M.I.H 致力於將傳統醫學現代化，讓每個人都能享受智慧化的中醫健康管理。</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-2">聯絡資訊</h4>
              <p>Email: contact@omih.hub</p>
            </div>
          </div>
          <p className="text-xs text-tcm-500">
            免責聲明：本平台提供的所有資訊僅供參考，不構成專業醫療建議、診斷或治療。如感身體不適，請務必諮詢合格醫師。
          </p>
          <p className="text-xs text-tcm-600 mt-2">
            © 2024 Oriental MedIntelli Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
      active 
        ? 'bg-white text-tcm-700 shadow-sm' 
        : 'text-stone-500 hover:text-stone-700 hover:bg-white/50'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default App;