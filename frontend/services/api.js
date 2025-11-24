// API 服務 - 與後端 Flask API 的通訊
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 通用 HTTP 請求方法
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // GET 請求
  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST 請求
  post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 請求
  put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 請求
  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // =================== AI 小助理相關 API ===================
  
  // AI 對話
  async chatWithAssistant(message, userId = 'anonymous') {
    return this.post('/api/assistant/chat', {
      message,
      user_id: userId
    });
  }

  // 症狀分析
  async analyzeSymptoms(symptoms, userInfo = {}) {
    return this.post('/api/assistant/analyze_symptoms', {
      symptoms,
      user_info: userInfo
    });
  }

  // 檢查助理服務狀態
  async checkAssistantHealth() {
    return this.get('/api/assistant/health');
  }

  // =================== 症狀檢查相關 API ===================
  
  // 提交症狀
  async submitSymptoms(symptoms, userInfo = {}) {
    return this.post('/api/symptoms/submit', {
      symptoms,
      user_info: userInfo
    });
  }

  // 獲取症狀分類
  async getSymptomCategories() {
    return this.get('/api/symptoms/categories');
  }

  // 獲取常見症狀
  async getCommonSymptoms(category = '') {
    return this.get('/api/symptoms/common', { category });
  }

  // 驗證症狀輸入
  async validateSymptoms(symptoms) {
    return this.post('/api/symptoms/validate', { symptoms });
  }

  // 獲取用戶症狀歷史
  async getSymptomHistory(userId) {
    return this.get(`/api/symptoms/history/${userId}`);
  }

  // =================== 體質測試相關 API ===================
  
  // 獲取測試問題
  async getConstitutionQuestions() {
    return this.get('/api/constitution/questions');
  }

  // 提交測試答案
  async submitConstitutionTest(answers, userInfo = {}) {
    return this.post('/api/constitution/submit', {
      answers,
      user_info: userInfo
    });
  }

  // 獲取測試結果
  async getConstitutionResult(testId) {
    return this.get(`/api/constitution/result/${testId}`);
  }

  // 獲取測試歷史
  async getConstitutionHistory(userId) {
    return this.get(`/api/constitution/history/${userId}`);
  }

  // 獲取體質類型說明
  async getConstitutionTypes() {
    return this.get('/api/constitution/types');
  }

  // 獲取體質調理建議
  async getConstitutionRecommendations(constitutionType) {
    return this.get(`/api/constitution/recommendations/${constitutionType}`);
  }

  // =================== 知識庫相關 API ===================
  
  // 搜尋知識
  async searchKnowledge(query, category = '', limit = 10) {
    return this.post('/api/knowledge/search', {
      query,
      category,
      limit
    });
  }

  // 獲取知識分類
  async getKnowledgeCategories() {
    return this.get('/api/knowledge/categories');
  }

  // 獲取單篇文章
  async getArticle(articleId) {
    return this.get(`/api/knowledge/article/${articleId}`);
  }

  // 獲取文章列表
  async getArticles(category = '', page = 1, perPage = 20) {
    return this.get('/api/knowledge/articles', {
      category,
      page,
      per_page: perPage
    });
  }

  // 獲取熱門文章
  async getPopularArticles(limit = 10) {
    return this.get('/api/knowledge/popular', { limit });
  }

  // 獲取推薦文章
  async getRecommendedArticles(interests = [], history = [], limit = 5) {
    return this.post('/api/knowledge/recommendations', {
      interests,
      history,
      limit
    });
  }

  // 獲取知識庫統計
  async getKnowledgeStatistics() {
    return this.get('/api/knowledge/statistics');
  }

  // =================== 醫師相關 API ===================
  
  // 搜尋醫師
  async searchDoctors(criteria = {}) {
    return this.post('/api/doctors/search', criteria);
  }

  // 獲取醫師詳情
  async getDoctor(doctorId) {
    return this.get(`/api/doctors/doctor/${doctorId}`);
  }

  // 獲取專長列表
  async getDoctorSpecialties() {
    return this.get('/api/doctors/specialties');
  }

  // 根據專長獲取醫師
  async getDoctorsBySpecialty(specialty) {
    return this.get(`/api/doctors/specialty/${specialty}`);
  }

  // 醫師推薦
  async recommendDoctors(userProfile) {
    return this.post('/api/doctors/recommend', userProfile);
  }

  // 新增醫師評價
  async addDoctorReview(doctorId, userId, rating, comment) {
    return this.post('/api/doctors/reviews', {
      doctor_id: doctorId,
      user_id: userId,
      rating,
      comment
    });
  }

  // 獲取醫師評價
  async getDoctorReviews(doctorId, limit = 10) {
    return this.get(`/api/doctors/reviews/${doctorId}`, { limit });
  }

  // 獲取熱門醫師
  async getPopularDoctors(limit = 10) {
    return this.get('/api/doctors/popular', { limit });
  }

  // 獲取醫師統計
  async getDoctorStatistics() {
    return this.get('/api/doctors/statistics');
  }

  // =================== 通用 API ===================
  
  // 健康檢查
  async healthCheck() {
    return this.get('/');
  }

  // =================== 本地儲存輔助方法 ===================
  
  // 儲存用戶資料
  saveUserData(userData) {
    localStorage.setItem('omih_user_data', JSON.stringify(userData));
  }

  // 獲取用戶資料
  getUserData() {
    const userData = localStorage.getItem('omih_user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // 清除用戶資料
  clearUserData() {
    localStorage.removeItem('omih_user_data');
  }

  // 儲存症狀歷史
  saveSymptomHistory(symptoms) {
    const history = this.getSymptomHistoryLocal() || [];
    const newEntry = {
      symptoms,
      timestamp: new Date().toISOString()
    };
    history.unshift(newEntry);
    
    // 限制歷史記錄數量
    const limitedHistory = history.slice(0, 50);
    localStorage.setItem('omih_symptom_history', JSON.stringify(limitedHistory));
  }

  // 獲取本地症狀歷史
  getSymptomHistoryLocal() {
    const history = localStorage.getItem('omih_symptom_history');
    return history ? JSON.parse(history) : [];
  }

  // 儲存體質測試結果
  saveConstitutionResult(result) {
    const results = this.getConstitutionResultsLocal() || [];
    results.unshift(result);
    
    // 限制結果數量
    const limitedResults = results.slice(0, 10);
    localStorage.setItem('omih_constitution_results', JSON.stringify(limitedResults));
  }

  // 獲取本地體質測試結果
  getConstitutionResultsLocal() {
    const results = localStorage.getItem('omih_constitution_results');
    return results ? JSON.parse(results) : [];
  }
}

// 創建 API 服務實例
const apiService = new ApiService();

export default apiService;