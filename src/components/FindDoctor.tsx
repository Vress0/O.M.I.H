import React, { useState } from 'react';
import { MapPin, Search, Star, Calendar, Navigation, Building2, Map as MapIcon } from 'lucide-react';
import { Button } from './Button';
import { findDoctors } from '../services/geminiService';
import { GroundingPlace } from '../types';

export const FindDoctor: React.FC = () => {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [places, setPlaces] = useState<GroundingPlace[]>([]);
  const [usingLocation, setUsingLocation] = useState(false);
  const [mapQuery, setMapQuery] = useState<string>('');

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
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex-shrink-0">
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
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Column: Results List (Scrollable) */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
          {(resultText || loading) && (
            <>
              {/* AI Summary */}
              <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm flex-shrink-0">
                <h3 className="flex items-center gap-2 text-lg font-serif text-tcm-800 border-b border-tcm-200 pb-2 mb-4">
                  <Building2 size={20} />
                  AI 推薦摘要
                </h3>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-stone-100 rounded w-3/4"></div>
                    <div className="h-4 bg-stone-100 rounded w-full"></div>
                    <div className="h-4 bg-stone-100 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="prose prose-stone max-w-none text-stone-700 whitespace-pre-wrap leading-relaxed">
                    {resultText}
                  </div>
                )}
              </div>

              {/* Places List */}
              <div className="space-y-4">
                <h3 className="font-bold text-stone-700 flex items-center gap-2">
                  <MapPin size={18} />
                  推薦診所列表
                </h3>
                
                {places.length > 0 ? (
                  places.map((place, idx) => (
                    <div key={idx} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow hover:border-tcm-300 group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-tcm-900 mb-1 group-hover:text-tcm-700">{place.title}</h4>
                          {place.address && (
                            <p className="text-sm text-stone-500 mb-2 flex items-center gap-1">
                              <MapPin size={12} />
                              {place.address}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mb-3 bg-amber-50 inline-flex px-2 py-1 rounded-md">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-amber-700">{place.rating || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-2">
                        <a 
                          href={place.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 text-center py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-lg text-sm font-medium transition-colors border border-stone-200 flex items-center justify-center gap-2"
                        >
                          <MapIcon size={16} />
                          Google 地圖
                        </a>
                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-tcm-600 hover:bg-tcm-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                          <Calendar size={16} />
                          預約掛號
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  !loading && (
                    <div className="text-center p-8 bg-stone-50 rounded-xl border border-dashed border-stone-300 text-stone-400 text-sm">
                      請輸入條件並搜尋以查看推薦診所
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Visual Map (Sticky) */}
        <div className="bg-stone-200 rounded-2xl overflow-hidden shadow-inner border border-stone-300 relative min-h-[400px] lg:h-auto">
          {mapQuery ? (
             <iframe
              title="Google Map"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '100%' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              className="absolute inset-0"
            ></iframe>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 bg-stone-100">
              <MapIcon size={64} className="opacity-20 mb-4" />
              <p>地圖將在此顯示搜尋結果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};