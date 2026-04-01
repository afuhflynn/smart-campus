# Smart Campus Frontend

This is the Next.js frontend for the Smart Campus Management System.

It provides:

- public school discovery pages
- dynamic application flows
- role-based dashboards
- reusable UI components and layouts

## Purpose

The frontend is the user-facing layer of the platform. It is responsible for:

- helping students discover schools
- rendering school-specific application forms
- providing role-based dashboards for campus operations
- consuming backend APIs for authentication, admissions, academics, finance, and reporting

At the moment, the UI is well developed, but much of the data layer is still mock-based.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- TanStack Query v5
- Zustand
- nuqs
- React Hook Form + Zod
- shadcn/ui + Radix UI
- Biome

## Folder Structure

```text
frontend/
├── app/          # App Router routes, layouts, pages
├── components/   # Shared UI, layouts, auth, and feature components
├── config/       # Axios configuration
├── data/         # Mock JSON datasets
├── hooks/        # Shared hooks
├── lib/          # API clients, mocks, helpers
├── nuqs/         # URL query-state schema
├── public/       # Static assets
└── store/        # Zustand state stores
```

## Implemented Pages

### Public pages

- `/`
- `/about`
- `/contact`
- `/how-it-works`
- `/pricing`
- `/schools`
- `/schools/[slug]`
- `/schools/[slug]/apply`
- `/login`

### Dashboard pages

- `/student`
- `/student/invoices`
- `/lecturer`
- `/lecturer/attendance`
- `/finance`
- `/library`
- `/admin/email-center`
- `/:schoolId/school`
- `/:schoolId/school/form-builder`

## Current Frontend Features

### Public experience

- Landing page and marketing flow
- School search and filtering
- School profile pages
- Dynamic application form rendering
- Multi-step application UI

### Role-based experience

- Student dashboard
- Lecturer dashboard
- School admin dashboard
- Finance dashboard
- Library dashboard
- Platform admin email center

### Shared infrastructure

- Global providers for TanStack Query and `nuqs`
- Zustand persisted auth store
- Reusable dashboard layout
- Shared sidebar/topbar patterns
- Large local UI component library

## Current Data Sources

Most app data is still driven by local mock files:

- `data/schools.json`
- `data/users.json`
- `data/applications.json`

Mock services currently live in:

- `lib/mocks/school-service.ts`
- `lib/mocks/auth-service.ts`

## Setup

### Requirements

- Node.js 18+
- pnpm

### Install

```bash
cd frontend
pnpm install
```

### Run

```bash
pnpm dev
```

Open:

- `http://localhost:3000`

## Environment

Current frontend environment:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Important:

- This currently points back to the frontend host.
- When the backend API is fully integrated, this should point to the backend server, for example `http://localhost:8080`.

## Available Scripts

```bash
pnpm dev
pnpm dev:clear
pnpm build
pnpm start
pnpm lint
pnpm format
```

## Demo Credentials

Any password works with these mock accounts:

- `student@example.com`
- `lecturer@example.com`
- `admin@example.com`
- `finance@example.com`
- `librarian@example.com`
- `platform@example.com`

## Current Limitations

These are the most important known gaps right now:

- The app still relies heavily on mock data.
- Some links and redirects do not yet match the actual App Router paths.
- Several sidebar/footer routes point to pages that are not implemented yet.
- The real backend API client exists, but most screens are not wired to it yet.
- Some helper files are placeholders and need proper implementation.
- Linting currently reports many issues that should be cleaned up before production use.

## Frontend Roadmap

The main next steps are:

1. Replace mock auth and school services with real backend API calls.
2. Align route names and redirects with the actual App Router structure.
3. Connect admissions flows end-to-end.
4. Back student, lecturer, finance, and admin dashboards with real API data.
5. Remove stale mock/demo-only paths as real modules are completed.

## Notes

The frontend already demonstrates the product vision well:

- multi-role design
- dynamic forms
- end-to-end student lifecycle UI
- SaaS-style school discovery entry point

Its main remaining work is backend integration and route/data cleanup.

