# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Offline Todo PWA

A React-based Progressive Web App for task management with offline-first capabilities using WASM SQLite.

## Commands

- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production (output in dist/)
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run unit tests with UI
- `npm run test:e2e` - Run E2E tests with Playwright
- `npm run test:e2e:headed` - Run E2E tests in headed mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Architecture

### Tech Stack
- React 18 + TypeScript + Vite
- WASM SQLite (sql.js) with localStorage fallback
- Vite PWA Plugin for offline functionality
- Radix UI for accessible components
- Vitest + Playwright for testing

### Key Components
- `TodoContext` - Global state management using React Context
- `db/database.ts` - SQLite wrapper functions with debounced writes
- Service Worker auto-registered for offline caching
- All data stored locally, no backend required

### Database
Data stored in localStorage (with SQLite fallback) with schema:
- todos table with id, title, description, due_date, status, tags, timestamps
- Status values: '未着手' | '進行中' | '完了'

### Important Patterns
- Automatic localStorage persistence for performance
- Filter/sort preferences persisted to localStorage
- Component state managed via TodoContext
- All async operations have error handling

## Development Notes
- PWA manifest and icons configured
- GitHub Actions CI runs lint, test, build on PRs

## Testing
- Unit tests use Vitest with React Testing Library
- E2E tests use Playwright with Chrome
- CI automatically runs all tests on push/PR
- E2E tests in CI include system dependency installation

## Common Issues
- E2E test failures: Usually due to dialog overlay blocking clicks - use specific selectors
- WASM loading: Ensure sql-wasm.wasm is in public directory
