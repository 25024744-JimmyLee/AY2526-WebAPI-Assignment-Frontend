# CinemaVault Frontend

CinemaVault Frontend 是本作業的 React TypeScript 單頁應用，目前保留 `Essential` 功能，並補回一條使用者與管理員訊息往返流程。

## 已實作畫面與流程
- 公開首頁：搜尋、類型篩選、電影卡片清單
- 電影詳情頁
- 一般使用者註冊
- 使用者帳戶頁：查看訊息與管理員回覆
- 管理員註冊
- 使用者 / 管理員登入
- 電影詳情頁發送訊息給管理員
- 管理後台：新增、編輯、刪除電影，以及回覆 / 刪除訊息

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
  電影清單、單筆查詢、建立、更新、刪除
- `src/api/messages-api.ts`
  訊息列表、建立、回覆、刪除

## 測試
```bash
npm test
npm run build
```

目前包含：
- App 基本渲染與主要入口驗證
- Auth store 的 session restore 與失效 token 清理
