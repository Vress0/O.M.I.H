import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './ConstitutionForm.css';

const ConstitutionForm = ({ onComplete, initialAnswers = {} }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sections, setSections] = useState([]);
  const [errors, setErrors] = useState({});

  // 載入體質測試問題
  useEffect(() => {
    loadConstitutionQuestions();
  }, []);

  // 計算進度
  useEffect(() => {
    if (questions.length > 0) {
      const answeredCount = Object.keys(answers).length;
      const progressPercent = Math.round((answeredCount / questions.length) * 100);
      setProgress(progressPercent);
    }
  }, [answers, questions]);

  const loadConstitutionQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getConstitutionQuestions();
      if (response.success && response.data) {
        setQuestions(response.data.questions || []);
        setSections(response.data.sections || []);
        
        // 如果有現有答案，載入它們
        const savedAnswers = apiService.getStoredConstitutionAnswers();
        if (savedAnswers && Object.keys(savedAnswers).length > 0) {
          setAnswers({ ...savedAnswers, ...initialAnswers });
        }
      }
    } catch (error) {
      console.error('載入體質測試問題失敗:', error);
      // 使用預設問題
      loadDefaultQuestions();
    } finally {
      setIsLoading(false);
    }
  };

  // 載入預設問題（當 API 失敗時使用）
  const loadDefaultQuestions = () => {
    const defaultQuestions = [
      // 基本資訊
      {
        id: 'basic_age',
        section: 0,
        type: 'number',
        question: '您的年齡是？',
        required: true,
        min: 1,
        max: 120
      },
      {
        id: 'basic_gender',
        section: 0,
        type: 'radio',
        question: '您的性別是？',
        required: true,
        options: ['男性', '女性', '其他']
      },
      {
        id: 'basic_height',
        section: 0,
        type: 'number',
        question: '您的身高（公分）？',
        required: true,
        min: 100,
        max: 250
      },
      {
        id: 'basic_weight',
        section: 0,
        type: 'number',
        question: '您的體重（公斤）？',
        required: true,
        min: 20,
        max: 300
      },
      
      // 生活習慣
      {
        id: 'lifestyle_sleep',
        section: 1,
        type: 'radio',
        question: '您通常幾點睡覺？',
        required: true,
        options: ['晚上9-10點', '晚上10-11點', '晚上11-12點', '凌晨12點後']
      },
      {
        id: 'lifestyle_exercise',
        section: 1,
        type: 'radio',
        question: '您每週運動幾次？',
        required: true,
        options: ['幾乎不運動', '1-2次', '3-4次', '5次以上']
      },
      {
        id: 'lifestyle_stress',
        section: 1,
        type: 'scale',
        question: '您最近的壓力程度如何？',
        required: true,
        scale: { min: 1, max: 5, labels: ['很輕鬆', '有點壓力', '中等壓力', '壓力較大', '壓力很大'] }
      },
      
      // 身體症狀
      {
        id: 'symptom_cold',
        section: 2,
        type: 'radio',
        question: '您是否容易感到怕冷？',
        required: true,
        options: ['從不', '偶爾', '經常', '總是']
      },
      {
        id: 'symptom_hot',
        section: 2,
        type: 'radio',
        question: '您是否容易感到燥熱？',
        required: true,
        options: ['從不', '偶爾', '經常', '總是']
      },
      {
        id: 'symptom_fatigue',
        section: 2,
        type: 'scale',
        question: '您最近的疲勞程度如何？',
        required: true,
        scale: { min: 1, max: 5, labels: ['精力充沛', '略感疲勞', '中度疲勞', '經常疲勞', '極度疲勞'] }
      },
      
      // 飲食習慣
      {
        id: 'diet_preference',
        section: 3,
        type: 'checkbox',
        question: '您偏好哪些類型的食物？（可多選）',
        required: false,
        options: ['清淡食物', '辛辣食物', '甜食', '冷飲', '熱飲', '肉類', '蔬菜']
      },
      {
        id: 'diet_appetite',
        section: 3,
        type: 'radio',
        question: '您的食慾如何？',
        required: true,
        options: ['食慾很好', '食慾正常', '食慾不振', '時好時壞']
      }
    ];

    const defaultSections = [
      { name: '基本資訊', description: '請提供您的基本身體資訊' },
      { name: '生活習慣', description: '了解您的作息和生活方式' },
      { name: '身體症狀', description: '評估您的身體感受和症狀' },
      { name: '飲食習慣', description: '了解您的飲食偏好和習慣' }
    ];

    setQuestions(defaultQuestions);
    setSections(defaultSections);
  };

  // 處理答案變化
  const handleAnswerChange = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // 清除該問題的錯誤
    if (errors[questionId]) {
      const newErrors = { ...errors };
      delete newErrors[questionId];
      setErrors(newErrors);
    }
    
    // 儲存到本地存儲
    apiService.saveConstitutionAnswers(newAnswers);
  };

  // 驗證當前部分的答案
  const validateCurrentSection = () => {
    const currentQuestions = questions.filter(q => q.section === currentSection);
    const newErrors = {};
    let isValid = true;

    currentQuestions.forEach(question => {
      if (question.required && (!answers[question.id] || answers[question.id] === '')) {
        newErrors[question.id] = '此問題為必填';
        isValid = false;
      }

      // 數字類型驗證
      if (question.type === 'number' && answers[question.id]) {
        const value = parseFloat(answers[question.id]);
        if (question.min && value < question.min) {
          newErrors[question.id] = `數值不能小於 ${question.min}`;
          isValid = false;
        }
        if (question.max && value > question.max) {
          newErrors[question.id] = `數值不能大於 ${question.max}`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // 下一個部分
  const nextSection = () => {
    if (validateCurrentSection()) {
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        submitForm();
      }
    }
  };

  // 上一個部分
  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  // 提交表單
  const submitForm = async () => {
    // 驗證所有必填問題
    const allErrors = {};
    let isValid = true;

    questions.forEach(question => {
      if (question.required && (!answers[question.id] || answers[question.id] === '')) {
        allErrors[question.id] = '此問題為必填';
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(allErrors);
      alert('請完成所有必填問題');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await apiService.submitConstitutionTest(answers);
      
      if (response.success) {
        // 清除本地存儲的答案
        apiService.clearConstitutionAnswers();
        
        if (onComplete) {
          onComplete(response.data);
        }
      } else {
        throw new Error(response.message || '提交失敗');
      }
    } catch (error) {
      console.error('提交體質測試失敗:', error);
      alert('提交失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置表單
  const resetForm = () => {
    if (window.confirm('確定要重新開始測試嗎？所有答案將被清除。')) {
      setAnswers({});
      setCurrentSection(0);
      setErrors({});
      apiService.clearConstitutionAnswers();
    }
  };

  // 渲染問題
  const renderQuestion = (question) => {
    const value = answers[question.id] || '';
    const hasError = errors[question.id];

    return (
      <div key={question.id} className={`question-item ${hasError ? 'error' : ''}`}>
        <div className="question-header">
          <h3 className="question-text">
            {question.question}
            {question.required && <span className="required">*</span>}
          </h3>
          {hasError && (
            <div className="error-message">{hasError}</div>
          )}
        </div>

        <div className="answer-container">
          {question.type === 'text' && (
            <input
              type="text"
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="請輸入答案"
              className="text-input"
            />
          )}

          {question.type === 'number' && (
            <input
              type="number"
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              min={question.min}
              max={question.max}
              placeholder="請輸入數字"
              className="number-input"
            />
          )}

          {question.type === 'radio' && (
            <div className="radio-group">
              {question.options.map((option, index) => (
                <label key={index} className="radio-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                  <span className="radio-text">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'checkbox' && (
            <div className="checkbox-group">
              {question.options.map((option, index) => {
                const isChecked = Array.isArray(value) && value.includes(option);
                return (
                  <label key={index} className="checkbox-option">
                    <input
                      type="checkbox"
                      value={option}
                      checked={isChecked}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        if (e.target.checked) {
                          handleAnswerChange(question.id, [...currentValues, option]);
                        } else {
                          handleAnswerChange(question.id, currentValues.filter(v => v !== option));
                        }
                      }}
                    />
                    <span className="checkbox-text">{option}</span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === 'scale' && (
            <div className="scale-group">
              <div className="scale-options">
                {Array.from({ length: question.scale.max - question.scale.min + 1 }, (_, i) => {
                  const scaleValue = question.scale.min + i;
                  return (
                    <label key={scaleValue} className="scale-option">
                      <input
                        type="radio"
                        name={question.id}
                        value={scaleValue}
                        checked={parseInt(value) === scaleValue}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                      />
                      <span className="scale-number">{scaleValue}</span>
                      {question.scale.labels && (
                        <span className="scale-label">{question.scale.labels[i]}</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="constitution-form loading">
        <div className="loading-content">
          <div className="loading-spinner">⏳</div>
          <p>載入體質測試問題中...</p>
        </div>
      </div>
    );
  }

  const currentSectionQuestions = questions.filter(q => q.section === currentSection);
  const currentSectionInfo = sections[currentSection] || { name: '測試', description: '請回答以下問題' };

  return (
    <div className="constitution-form">
      {/* 標題和進度 */}
      <div className="form-header">
        <div className="header-content">
          <h1 className="form-title">
            <span className="title-icon">🔍</span>
            中醫體質測試
          </h1>
          <p className="form-description">
            通過科學的問卷評估，了解您的中醫體質類型，為您提供個人化的健康建議
          </p>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-text">完成進度</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 部分導航 */}
      <div className="section-navigation">
        {sections.map((section, index) => (
          <div 
            key={index}
            className={`section-tab ${
              index === currentSection ? 'active' : ''
            } ${
              index < currentSection ? 'completed' : ''
            }`}
          >
            <div className="section-number">{index + 1}</div>
            <div className="section-name">{section.name}</div>
          </div>
        ))}
      </div>

      {/* 當前部分 */}
      <div className="current-section">
        <div className="section-header">
          <h2 className="section-title">{currentSectionInfo.name}</h2>
          <p className="section-description">{currentSectionInfo.description}</p>
        </div>

        <div className="questions-container">
          {currentSectionQuestions.map(renderQuestion)}
        </div>
      </div>

      {/* 導航按鈕 */}
      <div className="form-navigation">
        <button
          onClick={prevSection}
          disabled={currentSection === 0}
          className="nav-btn prev-btn"
        >
          ⬅️ 上一步
        </button>

        <button
          onClick={resetForm}
          className="reset-btn"
          title="重新開始測試"
        >
          🔄 重新開始
        </button>

        <button
          onClick={nextSection}
          disabled={isSubmitting}
          className="nav-btn next-btn"
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner">⏳</span>
              提交中...
            </>
          ) : currentSection === sections.length - 1 ? (
            <>
              完成測試 ✅
            </>
          ) : (
            <>
              下一步 ➡️
            </>
          )}
        </button>
      </div>

      {/* 提示資訊 */}
      <div className="form-tips">
        <div className="tip-item">
          💡 <strong>小提示：</strong>請根據您最近一個月的實際情況回答問題
        </div>
        <div className="tip-item">
          ⚠️ <strong>注意：</strong>測試結果僅供參考，如有健康問題請諮詢專業醫師
        </div>
      </div>
    </div>
  );
};

export default ConstitutionForm;