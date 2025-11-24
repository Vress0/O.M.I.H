import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConstitutionForm from '../components/ConstitutionForm';
import apiService from '../services/api';
import './constitution.css';

const ConstitutionPage = () => {
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [progress, setProgress] = useState(0);

  // 九種體質問卷題目
  const constitutionQuestions = [
    {
      category: '平和質',
      questions: [
        {
          id: 'peaceful_1',
          text: '您精力充沛嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'peaceful_2', 
          text: '您容易疲勞嗎？',
          options: ['完全符合', '比較符合', '有些符合', '基本不符合', '完全不符合']
        },
        {
          id: 'peaceful_3',
          text: '您說話聲音有力嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '氣虛質',
      questions: [
        {
          id: 'qi_deficiency_1',
          text: '您容易呼吸急促，接不上氣嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'qi_deficiency_2',
          text: '您容易心慌嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'qi_deficiency_3',
          text: '您容易頭暈或站立時眼前發黑嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '陽虛質',
      questions: [
        {
          id: 'yang_deficiency_1',
          text: '您手腳發涼嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'yang_deficiency_2',
          text: '您胃脘部、背部或腰膝部怕冷嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'yang_deficiency_3',
          text: '您比別人耐受不了寒冷（冬天的寒冷、夏天的冷空調、電扇等）嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '陰虛質',
      questions: [
        {
          id: 'yin_deficiency_1',
          text: '您手心、腳心發熱嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'yin_deficiency_2',
          text: '您身體、臉上發熱嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'yin_deficiency_3',
          text: '您皮膚或口唇乾嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '痰濕質',
      questions: [
        {
          id: 'phlegm_dampness_1',
          text: '您腹部肥滿鬆軟嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'phlegm_dampness_2',
          text: '您額頭油膩嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'phlegm_dampness_3',
          text: '您上眼皮比別人腫嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '濕熱質',
      questions: [
        {
          id: 'damp_heat_1',
          text: '您面部或鼻部有油膩感或者油亮發光嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'damp_heat_2',
          text: '您容易生痤瘡或瘡癤嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'damp_heat_3',
          text: '您感到口苦或嘴裡有異味嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '血瘀質',
      questions: [
        {
          id: 'blood_stasis_1',
          text: '您皮膚在不知不覺中會出現青紫瘀斑（皮下出血）嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'blood_stasis_2',
          text: '您兩顴部有細絡血絲嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'blood_stasis_3',
          text: '您嘴唇顏色偏暗嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '氣鬱質',
      questions: [
        {
          id: 'qi_stagnation_1',
          text: '您感到悶悶不樂、情緒低沉嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'qi_stagnation_2',
          text: '您容易精神緊張、焦慮不安嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'qi_stagnation_3',
          text: '您多愁善感、感情脆弱嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    },
    {
      category: '特稟質',
      questions: [
        {
          id: 'special_1',
          text: '您沒有感冒時也會打噴嚏嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'special_2',
          text: '您容易過敏（對藥物、食物、氣味、花粉或在季節交替時）嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        },
        {
          id: 'special_3',
          text: '您皮膚容易起蕁麻疹（風團、風疹塊、風疙瘩）嗎？',
          options: ['完全不符合', '基本不符合', '有些符合', '比較符合', '完全符合']
        }
      ]
    }
  ];

  const totalQuestions = constitutionQuestions.reduce((sum, category) => sum + category.questions.length, 0);

  useEffect(() => {
    loadTestHistory();
    
    // 計算進度
    const answeredCount = Object.keys(answers).length;
    setProgress((answeredCount / totalQuestions) * 100);
  }, [answers]);

  const loadTestHistory = async () => {
    try {
      const response = await apiService.getConstitutionHistory();
      if (response.success) {
        setTestHistory(response.data || []);
      }
    } catch (error) {
      console.error('載入檢測歷史失敗:', error);
      // 從本地存儲載入
      const localHistory = localStorage.getItem('constitutionHistory');
      if (localHistory) {
        setTestHistory(JSON.parse(localHistory));
      }
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getCurrentCategoryQuestions = () => {
    return constitutionQuestions[currentStep] || { questions: [] };
  };

  const isCurrentStepComplete = () => {
    const currentCategory = getCurrentCategoryQuestions();
    return currentCategory.questions.every(q => answers[q.id] !== undefined);
  };

  const goToNextStep = () => {
    if (currentStep < constitutionQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      analyzeConstitution();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const analyzeConstitution = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await apiService.analyzeConstitution(answers);
      
      if (response.success) {
        const analysisResult = response.data;
        setResult(analysisResult);
        
        // 保存到歷史記錄
        const newRecord = {
          id: Date.now(),
          date: new Date().toISOString(),
          result: analysisResult,
          answers: answers
        };
        
        const updatedHistory = [newRecord, ...testHistory];
        setTestHistory(updatedHistory);
        localStorage.setItem('constitutionHistory', JSON.stringify(updatedHistory));
      } else {
        // 使用本地分析
        const localResult = calculateLocalConstitution();
        setResult(localResult);
      }
    } catch (error) {
      console.error('體質分析失敗:', error);
      const localResult = calculateLocalConstitution();
      setResult(localResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateLocalConstitution = () => {
    const scores = {};
    
    // 計算各體質得分
    constitutionQuestions.forEach((category, categoryIndex) => {
      let totalScore = 0;
      category.questions.forEach(question => {
        const answer = answers[question.id] || 0;
        totalScore += answer;
      });
      
      const maxPossibleScore = category.questions.length * 4;
      const percentage = (totalScore / maxPossibleScore) * 100;
      
      scores[category.category] = {
        score: totalScore,
        percentage: Math.round(percentage),
        level: getConstitutionLevel(percentage)
      };
    });

    // 找出主要體質
    const sortedTypes = Object.entries(scores)
      .sort(([,a], [,b]) => b.percentage - a.percentage);
    
    const primaryType = sortedTypes[0];
    const secondaryType = sortedTypes[1];

    return {
      primary_constitution: {
        type: primaryType[0],
        percentage: primaryType[1].percentage,
        level: primaryType[1].level
      },
      secondary_constitution: secondaryType[1].percentage >= 30 ? {
        type: secondaryType[0],
        percentage: secondaryType[1].percentage,
        level: secondaryType[1].level
      } : null,
      all_scores: scores,
      analysis_date: new Date().toISOString(),
      recommendations: getConstitutionRecommendations(primaryType[0]),
      lifestyle_advice: getLifestyleAdvice(primaryType[0]),
      dietary_suggestions: getDietarySuggestions(primaryType[0])
    };
  };

  const getConstitutionLevel = (percentage) => {
    if (percentage >= 70) return '明顯';
    if (percentage >= 50) return '比較明顯';
    if (percentage >= 30) return '有傾向';
    return '基本正常';
  };

  const getConstitutionRecommendations = (constitution) => {
    const recommendations = {
      '平和質': ['保持現有生活方式', '適量運動', '規律作息', '均衡飲食'],
      '氣虛質': ['補氣為主', '避免過度勞累', '多食補氣食物', '適當運動但不宜過激'],
      '陽虛質': ['溫陽散寒', '注意保暖', '多曬太陽', '少食生冷食物'],
      '陰虛質': ['滋陰潤燥', '避免熬夜', '多食滋陰食物', '保持情緒穩定'],
      '痰濕質': ['化痰祛濕', '控制體重', '清淡飲食', '多運動促進代謝'],
      '濕熱質': ['清熱利濕', '避免油膩食物', '多食清熱食物', '保持環境乾燥'],
      '血瘀質': ['活血化瘀', '多運動促進血液循環', '避免久坐', '保持心情愉快'],
      '氣鬱質': ['疏肝理氣', '調節情緒', '多參與社交活動', '聽音樂放鬆心情'],
      '特稟質': ['預防過敏', '避免過敏原', '增強體質', '規律生活']
    };
    return recommendations[constitution] || [];
  };

  const getLifestyleAdvice = (constitution) => {
    const advice = {
      '平和質': '保持規律作息，適量運動，心情愉快',
      '氣虛質': '避免過度勞累，適當午休，選擇和緩的運動方式',
      '陽虛質': '注意保暖，特别是腹部和腰部，避免在寒冷環境中久留',
      '陰虛質': '避免熬夜，保證充足睡眠，避免劇烈運動',
      '痰濕質': '居住環境要乾燥，多做有氧運動，控制體重',
      '濕熱質': '保持環境通風乾燥，避免過度出汗，穿著寬鬆透氣衣物',
      '血瘀質': '多做促進血液循環的運動，避免久坐久立',
      '氣鬱質': '多參與社交活動，培養興趣愛好，學會放鬆技巧',
      '特稟質': '避免接觸過敏原，保持居住環境清潔，增強免疫力'
    };
    return advice[constitution] || '';
  };

  const getDietarySuggestions = (constitution) => {
    const suggestions = {
      '平和質': ['五穀雜糧', '新鮮蔬果', '適量肉類', '清淡為主'],
      '氣虛質': ['黃耆', '人參', '大棗', '山藥', '小米粥'],
      '陽虛質': ['羊肉', '生薑', '肉桂', '核桃', '韭菜'],
      '陰虛質': ['銀耳', '百合', '枸杞', '蜂蜜', '梨子'],
      '痰濕質': ['薏仁', '白蘿蔔', '冬瓜', '海帶', '綠豆'],
      '濕熱質': ['綠豆', '苦瓜', '黃瓜', '西瓜', '薏仁'],
      '血瘀質': ['紅花', '桃仁', '山楂', '紅酒', '黑豆'],
      '氣鬱質': ['玫瑰花茶', '柑橘', '佛手', '薄荷', '柴胡'],
      '特稟質': ['益氣固表的食物', '避免已知過敏食物', '增強體質的藥膳']
    };
    return suggestions[constitution] || [];
  };

  const resetTest = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setProgress(0);
  };

  const viewHistoryResult = (historyItem) => {
    setResult(historyItem.result);
    setShowHistory(false);
  };

  if (result) {
    return (
      <div className="constitution-page">
        <div className="result-container">
          <div className="result-header">
            <h1 className="result-title">
              <span className="title-icon">🧬</span>
              您的體質分析結果
            </h1>
            <div className="result-actions">
              <button onClick={resetTest} className="restart-btn">
                🔄 重新檢測
              </button>
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="history-btn"
              >
                📊 歷史記錄
              </button>
            </div>
          </div>

          <div className="result-content">
            {/* 主要體質 */}
            <div className="primary-constitution">
              <div className="constitution-card primary">
                <div className="constitution-header">
                  <h2 className="constitution-name">
                    {result.primary_constitution.type}
                  </h2>
                  <div className="constitution-percentage">
                    {result.primary_constitution.percentage}%
                  </div>
                </div>
                <div className="constitution-level">
                  程度：{result.primary_constitution.level}
                </div>
                <div className="constitution-description">
                  您的主要體質類型，需要重點調理
                </div>
              </div>
            </div>

            {/* 次要體質 */}
            {result.secondary_constitution && (
              <div className="secondary-constitution">
                <div className="constitution-card secondary">
                  <div className="constitution-header">
                    <h3 className="constitution-name">
                      {result.secondary_constitution.type}
                    </h3>
                    <div className="constitution-percentage">
                      {result.secondary_constitution.percentage}%
                    </div>
                  </div>
                  <div className="constitution-level">
                    程度：{result.secondary_constitution.level}
                  </div>
                  <div className="constitution-description">
                    您的次要體質傾向，也需適當注意
                  </div>
                </div>
              </div>
            )}

            {/* 詳細分析 */}
            <div className="detailed-analysis">
              <h3 className="section-title">📊 九種體質得分</h3>
              <div className="scores-grid">
                {Object.entries(result.all_scores).map(([type, data]) => (
                  <div key={type} className="score-item">
                    <div className="score-header">
                      <span className="score-type">{type}</span>
                      <span className="score-percentage">{data.percentage}%</span>
                    </div>
                    <div className="score-bar">
                      <div 
                        className="score-fill"
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                    <div className="score-level">{data.level}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 調理建議 */}
            <div className="recommendations">
              <h3 className="section-title">💡 調理建議</h3>
              <div className="recommendations-grid">
                <div className="recommendation-card">
                  <h4 className="recommendation-title">
                    <span className="recommendation-icon">🏥</span>
                    中醫調理
                  </h4>
                  <ul className="recommendation-list">
                    {result.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div className="recommendation-card">
                  <h4 className="recommendation-title">
                    <span className="recommendation-icon">🌱</span>
                    生活方式
                  </h4>
                  <p className="lifestyle-advice">{result.lifestyle_advice}</p>
                </div>

                <div className="recommendation-card">
                  <h4 className="recommendation-title">
                    <span className="recommendation-icon">🍎</span>
                    飲食建議
                  </h4>
                  <div className="dietary-suggestions">
                    {result.dietary_suggestions.map((food, index) => (
                      <span key={index} className="food-tag">{food}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="result-actions-bottom">
              <button 
                onClick={() => navigate('/doctors', { 
                  state: { 
                    fromAnalysis: result,
                    recommendedSpecialties: ['中醫內科', '體質調理'] 
                  }
                })}
                className="find-doctor-btn"
              >
                🏥 尋找中醫師
              </button>
              <button 
                onClick={() => navigate('/knowledge')}
                className="learn-more-btn"
              >
                📚 了解更多
              </button>
              <button 
                onClick={() => navigate('/assistant')}
                className="consult-ai-btn"
              >
                🤖 AI 諮詢
              </button>
            </div>
          </div>
        </div>

        {/* 歷史記錄面板 */}
        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3 className="history-title">檢測歷史</h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="close-history-btn"
              >
                ✕
              </button>
            </div>
            <div className="history-list">
              {testHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-info">
                    <div className="history-date">
                      {new Date(item.date).toLocaleDateString('zh-TW')}
                    </div>
                    <div className="history-constitution">
                      主要體質：{item.result.primary_constitution.type}
                    </div>
                  </div>
                  <button 
                    onClick={() => viewHistoryResult(item)}
                    className="view-result-btn"
                  >
                    查看結果
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="constitution-page analyzing">
        <div className="analyzing-content">
          <div className="analyzing-animation">🧬</div>
          <h2 className="analyzing-title">正在分析您的體質...</h2>
          <p className="analyzing-description">
            基於中醫九種體質理論進行綜合分析
          </p>
          <div className="analyzing-progress">
            <div className="progress-bar">
              <div className="progress-fill analyzing-fill"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="constitution-page">
      <div className="test-container">
        {/* 頁面標題 */}
        <div className="page-header">
          <h1 className="page-title">
            <span className="title-icon">🧬</span>
            中醫九種體質檢測
          </h1>
          <p className="page-description">
            通過專業問卷了解您的體質類型，獲得個性化的養生調理建議
          </p>
        </div>

        {/* 進度指示器 */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">
              第 {currentStep + 1} 部分，共 {constitutionQuestions.length} 部分
            </span>
            <span className="progress-percentage">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="steps-indicator">
            {constitutionQuestions.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index <= currentStep ? 'active' : ''}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 問卷內容 */}
        <div className="questions-section">
          <ConstitutionForm
            category={getCurrentCategoryQuestions()}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            currentStep={currentStep}
            totalSteps={constitutionQuestions.length}
          />
        </div>

        {/* 導航按鈕 */}
        <div className="navigation-buttons">
          <button 
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            className="nav-btn prev-btn"
          >
            ← 上一步
          </button>
          
          <div className="nav-info">
            <button 
              onClick={() => setShowHistory(true)}
              className="history-link"
            >
              📊 查看歷史記錄
            </button>
          </div>

          <button 
            onClick={goToNextStep}
            disabled={!isCurrentStepComplete()}
            className={`nav-btn next-btn ${
              currentStep === constitutionQuestions.length - 1 ? 'analyze-btn' : ''
            }`}
          >
            {currentStep === constitutionQuestions.length - 1 ? '開始分析 →' : '下一步 →'}
          </button>
        </div>

        {/* 測試說明 */}
        <div className="test-info">
          <div className="info-card">
            <h3 className="info-title">📋 檢測說明</h3>
            <ul className="info-list">
              <li>本檢測基於中醫九種體質學說</li>
              <li>請根據近一個月的身體狀況如實填寫</li>
              <li>每個問題都很重要，請認真作答</li>
              <li>檢測結果僅供參考，具體調理請諮詢專業中醫師</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 歷史記錄面板 */}
      {showHistory && (
        <div className="history-overlay">
          <div className="history-panel">
            <div className="history-header">
              <h3 className="history-title">檢測歷史</h3>
              <button 
                onClick={() => setShowHistory(false)}
                className="close-history-btn"
              >
                ✕
              </button>
            </div>
            <div className="history-list">
              {testHistory.length > 0 ? (
                testHistory.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-info">
                      <div className="history-date">
                        {new Date(item.date).toLocaleDateString('zh-TW')}
                      </div>
                      <div className="history-constitution">
                        主要體質：{item.result.primary_constitution.type} 
                        ({item.result.primary_constitution.percentage}%)
                      </div>
                    </div>
                    <button 
                      onClick={() => viewHistoryResult(item)}
                      className="view-result-btn"
                    >
                      查看詳情
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-history">
                  <p>暫無檢測記錄</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstitutionPage;