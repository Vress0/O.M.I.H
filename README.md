# 🏥 O.M.I.H - 中醫智慧健康平台

<div align="center">

![O.M.I.H Logo](https://img.shields.io/badge/O.M.I.H-中醫智慧健康平台-green?style=for-the-badge)

**Oriental Medicine Intelligent Health Platform**  
基於人工智慧的現代化中醫健康管理系統

[![GitHub Stars](https://img.shields.io/github/stars/Vress0/O.M.I.H?style=social)](https://github.com/Vress0/O.M.I.H)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-61dafb)](https://reactjs.org/)
[![Backend](https://img.shields.io/badge/Backend-Flask-000000)](https://flask.palletsprojects.com/)
[![AI](https://img.shields.io/badge/AI-OpenAI%20API-412991)](https://openai.com/)

</div>

## 📋 目錄

- [🎯 專案簡介](#-專案簡介)
- [✨ 功能特色](#-功能特色)
- [🏗️ 技術架構](#-技術架構)
- [🚀 快速開始](#-快速開始)
- [📱 功能模組](#-功能模組)
- [🔧 API 文檔](#-api-文檔)
- [📊 專案結構](#-專案結構)
- [🧪 測試指南](#-測試指南)
- [📈 部署指南](#-部署指南)
- [🤝 貢獻指南](#-貢獻指南)
- [📄 授權條款](#-授權條款)

## 🎯 專案簡介

O.M.I.H（Oriental Medicine Intelligent Health）是一個結合傳統中醫理論與現代人工智慧技術的健康管理平台。透過先進的 AI 演算法，為用戶提供個人化的中醫健康諮詢服務。

### 🌟 核心理念

- **傳統與現代結合**: 融合千年中醫智慧與 AI 技術
- **個人化服務**: 基於個人體質的客製化健康建議
- **智能診斷**: 運用機器學習進行症狀分析
- **知識普及**: 推廣中醫養生文化與健康理念

## ✨ 功能特色

### 🤖 AI 症狀檢查器
- **智能症狀分析**: 基於用戶輸入症狀進行 AI 分析
- **中醫診斷建議**: 提供傳統中醫角度的診斷參考
- **治療建議**: 包含中藥、針灸、推拿等治療方案
- **預防措施**: 個人化的健康預防建議

### ⚖️ 體質測試系統
- **九種體質分析**: 平和質、氣虛質、陽虛質、陰虛質等
- **科學評估**: 基於中醫體質學理論的標準化測評
- **個人化報告**: 詳細的體質分析報告
- **養生建議**: 針對不同體質的專屬調理方案

### 👨‍⚕️ 中醫師查詢
- **地區篩選**: 按地理位置尋找附近的中醫師
- **專科搜索**: 根據專長領域篩選醫師
- **評價系統**: 用戶評價與專業認證展示
- **預約功能**: 便捷的線上預約服務

### 📚 中醫知識庫
- **豐富內容**: 包含中藥、方劑、穴位、養生等知識
- **分類瀏覽**: 按類別組織的結構化知識庫
- **搜索功能**: 智能搜索與關鍵詞匹配
- **專業文章**: 由專業中醫師撰寫的健康文章

### 💬 AI 健康小助理
- **24/7 服務**: 全天候智能問答服務
- **多輪對話**: 支持連續對話與上下文理解
- **個人化回應**: 基於用戶歷史記錄的個人化建議
- **安全防護**: 內建安全機制，避免提供危險建議

### 📊 健康分析報告
- **綜合評估**: 整合多項健康數據的綜合分析
- **趨勢追蹤**: 長期健康狀況變化追蹤
- **視覺化展示**: 直觀的圖表與數據呈現
- **建議追蹤**: 健康建議的執行狀況追蹤

## 🏗️ 技術架構

### 前端技術棧
```
React 18.2.0          # 現代化前端框架
React Router 6.x       # 前端路由管理
Axios                  # HTTP 請求庫
CSS3 & Flexbox        # 響應式設計
```

### 後端技術棧
```
Flask 2.3.3           # Python Web 框架
Flask-CORS            # 跨域資源共享
OpenAI API            # GPT 人工智慧
scikit-learn          # 機器學習庫
pandas & numpy        # 數據處理
```

### 數據存儲
```
JSON                  # 知識庫數據
CSV                   # 醫師資料
Python Objects        # 運行時數據緩存
```

### AI/ML 組件
```
OpenAI GPT-3.5/4     # 自然語言處理
RAG (檢索增強生成)    # 知識檢索系統
症狀分類器            # 機器學習分類
```

## 🚀 快速開始

### 系統需求

- **Node.js** >= 16.0.0
- **Python** >= 3.8
- **npm** 或 **yarn**
- **Git**

### 安裝步驟

#### 1. 複製專案
```bash
git clone https://github.com/Vress0/O.M.I.H.git
cd O.M.I.H
```

#### 2. 後端設置
```bash
# 進入後端目錄
cd backend

# 創建虛擬環境（推薦）
python -m venv venv

# 啟動虛擬環境
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安裝依賴
pip install -r requirements.txt

# 配置環境變數
cp .env.example .env
# 編輯 .env 文件，添加 OpenAI API Key
```

#### 3. 前端設置
```bash
# 進入前端目錄
cd ../frontend

# 安裝依賴
npm install
```

#### 4. 啟動服務

**後端服務**（端口 5000）
```bash
cd backend
python main.py
```

**前端服務**（端口 3000）
```bash
cd frontend
npm start
```

#### 5. 訪問應用
打開瀏覽器訪問：http://localhost:3000

## 📱 功能模組

### 🏠 首頁模組
- **功能導航**: 清晰的功能模組導航
- **健康資訊**: 每日健康小貼士
- **快速入口**: 常用功能的快速訪問
- **用戶引導**: 新用戶使用指南

### 🔍 症狀檢查模組
```
路由: /symptoms
API: POST /api/symptoms/
功能: AI 症狀分析與診斷建議
```

### ⚖️ 體質測試模組
```
路由: /constitution
API: POST /api/constitution/
功能: 中醫體質測評與分析
```

### 👨‍⚕️ 醫師查詢模組
```
路由: /doctors
API: GET /api/doctors/
功能: 中醫師查找與篩選
```

### 📚 知識庫模組
```
路由: /knowledge
API: GET /api/knowledge/
功能: 中醫知識瀏覽與搜索
```

### 💬 AI 助理模組
```
路由: /assistant
API: POST /api/assistant/
功能: 智能對話與健康諮詢
```

### 📊 分析報告模組
```
路由: /analysis
功能: 健康數據分析與報告生成
```

## 🔧 API 文檔

### 基礎資訊
- **基礎 URL**: `http://localhost:5000`
- **內容類型**: `application/json`
- **編碼**: `UTF-8`

### 主要端點

#### 健康檢查
```http
GET /
```
回應：平台基本資訊

#### AI 小助理
```http
POST /api/assistant/
Content-Type: application/json

{
  "message": "我最近總是感覺疲憊，該怎麼辦？",
  "session_id": "user_session_123"
}
```

#### 症狀檢查
```http
POST /api/symptoms/
Content-Type: application/json

{
  "symptoms": ["頭痛", "疲勞", "失眠"],
  "duration": "一週",
  "severity": "中等"
}
```

#### 體質測試
```http
POST /api/constitution/
Content-Type: application/json

{
  "answers": [1, 2, 3, 1, 4, 2, 1, 3, 2],
  "user_info": {
    "age": 30,
    "gender": "女"
  }
}
```

#### 醫師查詢
```http
GET /api/doctors/?location=台北&specialty=內科
```

#### 知識庫
```http
GET /api/knowledge/?category=中藥&keyword=人參
```

## 📊 專案結構

```
O.M.I.H/
├── 📁 backend/                 # 後端服務
│   ├── 📁 ai/                 # AI 相關模組
│   │   ├── prompts/           # AI 提示詞
│   │   ├── rag.py            # 檢索增強生成
│   │   ├── symptom_classifier.py  # 症狀分類器
│   │   └── utils.py          # AI 工具函數
│   ├── 📁 api/                # API 路由
│   │   └── routes.py         # 主要路由定義
│   ├── 📁 assistant/          # AI 助理模組
│   ├── 📁 constitution_test/  # 體質測試模組
│   ├── 📁 doctors/           # 醫師查詢模組
│   ├── 📁 knowledge_base/    # 知識庫模組
│   ├── 📁 symptom_checker/   # 症狀檢查模組
│   ├── 📁 db/                # 數據文件
│   │   ├── doctors.csv       # 醫師資料
│   │   └── tcm_knowledge.json # 中醫知識庫
│   ├── main.py               # 應用入口點
│   ├── requirements.txt      # Python 依賴
│   └── .env.example         # 環境變數範例
├── 📁 frontend/               # 前端應用
│   ├── 📁 public/            # 靜態資源
│   │   ├── index.html        # HTML 模板
│   │   └── manifest.json     # PWA 配置
│   ├── 📁 src/               # 源代碼
│   │   ├── 📁 components/    # React 組件
│   │   ├── 📁 pages/         # 頁面組件
│   │   ├── 📁 services/      # API 服務
│   │   ├── 📁 styles/        # 樣式文件
│   │   ├── App.js           # 主應用組件
│   │   └── index.js         # 應用入口
│   ├── package.json          # Node.js 依賴
│   └── package-lock.json     # 依賴鎖定文件
├── 📄 README.md              # 專案說明
├── 📄 TESTING.md             # 測試指南
├── 📄 .gitignore            # Git 忽略規則
└── 📄 LICENSE               # 授權條款
```

## 🧪 測試指南

### 自動化測試
```bash
# 運行前端測試
cd frontend
npm test

# 運行後端測試
cd backend
python -m pytest
```

### 手動測試流程

1. **功能測試**
   - [ ] 首頁載入正常
   - [ ] 各模組導航正常
   - [ ] API 回應正常

2. **症狀檢查測試**
   - [ ] 症狀輸入正常
   - [ ] AI 分析回應
   - [ ] 建議顯示完整

3. **體質測試測試**
   - [ ] 問卷填寫流暢
   - [ ] 結果計算準確
   - [ ] 報告生成完整

4. **響應式測試**
   - [ ] 移動設備適配
   - [ ] 平板設備適配
   - [ ] 桌面設備適配

詳細測試指南請參考：[TESTING.md](TESTING.md)

## 📈 部署指南

### 前端部署（Vercel）

1. Fork 此專案到你的 GitHub
2. 在 Vercel 中導入專案
3. 設置構建配置：
   ```
   Framework Preset: Create React App
   Build Command: cd frontend && npm run build
   Output Directory: frontend/build
   ```

### 後端部署（Railway/Heroku）

1. 創建 `Procfile`:
   ```
   web: cd backend && python main.py
   ```

2. 設置環境變數：
   ```
   OPENAI_API_KEY=your_openai_api_key
   FLASK_ENV=production
   ```

### Docker 部署

```dockerfile
# Dockerfile
FROM node:16 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM python:3.9
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/build ./frontend/build
EXPOSE 5000
CMD ["python", "backend/main.py"]
```

## 🤝 貢獻指南

我們歡迎社群的貢獻！請遵循以下步驟：

### 貢獻步驟

1. **Fork 專案**
   ```bash
   git clone https://github.com/YOUR_USERNAME/O.M.I.H.git
   ```

2. **創建功能分支**
   ```bash
   git checkout -b feature/新功能名稱
   ```

3. **提交更改**
   ```bash
   git commit -m "feat: 添加新功能描述"
   ```

4. **推送分支**
   ```bash
   git push origin feature/新功能名稱
   ```

5. **創建 Pull Request**

### 代碼規範

- **前端**: 遵循 ESLint 規則
- **後端**: 遵循 PEP 8 規範
- **提交訊息**: 使用 Conventional Commits

### 開發環境

1. 安裝開發依賴
2. 配置代碼格式化工具
3. 運行測試確保功能正常

## 👥 開發團隊

- **專案負責人**: [@Vress0](https://github.com/Vress0)
- **技術架構**: AI + Web 全棧開發
- **設計理念**: 傳統中醫 × 現代科技

## 📞 聯繫方式

- **GitHub Issues**: [報告問題](https://github.com/Vress0/O.M.I.H/issues)
- **Email**: [聯繫我們](mailto:contact@omih.health)
- **文檔**: [查看文檔](https://omih.readthedocs.io)

## 🛣️ 發展路線圖

### 近期目標（2025 Q1-Q2）
- [ ] 完善 AI 診斷準確度
- [ ] 增加更多體質類型
- [ ] 優化用戶介面體驗
- [ ] 添加多語言支持

### 中期目標（2025 Q3-Q4）
- [ ] 開發移動應用
- [ ] 整合更多中醫資料
- [ ] 添加遠程諮詢功能
- [ ] 建立用戶社群

### 長期願景（2026+）
- [ ] AI 診斷專業化認證
- [ ] 與醫療機構合作
- [ ] 國際市場拓展
- [ ] 建立中醫 AI 標準

## 📄 授權條款

本專案採用 [MIT License](LICENSE) 開源授權條款。

```
MIT License

Copyright (c) 2025 O.M.I.H Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**🌟 如果這個專案對你有幫助，請給我們一個星星！⭐**

![Footer](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Tech](https://img.shields.io/badge/Powered%20by-AI%20%2B%20TCM-green?style=for-the-badge)

</div>
