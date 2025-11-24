# O.M.I.H 傳統中醫 AI 平台 - 測試指南

## 🚀 快速開始測試

### 前置要求

- Node.js (版本 14 或更高)
- Python 3.8+
- Git

### 1. 後端測試設置

```powershell
# 切換到後端目錄
cd c:\Users\Ryan\Desktop\GitHub\O.M.I.H\backend

# 創建虛擬環境
python -m venv venv

# 啟動虛擬環境
.\venv\Scripts\Activate.ps1

# 安裝依賴
pip install -r requirements.txt

# 啟動後端服務器
python app.py
```

後端將在 `http://localhost:5000` 運行

### 2. 前端測試設置

```powershell
# 打開新的終端，切換到前端目錄
cd c:\Users\Ryan\Desktop\GitHub\O.M.I.H\frontend

# 安裝依賴
npm install

# 啟動前端開發服務器
npm start
```

前端將在 `http://localhost:3000` 運行，並自動在瀏覽器中打開

### 3. 功能測試清單

#### ✅ 首頁 (/)

- [ ] 頁面正常載入
- [ ] 導航欄功能正常
- [ ] 健康資訊輪播
- [ ] AI 推薦區塊
- [ ] 熱門症狀點擊跳轉

#### ✅ 症狀檢測 (/symptoms)

- [ ] 症狀輸入功能
- [ ] 症狀搜索和選擇
- [ ] AI 分析按鈕
- [ ] 結果顯示
- [ ] 跳轉到分析頁面

#### ✅ 分析結果 (/analysis)

- [ ] 詳細分析報告
- [ ] 多標籤介面
- [ ] 中醫理論分析
- [ ] 調理建議
- [ ] 醫師推薦按鈕

#### ✅ 醫師推薦 (/doctors)

- [ ] 醫師列表顯示
- [ ] 篩選功能 (地區、專科、評分)
- [ ] 排序功能
- [ ] 醫師詳情查看
- [ ] 預約功能

#### ✅ 體質檢測 (/constitution)

- [ ] 問卷系統
- [ ] 進度條顯示
- [ ] 分步驟導航
- [ ] 體質分析結果
- [ ] 歷史記錄查看

#### ✅ 知識庫 (/knowledge)

- [ ] 文章列表顯示
- [ ] 搜索功能
- [ ] 分類篩選
- [ ] 文章詳情閱讀
- [ ] 收藏功能

#### ✅ AI 助理 (/assistant)

- [ ] 聊天介面
- [ ] AI 對話功能
- [ ] 快速功能按鈕
- [ ] 聊天歷史

### 4. 響應式測試

測試不同螢幕尺寸下的顯示效果：

- 桌面 (>1200px)
- 平板 (768px-1200px)
- 手機 (320px-768px)

### 5. 瀏覽器相容性測試

建議測試的瀏覽器：

- Chrome (最新版本)
- Edge (最新版本)
- Firefox (最新版本)
- Safari (如果是 Mac)

### 6. 效能測試

- [ ] 頁面載入速度
- [ ] 圖片載入優化
- [ ] API 響應時間
- [ ] 記憶體使用情況

### 7. 常見問題排除

#### 前端問題

```powershell
# 清除 npm 快取
npm cache clean --force

# 刪除 node_modules 重新安裝
Remove-Item -Recurse -Force node_modules
npm install
```

#### 後端問題

```powershell
# 確認 Python 版本
python --version

# 重新安裝依賴
pip install -r requirements.txt --force-reinstall

# 檢查 Flask 應用
python -c "from app import app; print('Flask app loaded successfully')"
```

#### 埠口衝突

如果埠口被占用，可以修改：

- 前端：修改 package.json 中的 start 腳本，添加 `PORT=3001`
- 後端：修改 app.py 中的 `port=5001`

### 8. 開發工具推薦

#### 瀏覽器開發者工具

- F12 打開開發者工具
- Console：查看 JavaScript 錯誤
- Network：檢查 API 請求
- Elements：檢查 HTML/CSS

#### VS Code 擴展

- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Prettier - Code formatter
- Python

### 9. 測試數據

系統包含以下測試數據：

- 預設醫師資料 (3 位醫師)
- 體質檢測問卷 (27 題)
- 知識庫文章 (6 篇)
- 症狀分析樣本

### 10. 部署測試 (可選)

#### 前端打包測試

```powershell
cd frontend
npm run build
```

#### 後端生產模式

```powershell
cd backend
set FLASK_ENV=production
python app.py
```

## 🔧 故障排除

### 常見錯誤解決方案

1. **Module not found 錯誤**

   - 檢查檔案路徑是否正確
   - 確認所有依賴都已安裝
2. **CORS 錯誤**

   - 確認後端 Flask-CORS 已安裝且配置正確
   - 檢查前端 proxy 設定
3. **樣式顯示異常**

   - 檢查 CSS 檔案路徑
   - 確認 import 語句正確
4. **API 連接失敗**

   - 檢查後端服務器是否運行
   - 確認 API 端點 URL 正確

## 📞 技術支援

如果遇到問題，請檢查：

1. 終端錯誤訊息
2. 瀏覽器 Console 錯誤
3. 網路連接狀態
4. 依賴版本相容性

祝您測試順利！🎉
