# 🌿 O.M.I.H 東方醫智館

> Oriental MedIntelli Hub - 融合千年傳統智慧與現代 AI 科技的健康管理平台

[![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)](https://github.com/Vress0/O.M.I.H)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646cff.svg)](https://vitejs.dev/)

## 📖 專案概述

O.M.I.H (Oriental MedIntelli Hub) 是一個創新的健康管理平台，將傳統中醫的千年智慧與現代 AI 技術相結合，為使用者提供個人化的全方位健康管理方案。

### ✨ 核心功能

- 🤖 **AI 健康小助理** - 24/7 智能問答，即時分析症狀並提供養生建議
- 📚 **中醫知識庫** - 包含中藥、方劑、穴位與養生的結構化百科全書
- 🔍 **體質檢測** - 分析九大體質，提供專屬的飲食與調理方案
- 🏥 **尋找醫師** - 根據地區與專科，尋找最適合您的中醫專家
- 📷 **影像分析** - AI 輔助的舌診、面診等傳統中醫診斷
- ✏️ **圖像編輯** - 內建圖像處理工具

## 🛠️ 技術架構

### 前端技術棧
- **React 19.2.0** - 現代化的用戶界面框架
- **TypeScript 5.8.2** - 類型安全的 JavaScript
- **Vite 6.2.0** - 快速的前端構建工具
- **Tailwind CSS** - 實用優先的 CSS 框架
- **Lucide React** - 優雅的圖標庫

### AI 服務
- **Google Gemini AI** - 先進的大語言模型支持
- **圖像分析** - 基於 AI 的舌診、面診功能
- **自然語言處理** - 智能健康諮詢對話

## 🚀 快速開始

### 系統要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安裝步驟

1. **複製專案**
```bash
git clone https://github.com/Vress0/O.M.I.H.git
cd O.M.I.H
```

2. **安裝依賴**
```bash
npm install
```

3. **配置環境變數**
創建 `.env` 文件並添加必要的 API 金鑰：
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **啟動開發伺服器**
```bash
npm run dev
```

5. **訪問應用程式**
打開瀏覽器並前往 `http://localhost:5173`

### 構建生產版本
```bash
npm run build
```

### 預覽生產構建
```bash
npm run preview
```

## 📁 專案結構

```
O.M.I.H/
├── index.html              # 主要 HTML 模板
├── package.json            # 專案依賴與腳本
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 構建配置
├── metadata.json           # 應用程式元數據
├── services/               # 後端服務
│   └── geminiService.ts    # Gemini AI 服務
├── src/
│   ├── App.tsx             # 主應用程式組件
│   ├── main.tsx            # 應用程式入口點
│   ├── types.ts            # TypeScript 類型定義
│   ├── components/         # React 組件
│   │   ├── Analyzer.tsx    # 影像分析組件
│   │   ├── Button.tsx      # 通用按鈕組件
│   │   ├── ChatBot.tsx     # AI 聊天機器人
│   │   ├── Constitution.tsx # 體質檢測
│   │   ├── Editor.tsx      # 圖像編輯器
│   │   ├── FindDoctor.tsx  # 醫師搜尋
│   │   ├── ImageUploader.tsx # 圖像上傳
│   │   └── KnowledgeBase.tsx # 知識庫
│   └── services/
│       └── geminiService.ts # 前端 AI 服務
└── README.md               # 專案說明文檔
```

## 🎯 功能模組詳解

### 1. AI 健康小助理 (ChatBot)
- 即時健康諮詢對話
- 症狀分析與建議
- 中醫養生指導
- 自然語言理解

### 2. 體質檢測 (Constitution)
- 九大體質分類分析
- 個人化體質報告
- 飲食調理建議
- 生活方式指導

### 3. 影像分析 (Analyzer)
- 舌診 AI 分析
- 面診特徵識別
- 健康狀況評估
- 專業診斷建議

### 4. 中醫知識庫 (KnowledgeBase)
- 中藥材資料庫
- 經典方劑查詢
- 穴位圖解說明
- 養生保健知識

### 5. 尋找醫師 (FindDoctor)
- 地理位置搜尋
- 專科分類篩選
- 醫師資訊展示
- 評價與聯絡方式

## 🔧 開發指南

### 代碼風格
- 使用 TypeScript 進行類型檢查
- 遵循 React Hooks 最佳實踐
- 採用函數式組件開發
- CSS 使用 Tailwind 實用類

### 組件開發規範
- 每個組件都應該有明確的 TypeScript 接口
- 使用 React.FC 類型註解
- 適當的錯誤邊界處理
- 響應式設計支持

### API 集成
- 統一的服務層架構
- 錯誤處理與重試機制
- 請求狀態管理
- 類型安全的 API 調用

## 🤝 貢獻指南

歡迎對本專案做出貢獻！請遵循以下步驟：

1. Fork 本專案
2. 創建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權條款

本專案採用 MIT 授權條款 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 聯絡資訊

- 專案維護者: [Vress0](https://github.com/Vress0)
- 專案連結: [https://github.com/Vress0/O.M.I.H](https://github.com/Vress0/O.M.I.H)

## 🙏 致謝

- 感謝 Google Gemini AI 提供的強大 AI 服務支持
- 感謝所有為傳統中醫現代化做出貢獻的研究者與開發者
- 感謝開源社群提供的優秀工具與函式庫

---

<div align="center">
  <strong>🌿 讓傳統智慧與現代科技攜手，守護您的健康 🌿</strong>
</div>
O.M.I.H 東方醫智館
