# Staffup LMS — Frontend

Production-ready Next.js frontend for the Staffup Learning Management System

## Tech Stack

| Category         | Technology                      |
| ---------------- | ------------------------------- |
| Framework        | Next.js 16 (App Router)         |
| Language         | TypeScript (Strict)             |
| Styling          | Tailwind CSS v4 + Shadcn/ui     |
| State Management | Zustand (with persistence)      |
| Data Fetching    | TanStack React Query v5 + Axios |
| Forms            | React Hook Form + Zod           |
| Icons            | Lucide React                    |
| Linting          | ESLint 9 + Prettier             |
| Git Hooks        | Husky + lint-staged             |
| Package Manager  | pnpm                            |

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command             | Description               |
| ------------------- | ------------------------- |
| `pnpm dev`          | Start dev server          |
| `pnpm build`        | Build for production      |
| `pnpm start`        | Start production server   |
| `pnpm lint`         | Run ESLint                |
| `pnpm lint:fix`     | Fix ESLint errors         |
| `pnpm format`       | Format code with Prettier |
| `pnpm format:check` | Check formatting          |

## Docker

```bash
# Development
docker compose up

# Production build
docker build --target production -t staffup-frontend .
docker run -p 3000:3000 staffup-frontend
```

## Project Structure

```
src/
├── app/                  # Next.js App Router (routes & layouts)
│   ├── (auth)/           # Auth route group (login, register)
│   └── (dashboard)/      # Dashboard route group
├── components/
│   ├── ui/               # Shadcn/ui base components
│   ├── shared/           # Reusable (Navbar, Sidebar, Footer)
│   └── features/         # Domain-grouped components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities (axios, query-client, utils)
├── services/             # API service modules
├── store/                # Zustand stores
├── types/                # TypeScript interfaces
├── assets/               # Images, fonts, local icons
└── proxy.ts              # Route protection (Next.js 16)
```
