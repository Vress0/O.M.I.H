import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import './SymptomInputBox.css';

const SymptomInputBox = ({ onSymptomsSubmit, initialSymptoms = [] }) => {
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 載入症狀分類和常見症狀
  useEffect(() => {
    loadSymptomData();
  }, []);

  // 根據選擇的分類載入常見症狀
  useEffect(() => {
    if (selectedCategory) {
      loadCommonSymptoms(selectedCategory);
    }
  }, [selectedCategory]);

  const loadSymptomData = async () => {
    try {
      const [categoriesResponse, commonSymptomsResponse] = await Promise.all([
        apiService.getSymptomCategories(),
        apiService.getCommonSymptoms()
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data || []);
      }

      if (commonSymptomsResponse.success) {
        setCommonSymptoms(commonSymptomsResponse.data || []);
        setSuggestions(commonSymptomsResponse.data?.slice(0, 8) || []);
      }
    } catch (error) {
      console.error('載入症狀資料錯誤:', error);
    }
  };

  const loadCommonSymptoms = async (category) => {
    try {
      const response = await apiService.getCommonSymptoms(category);
      if (response.success) {
        const categorySymptoms = response.data || [];
        setSuggestions(categorySymptoms.slice(0, 8));
      }
    } catch (error) {
      console.error('載入分類症狀錯誤:', error);
    }
  };

  // 新增症狀
  const addSymptom = (symptom) => {
    const trimmedSymptom = symptom.trim();
    if (trimmedSymptom && !symptoms.includes(trimmedSymptom)) {
      const newSymptoms = [...symptoms, trimmedSymptom];
      setSymptoms(newSymptoms);
      setInputValue('');
      setShowSuggestions(false);
      
      // 儲存到本地歷史
      apiService.saveSymptomHistory(newSymptoms);
    }
  };

  // 移除症狀
  const removeSymptom = (symptomToRemove) => {
    const newSymptoms = symptoms.filter(symptom => symptom !== symptomToRemove);
    setSymptoms(newSymptoms);
  };

  // 處理輸入變化
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      // 根據輸入過濾建議
      const filteredSuggestions = commonSymptoms.filter(symptom =>
        symptom.toLowerCase().includes(value.toLowerCase()) &&
        !symptoms.includes(symptom)
      );
      setSuggestions(filteredSuggestions.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // 處理 Enter 鍵
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addSymptom(inputValue);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 提交症狀
  const handleSubmit = async () => {
    if (symptoms.length === 0) {
      alert('請至少輸入一個症狀');
      return;
    }

    setIsLoading(true);
    
    try {
      // 驗證症狀
      const validationResponse = await apiService.validateSymptoms(symptoms);
      
      if (!validationResponse.success || !validationResponse.data.valid) {
        alert('症狀格式不正確，請重新輸入');
        return;
      }

      // 提交症狀進行分析
      const userData = apiService.getUserData() || {};
      const response = await apiService.submitSymptoms(symptoms, userData);
      
      if (response.success && onSymptomsSubmit) {
        onSymptomsSubmit(symptoms, response.data);
      } else {
        throw new Error(response.message || '提交失敗');
      }
      
    } catch (error) {
      console.error('提交症狀錯誤:', error);
      alert('提交失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  // 清除所有症狀
  const clearAllSymptoms = () => {
    if (symptoms.length > 0 && window.confirm('確定要清除所有症狀嗎？')) {
      setSymptoms([]);
      setInputValue('');
    }
  };

  // 症狀嚴重度指示器
  const getSeverityLevel = () => {
    if (symptoms.length === 0) return { level: 'none', text: '尚未輸入症狀' };
    if (symptoms.length <= 2) return { level: 'mild', text: '輕度症狀' };
    if (symptoms.length <= 4) return { level: 'moderate', text: '中度症狀' };
    return { level: 'severe', text: '多重症狀' };
  };

  const severityInfo = getSeverityLevel();

  return (
    <div className="symptom-input-box">
      {/* 標題區域 */}
      <div className="input-header">
        <h2 className="input-title">
          <span className="title-icon">🩺</span>
          症狀輸入
        </h2>
        <p className="input-description">
          請詳細描述您目前的身體症狀，我們的 AI 將為您分析並提供建議
        </p>
      </div>

      {/* 症狀分類選擇 */}
      <div className="category-selector">
        <label className="category-label">症狀分類：</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">全部分類</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name || category}>
              {category.name || category} {category.count && `(${category.count})`}
            </option>
          ))}
        </select>
      </div>

      {/* 症狀輸入區域 */}
      <div className="input-section">
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(inputValue.trim() !== '')}
            placeholder="請輸入症狀，如：頭痛、失眠、疲勞等..."
            className="symptom-input"
            disabled={isLoading}
          />
          
          <button
            onClick={() => addSymptom(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="add-btn"
            title="新增症狀"
          >
            ➕
          </button>
        </div>

        {/* 建議症狀 */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            <div className="suggestions-header">建議症狀：</div>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSymptom(suggestion)}
                  className="suggestion-item"
                  disabled={symptoms.includes(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 常見症狀快速選擇 */}
      <div className="quick-symptoms">
        <div className="quick-symptoms-title">常見症狀：</div>
        <div className="quick-symptoms-grid">
          {commonSymptoms.slice(0, 12).map((symptom, index) => (
            <button
              key={index}
              onClick={() => addSymptom(symptom)}
              disabled={symptoms.includes(symptom)}
              className={`quick-symptom-btn ${
                symptoms.includes(symptom) ? 'selected' : ''
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>

      {/* 已選擇的症狀 */}
      <div className="selected-symptoms">
        <div className="symptoms-header">
          <span className="symptoms-title">已選擇症狀 ({symptoms.length})</span>
          <div className={`severity-indicator ${severityInfo.level}`}>
            <span className="severity-dot"></span>
            <span className="severity-text">{severityInfo.text}</span>
          </div>
        </div>

        {symptoms.length > 0 ? (
          <div className="symptoms-list">
            {symptoms.map((symptom, index) => (
              <div key={index} className="symptom-tag">
                <span className="symptom-text">{symptom}</span>
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="remove-btn"
                  title="移除症狀"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-symptoms">
            <span className="no-symptoms-icon">📝</span>
            <span className="no-symptoms-text">尚未輸入任何症狀</span>
          </div>
        )}
      </div>

      {/* 操作按鈕 */}
      <div className="action-buttons">
        <button
          onClick={clearAllSymptoms}
          disabled={symptoms.length === 0 || isLoading}
          className="clear-btn"
        >
          🗑️ 清除全部
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={symptoms.length === 0 || isLoading}
          className="submit-btn"
        >
          {isLoading ? (
            <>
              <span className="loading-spinner">⏳</span>
              分析中...
            </>
          ) : (
            <>
              <span className="submit-icon">🔍</span>
              開始分析
            </>
          )}
        </button>
      </div>

      {/* 提示資訊 */}
      <div className="input-tips">
        <div className="tip-item">
          💡 <strong>小提示：</strong>請盡量詳細描述症狀，有助於提供更準確的建議
        </div>
        <div className="tip-item">
          ⚠️ <strong>注意：</strong>AI 分析僅供參考，如有急性或嚴重症狀請立即就醫
        </div>
      </div>
    </div>
  );
};

export default SymptomInputBox;