# CinemaVault Frontend

CinemaVault Frontend is the React TypeScript single-page application for the 6003CEM-2526 Web API coursework. It implements the essential client-side features and additional coursework scope including profile photo upload, favourites/watchlist support, OMDB metadata import through the backend, and a user/admin message workflow.

## Implemented Screens and Workflows

- Public home page with film catalogue cards
- Film search and filtering by title, genre, year, and rating
- Public film detail page
- Standard user registration
- User and administrator login
- User account page with profile details, messages, administrator replies, and favourites
- Profile photo upload through the protected profile API
- Add and remove favourite films from the film detail page
- Send film-related messages to administrators
- Administrator registration with setup code
- Administrator dashboard for film and message management
- Add, edit, and delete films as an administrator
- Import film metadata from OMDB when creating or editing films
- Conditional requests using ETag and If-None-Match in the film API client

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- React Hook Form
- Zod
- Vitest
- Testing Library

## Main Routes

| Route | Description |
|---|---|
| `/` | Public film catalogue |
| `/films/:filmId` | Film detail page |
| `/login` | User and administrator login |
| `/signup` | Standard user registration |
| `/account` | User account, favourites, profile photo, and messages |
| `/register-admin` | Administrator registration |
| `/admin` | Administrator dashboard |
| `/admin/films/new` | Create a new film |
| `/admin/films/:filmId/edit` | Edit an existing film |

## Environment Setup

```bash
npm install
cp .env.example .env
npm test
npm run build
npm run dev
```

The main setting in `.env.example` is:

```env
VITE_API_BASE_URL=http://localhost:4000
```

The backend API should be running on the same URL used by `VITE_API_BASE_URL`.

## API Integration

- `src/api/auth-api.ts`  
  User registration, administrator registration, login, and current user lookup.

- `src/api/films-api.ts`  
  Film listing, film detail, create, update, delete, title/genre/year/rating query parameters, and ETag cache handling.

- `src/api/favourites-api.ts`  
  User favourites list, add favourite, and remove favourite.

- `src/api/messages-api.ts`  
  Message listing, message creation, administrator reply, and message deletion.

- `src/api/profile-api.ts`  
  Protected profile photo upload.

- `src/api/omdb-api.ts`  
  Administrator-only OMDB metadata lookup.

## Testing

```bash
npm test
npm run build
```

Current frontend test coverage includes:

- Basic application rendering and main navigation entry points
- Auth store session restore and invalid token cleanup
- Home page filter query behaviour
- Account page favourites and profile photo upload behaviour
- Administrator custom message reply workflow

## Coursework Notes

- This repository contains only the React TypeScript frontend SPA.
- The complete coursework submission also includes the separate backend API repository, OpenAPI/Swagger documentation, API endpoint tests, and a demo video link.
- Favourites/watchlist support is implemented. A separate watched-tracking workflow is not exposed in the frontend unless corresponding backend endpoints are added.
- Local verification requires the backend API and `VITE_API_BASE_URL` to use the same base URL. The default is `http://localhost:4000`.
