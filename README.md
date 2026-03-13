# CinemaVault Frontend

CinemaVault Frontend 是本作業的 React TypeScript 單頁應用，現在只保留 `Essential` 範圍：公開電影瀏覽，以及管理員登入/註冊後的電影管理流程。

## 已實作畫面與流程
- 公開首頁：搜尋、類型篩選、電影卡片清單
- 電影詳情頁
- 管理員註冊
- 管理員登入
- 管理後台：新增、編輯、刪除電影

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
| `/login` | 管理員登入 |
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
  管理員註冊、登入、目前使用者
- `src/api/films-api.ts`
  電影清單、單筆查詢、建立、更新、刪除

## 測試
```bash
npm test
npm run build
```

目前包含：
- App 基本渲染與主要入口驗證
- Auth store 的 session restore 與失效 token 清理
