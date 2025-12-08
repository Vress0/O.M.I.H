請將你要用的花邊圖片放到專案的 public 資料夾下，檔名為 `cherry-border.png`。

建議規格：
- 建議尺寸：1200×800 或 1920×1080（寬比高大）
- 檔案格式：PNG（若要透明背景）或 WebP
- 檔案路徑：`/cherry-border.png`（上線後可直接以此路徑存取）

使用說明：
- 我已在 `src/App.tsx` 的六個功能卡片容器中加入了絕對定位的裝飾圖層，圖片會覆蓋整個卡片作為背景裝飾，卡片內容會顯示在前景。
- 若圖片看起來被拉伸或太大，請調整圖片寬高或在圖片編輯器中製作合適的畫布；也可以在 `App.tsx` 裡把 `className` 中的 `object-cover` 改成 `object-contain`。

如何預覽：
1. 安裝依賴：

```powershell
npm install
```

2. 啟動開發伺服器：

```powershell
npm run dev
```

3. 在瀏覽器打開 `http://localhost:5173`（或終端顯示的 port）查看效果。

如需我幫你把圖片放進 repo（你把圖片上傳到會話或給我路徑），我可以直接新增檔案並調整透明度與大小。