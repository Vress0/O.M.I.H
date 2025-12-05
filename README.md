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
- **Node.js** >= 18.0.0 (建議使用 LTS 版本)
- **npm** >= 9.0.0 (或 **yarn** >= 1.22.0)
- **Git** >= 2.30.0
- 支援的瀏覽器：Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### 環境安裝指南

#### Windows 用戶
```powershell
# 1. 安裝 Node.js (建議使用 nvm-windows 管理版本)
# 下載並安裝：https://nodejs.org/en/download/
# 或使用 Chocolatey
choco install nodejs

# 2. 驗證安裝
node --version
npm --version
```

#### macOS 用戶
```bash
# 使用 Homebrew 安裝
brew install node

# 或使用 nvm 管理版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

#### Linux 用戶 (Ubuntu/Debian)
```bash
# 使用 NodeSource 安裝最新版本
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 snap
sudo snap install node --classic
```

### 專案安裝步驟

1. **複製專案**
```bash
git clone https://github.com/Vress0/O.M.I.H.git
cd O.M.I.H
```

2. **安裝依賴套件**
```bash
# 使用 npm (推薦)
npm install

# 或使用 yarn
yarn install
```

3. **設定環境變數**

   **方法一：使用範例檔案**
   ```bash
   # 複製範例檔案
   cp .env.example .env.local
   
   # 編輯 .env.local 並填入您的 API 金鑰
   # Windows 用戶可以使用 notepad .env.local
   # macOS/Linux 用戶可以使用 nano .env.local
   ```

   **方法二：手動創建**
   在專案根目錄創建 `.env.local` 檔案，內容如下：
   ```env
   # Google Gemini AI API Key
   VITE_API_KEY=your_gemini_api_key_here
   
   # 開發環境設定
   NODE_ENV=development
   ```

4. **取得 Gemini API 金鑰**
   - 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
   - 登入您的 Google 帳戶
   - 點擊「Create API Key」
   - 複製生成的 API 金鑰並貼到 `.env.local` 檔案中

5. **啟動開發伺服器**
```bash
npm run dev
```

6. **訪問應用程式**
   - 開啟瀏覽器並前往 `http://localhost:3000`
   - 如果看到 O.M.I.H 東方醫智館首頁，表示安裝成功！

### 常見問題排解

#### 權限問題 (Windows)
```powershell
# 如果遇到執行政策錯誤
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Node.js 版本問題
```bash
# 檢查當前版本
node --version
npm --version

# 如果版本過舊，請更新 Node.js
# 或使用 nvm 切換版本
nvm install 18
nvm use 18
```

#### 網路連線問題
```bash
# 如果 npm install 失敗，嘗試使用不同鏡像源
npm config set registry https://registry.npmmirror.com/
npm install

# 或清除 npm 快取
npm cache clean --force
```

#### 埠號衝突
```bash
# 如果 3000 埠被占用，專案會自動使用下一個可用埠號
# 您也可以手動指定埠號
npm run dev -- --port 5173
```

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
