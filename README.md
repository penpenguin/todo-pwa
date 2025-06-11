# Offline Todo PWA

A personal offline-first Progressive Web App (PWA) for managing tasks, built with React, TypeScript, and WASM-based SQLite.

## Features

- **Offline-First**: All data stored locally using SQLite (via sql.js WASM) or localStorage fallback
- **PWA**: Installable app with offline functionality via Service Worker
- **Task Management**: 
  - Add tasks with title, description, due date, status, and tags
  - Edit existing tasks
  - Mark tasks as complete/incomplete
  - Delete tasks
- **Filtering & Sorting**:
  - Filter by status (未着手/進行中/完了)
  - Filter by tags
  - Sort by due date, creation date, or title
- **Data Portability**:
  - Export all tasks to JSON
  - Import tasks from JSON (merge or replace)
- **Performance**: Lighthouse score ≥90, bundle size <500KB

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Database**: sql.js (SQLite WASM) with localStorage fallback
- **PWA**: Vite PWA Plugin + Workbox
- **UI Components**: Radix UI
- **Testing**: Vitest + Playwright
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd todo-pwa

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run E2E tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Architecture

### Directory Structure

```
src/
├── components/       # React components
├── contexts/        # React contexts (TodoContext)
├── db/             # Database layer (SQLite wrapper)
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── tests/          # Unit tests
└── serviceWorkerRegistration.ts
```

### Database Schema

```sql
CREATE TABLE todos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  title     TEXT    NOT NULL,
  description TEXT,
  due_date  TEXT,
  status    TEXT    NOT NULL DEFAULT '未着手',
  tags      TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Key Components

- **TodoContext**: Global state management for todos
- **AddTaskDialog**: Modal for adding/editing tasks
- **TodoList**: Main list display component
- **FilterBar**: Status and sort controls
- **ExportImport**: Data export/import functionality

## Development

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# E2E tests with UI
npm run test:e2e:headed
```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Deployment

The app can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Ensure your hosting service supports:
- HTTPS (required for Service Workers)
- Proper MIME types for .wasm files
- Cache headers for optimal performance

## Browser Support

- Chrome/Edge 90+
- Firefox 89+
- Safari 15+

## License

MIT