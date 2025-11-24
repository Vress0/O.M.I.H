# O.M.I.H 中醫智慧健康平台後端

## 專案概述

O.M.I.H (Oriental Medicine Intelligence Hub) 是一個基於人工智慧的中醫智慧健康平台後端系統。整合了症狀分析、體質測試、AI 小助理、知識庫和醫師推薦等功能。

## 功能模組

### 🤖 AI 模組 (`ai/`)
- **症狀分類器** (`symptom_classifier.py`): 將用戶症狀轉換為中醫調理方向
- **RAG 系統** (`rag.py`): 知識庫檢索增強生成
- **提示詞管理** (`prompts/`): AI 模型的提示詞模板
- **工具函數** (`utils.py`): AI 相關的輔助函數

### 👨‍⚕️ AI 小助理 (`assistant/`)
- **對話 API** (`views.py`): 處理用戶與 AI 的對話
- **會話管理** (`models.py`): 管理用戶對話歷史

### 🩺 症狀檢查器 (`symptom_checker/`)
- **症狀輸入 API** (`views.py`): 接收和處理用戶症狀
- **症狀分析邏輯** (`logic.py`): 症狀標準化和嚴重度評估

### 🧘 體質測試 (`constitution_test/`)
- **測試 API** (`views.py`): 體質測試問卷和結果
- **評分系統** (`score.py`): 中醫九種體質評分算法
- **資料模型** (`models.py`): 測試結果儲存和管理

### 📚 知識庫 (`knowledge_base/`)
- **知識 API** (`views.py`): 知識搜尋和管理
- **資料模型** (`models.py`): 文章和分類管理
- **資料載入器** (`loader.py`): 批量匯入知識內容

### 👩‍⚕️ 醫師模組 (`doctors/`)
- **醫師 API** (`views.py`): 醫師搜尋和評價
- **推薦系統** (`recommender.py`): 基於症狀和體質的醫師推薦
- **資料模型** (`models.py`): 醫師資料和評價管理
- **CSV 匯入** (`import_csv.py`): 批量匯入醫師資料

### 🗄️ 資料庫 (`db/`)
- **醫師資料** (`doctors.csv`): 中醫師基本資訊
- **知識庫** (`tcm_knowledge.json`): 中醫相關知識文章

## 安裝和部署

### 環境需求
- Python 3.8+
- Flask 2.3+
- 其他依賴見 `requirements.txt`

### 安裝步驟

1. **創建虛擬環境**
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

2. **安裝依賴**
```bash
pip install -r requirements.txt
```

3. **設定環境變數**
創建 `.env` 檔案：
```
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
FLASK_DEBUG=1
```

4. **啟動服務**
```bash
python main.py
```

服務將在 `http://localhost:5000` 啟動。

## API 端點

### 🏥 健康檢查
- `GET /` - 服務狀態檢查

### 🤖 AI 小助理
- `POST /api/assistant/chat` - AI 對話
- `POST /api/assistant/analyze_symptoms` - 症狀分析
- `GET /api/assistant/health` - 助理服務狀態

### 🩺 症狀檢查
- `POST /api/symptoms/submit` - 提交症狀
- `GET /api/symptoms/categories` - 獲取症狀分類
- `GET /api/symptoms/common` - 常見症狀列表
- `POST /api/symptoms/validate` - 驗證症狀輸入

### 🧘 體質測試
- `GET /api/constitution/questions` - 獲取測試問題
- `POST /api/constitution/submit` - 提交測試答案
- `GET /api/constitution/result/<test_id>` - 獲取測試結果
- `GET /api/constitution/types` - 體質類型說明

### 📚 知識庫
- `POST /api/knowledge/search` - 搜尋知識
- `GET /api/knowledge/categories` - 知識分類
- `GET /api/knowledge/article/<article_id>` - 單篇文章
- `GET /api/knowledge/popular` - 熱門文章

### 👩‍⚕️ 醫師查詢
- `POST /api/doctors/search` - 搜尋醫師
- `GET /api/doctors/doctor/<doctor_id>` - 醫師詳情
- `POST /api/doctors/recommend` - 醫師推薦
- `GET /api/doctors/specialties` - 專長列表
- `POST /api/doctors/reviews` - 新增評價

## 資料格式

### 症狀提交
```json
{
  "symptoms": ["頭痛", "失眠", "疲勞"],
  "user_info": {
    "age": 30,
    "gender": "女性",
    "constitution_type": "氣虛質"
  }
}
```

### 體質測試
```json
{
  "answers": {
    "1": 3,
    "2": 4,
    "3": 2
  },
  "user_info": {
    "user_id": "user123",
    "age": 25,
    "gender": "男性"
  }
}
```

### 醫師推薦
```json
{
  "symptoms": ["腰痛", "關節痛"],
  "constitution_type": "陽虛質",
  "location": "台北市",
  "preferred_gender": "男",
  "max_fee": 1000
}
```

## 開發指南

### 專案結構
```
backend/
├── api/                    # API 路由配置
├── ai/                     # AI 相關模組
├── assistant/              # AI 小助理
├── symptom_checker/        # 症狀檢查
├── constitution_test/      # 體質測試
├── knowledge_base/         # 知識庫
├── doctors/               # 醫師模組
├── db/                    # 資料檔案
├── main.py               # 主程式
├── requirements.txt      # 依賴清單
└── README.md            # 說明文件
```

### 新增功能模組
1. 在相應目錄創建 `views.py`, `models.py`, `logic.py` 等檔案
2. 在 `api/routes.py` 中註冊新的藍圖
3. 更新 `requirements.txt` 如有新依賴

### 測試
```bash
# 執行測試 (如果有測試檔案)
pytest

# 代碼格式化
black .

# 代碼檢查
flake8 .
```

## 注意事項

1. **API 金鑰安全**: 請勿將 OpenAI API 金鑰提交到版本控制中
2. **資料驗證**: 所有用戶輸入都應進行適當驗證
3. **錯誤處理**: 實作完整的錯誤處理和日誌記錄
4. **效能優化**: 大量資料處理時考慮使用快取和分頁
5. **醫療免責**: 所有 AI 建議都應包含適當的醫療免責聲明

## 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/新功能`)
3. 提交變更 (`git commit -am '新增某功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 創建 Pull Request

## 授權

本專案採用 MIT 授權條款。

## 聯繫方式

如有問題或建議，請透過 Issues 或 Pull Requests 與我們聯繫。

---

**⚠️ 重要提醒**: 本平台提供的所有建議僅供參考，不能取代專業醫療診斷和治療。如有健康問題，請諮詢合格的醫療專業人員。