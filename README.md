# CinemaVault Frontend

CinemaVault Frontend 是本作業的 React TypeScript 單頁應用，提供公開電影目錄、會員片庫、管理員工作台，以及與後端 API 的整合。

## 已實作畫面與流程
- 公開首頁：搜尋、類型篩選、電影卡片清單
- 電影詳情頁：完整片單資訊、擴充 OMDB 資料
- 會員註冊與登入
- 管理員註冊與登入
- 會員帳戶頁：頭像上傳、收藏、待看、已觀看、訊息歷史
- 電影詳情頁內的收藏、待看、已觀看與訊息送出操作
- 管理員後台：新增、編輯、刪除電影，查看會員訊息，快速回覆，觸發 OMDB 同步，查看社群公告歷史

## 技術棧
- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Vitest + Testing Library

## 主要路由
| Route | 說明 |
|------|------|
| `/` | 公開電影目錄 |
| `/films/:filmId` | 電影詳情 |
| `/login` | 會員 / 管理員登入 |
| `/signup` | 一般會員註冊 |
| `/register-admin` | 管理員註冊 |
| `/account` | 會員帳戶與個人片庫 |
| `/admin` | 管理員工作台 |
| `/admin/films/new` | 新增電影 |
| `/admin/films/:filmId/edit` | 編輯電影 |

## 環境設定
```bash
npm install
cp .env.example .env
npm test
npm run build
npm run dev
```

`.env.example` 內最重要的設定：

```env
VITE_API_BASE_URL=http://localhost:4000
```

請把它指向後端 API 根位址。

## API 整合
- `src/api/auth-api.ts`
  會員註冊、管理員註冊、登入、目前使用者
- `src/api/films-api.ts`
  電影清單、單筆查詢、建立、更新、刪除
- `src/api/account-api.ts`
  頭像、收藏、待看、已觀看
- `src/api/messages-api.ts`
  會員訊息與管理員回覆
- `src/api/social-api.ts`
  社群公告歷史與 OMDB 同步

## 測試
```bash
npm test
npm run build
```

目前包含：
- App 基本渲染與公開入口驗證
- Auth store 的 session restore 與失效 token 清理

## 與後端對應的作業功能
- 公開瀏覽 / 搜尋 / 篩選電影
- 一般會員註冊與個人片庫
- 管理員註冊、登入與電影 CRUD
- 電影詳情頁直接傳送訊息給管理員
- 個人頭像上傳
- OMDB 補充資料同步後在前端顯示
- 新電影社群公告歷史查看

## 限制
- 頭像目前以 data URL 傳輸與顯示，未串接獨立檔案儲存服務
- 社群公告與 OMDB 需要後端提供 webhook / API key 才會有外部整合結果
- OAuth 與完整社交功能未納入目前版本
