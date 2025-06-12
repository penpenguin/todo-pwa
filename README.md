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
- **Performance**: Optimized for fast loading and smooth interactions

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

# Install Playwright browsers for E2E testing (optional)
npx playwright install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server at http://localhost:5173
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
# Unit tests with Vitest
npm test

# Unit tests in watch mode
npm test -- --watch

# Unit tests with UI
npm run test:ui

# E2E tests with Playwright
npm run test:e2e

# E2E tests with UI (headed mode)
npm run test:e2e:headed
```

### E2E Testing

E2E tests use Playwright and test the following scenarios:
- Adding new tasks
- Editing existing tasks
- Completing/uncompleting tasks
- Deleting tasks
- Filtering by status
- Offline functionality
- Data export/import

For local E2E testing, Playwright will automatically start the dev server.

### CI/CD

The project uses GitHub Actions for continuous integration:

- **Linting**: ESLint checks on every push/PR
- **Unit Tests**: Vitest tests with coverage
- **E2E Tests**: Playwright tests on Ubuntu with Chrome
- **Build**: Production build verification

Test results and artifacts are automatically uploaded for failed builds.

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory. The build process:
- Compiles TypeScript
- Bundles and minifies code
- Generates PWA assets
- Copies WASM files
- Creates service worker

## Deployment

### GitHub Pages (Automatic)

The app automatically deploys to GitHub Pages when changes are pushed to the `main` branch:

1. The CI/CD workflow runs tests, linting, and builds the app
2. If all checks pass, the build artifacts are deployed to GitHub Pages
3. The app will be available at `https://penpenguin.github.io/todo-pwa/`

### Manual Deployment

The app can also be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages (manual)
- AWS S3 + CloudFront

Ensure your hosting service supports:
- HTTPS (required for Service Workers)
- Proper MIME types for .wasm files
- Cache headers for optimal performance

For manual deployment, build the app and upload the `dist` folder:

```bash
npm run build
# Upload contents of dist/ folder to your hosting service
```

## Browser Support

- Chrome/Edge 90+
- Firefox 89+
- Safari 15+

All browsers must support:
- WebAssembly
- Service Workers
- IndexedDB/localStorage
- ES2020+ features

## Troubleshooting

### E2E Tests Failing

If E2E tests fail locally:

```bash
# Install system dependencies (Linux/WSL)
sudo npx playwright install-deps

# Or install specific browsers
npx playwright install chromium
```

### WASM Loading Issues

If you see WASM-related errors:
1. Ensure your server serves `.wasm` files with `application/wasm` MIME type
2. Check that `sql-wasm.wasm` is in the `public` directory
3. Verify CORS headers if loading from a different domain

### PWA Installation

For PWA installation to work:
1. Serve the app over HTTPS (or localhost)
2. Ensure `manifest.json` is accessible
3. Check browser DevTools > Application tab for PWA status

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs must pass:
- ESLint checks
- Unit tests
- E2E tests

## License

MIT