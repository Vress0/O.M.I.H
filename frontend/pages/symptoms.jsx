import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SymptomInputBox from '../components/SymptomInputBox';
import apiService from '../services/api';
import './symptoms.css';

const SymptomsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // 從首頁帶來的初始症狀
  const initialSymptom = location.state?.initialSymptom || '';

  useEffect(() => {
    loadSymptomHistory();
    
    // 如果有初始症狀，自動填入
    if (initialSymptom) {
      // 這裡可以觸發自動分析或只是填入症狀
      console.log('初始症狀:', initialSymptom);
    }
  }, [initialSymptom]);

  const loadSymptomHistory = async () => {
    try {
      const response = await apiService.getSymptomHistory();
      if (response.success && response.data) {
        setSymptomHistory(response.data.slice(0, 10)); // 只顯示最近10次
      }
    } catch (error) {
      console.error('載入症狀歷史失敗:', error);
    }
  };

  // 處理症狀提交和分析
  const handleSymptomsSubmit = async (symptoms, result) => {
    setIsAnalyzing(true);
    
    try {
      if (result) {
        // 如果已經有結果，直接使用
        setAnalysisResult(result);
      } else {
        // 否則重新分析
        const analysisResponse = await apiService.analyzeSymptoms(symptoms);
        if (analysisResponse.success) {
          setAnalysisResult(analysisResponse.data);
        } else {
          throw new Error(analysisResponse.message || '分析失敗');
        }
      }
      
      // 更新歷史記錄
      await loadSymptomHistory();
      
    } catch (error) {
      console.error('症狀分析失敗:', error);
      alert('分析過程中發生錯誤，請稍後再試');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 查看完整分析結果
  const viewFullAnalysis = () => {
    navigate('/analysis', { state: { analysisResult } });
  };

  // 查找推薦醫師
  const findDoctors = () => {
    navigate('/doctors', { 
      state: { 
        fromSymptoms: analysisResult?.symptoms || [],
        recommendedSpecialties: analysisResult?.recommended_specialties || []
      } 
    });
  };

  // 從歷史記錄重新分析
  const reAnalyzeFromHistory = async (historyItem) => {
    setIsAnalyzing(true);
    
    try {
      const symptoms = historyItem.symptoms || [];
      await handleSymptomsSubmit(symptoms);
    } catch (error) {
      console.error('重新分析失敗:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 清除分析結果
  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  // 獲取症狀嚴重度指示
  const getSeverityInfo = (severity) => {
    const levels = {
      'low': { text: '輕微', color: '#10b981', icon: '🟢' },
      'medium': { text: '中等', color: '#f59e0b', icon: '🟡' },
      'high': { text: '較重', color: '#ef4444', icon: '🔴' },
      'urgent': { text: '緊急', color: '#dc2626', icon: '🚨' }
    };
    return levels[severity] || levels['low'];
  };

  return (
    <div className="symptoms-page">
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">🩺</span>
            中醫症狀查詢系統
          </h1>
          <p className="page-description">
            輸入您的身體症狀，AI 將基於中醫理論為您分析可能的調理方向與改善建議
          </p>
          
          {/* 操作按鈕 */}
          <div className="page-actions">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="history-btn"
            >
              📋 查詢歷史 {showHistory ? '▼' : '▶'}
            </button>
            
            {analysisResult && (
              <button
                onClick={clearAnalysis}
                className="clear-btn"
              >
                🔄 重新查詢
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 症狀歷史 */}
      {showHistory && (
        <div className="history-section">
          <h2 className="history-title">最近查詢記錄</h2>
          {symptomHistory.length > 0 ? (
            <div className="history-list">
              {symptomHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <div className="history-info">
                    <div className="history-symptoms">
                      {item.symptoms?.slice(0, 3).join('、') || '未知症狀'}
                      {item.symptoms?.length > 3 && ` 等${item.symptoms.length}個症狀`}
                    </div>
                    <div className="history-date">
                      {item.date || '最近'}
                    </div>
                  </div>
                  <button
                    onClick={() => reAnalyzeFromHistory(item)}
                    disabled={isAnalyzing}
                    className="reanalyze-btn"
                  >
                    重新分析
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-history">
              <span className="no-history-icon">📝</span>
              <span className="no-history-text">尚無查詢記錄</span>
            </div>
          )}
        </div>
      )}

      <div className="main-content">
        {/* 症狀輸入區域 */}
        {!analysisResult && (
          <div className="input-section">
            <SymptomInputBox
              onSymptomsSubmit={handleSymptomsSubmit}
              initialSymptoms={initialSymptom ? [initialSymptom] : []}
            />
          </div>
        )}

        {/* 載入分析狀態 */}
        {isAnalyzing && (
          <div className="analyzing-section">
            <div className="analyzing-content">
              <div className="analyzing-spinner">🧠</div>
              <h2 className="analyzing-title">AI 正在分析您的症狀...</h2>
              <p className="analyzing-description">
                基於中醫理論進行智能分析，請稍候片刻
              </p>
              <div className="analyzing-steps">
                <div className="step active">🔍 解析症狀特征</div>
                <div className="step active">🏥 匹配中醫理論</div>
                <div className="step active">💡 生成調理建議</div>
              </div>
            </div>
          </div>
        )}

        {/* 分析結果 */}
        {analysisResult && !isAnalyzing && (
          <div className="analysis-section">
            <div className="result-header">
              <h2 className="result-title">
                <span className="result-icon">📊</span>
                AI 分析結果
              </h2>
              <div className="result-actions">
                <button
                  onClick={viewFullAnalysis}
                  className="detail-btn"
                >
                  📋 詳細報告
                </button>
                <button
                  onClick={findDoctors}
                  className="doctor-btn"
                >
                  👨‍⚕️ 尋找醫師
                </button>
              </div>
            </div>

            <div className="result-content">
              {/* 症狀摘要 */}
              <div className="result-card summary-card">
                <h3 className="card-title">
                  <span className="card-icon">📝</span>
                  症狀摘要
                </h3>
                <div className="symptoms-summary">
                  <div className="submitted-symptoms">
                    <strong>您提及的症狀：</strong>
                    <div className="symptom-tags">
                      {(analysisResult.symptoms || []).map((symptom, index) => (
                        <span key={index} className="symptom-tag">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {analysisResult.severity && (
                    <div className="severity-info">
                      <strong>嚴重程度評估：</strong>
                      <div className="severity-badge">
                        <span className="severity-icon">
                          {getSeverityInfo(analysisResult.severity).icon}
                        </span>
                        <span 
                          className="severity-text"
                          style={{ color: getSeverityInfo(analysisResult.severity).color }}
                        >
                          {getSeverityInfo(analysisResult.severity).text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 中醫分析 */}
              <div className="result-card analysis-card">
                <h3 className="card-title">
                  <span className="card-icon">🔍</span>
                  中醫理論分析
                </h3>
                <div className="tcm-analysis">
                  {analysisResult.tcm_analysis?.constitution_type && (
                    <div className="analysis-item">
                      <strong>體質類型：</strong>
                      <span className="constitution-type">
                        {analysisResult.tcm_analysis.constitution_type}
                      </span>
                    </div>
                  )}
                  
                  {analysisResult.tcm_analysis?.pattern && (
                    <div className="analysis-item">
                      <strong>證型分析：</strong>
                      <span className="pattern-text">
                        {analysisResult.tcm_analysis.pattern}
                      </span>
                    </div>
                  )}
                  
                  {analysisResult.tcm_analysis?.organ_systems && (
                    <div className="analysis-item">
                      <strong>相關臟腑：</strong>
                      <div className="organ-tags">
                        {analysisResult.tcm_analysis.organ_systems.map((organ, index) => (
                          <span key={index} className="organ-tag">
                            {organ}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 調理建議 */}
              <div className="result-card suggestions-card">
                <h3 className="card-title">
                  <span className="card-icon">💡</span>
                  調理建議
                </h3>
                <div className="suggestions-content">
                  {analysisResult.lifestyle_suggestions && (
                    <div className="suggestion-category">
                      <h4 className="suggestion-title">生活調理</h4>
                      <ul className="suggestion-list">
                        {analysisResult.lifestyle_suggestions.map((suggestion, index) => (
                          <li key={index} className="suggestion-item">
                            <span className="suggestion-marker">▪</span>
                            <span className="suggestion-text">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.dietary_suggestions && (
                    <div className="suggestion-category">
                      <h4 className="suggestion-title">飲食建議</h4>
                      <ul className="suggestion-list">
                        {analysisResult.dietary_suggestions.map((suggestion, index) => (
                          <li key={index} className="suggestion-item">
                            <span className="suggestion-marker">▪</span>
                            <span className="suggestion-text">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysisResult.acupoint_suggestions && (
                    <div className="suggestion-category">
                      <h4 className="suggestion-title">穴位調理</h4>
                      <div className="acupoint-grid">
                        {analysisResult.acupoint_suggestions.map((point, index) => (
                          <div key={index} className="acupoint-item">
                            <span className="acupoint-name">{point.name || point}</span>
                            {point.location && (
                              <span className="acupoint-location">{point.location}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 推薦科別 */}
              {analysisResult.recommended_specialties && (
                <div className="result-card specialties-card">
                  <h3 className="card-title">
                    <span className="card-icon">🏥</span>
                    建議就診科別
                  </h3>
                  <div className="specialties-content">
                    <div className="specialty-tags">
                      {analysisResult.recommended_specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <p className="specialty-note">
                      💡 建議諮詢以上科別的中醫師，獲得更專業的診療意見
                    </p>
                  </div>
                </div>
              )}

              {/* 注意事項 */}
              <div className="result-card warning-card">
                <h3 className="card-title">
                  <span className="card-icon">⚠️</span>
                  重要提醒
                </h3>
                <div className="warning-content">
                  <ul className="warning-list">
                    <li className="warning-item">
                      本分析結果僅供參考，不能替代專業醫師診斷
                    </li>
                    <li className="warning-item">
                      如症狀持續或加重，請及時就醫
                    </li>
                    <li className="warning-item">
                      建議在醫師指導下進行調理
                    </li>
                    {analysisResult.severity === 'urgent' && (
                      <li className="warning-item urgent">
                        🚨 您的症狀可能較為嚴重，建議立即就醫！
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomsPage;