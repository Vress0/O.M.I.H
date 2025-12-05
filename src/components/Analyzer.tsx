import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Button } from './Button';
import { ImageFile } from '../types';
import { analyzeImage } from '../services/geminiService';
import { ScanSearch, ScrollText, AlertCircle } from 'lucide-react';

export const Analyzer: React.FC = () => {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!image) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prompt = `
        你是一位專業的中醫專家。請仔細分析這張圖片。
        如果是藥材，請辨識名稱、性味歸經和功效。
        如果是舌頭或面部照片，請進行中醫望診分析（舌苔、舌色、面色等），並推斷可能的體質或健康狀況。
        如果是處方或文字，請翻譯並解釋方劑組成與功效。
        請用繁體中文回答，並提供結構清晰、富含教育意義的內容。
        重要：請在開頭附上免責聲明，說明這僅為 AI 分析，不能替代專業醫師診斷。
      `;
      
      const analysis = await analyzeImage(image.base64, image.mimeType, prompt);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || "分析圖片失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h2 className="text-2xl font-serif text-tcm-800 mb-2 flex items-center gap-2">
          <ScanSearch className="text-tcm-600" />
          AI 智能望診
        </h2>
        <p className="text-stone-500 mb-6">
          上傳藥材、舌象或處方照片，讓 O.M.I.H 東方醫智館進行專業的中醫分析。
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <ImageUploader 
              image={image} 
              onImageSelect={setImage} 
              label="上傳藥材或診斷照片"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={!image} 
              isLoading={loading}
              className="w-full"
            >
              {loading ? '正在分析中...' : '開始分析'}
            </Button>
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>

          <div className="bg-stone-50 rounded-xl p-6 min-h-[300px] border border-stone-200">
            {result ? (
              <div className="prose prose-stone max-w-none">
                <h3 className="flex items-center gap-2 text-lg font-serif text-tcm-800 border-b border-tcm-200 pb-2 mb-4">
                  <ScrollText size={20} />
                  分析報告
                </h3>
                <div className="whitespace-pre-wrap text-stone-700 leading-relaxed">
                  {result}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-3">
                <ScanSearch size={48} className="opacity-20" />
                <p>分析結果將顯示於此</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};