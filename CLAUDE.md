# Nsfw-Index — Developer Guide

## Project Overview

Next.js 14 web application with TypeScript, Tailwind CSS, and Jest.

## Prerequisites

- Node.js 22+
- npm 10+

## Setup

```bash
npm install
```

## Development

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
```

## Code Quality

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Auto-fix lint issues
npm run format         # Format with Prettier
npm run format:check   # Check formatting
npm run type-check     # TypeScript type checking
```

## Testing

```bash
npm test              # Run tests in watch mode
npm run test:ci       # Run tests with coverage (used in CI)
```

Test files live alongside source code in `__tests__/` subdirectories or as `*.test.ts(x)` files.

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  components/    # Reusable React components
  lib/           # Utility functions and shared logic
    __tests__/   # Unit tests
.github/
  workflows/     # CI/CD pipelines
```

## CI

GitHub Actions runs on every push to `main` and `claude/**` branches, and on pull requests to `main`:

1. **Lint & Type Check** — ESLint, Prettier, TypeScript
2. **Unit Tests** — Jest with coverage upload
3. **Build** — Next.js production build

## Conventions

- TypeScript strict mode is enabled
- Imports use the `@/` alias for `src/`
- Prettier config: 100 char width, double quotes, trailing commas (ES5)
