import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './index.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [healthTips, setHealthTips] = useState([]);
  const [todayRecommendations, setTodayRecommendations] = useState(null);
  const [popularSymptoms, setPopularSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [userGreeting, setUserGreeting] = useState('');

  // 載入首頁數據
  useEffect(() => {
    loadHomeData();
    setGreeting();
    
    // 設置養生小知識輪播
    const tipTimer = setInterval(() => {
      setCurrentTipIndex(prev => 
        prev === healthTips.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(tipTimer);
  }, [healthTips.length]);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      
      // 並行載入各種數據
      const [tipsResponse, recommendationsResponse, symptomsResponse] = await Promise.all([
        apiService.getHealthTips(),
        apiService.getTodayRecommendations(),
        apiService.getPopularSymptoms()
      ]);

      if (tipsResponse.success) {
        setHealthTips(tipsResponse.data || getDefaultHealthTips());
      } else {
        setHealthTips(getDefaultHealthTips());
      }

      if (recommendationsResponse.success) {
        setTodayRecommendations(recommendationsResponse.data);
      } else {
        setTodayRecommendations(getDefaultRecommendations());
      }

      if (symptomsResponse.success) {
        setPopularSymptoms(symptomsResponse.data || getDefaultSymptoms());
      } else {
        setPopularSymptoms(getDefaultSymptoms());
      }

    } catch (error) {
      console.error('載入首頁數據失敗:', error);
      // 使用預設數據
      setHealthTips(getDefaultHealthTips());
      setTodayRecommendations(getDefaultRecommendations());
      setPopularSymptoms(getDefaultSymptoms());
    } finally {
      setIsLoading(false);
    }
  };

  const setGreeting = () => {
    const hour = new Date().getHours();
    const userData = apiService.getUserData();
    const name = userData?.name || '朋友';
    
    if (hour < 6) {
      setUserGreeting(`深夜好，${name}！注意休息哦`);
    } else if (hour < 12) {
      setUserGreeting(`早安，${name}！新的一天開始了`);
    } else if (hour < 18) {
      setUserGreeting(`午安，${name}！今天過得如何？`);
    } else {
      setUserGreeting(`晚安，${name}！今日辛苦了`);
    }
  };

  // 預設數據
  const getDefaultHealthTips = () => [
    {
      title: '冬季養腎正當時',
      content: '冬季是養腎的最佳時節，多吃黑色食物如黑芝麻、黑豆，早睡晚起，避免過度勞累。',
      category: '四季養生',
      season: '冬季'
    },
    {
      title: '按摩足三里，勝吃老母雞',
      content: '足三里是強壯要穴，每日按摩10分鐘，可調理脾胃、增強免疫力。',
      category: '穴位養生',
      technique: '按摩'
    },
    {
      title: '情志調養很重要',
      content: '中醫認為七情內傷是疾病的重要原因，保持心情舒暢，適度運動，有助身心健康。',
      category: '情志調養',
      method: '生活方式'
    },
    {
      title: '飲食有節，起居有常',
      content: '規律的作息和適當的飲食是養生的基礎，三餐定時，睡眠充足，是健康長壽的秘訣。',
      category: '生活養生',
      principle: '規律'
    }
  ];

  const getDefaultRecommendations = () => ({
    constitution_tip: {
      type: '平和體質',
      suggestion: '您的體質較為平衡，建議維持良好的生活習慣，適度運動，飲食均衡。',
      foods: ['蘋果', '胡蘿蔔', '燕麥', '魚類'],
      exercises: ['散步', '太極', '瑜伽']
    },
    seasonal_advice: {
      season: '冬季',
      focus: '養腎護陽',
      tips: [
        '早睡晚起，順應自然',
        '適當進補，溫陽散寒',
        '保暖防寒，特別注意腳部',
        '情志安寧，減少消耗'
      ]
    },
    acupoint_of_day: {
      name: '湧泉穴',
      location: '足底前1/3與後2/3交界處',
      benefits: ['補腎固元', '安神定志', '緩解疲勞'],
      method: '每晚睡前按摩3-5分鐘'
    }
  });

  const getDefaultSymptoms = () => [
    { name: '頭痛', count: 156, trend: 'up' },
    { name: '失眠', count: 142, trend: 'up' },
    { name: '胃脹', count: 128, trend: 'down' },
    { name: '疲勞', count: 115, trend: 'up' },
    { name: '咳嗽', count: 98, trend: 'stable' },
    { name: '腰痛', count: 87, trend: 'up' }
  ];

  // 導航到各功能模組
  const navigateToModule = (module) => {
    navigate(`/${module}`);
  };

  // 快速症狀查詢
  const quickSymptomCheck = (symptom) => {
    navigate('/symptoms', { state: { initialSymptom: symptom } });
  };

  if (isLoading) {
    return (
      <div className="home-page loading">
        <div className="loading-content">
          <div className="loading-spinner">⏳</div>
          <p>載入中醫養生平台...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* 歡迎橫幅 */}
      <section className="welcome-banner">
        <div className="banner-content">
          <div className="welcome-text">
            <h1 className="platform-title">
              <span className="title-icon">🏥</span>
              東方醫學智慧中心
            </h1>
            <h2 className="greeting">{userGreeting}</h2>
            <p className="platform-subtitle">
              融合傳統中醫智慧與現代AI技術，為您提供個人化健康養生指導
            </p>
          </div>
          <div className="banner-stats">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">服務用戶</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">知識條目</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">合作醫師</div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能模組入口 */}
      <section className="modules-section">
        <h2 className="section-title">六大核心功能</h2>
        <div className="modules-grid">
          <div 
            className="module-card primary"
            onClick={() => navigateToModule('symptoms')}
          >
            <div className="module-icon">🩺</div>
            <h3 className="module-title">症狀查詢</h3>
            <p className="module-description">
              輸入症狀，AI智能分析，提供調理方向與改善建議
            </p>
            <div className="module-action">立即查詢 →</div>
          </div>

          <div 
            className="module-card"
            onClick={() => navigateToModule('constitution')}
          >
            <div className="module-icon">🔍</div>
            <h3 className="module-title">體質測驗</h3>
            <p className="module-description">
              九體質科學測評，了解個人體質特點
            </p>
            <div className="module-action">開始測驗 →</div>
          </div>

          <div 
            className="module-card"
            onClick={() => navigateToModule('knowledge')}
          >
            <div className="module-icon">📚</div>
            <h3 className="module-title">知識庫</h3>
            <p className="module-description">
              豐富的中醫養生知識，穴位、食療、四季養生
            </p>
            <div className="module-action">探索知識 →</div>
          </div>

          <div 
            className="module-card"
            onClick={() => navigateToModule('doctors')}
          >
            <div className="module-icon">👨‍⚕️</div>
            <h3 className="module-title">就診推薦</h3>
            <p className="module-description">
              根據症狀智能推薦合適的中醫師
            </p>
            <div className="module-action">尋找醫師 →</div>
          </div>

          <div 
            className="module-card"
            onClick={() => navigateToModule('assistant')}
          >
            <div className="module-icon">🤖</div>
            <h3 className="module-title">AI 小助理</h3>
            <p className="module-description">
              24小時中醫養生問答，您的專屬健康顧問
            </p>
            <div className="module-action">開始對話 →</div>
          </div>

          <div 
            className="module-card special"
            onClick={() => navigateToModule('analysis')}
          >
            <div className="module-icon">📊</div>
            <h3 className="module-title">健康分析</h3>
            <p className="module-description">
              綜合分析您的健康數據，提供個人化建議
            </p>
            <div className="module-action">查看報告 →</div>
          </div>
        </div>
      </section>

      {/* 養生小知識輪播 */}
      <section className="health-tips-section">
        <h2 className="section-title">每日養生小知識</h2>
        <div className="tips-carousel">
          {healthTips.length > 0 && (
            <div className="tip-card">
              <div className="tip-header">
                <div className="tip-category">
                  {healthTips[currentTipIndex]?.category || '養生知識'}
                </div>
                <div className="tip-indicators">
                  {healthTips.map((_, index) => (
                    <div
                      key={index}
                      className={`indicator ${index === currentTipIndex ? 'active' : ''}`}
                      onClick={() => setCurrentTipIndex(index)}
                    />
                  ))}
                </div>
              </div>
              <h3 className="tip-title">
                {healthTips[currentTipIndex]?.title}
              </h3>
              <p className="tip-content">
                {healthTips[currentTipIndex]?.content}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 今日AI推薦 */}
      <section className="recommendations-section">
        <h2 className="section-title">今日AI推薦</h2>
        <div className="recommendations-grid">
          {/* 體質建議 */}
          <div className="recommendation-card">
            <div className="rec-header">
              <h3 className="rec-title">
                <span className="rec-icon">🧘</span>
                體質調養
              </h3>
            </div>
            <div className="rec-content">
              <div className="constitution-type">
                {todayRecommendations?.constitution_tip?.type}
              </div>
              <p className="constitution-advice">
                {todayRecommendations?.constitution_tip?.suggestion}
              </p>
              <div className="food-suggestions">
                <h4>推薦食物：</h4>
                <div className="food-tags">
                  {todayRecommendations?.constitution_tip?.foods?.map((food, index) => (
                    <span key={index} className="food-tag">{food}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 季節養生 */}
          <div className="recommendation-card">
            <div className="rec-header">
              <h3 className="rec-title">
                <span className="rec-icon">🍂</span>
                {todayRecommendations?.seasonal_advice?.season}養生
              </h3>
            </div>
            <div className="rec-content">
              <div className="seasonal-focus">
                重點：{todayRecommendations?.seasonal_advice?.focus}
              </div>
              <ul className="seasonal-tips">
                {todayRecommendations?.seasonal_advice?.tips?.map((tip, index) => (
                  <li key={index} className="seasonal-tip">
                    <span className="tip-marker">▪</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 今日穴位 */}
          <div className="recommendation-card">
            <div className="rec-header">
              <h3 className="rec-title">
                <span className="rec-icon">👆</span>
                今日穴位
              </h3>
            </div>
            <div className="rec-content">
              <div className="acupoint-name">
                {todayRecommendations?.acupoint_of_day?.name}
              </div>
              <div className="acupoint-location">
                位置：{todayRecommendations?.acupoint_of_day?.location}
              </div>
              <div className="acupoint-benefits">
                <h4>功效：</h4>
                <div className="benefit-tags">
                  {todayRecommendations?.acupoint_of_day?.benefits?.map((benefit, index) => (
                    <span key={index} className="benefit-tag">{benefit}</span>
                  ))}
                </div>
              </div>
              <div className="acupoint-method">
                方法：{todayRecommendations?.acupoint_of_day?.method}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 熱門症狀查詢 */}
      <section className="popular-symptoms-section">
        <h2 className="section-title">熱門症狀查詢</h2>
        <div className="symptoms-grid">
          {popularSymptoms.map((symptom, index) => (
            <div
              key={index}
              className="symptom-card"
              onClick={() => quickSymptomCheck(symptom.name)}
            >
              <div className="symptom-name">{symptom.name}</div>
              <div className="symptom-stats">
                <span className="symptom-count">
                  {symptom.count} 次查詢
                </span>
                <span className={`symptom-trend ${symptom.trend}`}>
                  {symptom.trend === 'up' && '📈'}
                  {symptom.trend === 'down' && '📉'}
                  {symptom.trend === 'stable' && '➡️'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="symptoms-footer">
          <button
            onClick={() => navigateToModule('symptoms')}
            className="view-all-btn"
          >
            查看更多症狀 →
          </button>
        </div>
      </section>

      {/* 平台特色 */}
      <section className="features-section">
        <h2 className="section-title">平台特色</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🔬</div>
            <h3 className="feature-title">科學嚴謹</h3>
            <p className="feature-description">
              基於傳統中醫理論，結合現代醫學研究成果
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">個人化</h3>
            <p className="feature-description">
              AI智能分析，提供符合個人體質的專屬建議
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">安全可靠</h3>
            <p className="feature-description">
              嚴格遵循醫療安全規範，不提供診斷與處方
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🕒</div>
            <h3 className="feature-title">24小時服務</h3>
            <p className="feature-description">
              隨時隨地獲得專業的中醫養生指導
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;