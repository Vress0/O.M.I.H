import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Button } from './Button';
import { ImageFile } from '../types';
import { editImage } from '../services/geminiService';
import { Wand2, Download, ArrowRight, Sparkles } from 'lucide-react';

export const Editor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Append specific context to ensure better results if the user is brief
      const enhancedPrompt = `${prompt}`;
      const resultBase64 = await editImage(sourceImage.base64, sourceImage.mimeType, enhancedPrompt);
      setGeneratedImage(resultBase64);
    } catch (err: any) {
      setError(err.message || "圖片生成失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `tcm-edit-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h2 className="text-2xl font-serif text-tcm-800 mb-2 flex items-center gap-2">
          <Wand2 className="text-tcm-600" />
          中醫影像工作室
        </h2>
        <p className="text-stone-500 mb-6">
          使用 AI 視覺化治療方案、添加經絡線，或將照片轉換為古風醫學插畫。
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-stone-700">1. 上傳原圖</h3>
            <ImageUploader 
              image={sourceImage} 
              onImageSelect={(file) => {
                setSourceImage(file);
                setGeneratedImage(null); // Reset result on new upload
              }}
              label="上傳圖片"
            />
            
            <h3 className="font-medium text-stone-700 pt-2">2. 描述修改需求</h3>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：'加上針灸經絡線'、'轉換為水墨畫風格'、'移除背景'"
                className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-tcm-500 focus:border-tcm-500 min-h-[100px] bg-stone-50"
              />
              <Sparkles className="absolute right-3 bottom-3 text-tcm-400" size={16} />
            </div>

            <Button 
              onClick={handleEdit} 
              disabled={!sourceImage || !prompt.trim()} 
              isLoading={loading}
              className="w-full"
            >
              {loading ? '生成中...' : '開始生成'}
            </Button>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-stone-700 flex justify-between">
              <span>結果預覽</span>
              {generatedImage && (
                <button 
                  onClick={handleDownload}
                  className="text-tcm-600 hover:text-tcm-800 text-sm flex items-center gap-1"
                >
                  <Download size={14} /> 下載
                </button>
              )}
            </h3>
            
            <div className="relative w-full h-[450px] bg-stone-100 rounded-xl border border-stone-200 overflow-hidden flex items-center justify-center">
              {generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-stone-400 space-y-2">
                  {loading ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <Wand2 size={48} className="mb-4 text-tcm-300" />
                      <p>AI 正在重繪您的圖片...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 border-2 border-dashed border-stone-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ArrowRight size={24} />
                      </div>
                      <p>編輯後的圖片將顯示於此</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};