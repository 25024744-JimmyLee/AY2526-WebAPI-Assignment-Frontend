# CinemaVault Frontend

## Overview
CinemaVault Frontend is a React TypeScript single-page application for the CinemaVault coursework project. It provides public film discovery, authenticated administrator workflows, and a dedicated API integration layer for the companion backend repository.

## Screens and Features
- Public home page with search and filter controls
- Film details page for individual catalogue entries
- Administrator login flow
- Protected admin dashboard with create, edit, and delete actions
- Add film and edit film forms with validation
- Loading, empty, and error states for API-backed screens
- Session restore on app boot via `/api/auth/me`

## Tech Stack
- React
- TypeScript
- Vite
- React Router
- Axios
- React Hook Form
- TanStack Query
- Vitest + Testing Library

## Folder Structure
```text
src/
  api/
  components/
  layouts/
  pages/
  store/
  types/
tests/
public/
```

## Routing Design
- `/` renders the public film catalogue
- `/films/:id` shows a single film record
- `/login` handles administrator access
- `/admin`, `/admin/films/new`, and `/admin/films/:id/edit` are protected routes
- `*` renders a branded not-found screen

## State Management
- Authentication state is managed with a React context store in `src/store/auth-store.tsx`
- Film fetching and mutations use the API client layer and route-level component state
- Protected routes wait for session restoration before deciding whether to redirect

## API Integration
- `src/api/http.ts` centralises Axios configuration
- `src/api/auth-api.ts` handles login and current-user requests
- `src/api/films-api.ts` handles list, detail, create, update, and delete operations

## Authentication Flow
- Login stores the access token and safe user payload in `localStorage`
- App boot checks for an existing token and calls `/api/auth/me`
- Invalid tokens are cleared automatically and protected routes redirect to `/login`

## Running the Project
```bash
npm install
cp .env.example .env
npm test
npm run build
npm run dev
```

## Environment Variable
- `VITE_API_BASE_URL`: backend API base URL, for example `http://localhost:4000`

## Testing
- `Vitest` runs component and auth-store tests
- API calls are mocked in tests so UI behaviour can be verified without a live backend

## Deployment
- Build output is generated with `npm run build`
- Configure `VITE_API_BASE_URL` to point at the deployed backend API before publishing the static bundle

## Known Limitations
- Session persistence currently uses `localStorage`, not HTTP-only cookies
- There is no pagination yet on the catalogue view
- Swagger UI is not surfaced in the frontend; API documentation remains in the backend repo

## Future Improvements
- Add richer search facets and pagination controls
- Add optimistic UI updates for admin actions
- Add route-level integration tests for CRUD workflows
