import React, { useState } from 'react';

const Secret: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askFortune = async () => {
    setError(null);
    setResult(null);
    if (!question.trim()) {
      setError('請輸入你想占卜的內容');
      return;
    }
    setLoading(true);
    try {
      const q = encodeURIComponent(question.trim());
      const res = await fetch(`/api/fortune?question=${q}`);
      if (!res.ok) throw new Error('伺服器錯誤');
      const data = await res.json();
      setResult(data.fortune || '沒有收到占卜結果');
    } catch (e: any) {
      setError(e.message || '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-2xl p-8 rounded-3xl bg-white/30 backdrop-blur-xl border border-pink-200/40 shadow-xl">
        <h2 className="text-3xl font-serif font-light bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent text-center mb-4">小占卜彩蛋 ✨</h2>
        <p className="text-center text-sm text-slate-600 mb-6">在心中輕聲問一句，讓小占卜為你帶來一點溫柔的指引。</p>

        <div className="flex gap-3 mb-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="輸入你的問題，例如：今天適合出門嗎？"
            className="flex-1 px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-pink-100 placeholder:text-slate-400 outline-none focus:shadow-md focus:shadow-pink-200/40 transition"
          />
          <button
            onClick={askFortune}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-300 to-purple-300 text-white hover:scale-105 hover:shadow-lg hover:shadow-pink-300/50 transition"
            disabled={loading}
          >
            {loading ? '占卜中...' : '開始占卜 ✨'}
          </button>
        </div>

        {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

        <div className="mt-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-50/60 to-purple-50/60 border border-pink-100/40">
            {result ? (
              <div className="text-center">
                <p className="text-xl font-serif font-light bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{result}</p>
              </div>
            ) : (
              <p className="text-center text-slate-500">占卜結果會顯示在這裡</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Secret;
