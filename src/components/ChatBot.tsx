import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { DecoratedWrapper } from './DecoratedWrapper';
import { sendMessageToAI } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '你好！我是 O.M.I.H 東方醫智館的智能健康小助理。請問今天有什麼我可以幫您的？(例如：詢問症狀、養生建議、中藥知識)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // 延遲一點確保 DOM 更新完成
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Convert internal ChatMessage to Gemini API history format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToAI(input, history);
      
      const botMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "抱歉，連線發生錯誤，請稍後再試。" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn h-[calc(100vh-120px)] flex flex-col">
      <DecoratedWrapper className="flex-1 bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-pink-200/50 flex flex-col overflow-hidden" imgOpacity={0.06}>
        {/* Header - Alicia Style */}
        <div className="p-4 bg-gradient-to-r from-pink-100/50 via-purple-100/50 to-pink-100/50 border-b border-pink-200/50 flex items-center gap-3 flex-shrink-0">
        <div className="bg-gradient-to-br from-pink-200 to-purple-200 p-2 rounded-full text-pink-700">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-serif text-lg bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent font-light">AI 健康小助理</h2>
          <p className="text-xs text-slate-600 font-light">東方醫智館 - 全天候為您解答中醫健康疑問</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-slate-50/30 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 max-w-[85%] animate-fadeIn ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center shrink-0
              ${msg.role === 'user' ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'}
            `}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`
              p-3 rounded-2xl text-sm leading-relaxed shadow-sm backdrop-blur-sm
              ${msg.role === 'user' 
                ? 'bg-white/80 text-slate-800 border border-slate-200 rounded-tr-none' 
                : 'bg-pink-100/60 text-slate-800 border border-pink-200/50 rounded-tl-none'}
            `}>
              {msg.role === 'user' ? (
                // 使用者訊息：直接顯示
                <div className="whitespace-pre-wrap">{msg.text}</div>
              ) : (
                // AI 回應：格式化處理
                <div className="space-y-2">
                  {msg.text.split('\n').map((line, lineIdx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={lineIdx} className="h-2"></div>;
                    
                    const cleaned = trimmed.replace(/\*\*/g, '');
                    
                    // 數字編號列表
                    const numberedMatch = cleaned.match(/^(\d+)[、.]\s*(.+)$/);
                    if (numberedMatch) {
                      const content = numberedMatch[2];
                      const colonMatch = content.match(/^([^：:]+)[：:]\s*(.+)$/);
                      
                      if (colonMatch) {
                        return (
                          <div key={lineIdx} className="flex items-start gap-2 mb-1">
                            <span className="flex-shrink-0 w-5 h-5 bg-pink-200 text-pink-800 rounded-full flex items-center justify-center text-xs font-bold">
                              {numberedMatch[1]}
                            </span>
                            <div className="flex-1 text-sm">
                              <span className="font-semibold text-pink-800">{colonMatch[1]}：</span>
                              <span>{colonMatch[2]}</span>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={lineIdx} className="flex items-start gap-2 mb-1">
                          <span className="flex-shrink-0 w-5 h-5 bg-pink-200 text-pink-800 rounded-full flex items-center justify-center text-xs font-bold">
                            {numberedMatch[1]}
                          </span>
                          <span className="flex-1 text-sm">{content}</span>
                        </div>
                      );
                    }
                    
                    // 項目符號列表
                    if (cleaned.match(/^[•\*\-]\s+/)) {
                      const content = cleaned.replace(/^[•\*\-]\s+/, '');
                      const colonMatch = content.match(/^([^：:]+)[：:]\s*(.+)$/);
                      
                      if (colonMatch) {
                        return (
                          <div key={lineIdx} className="flex items-start gap-2 mb-1">
                            <span className="text-pink-500 mt-0.5 flex-shrink-0">•</span>
                            <div className="flex-1 text-sm">
                              <span className="font-semibold text-pink-800">{colonMatch[1]}：</span>
                              <span>{colonMatch[2]}</span>
                            </div>
                          </div>
                        );
                      }
                      
                      return (
                        <div key={lineIdx} className="flex items-start gap-2 mb-1">
                          <span className="text-pink-500 mt-0.5 flex-shrink-0">•</span>
                          <span className="flex-1 text-sm">{content}</span>
                        </div>
                      );
                    }
                    
                    // 標籤：內容格式
                    const colonMatch = cleaned.match(/^([^：:]+)[：:]\s*(.+)$/);
                    if (colonMatch && cleaned.length < 100) {
                      return (
                        <p key={lineIdx} className="text-sm mb-1">
                          <span className="font-semibold text-pink-800">{colonMatch[1]}：</span>
                          <span>{colonMatch[2]}</span>
                        </p>
                      );
                    }
                    
                    // 一般段落
                    return <p key={lineIdx} className="text-sm mb-1">{cleaned}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-tcm-600 text-white flex items-center justify-center shrink-0">
              <Loader2 size={16} className="animate-spin" />
            </div>
            <div className="bg-tcm-50 p-3 rounded-2xl rounded-tl-none border border-tcm-100">
              <span className="text-tcm-400 text-sm">正在思考中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-stone-100 flex-shrink-0">
          <div className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="輸入您的症狀或問題..."
            className="w-full p-3 pr-12 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tcm-500 focus:border-tcm-500 resize-none max-h-32 min-h-[50px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 bottom-2 p-2 bg-tcm-600 text-white rounded-lg hover:bg-tcm-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-xs text-stone-400 mt-2">
          AI 回答僅供參考，不代表專業醫療診斷。
        </p>
        </div>
      </DecoratedWrapper>
    </div>
  );
};