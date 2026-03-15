# CinemaVault Frontend

## Overview
CinemaVault Frontend is a React TypeScript single-page application for the CinemaVault coursework project. It provides public film discovery routes and protected administrator routes that will connect to the companion backend API.

## Tech Stack
- React
- TypeScript
- Vite
- React Router
- React Hook Form
- TanStack Query
- Vitest + Testing Library

## Current Scope
- Public home page
- Film detail route
- Login form with validation
- Protected admin route shell
- Add film and edit film route shells
- Shared layout and navigation
- API client bootstrap

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

## Environment Variables
Copy `.env.example` to `.env` and point `VITE_API_BASE_URL` at the backend API.

## Installation
```bash
npm install
```

## Running in Development
```bash
npm run dev
```

## Running Tests
```bash
npm test
```

## Build
```bash
npm run build
```

## Development Order
1. Replace route shells with real API-backed screens.
2. Connect login to backend auth and persist user session data.
3. Add film listing query, details query, and admin CRUD forms.
4. Add loading, empty, and error states for all API calls.
