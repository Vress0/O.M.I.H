import React, { useState } from 'react';
import { MapPin, Search, Star, Calendar, Navigation, Building2, Map as MapIcon } from 'lucide-react';
import { Button } from './Button';
import { findDoctors } from '../services/geminiService';
import { GroundingPlace } from '../types';
import { DecoratedWrapper } from './DecoratedWrapper';

export const FindDoctor: React.FC = () => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [places, setPlaces] = useState<GroundingPlace[]>([]);
  const [usingLocation, setUsingLocation] = useState(false);
  const [mapQuery, setMapQuery] = useState<string>('台北市 中醫');

  const handleSearch = async () => {
    if (!location && !usingLocation) {
      alert("請輸入地點或使用當前位置");
      return;
    }

    setLoading(true);
    setResultText(null);
    setPlaces([]);

    try {
      let lat, lng;
      let queryLocation = location;
      
      if (usingLocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        queryLocation = `${lat},${lng}`;
      }

      // Update map query
      const searchQuery = usingLocation ? `${lat},${lng}` : `${location} ${specialty} 中醫`;
      setMapQuery(searchQuery);

      const response = await findDoctors(usingLocation ? '附近' : location, specialty, lat, lng);
      setResultText(response.text);
      setPlaces(response.places);
    } catch (error) {
      console.error(error);
      setResultText("搜尋時發生錯誤，請檢查網路連線或稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const toggleLocation = () => {
    if (!usingLocation) {
      setUsingLocation(true);
      setLocation('目前位置 (GPS)');
    } else {
      setUsingLocation(false);
      setLocation('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn flex flex-col pb-8">
      {/* Search Header */}
      <DecoratedWrapper className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100" imgOpacity={0.06}>
        <h2 className="text-2xl font-serif text-tcm-800 mb-6 flex items-center gap-2">
          <MapPin className="text-tcm-600" />
          尋找中醫師
        </h2>

        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="text-stone-400" size={18} />
            </div>
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-tcm-500 focus:outline-none transition-colors ${usingLocation ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300'}`}
              placeholder="輸入地點 (例如: 台北市大安區)"
              value={location}
              onChange={(e) => !usingLocation && setLocation(e.target.value)}
              disabled={usingLocation}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={toggleLocation}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors ${usingLocation ? 'bg-tcm-100 text-tcm-700' : 'text-stone-400 hover:text-stone-600'}`}
              title="使用目前位置"
            >
              <Navigation size={16} />
            </button>
          </div>

          <div className="md:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-stone-400" size={18} />
            </div>
            <select
              className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-tcm-500 focus:outline-none bg-white appearance-none"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
            >
              <option value="">選擇專科 (全部)</option>
              <option value="內科">中醫內科</option>
              <option value="針灸">針灸科</option>
              <option value="傷科">骨傷科</option>
              <option value="婦科">中醫婦科</option>
              <option value="兒科">中醫兒科</option>
              <option value="皮膚科">中醫皮膚科</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <Button 
              onClick={handleSearch} 
              isLoading={loading}
              className="w-full h-full"
            >
              搜尋
            </Button>
          </div>
        </div>
      </DecoratedWrapper>

      {/* Main Content Area - Split View */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Column: Results List (Scrollable) */}
        <div className="flex flex-col gap-6">
          {(resultText || loading) && (
            <>
              {/* AI Summary */}
              <div className="bg-gradient-to-br from-tcm-50 to-amber-50 rounded-xl p-6 border border-tcm-200 shadow-sm flex-shrink-0">
                <h3 className="flex items-center gap-2 text-lg font-serif text-tcm-800 border-b border-tcm-300 pb-3 mb-4">
                  <Building2 size={20} className="text-tcm-600" />
                  <span className="font-bold">AI 推薦摘要</span>
                </h3>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-white/60 rounded w-3/4"></div>
                    <div className="h-4 bg-white/60 rounded w-full"></div>
                    <div className="h-4 bg-white/60 rounded w-5/6"></div>
                    <div className="h-4 bg-white/60 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(() => {
                      // 解析並排序診所資訊
                      const lines = resultText?.split('\n') || [];
                      const clinics: { name: string; lines: string[]; rating: number }[] = [];
                      let currentClinic: { name: string; lines: string[]; rating: number } | null = null;
                      
                      // 第一步：分組診所資訊
                      lines.forEach(line => {
                        const trimmed = line.trim();
                        if (!trimmed) return;
                        
                        const cleaned = trimmed.replace(/^\*+\s*/, '').replace(/\*\*/g, '');
                        const hasColon = cleaned.includes('：') || cleaned.includes(':');
                        
                        // 診所名稱（不含冒號的短行）
                        if (!hasColon && cleaned.length > 0 && cleaned.length < 30) {
                          if (currentClinic) {
                            clinics.push(currentClinic);
                          }
                          currentClinic = { name: cleaned, lines: [], rating: 0 };
                        } else if (currentClinic) {
                          // 提取評分
                          const ratingMatch = cleaned.match(/評分[：:]\s*([\d.]+)/);
                          if (ratingMatch) {
                            currentClinic.rating = parseFloat(ratingMatch[1]);
                          }
                          currentClinic.lines.push(line);
                        }
                      });
                      
                      if (currentClinic) {
                        clinics.push(currentClinic);
                      }
                      
                      // 第二步：按評分排序（高到低）
                      clinics.sort((a, b) => b.rating - a.rating);
                      
                      // 第三步：渲染排序後的診所
                      return clinics.map((clinic, clinicIdx) => (
                        <div key={clinicIdx} className="bg-white rounded-xl p-5 shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
                          {/* 診所名稱 */}
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-200">
                            <MapPin size={20} className="text-tcm-600 flex-shrink-0" />
                            <h4 className="text-lg font-bold text-tcm-900">
                              {clinic.name}
                            </h4>
                          </div>
                          
                          {/* 診所詳細資訊 */}
                          <div className="space-y-2.5">
                            {clinic.lines.map((line, lineIdx) => {
                              const trimmed = line.trim();
                              if (!trimmed) return null;
                              
                              const cleaned = trimmed.replace(/^\*+\s*/, '').replace(/\*\*/g, '');
                              const colonMatch = cleaned.match(/^([^：:]+)[：:]\s*(.+)$/);
                              
                              if (colonMatch) {
                                const [, label, content] = colonMatch;
                                const cleanLabel = label.trim();
                                const cleanContent = content.trim();
                                
                                if (cleanLabel.includes('評分')) {
                                  return (
                                    <div key={lineIdx} className="flex items-center gap-2.5 py-1">
                                      <Star size={18} className="text-amber-500 fill-amber-500 flex-shrink-0" />
                                      <span className="text-stone-600 font-medium">{cleanLabel}：</span>
                                      <span className="text-amber-700 font-bold text-base">{cleanContent}</span>
                                    </div>
                                  );
                                }
                                
                                if (cleanLabel.includes('地址')) {
                                  return (
                                    <div key={lineIdx} className="flex items-start gap-2.5 py-1">
                                      <Navigation size={18} className="text-stone-500 flex-shrink-0 mt-0.5" />
                                      <span className="text-stone-600 font-medium flex-shrink-0">{cleanLabel}：</span>
                                      <span className="text-stone-800">{cleanContent}</span>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <div key={lineIdx} className="flex items-start gap-2.5 py-1">
                                    <span className="text-stone-600 font-medium flex-shrink-0 min-w-[80px]">{cleanLabel}：</span>
                                    <span className="text-stone-800 leading-relaxed">{cleanContent}</span>
                                  </div>
                                );
                              }
                              
                              return (
                                <p key={lineIdx} className="text-stone-700 leading-relaxed py-1">
                                  {cleaned}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Visual Map (Sticky) */}
        <div className="bg-stone-200 rounded-2xl overflow-hidden shadow-inner border border-stone-300 h-[500px] lg:sticky lg:top-6 lg:self-start">
          {mapQuery ? (
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
              <MapIcon size={64} className="opacity-20 mb-4" />
              <p>地圖將在此顯示搜尋結果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};