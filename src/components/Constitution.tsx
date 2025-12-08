import React, { useState } from 'react';
import { Button } from './Button';
import { analyzeConstitution } from '../services/geminiService';
import { ConstitutionData } from '../types';
import { FileText, CheckCircle, Activity, Thermometer, Moon, Smile, Utensils } from 'lucide-react';
import { DecoratedWrapper } from './DecoratedWrapper';

export const Constitution: React.FC = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ConstitutionData>({
    energy: '',
    temperature: '',
    sleep: '',
    mood: '',
    appetite: '',
    other: ''
  });
  const [result, setResult] = useState<{type: string, description: string, advice: string} | null>(null);

  const handleChange = (field: keyof ConstitutionData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // 檢查是否至少填寫了一些基本資訊
    const filledFields = Object.values(data).filter(v => typeof v === 'string' && v.trim()).length;
    if (filledFields < 1) {
      alert("請至少填寫一個欄位以進行體質分析");
      return;
    }
    
    setLoading(true);
    try {
      const jsonStr = await analyzeConstitution(data);
      const parsed = JSON.parse(jsonStr);
      // 驗證回應內容
      if (!parsed.type || !parsed.description || !parsed.advice) {
        throw new Error("分析結果格式錯誤");
      }
      setResult(parsed);
      setStep('result');
    } catch (error: any) {
      console.error("體質分析錯誤:", error);
      const errorMessage = error.message || "分析失敗，請重試";
      alert(`${errorMessage}\n\n請確認：\n1. 網路連線正常\n2. 已填寫必要資訊\n3. 稍後再試`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'result' && result) {
    return (
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <DecoratedWrapper className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-pink-200/50 overflow-hidden" imgOpacity={0.06}>
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 p-8 text-center text-white">
            <h2 className="text-3xl font-serif font-light mb-4">您的體質是：{result.type}</h2>
            <div className="w-20 h-1 bg-pink-200/60 mx-auto rounded-full"></div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* 體質特徵 */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-serif text-tcm-800 mb-4">
                <FileText className="text-tcm-500" /> 體質特徵
              </h3>
              <div className="bg-stone-50 p-5 rounded-xl space-y-3">
                {result.description.split('\n').map((line, idx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  
                  const cleaned = trimmed.replace(/\*\*/g, '');
                  
                  // 項目符號列表
                  if (cleaned.match(/^[•\*\-]\s+/)) {
                    const content = cleaned.replace(/^[•\*\-]\s+/, '');
                    const colonMatch = content.match(/^([^：:]+)[：:]\s*(.+)$/);
                    
                    if (colonMatch) {
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-tcm-500 mt-1 flex-shrink-0">•</span>
                          <div className="flex-1">
                            <span className="font-semibold text-tcm-800">{colonMatch[1]}：</span>
                            <span className="text-stone-700">{colonMatch[2]}</span>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-tcm-500 mt-1 flex-shrink-0">•</span>
                        <span className="text-stone-700">{content}</span>
                      </div>
                    );
                  }
                  
                  // 檢查是否為「標籤：內容」格式
                  const colonMatch = cleaned.match(/^([^：:]+)[：:]\s*(.+)$/);
                  if (colonMatch) {
                    return (
                      <p key={idx} className="text-stone-700">
                        <span className="font-semibold text-tcm-800">{colonMatch[1]}：</span>
                        {colonMatch[2]}
                      </p>
                    );
                  }
                  
                  return <p key={idx} className="text-stone-700">{cleaned}</p>;
                })}
              </div>
            </div>

            {/* 養生建議 */}
            <div>
              <h3 className="flex items-center gap-2 text-xl font-serif text-tcm-800 mb-4">
                <CheckCircle className="text-tcm-500" /> 養生建議
              </h3>
              <div className="bg-tcm-50 p-5 rounded-xl border border-tcm-100 space-y-3">
                {result.advice.split('\n').map((line, idx) => {
                  const trimmed = line.trim();
                  if (!trimmed) return null;
                  
                  const cleaned = trimmed.replace(/\*\*/g, '');
                  
                  // 數字編號列表
                  const numberedMatch = cleaned.match(/^(\d+)[、.]\s*(.+)$/);
                  if (numberedMatch) {
                    const content = numberedMatch[2];
                    const colonMatch = content.match(/^([^：:]+)[：:]\s*(.+)$/);
                    
                    if (colonMatch) {
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-tcm-200 text-tcm-800 rounded-full flex items-center justify-center text-sm font-bold">
                            {numberedMatch[1]}
                          </span>
                          <div className="flex-1">
                            <span className="font-semibold text-tcm-800">{colonMatch[1]}：</span>
                            <span className="text-stone-700">{colonMatch[2]}</span>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-tcm-200 text-tcm-800 rounded-full flex items-center justify-center text-sm font-bold">
                          {numberedMatch[1]}
                        </span>
                        <span className="text-stone-700">{content}</span>
                      </div>
                    );
                  }
                  
                  // 項目符號列表
                  if (cleaned.match(/^[•\*\-]\s+/)) {
                    const content = cleaned.replace(/^[•\*\-]\s+/, '');
                    const colonMatch = content.match(/^([^：:]+)[：:]\s*(.+)$/);
                    
                    if (colonMatch) {
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-tcm-500 mt-1 flex-shrink-0">•</span>
                          <div className="flex-1">
                            <span className="font-semibold text-tcm-800">{colonMatch[1]}：</span>
                            <span className="text-stone-700">{colonMatch[2]}</span>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-tcm-500 mt-1 flex-shrink-0">•</span>
                        <span className="text-stone-700">{content}</span>
                      </div>
                    );
                  }
                  
                  // 檢查是否為「標籤：內容」格式
                  const colonMatch = cleaned.match(/^([^：:]+)[：:]\s*(.+)$/);
                  if (colonMatch) {
                    return (
                      <p key={idx} className="text-stone-700">
                        <span className="font-semibold text-tcm-800">{colonMatch[1]}：</span>
                        {colonMatch[2]}
                      </p>
                    );
                  }
                  
                  return <p key={idx} className="text-stone-700">{cleaned}</p>;
                })}
              </div>
            </div>

            <Button 
              onClick={() => setStep('form')} 
              variant="outline"
              className="w-full"
            >
              重新測驗
            </Button>
          </div>
        </DecoratedWrapper>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <DecoratedWrapper className="bg-white/40 backdrop-blur-xl rounded-2xl p-8 shadow-sm border border-pink-200/50" imgOpacity={0.06}>
        <div className="text-center mb-10 space-y-4">
          <div className="flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-serif font-light bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent">中醫九大體質檢測</h2>
          <div className="flex justify-center">
            <div className="h-1 w-16 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full"></div>
          </div>
          <p className="text-slate-600 leading-relaxed font-light">請根據您最近三個月的身體狀況填寫，AI 將為您分析體質類型。</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-tcm-800">
              <Activity size={18} /> 精力狀況
            </label>
            <select 
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg"
              value={data.energy}
              onChange={(e) => handleChange('energy', e.target.value)}
            >
              <option value="">請選擇...</option>
              <option value="精力充沛，不易疲倦">精力充沛，不易疲倦</option>
              <option value="容易疲倦，精神不振">容易疲倦，精神不振</option>
              <option value="說話聲音小，不愛動">說話聲音小，不愛動</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-tcm-800">
              <Thermometer size={18} /> 冷熱偏好
            </label>
            <select 
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg"
              value={data.temperature}
              onChange={(e) => handleChange('temperature', e.target.value)}
            >
              <option value="">請選擇...</option>
              <option value="怕冷，手腳冰涼">怕冷，手腳冰涼</option>
              <option value="怕熱，手心腳心發熱">怕熱，手心腳心發熱</option>
              <option value="適中，無明顯冷熱偏好">適中，無明顯冷熱偏好</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-tcm-800">
              <Moon size={18} /> 睡眠品質
            </label>
            <input 
              type="text" 
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg"
              placeholder="例如：入睡困難、多夢、嗜睡..."
              value={data.sleep}
              onChange={(e) => handleChange('sleep', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-tcm-800">
              <Smile size={18} /> 情緒狀態
            </label>
            <input 
              type="text" 
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg"
              placeholder="例如：容易焦慮、悶悶不樂、急躁易怒..."
              value={data.mood}
              onChange={(e) => handleChange('mood', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-tcm-800">
              <Utensils size={18} /> 食慾與消化
            </label>
            <input 
              type="text" 
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg"
              placeholder="例如：胃口好、腹脹、便秘、腹瀉..."
              value={data.appetite}
              onChange={(e) => handleChange('appetite', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-tcm-800">
              <FileText size={18} /> 其他補充（選填）
            </label>
            <textarea 
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg h-24"
              placeholder="還有什麼身體特徵想告訴我們？例如皮膚狀況、出汗情況等。"
              value={data.other}
              onChange={(e) => handleChange('other', e.target.value)}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            isLoading={loading}
            className="w-full py-4 text-lg"
          >
            {loading ? 'AI 分析中...' : '開始體質分析'}
          </Button>
        </div>
      </DecoratedWrapper>
    </div>
  );
};