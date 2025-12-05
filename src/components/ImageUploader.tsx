import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  image: ImageFile | null;
  onImageSelect: (image: ImageFile | null) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ image, onImageSelect, label = "上傳圖片" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      const mimeType = file.type;

      onImageSelect({
        file,
        previewUrl: result,
        base64,
        mimeType
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center overflow-hidden group
          ${image ? 'border-tcm-400 bg-tcm-50' : 'border-stone-300 hover:border-tcm-400 hover:bg-stone-50'}
        `}
      >
        {image ? (
          <>
            <img 
              src={image.previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain p-2"
            />
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <X size={16} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs text-center truncate opacity-0 group-hover:opacity-100 transition-opacity">
              點擊更換圖片
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-tcm-100 text-tcm-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload size={32} />
            </div>
            <p className="text-stone-600 font-medium mb-1">{label}</p>
            <p className="text-stone-400 text-sm">支援 JPG, PNG 格式</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};