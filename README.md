# CinemaVault Frontend

CinemaVault Frontend 是本作業的 React TypeScript 單頁應用，目前保留 `Essential` 功能，並補強 profile photo、favourites/watchlist、OMDB metadata 匯入與使用者 / 管理員訊息往返流程。

## 已實作畫面與流程
- 公開首頁：依標題、類型、年份、評分篩選電影卡片清單
- 電影詳情頁
- 一般使用者註冊
- 使用者帳戶頁：查看訊息與管理員回覆
- 使用者帳戶頁：上傳 profile photo、查看 / 移除 favourites
- 管理員註冊
- 使用者 / 管理員登入
- 電影詳情頁加入 / 移除 favourite
- 電影詳情頁發送訊息給管理員
- 管理後台：新增、編輯、刪除電影，以及回覆 / 刪除訊息
- 管理員新增 / 編輯電影時可從 OMDB 匯入 metadata
- Film API client 使用 ETag / If-None-Match 做 conditional request

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
| `/login` | 使用者 / 管理員登入 |
| `/signup` | 一般使用者註冊 |
| `/account` | 使用者訊息頁 |
| `/register-admin` | 管理員註冊 |
| `/admin` | 管理後台 |
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

## API 整合
- `src/api/auth-api.ts`
  使用者註冊、管理員註冊、登入、目前使用者
- `src/api/films-api.ts`
  電影清單、單筆查詢、建立、更新、刪除、標題 / 類型 / 年份 / 評分查詢參數、ETag cache
- `src/api/favourites-api.ts`
  收藏清單、加入收藏、移除收藏
- `src/api/messages-api.ts`
  訊息列表、建立、回覆、刪除
- `src/api/profile-api.ts`
  profile photo upload
- `src/api/omdb-api.ts`
  管理員 OMDB metadata lookup

## 測試
```bash
npm test
npm run build
```

目前包含：
- App 基本渲染與主要入口驗證
- Auth store 的 session restore 與失效 token 清理
- 首頁標題 / 類型 / 年份 / 評分篩選參數驗證
- 使用者帳戶頁 favourites 與 profile photo upload 驗證
- 管理員自訂訊息回覆流程

## 已知限制與提交注意事項
- 本 repo 只包含 React TS SPA。完整 coursework 還需要另一個 backend API repo、OpenAPI / Swagger 文件、API endpoint tests，以及 demo video link。
- Favourites/watchlist 已實作；獨立的 `Watched` tracking 尚未在前端提供，需 backend 支援相應 endpoint 後再補。
- 本地驗證需 backend API 與 `.env` 的 `VITE_API_BASE_URL` 一致，預設為 `http://localhost:4000`。
