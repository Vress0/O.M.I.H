import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './analysis.css';

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [canShare, setCanShare] = useState(false);

  // 從症狀頁面傳來的分析結果
  const initialResult = location.state?.analysisResult;

  useEffect(() => {
    if (initialResult) {
      setAnalysisResult(initialResult);
      loadRelatedContent(initialResult);
    } else {
      // 如果沒有分析結果，重定向到症狀頁面
      navigate('/symptoms');
    }

    // 檢查是否支持分享
    setCanShare(!!navigator.share);
  }, [initialResult, navigate]);

  const loadRelatedContent = async (result) => {
    setIsLoading(true);
    
    try {
      // 載入相關文章
      const articlesResponse = await apiService.getRelatedArticles({
        symptoms: result.symptoms,
        constitution: result.tcm_analysis?.constitution_type,
        specialties: result.recommended_specialties
      });
      
      if (articlesResponse.success) {
        setRelatedArticles(articlesResponse.data || []);
      }

    } catch (error) {
      console.error('載入相關內容失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await apiService.exportAnalysisReport(analysisResult);
      
      if (response.success && response.data) {
        // 創建下載連結
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `中醫分析報告_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('導出報告失敗:', error);
      alert('導出失敗，請稍後再試');
    }
  };

  const shareReport = async () => {
    if (!canShare) {
      // 備用方案：複製連結
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('報告連結已複製到剪貼簿');
      } catch (error) {
        alert('分享功能暫不可用');
      }
      return;
    }

    try {
      await navigator.share({
        title: '中醫症狀分析報告',
        text: `我的症狀分析結果：${analysisResult.symptoms?.slice(0, 3).join('、')}等`,
        url: window.location.href
      });
    } catch (error) {
      console.log('分享取消或失敗');
    }
  };

  const findDoctors = () => {
    navigate('/doctors', {
      state: {
        fromAnalysis: analysisResult,
        recommendedSpecialties: analysisResult.recommended_specialties
      }
    });
  };

  const retakeTest = () => {
    navigate('/symptoms');
  };

  const viewConstitutionTest = () => {
    navigate('/constitution');
  };

  if (!analysisResult) {
    return (
      <div className="analysis-page loading">
        <div className="loading-content">
          <div className="loading-spinner">⏳</div>
          <p>載入分析結果...</p>
        </div>
      </div>
    );
  }

  const getSeverityInfo = (severity) => {
    const levels = {
      'low': { text: '輕微', color: '#10b981', icon: '🟢', bgColor: '#ecfdf5' },
      'medium': { text: '中等', color: '#f59e0b', icon: '🟡', bgColor: '#fefbf2' },
      'high': { text: '較重', color: '#ef4444', icon: '🔴', bgColor: '#fef2f2' },
      'urgent': { text: '緊急', color: '#dc2626', icon: '🚨', bgColor: '#fef2f2' }
    };
    return levels[severity] || levels['low'];
  };

  const severityInfo = getSeverityInfo(analysisResult.severity || 'low');

  return (
    <div className="analysis-page">
      {/* 報告標題 */}
      <div className="report-header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="report-title">
              <span className="title-icon">📊</span>
              詳細分析報告
            </h1>
            <div className="header-actions">
              <button onClick={exportReport} className="export-btn">
                📥 導出報告
              </button>
              <button onClick={shareReport} className="share-btn">
                📤 分享
              </button>
            </div>
          </div>
          
          <div className="report-meta">
            <div className="meta-item">
              <span className="meta-label">分析時間：</span>
              <span className="meta-value">
                {analysisResult.analyzed_at || new Date().toLocaleString('zh-TW')}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">症狀數量：</span>
              <span className="meta-value">
                {analysisResult.symptoms?.length || 0} 個
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">嚴重程度：</span>
              <div 
                className="severity-badge-header"
                style={{ 
                  color: severityInfo.color,
                  backgroundColor: severityInfo.bgColor 
                }}
              >
                <span className="severity-icon">{severityInfo.icon}</span>
                <span className="severity-text">{severityInfo.text}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 導航標籤 */}
      <div className="report-tabs">
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            🔍 總覽分析
          </button>
          <button
            className={`tab-btn ${activeTab === 'tcm' ? 'active' : ''}`}
            onClick={() => setActiveTab('tcm')}
          >
            🏥 中醫理論
          </button>
          <button
            className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            💡 調理建議
          </button>
          <button
            className={`tab-btn ${activeTab === 'related' ? 'active' : ''}`}
            onClick={() => setActiveTab('related')}
          >
            📚 相關資訊
          </button>
        </div>
      </div>

      <div className="report-content">
        {/* 總覽分析 */}
        {activeTab === 'overview' && (
          <div className="tab-content overview-tab">
            {/* 症狀分析圖表 */}
            <div className="analysis-chart-section">
              <h2 className="section-title">症狀分析概覽</h2>
              <div className="chart-container">
                <div className="symptom-distribution">
                  <h3 className="chart-title">主要症狀分布</h3>
                  <div className="symptom-list-detailed">
                    {analysisResult.symptoms?.map((symptom, index) => (
                      <div key={index} className="symptom-item-detailed">
                        <div className="symptom-info">
                          <span className="symptom-name">{symptom}</span>
                          <span className="symptom-category">
                            {analysisResult.symptom_categories?.[symptom] || '一般症狀'}
                          </span>
                        </div>
                        <div className="symptom-score">
                          <div 
                            className="score-bar"
                            style={{ 
                              width: `${(analysisResult.symptom_scores?.[symptom] || 0.7) * 100}%` 
                            }}
                          ></div>
                          <span className="score-text">
                            {Math.round((analysisResult.symptom_scores?.[symptom] || 0.7) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="constitution-analysis">
                  <h3 className="chart-title">體質分析</h3>
                  <div className="constitution-chart">
                    <div className="constitution-main">
                      <div className="constitution-circle">
                        <div className="constitution-type-large">
                          {analysisResult.tcm_analysis?.constitution_type || '平和體質'}
                        </div>
                      </div>
                    </div>
                    <div className="constitution-details">
                      <div className="constitution-traits">
                        <h4>體質特徵：</h4>
                        <ul className="trait-list">
                          {analysisResult.tcm_analysis?.constitution_traits?.map((trait, index) => (
                            <li key={index} className="trait-item">
                              <span className="trait-marker">▪</span>
                              {trait}
                            </li>
                          )) || (
                            <li className="trait-item">
                              <span className="trait-marker">▪</span>
                              體質均衡，氣血調和
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 風險評估 */}
            <div className="risk-assessment-section">
              <h2 className="section-title">健康風險評估</h2>
              <div className="risk-grid">
                <div className="risk-item">
                  <div className="risk-icon">⚡</div>
                  <div className="risk-content">
                    <h3 className="risk-title">急性風險</h3>
                    <div className={`risk-level ${analysisResult.severity === 'urgent' ? 'high' : 'low'}`}>
                      {analysisResult.severity === 'urgent' ? '需要關注' : '風險較低'}
                    </div>
                    <p className="risk-description">
                      {analysisResult.severity === 'urgent' 
                        ? '建議盡快就醫檢查'
                        : '症狀相對溫和，注意日常調理即可'
                      }
                    </p>
                  </div>
                </div>

                <div className="risk-item">
                  <div className="risk-icon">📈</div>
                  <div className="risk-content">
                    <h3 className="risk-title">慢性風險</h3>
                    <div className="risk-level medium">
                      需要調理
                    </div>
                    <p className="risk-description">
                      建議通過中醫調理改善體質，預防疾病發展
                    </p>
                  </div>
                </div>

                <div className="risk-item">
                  <div className="risk-icon">🛡️</div>
                  <div className="risk-content">
                    <h3 className="risk-title">預防建議</h3>
                    <div className="risk-level good">
                      積極預防
                    </div>
                    <p className="risk-description">
                      通過生活方式調整和中醫養生可有效預防
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 行動建議 */}
            <div className="action-suggestions">
              <h2 className="section-title">推薦行動方案</h2>
              <div className="action-cards">
                <div className="action-card primary">
                  <div className="action-icon">👨‍⚕️</div>
                  <h3 className="action-title">尋找專業醫師</h3>
                  <p className="action-description">
                    基於您的症狀，我們推薦了合適的中醫師
                  </p>
                  <button onClick={findDoctors} className="action-btn primary">
                    查找醫師 →
                  </button>
                </div>

                <div className="action-card">
                  <div className="action-icon">🧘</div>
                  <h3 className="action-title">完善體質測試</h3>
                  <p className="action-description">
                    進行完整的九體質測試，獲得更精確的分析
                  </p>
                  <button onClick={viewConstitutionTest} className="action-btn">
                    體質測試 →
                  </button>
                </div>

                <div className="action-card">
                  <div className="action-icon">🔄</div>
                  <h3 className="action-title">重新症狀分析</h3>
                  <p className="action-description">
                    如症狀有變化，可重新進行分析
                  </p>
                  <button onClick={retakeTest} className="action-btn">
                    重新分析 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 中醫理論分析 */}
        {activeTab === 'tcm' && (
          <div className="tab-content tcm-tab">
            <div className="tcm-theory-section">
              <h2 className="section-title">中醫理論分析</h2>
              
              {/* 病機分析 */}
              <div className="theory-card">
                <h3 className="theory-title">
                  <span className="theory-icon">🔍</span>
                  病機分析
                </h3>
                <div className="theory-content">
                  <div className="pathology-analysis">
                    <div className="pathology-item">
                      <strong>證型：</strong>
                      <span className="pathology-text">
                        {analysisResult.tcm_analysis?.pattern || '氣血不調'}
                      </span>
                    </div>
                    <div className="pathology-item">
                      <strong>病位：</strong>
                      <div className="organ-system">
                        {analysisResult.tcm_analysis?.organ_systems?.map((organ, index) => (
                          <span key={index} className="organ-tag-detailed">
                            {organ}
                          </span>
                        )) || <span className="organ-tag-detailed">脾胃</span>}
                      </div>
                    </div>
                    <div className="pathology-item">
                      <strong>病性：</strong>
                      <span className="pathology-text">
                        {analysisResult.tcm_analysis?.pathology_nature || '虛實夾雜'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 五行分析 */}
              <div className="theory-card">
                <h3 className="theory-title">
                  <span className="theory-icon">☯️</span>
                  五行相關性分析
                </h3>
                <div className="five-elements-analysis">
                  <div className="elements-circle">
                    <div className="element wood">木</div>
                    <div className="element fire">火</div>
                    <div className="element earth">土</div>
                    <div className="element metal">金</div>
                    <div className="element water">水</div>
                  </div>
                  <div className="elements-description">
                    <h4>主要影響臟腑：</h4>
                    <div className="organ-elements">
                      {analysisResult.tcm_analysis?.five_elements_analysis?.map((item, index) => (
                        <div key={index} className="organ-element-item">
                          <span className="element-name">{item.element}</span>
                          <span className="element-organ">{item.organ}</span>
                          <span className="element-status">{item.status}</span>
                        </div>
                      )) || (
                        <div className="organ-element-item">
                          <span className="element-name">土</span>
                          <span className="element-organ">脾胃</span>
                          <span className="element-status">需要調理</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 氣血津液分析 */}
              <div className="theory-card">
                <h3 className="theory-title">
                  <span className="theory-icon">🌊</span>
                  氣血津液狀態
                </h3>
                <div className="qi-blood-analysis">
                  <div className="qi-blood-grid">
                    <div className="qi-blood-item">
                      <div className="qi-blood-icon">💨</div>
                      <div className="qi-blood-content">
                        <h4>氣的狀態</h4>
                        <div className="status-bar">
                          <div 
                            className="status-fill qi"
                            style={{ 
                              width: `${(analysisResult.tcm_analysis?.qi_status || 0.7) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="status-description">
                          {analysisResult.tcm_analysis?.qi_description || '氣機略有不暢，需要調理'}
                        </p>
                      </div>
                    </div>

                    <div className="qi-blood-item">
                      <div className="qi-blood-icon">🩸</div>
                      <div className="qi-blood-content">
                        <h4>血的狀態</h4>
                        <div className="status-bar">
                          <div 
                            className="status-fill blood"
                            style={{ 
                              width: `${(analysisResult.tcm_analysis?.blood_status || 0.6) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="status-description">
                          {analysisResult.tcm_analysis?.blood_description || '血液運行基本正常'}
                        </p>
                      </div>
                    </div>

                    <div className="qi-blood-item">
                      <div className="qi-blood-icon">💧</div>
                      <div className="qi-blood-content">
                        <h4>津液狀態</h4>
                        <div className="status-bar">
                          <div 
                            className="status-fill fluid"
                            style={{ 
                              width: `${(analysisResult.tcm_analysis?.fluid_status || 0.8) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="status-description">
                          {analysisResult.tcm_analysis?.fluid_description || '津液代謝良好'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 經絡分析 */}
              <div className="theory-card">
                <h3 className="theory-title">
                  <span className="theory-icon">🌐</span>
                  相關經絡分析
                </h3>
                <div className="meridian-analysis">
                  <div className="meridian-list">
                    {analysisResult.tcm_analysis?.affected_meridians?.map((meridian, index) => (
                      <div key={index} className="meridian-item">
                        <div className="meridian-name">{meridian.name}</div>
                        <div className="meridian-status">
                          <span className={`status-indicator ${meridian.status}`}>
                            {meridian.status === 'blocked' ? '阻塞' : 
                             meridian.status === 'weak' ? '虛弱' : '正常'}
                          </span>
                        </div>
                        <div className="meridian-description">{meridian.description}</div>
                      </div>
                    )) || (
                      <div className="meridian-item">
                        <div className="meridian-name">足陽明胃經</div>
                        <div className="meridian-status">
                          <span className="status-indicator weak">虛弱</span>
                        </div>
                        <div className="meridian-description">與消化系統症狀相關</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 調理建議 */}
        {activeTab === 'suggestions' && (
          <div className="tab-content suggestions-tab">
            <div className="suggestions-detailed">
              <h2 className="section-title">個人化調理方案</h2>

              {/* 生活方式調理 */}
              <div className="suggestion-section">
                <h3 className="suggestion-section-title">
                  <span className="suggestion-icon">🏠</span>
                  生活方式調理
                </h3>
                <div className="lifestyle-suggestions">
                  <div className="suggestion-category-detailed">
                    <h4>作息調整</h4>
                    <div className="suggestion-items">
                      {analysisResult.lifestyle_suggestions?.filter(s => 
                        s.includes('睡眠') || s.includes('作息') || s.includes('休息')
                      ).map((suggestion, index) => (
                        <div key={index} className="suggestion-item-detailed">
                          <span className="suggestion-check">✓</span>
                          <span className="suggestion-text">{suggestion}</span>
                        </div>
                      )) || (
                        <div className="suggestion-item-detailed">
                          <span className="suggestion-check">✓</span>
                          <span className="suggestion-text">保持規律作息，早睡早起</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="suggestion-category-detailed">
                    <h4>運動建議</h4>
                    <div className="exercise-recommendations">
                      <div className="exercise-card">
                        <div className="exercise-name">太極拳</div>
                        <div className="exercise-benefits">調和氣血、舒筋活絡</div>
                        <div className="exercise-frequency">每日 30 分鐘</div>
                      </div>
                      <div className="exercise-card">
                        <div className="exercise-name">八段錦</div>
                        <div className="exercise-benefits">強身健體、調理臟腑</div>
                        <div className="exercise-frequency">每日 20 分鐘</div>
                      </div>
                      <div className="exercise-card">
                        <div className="exercise-name">散步</div>
                        <div className="exercise-benefits">促進消化、放鬆心情</div>
                        <div className="exercise-frequency">飯後 15 分鐘</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 飲食調理 */}
              <div className="suggestion-section">
                <h3 className="suggestion-section-title">
                  <span className="suggestion-icon">🍽️</span>
                  飲食調理方案
                </h3>
                <div className="dietary-suggestions-detailed">
                  <div className="dietary-principles">
                    <h4>飲食原則</h4>
                    <div className="principles-grid">
                      {analysisResult.dietary_suggestions?.map((suggestion, index) => (
                        <div key={index} className="principle-card">
                          <div className="principle-text">{suggestion}</div>
                        </div>
                      )) || (
                        <div className="principle-card">
                          <div className="principle-text">飲食清淡，定時定量</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="food-recommendations">
                    <div className="food-category">
                      <h4 className="food-category-title">推薦食物</h4>
                      <div className="food-list recommended">
                        <div className="food-item">山藥 - 健脾益氣</div>
                        <div className="food-item">紅棗 - 補血養心</div>
                        <div className="food-item">薏米 - 健脾祛濕</div>
                        <div className="food-item">百合 - 潤肺止咳</div>
                      </div>
                    </div>

                    <div className="food-category">
                      <h4 className="food-category-title">避免食物</h4>
                      <div className="food-list avoid">
                        <div className="food-item">生冷食物 - 損傷脾胃</div>
                        <div className="food-item">辛辣刺激 - 耗傷津液</div>
                        <div className="food-item">油膩厚味 - 阻礙氣機</div>
                        <div className="food-item">過度甜食 - 生痰助濕</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 穴位按摩 */}
              <div className="suggestion-section">
                <h3 className="suggestion-section-title">
                  <span className="suggestion-icon">👆</span>
                  穴位按摩指導
                </h3>
                <div className="acupoint-guide">
                  {analysisResult.acupoint_suggestions?.map((point, index) => (
                    <div key={index} className="acupoint-card-detailed">
                      <div className="acupoint-header">
                        <div className="acupoint-name-large">{point.name || point}</div>
                        <div className="acupoint-category">
                          {point.category || '常用穴位'}
                        </div>
                      </div>
                      <div className="acupoint-details">
                        <div className="acupoint-location-detailed">
                          <strong>位置：</strong>
                          {point.location || '請諮詢專業人士'}
                        </div>
                        <div className="acupoint-benefits-detailed">
                          <strong>功效：</strong>
                          {point.benefits || '調理氣血，緩解症狀'}
                        </div>
                        <div className="acupoint-method-detailed">
                          <strong>按摩方法：</strong>
                          {point.method || '每次按摩3-5分鐘，力度適中'}
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="acupoint-card-detailed">
                      <div className="acupoint-header">
                        <div className="acupoint-name-large">足三里</div>
                        <div className="acupoint-category">保健要穴</div>
                      </div>
                      <div className="acupoint-details">
                        <div className="acupoint-location-detailed">
                          <strong>位置：</strong>外膝眼下3寸，脛骨前緣外側一橫指處
                        </div>
                        <div className="acupoint-benefits-detailed">
                          <strong>功效：</strong>健脾和胃，調理氣血，增強免疫力
                        </div>
                        <div className="acupoint-method-detailed">
                          <strong>按摩方法：</strong>每日早晚各按摩5分鐘，以酸脹感為宜
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 情志調攝 */}
              <div className="suggestion-section">
                <h3 className="suggestion-section-title">
                  <span className="suggestion-icon">🧠</span>
                  情志調攝
                </h3>
                <div className="emotional-guidance">
                  <div className="emotional-principles">
                    <div className="emotional-card">
                      <h4>情緒管理</h4>
                      <ul className="emotional-list">
                        <li>保持心情舒暢，避免過度憂慮</li>
                        <li>適當表達情緒，不要壓抑內心感受</li>
                        <li>培養興趣愛好，豐富精神生活</li>
                      </ul>
                    </div>
                    <div className="emotional-card">
                      <h4>放鬆技巧</h4>
                      <ul className="emotional-list">
                        <li>練習深呼吸，緩解緊張情緒</li>
                        <li>進行冥想或靜坐，寧心安神</li>
                        <li>聽舒緩音樂，調節心境</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 相關資訊 */}
        {activeTab === 'related' && (
          <div className="tab-content related-tab">
            <div className="related-content">
              <h2 className="section-title">相關知識與資源</h2>

              {/* 相關文章 */}
              <div className="related-articles-section">
                <h3 className="subsection-title">推薦閱讀文章</h3>
                {isLoading ? (
                  <div className="loading-related">載入相關文章...</div>
                ) : relatedArticles.length > 0 ? (
                  <div className="articles-grid">
                    {relatedArticles.map((article, index) => (
                      <div key={index} className="article-card-small">
                        <h4 className="article-title-small">{article.title}</h4>
                        <p className="article-excerpt-small">{article.excerpt}</p>
                        <div className="article-meta-small">
                          <span className="article-category">{article.category}</span>
                          <span className="article-read-time">{article.readTime}</span>
                        </div>
                        <button 
                          onClick={() => navigate(`/knowledge/${article.id}`)}
                          className="read-article-btn"
                        >
                          閱讀全文
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-related-articles">
                    <p>暫無相關文章，建議查看知識庫獲取更多資訊</p>
                    <button 
                      onClick={() => navigate('/knowledge')}
                      className="browse-knowledge-btn"
                    >
                      瀏覽知識庫
                    </button>
                  </div>
                )}
              </div>

              {/* 追蹤建議 */}
              <div className="follow-up-section">
                <h3 className="subsection-title">後續追蹤建議</h3>
                <div className="follow-up-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker immediate"></div>
                    <div className="timeline-content">
                      <h4>立即行動（1-3天）</h4>
                      <ul>
                        <li>開始執行飲食調理建議</li>
                        <li>調整作息時間</li>
                        <li>學習推薦的穴位按摩手法</li>
                      </ul>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker short-term"></div>
                    <div className="timeline-content">
                      <h4>短期目標（1-2週）</h4>
                      <ul>
                        <li>如症狀嚴重，安排中醫師就診</li>
                        <li>完成體質測驗，獲得更精確指導</li>
                        <li>建立規律的運動習慣</li>
                      </ul>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker long-term"></div>
                    <div className="timeline-content">
                      <h4>長期維護（1個月以上）</h4>
                      <ul>
                        <li>定期重新評估症狀變化</li>
                        <li>持續學習中醫養生知識</li>
                        <li>建立健康的生活方式</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 專業資源 */}
              <div className="professional-resources">
                <h3 className="subsection-title">專業資源</h3>
                <div className="resources-grid">
                  <div className="resource-card">
                    <div className="resource-icon">👨‍⚕️</div>
                    <h4>專業醫師</h4>
                    <p>尋找附近的專業中醫師進行面診</p>
                    <button onClick={findDoctors} className="resource-btn">
                      查找醫師
                    </button>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">📚</div>
                    <h4>知識庫</h4>
                    <p>瀏覽更多中醫養生相關知識</p>
                    <button 
                      onClick={() => navigate('/knowledge')}
                      className="resource-btn"
                    >
                      瀏覽知識
                    </button>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">🤖</div>
                    <h4>AI 助理</h4>
                    <p>隨時諮詢中醫養生相關問題</p>
                    <button 
                      onClick={() => navigate('/assistant')}
                      className="resource-btn"
                    >
                      開始對話
                    </button>
                  </div>

                  <div className="resource-card">
                    <div className="resource-icon">🔍</div>
                    <h4>體質測驗</h4>
                    <p>完善的九體質測驗分析</p>
                    <button onClick={viewConstitutionTest} className="resource-btn">
                      開始測驗
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;