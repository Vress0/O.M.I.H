import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import apiService from '../services/api';
import './doctors.css';

const DoctorsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    specialty: '',
    availability: 'all',
    rating: 0,
    distance: 50
  });
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  // 從其他頁面傳來的推薦參數
  const fromSymptoms = location.state?.fromSymptoms || [];
  const fromAnalysis = location.state?.fromAnalysis;
  const recommendedSpecialties = location.state?.recommendedSpecialties || [];

  useEffect(() => {
    loadDoctors();
    loadFilterOptions();
    getUserLocation();

    // 如果有推薦專科，自動設置篩選條件
    if (recommendedSpecialties.length > 0) {
      setFilters(prev => ({
        ...prev,
        specialty: recommendedSpecialties[0]
      }));
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [doctors, filters, sortBy, userLocation]);

  const loadDoctors = async () => {
    setIsLoading(true);
    
    try {
      const response = await apiService.getDoctors({
        symptoms: fromSymptoms,
        recommendedSpecialties: recommendedSpecialties
      });
      
      if (response.success) {
        setDoctors(response.data || getDefaultDoctors());
      } else {
        setDoctors(getDefaultDoctors());
      }
    } catch (error) {
      console.error('載入醫師資料失敗:', error);
      setDoctors(getDefaultDoctors());
    } finally {
      setIsLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const [specialtiesResponse, citiesResponse] = await Promise.all([
        apiService.getDoctorSpecialties(),
        apiService.getCities()
      ]);

      if (specialtiesResponse.success) {
        setSpecialties(specialtiesResponse.data || getDefaultSpecialties());
      } else {
        setSpecialties(getDefaultSpecialties());
      }

      if (citiesResponse.success) {
        setCities(citiesResponse.data || getDefaultCities());
      } else {
        setCities(getDefaultCities());
      }
    } catch (error) {
      console.error('載入篩選選項失敗:', error);
      setSpecialties(getDefaultSpecialties());
      setCities(getDefaultCities());
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('無法獲取位置資訊:', error);
          // 使用台北作為預設位置
          setUserLocation({ lat: 25.0330, lng: 121.5654 });
        }
      );
    } else {
      setUserLocation({ lat: 25.0330, lng: 121.5654 });
    }
  };

  const getDefaultDoctors = () => [
    {
      id: 1,
      name: '陳中醫',
      department: '中醫內科',
      clinic: '仁心中醫診所',
      address: '台北市大安區信義路四段123號',
      city: '台北市',
      district: '大安區',
      phone: '02-2345-6789',
      specialties: ['脾胃調理', '失眠治療', '頭痛'],
      rating: 4.8,
      review_count: 156,
      experience_years: 15,
      is_online: true,
      accept_online_consultation: true,
      lat: 25.0330,
      lng: 121.5654,
      distance: 2.3,
      match_score: 0.92,
      schedule: {
        '週一': ['09:00-12:00', '14:00-18:00'],
        '週二': ['09:00-12:00', '14:00-18:00'],
        '週三': ['09:00-12:00'],
        '週四': ['09:00-12:00', '14:00-18:00'],
        '週五': ['09:00-12:00', '14:00-18:00'],
        '週六': ['09:00-12:00']
      }
    },
    {
      id: 2,
      name: '林中醫師',
      department: '中醫婦科',
      clinic: '德安中醫診所',
      address: '台北市信義區松高路321號',
      city: '台北市',
      district: '信義區',
      phone: '02-3456-7890',
      specialties: ['婦科調理', '月經不調', '更年期'],
      rating: 4.6,
      review_count: 89,
      experience_years: 12,
      is_online: false,
      accept_online_consultation: false,
      lat: 25.0378,
      lng: 121.5645,
      distance: 3.1,
      match_score: 0.78
    },
    {
      id: 3,
      name: '王針灸師',
      department: '針灸科',
      clinic: '康泰中醫診所',
      address: '新北市板橋區文化路456號',
      city: '新北市',
      district: '板橋區',
      phone: '02-4567-8901',
      specialties: ['針灸治療', '疼痛管理', '中風復健'],
      rating: 4.9,
      review_count: 203,
      experience_years: 20,
      is_online: true,
      accept_online_consultation: true,
      lat: 25.0116,
      lng: 121.4628,
      distance: 8.5,
      match_score: 0.85
    }
  ];

  const getDefaultSpecialties = () => [
    '中醫內科', '中醫婦科', '針灸科', '中醫兒科', '中醫皮膚科',
    '中醫骨傷科', '中醫耳鼻喉科', '脾胃調理', '失眠治療', '疼痛管理'
  ];

  const getDefaultCities = () => [
    '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
    '基隆市', '新竹市', '嘉義市'
  ];

  const applyFilters = () => {
    let filtered = [...doctors];

    // 地區篩選
    if (filters.location) {
      filtered = filtered.filter(doctor => 
        doctor.city === filters.location || 
        doctor.district === filters.location
      );
    }

    // 專科篩選
    if (filters.specialty) {
      filtered = filtered.filter(doctor =>
        doctor.specialties.includes(filters.specialty) ||
        doctor.department === filters.specialty
      );
    }

    // 可預約篩選
    if (filters.availability === 'online') {
      filtered = filtered.filter(doctor => doctor.is_online);
    } else if (filters.availability === 'consultation') {
      filtered = filtered.filter(doctor => doctor.accept_online_consultation);
    }

    // 評分篩選
    if (filters.rating > 0) {
      filtered = filtered.filter(doctor => doctor.rating >= filters.rating);
    }

    // 距離篩選
    if (userLocation && filters.distance < 100) {
      filtered = filtered.filter(doctor => 
        doctor.distance <= filters.distance
      );
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.match_score || 0) - (a.match_score || 0);
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return (a.distance || 0) - (b.distance || 0);
        case 'experience':
          return b.experience_years - a.experience_years;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      specialty: '',
      availability: 'all',
      rating: 0,
      distance: 50
    });
    setSortBy('relevance');
  };

  const handleQuickBook = async (doctorId) => {
    try {
      const response = await apiService.quickBookDoctor(doctorId);
      if (response.success) {
        alert('預約請求已送出，我們將盡快與您聯繫確認！');
      }
    } catch (error) {
      console.error('快速預約失敗:', error);
      alert('預約失敗，請稍後再試或直接撥打診所電話。');
    }
  };

  if (isLoading) {
    return (
      <div className="doctors-page loading">
        <div className="loading-content">
          <div className="loading-spinner">⏳</div>
          <p>搜尋合適的中醫師...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">👨‍⚕️</span>
            中醫師推薦系統
          </h1>
          <p className="page-description">
            基於您的症狀和需求，為您推薦最合適的中醫師
          </p>
          
          {fromAnalysis && (
            <div className="context-info">
              <span className="context-icon">📊</span>
              根據您的分析結果推薦
              {recommendedSpecialties.length > 0 && (
                <span className="recommended-specialties">
                  建議科別：{recommendedSpecialties.join('、')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="doctors-content">
        {/* 篩選面板 */}
        <div className="filters-panel">
          <div className="filters-header">
            <h2 className="filters-title">篩選條件</h2>
            <button onClick={clearFilters} className="clear-filters-btn">
              🔄 清除篩選
            </button>
          </div>

          <div className="filters-grid">
            {/* 地區篩選 */}
            <div className="filter-group">
              <label className="filter-label">所在地區</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="filter-select"
              >
                <option value="">全部地區</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* 專科篩選 */}
            <div className="filter-group">
              <label className="filter-label">專科類別</label>
              <select
                value={filters.specialty}
                onChange={(e) => handleFilterChange('specialty', e.target.value)}
                className="filter-select"
              >
                <option value="">全部專科</option>
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            {/* 可預約狀態 */}
            <div className="filter-group">
              <label className="filter-label">預約狀態</label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="filter-select"
              >
                <option value="all">全部</option>
                <option value="online">目前線上</option>
                <option value="consultation">可線上諮詢</option>
              </select>
            </div>

            {/* 評分篩選 */}
            <div className="filter-group">
              <label className="filter-label">最低評分</label>
              <div className="rating-filter">
                {[0, 3, 4, 4.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('rating', rating)}
                    className={`rating-btn ${filters.rating === rating ? 'active' : ''}`}
                  >
                    {rating === 0 ? '不限' : `${rating}★ 以上`}
                  </button>
                ))}
              </div>
            </div>

            {/* 距離篩選 */}
            <div className="filter-group">
              <label className="filter-label">
                距離範圍：{filters.distance === 100 ? '不限' : `${filters.distance}km`}
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={filters.distance}
                onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
                className="distance-slider"
              />
            </div>
          </div>
        </div>

        {/* 結果列表 */}
        <div className="results-section">
          {/* 結果標題和排序 */}
          <div className="results-header">
            <div className="results-info">
              <h2 className="results-title">
                找到 {filteredDoctors.length} 位醫師
              </h2>
              {recommendedSpecialties.length > 0 && (
                <div className="recommendation-note">
                  <span className="note-icon">💡</span>
                  根據您的症狀，建議優先考慮：{recommendedSpecialties.join('、')}
                </div>
              )}
            </div>
            
            <div className="sort-controls">
              <label className="sort-label">排序方式：</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="relevance">推薦程度</option>
                <option value="rating">評分高低</option>
                <option value="distance">距離遠近</option>
                <option value="experience">經驗豐富</option>
              </select>
            </div>
          </div>

          {/* 醫師列表 */}
          {filteredDoctors.length > 0 ? (
            <div className="doctors-list">
              {filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  onSelect={handleDoctorSelect}
                  isSelected={selectedDoctor?.id === doctor.id}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-content">
                <div className="no-results-icon">😔</div>
                <h3 className="no-results-title">沒有找到符合條件的醫師</h3>
                <p className="no-results-description">
                  請嘗試調整篩選條件，或聯繫我們為您推薦合適的醫師
                </p>
                <div className="no-results-actions">
                  <button onClick={clearFilters} className="adjust-filters-btn">
                    調整篩選條件
                  </button>
                  <button 
                    onClick={() => navigate('/assistant')}
                    className="ask-assistant-btn"
                  >
                    諮詢 AI 助理
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 快速操作浮動按鈕 */}
      <div className="floating-actions">
        <button 
          onClick={() => navigate('/symptoms')}
          className="fab secondary"
          title="重新症狀分析"
        >
          🩺
        </button>
        <button 
          onClick={() => navigate('/assistant')}
          className="fab primary"
          title="AI 助理諮詢"
        >
          🤖
        </button>
      </div>

      {/* 地圖視圖切換 */}
      <div className="view-toggle">
        <button className="view-btn active">
          📋 列表視圖
        </button>
        <button 
          className="view-btn"
          onClick={() => alert('地圖視圖功能開發中...')}
        >
          🗺️ 地圖視圖
        </button>
      </div>
    </div>
  );
};

export default DoctorsPage;