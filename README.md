# Smart Campus Management System

Smart Campus is a web-based campus management platform designed to replace manual, fragmented school operations with one centralized system.

It covers the student lifecycle from school discovery and application to academic management, attendance, grading, fee tracking, and reporting through role-based dashboards.

## Overview

Many schools still rely on:

- scattered spreadsheets
- paper-based registration and attendance
- delayed fee tracking
- disconnected departments
- slow communication and reporting

This project brings those workflows into a single digital platform for:

- students
- lecturers
- school administrators
- finance officers
- platform administrators

## Core Capabilities

- School discovery and comparison
- Dynamic online application forms per school
- Admissions review and approval workflows
- Role-based dashboards and permissions
- Course and academic management
- Attendance tracking
- Grade management
- Invoice and payment tracking
- Reporting and analytics

## Architecture

This repository is split into two main applications:

- `frontend/`: Next.js + Tailwind CSS web client
- `backend/`: CodeIgniter 4 + MySQL API layer

High-level flow:

1. The frontend provides public pages and role-based dashboards.
2. The backend exposes APIs, validation, authentication, and business logic.
3. MySQL stores tenant, user, academic, and finance data.

Target architecture:

- Frontend -> Backend API -> Database
- Multi-tenant SaaS model with data isolated by school

## Repository Structure

```text
smart-campus-app/
├── frontend/   # Next.js application
├── backend/    # CodeIgniter 4 application
└── README.md   # Project overview
```

## Current Status

The project is in a strong prototype stage.

### Frontend

- Public marketing and school discovery flows are present
- Dynamic application UI exists
- Multiple role dashboards exist
- Most frontend data is still mock-driven
- Some routes and links need alignment before full backend integration

See [frontend/README.md](./frontend/README.md) for details.

### Backend

- CodeIgniter 4 starter setup is in place
- JWT support is installed
- A custom request validator and auth filter exist
- The real Smart Campus domain API is not fully implemented yet
- Much of the intended backend logic is still planned rather than wired into routes/controllers

See [backend/README.md](./backend/README.md) for details.

## Tech Stack

### Frontend

- Next.js 16
- React 19
- Tailwind CSS v4
- TanStack Query
- Zustand
- React Hook Form + Zod
- shadcn/ui + Radix UI

### Backend

- PHP 8.1+
- CodeIgniter 4
- MySQL
- Firebase PHP-JWT
- PHPUnit

## Getting Started

### 1. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on:

- `http://localhost:3000`

### 2. Backend

```bash
cd backend
composer install
php spark serve
```

Backend typically runs on:

- `http://localhost:8080`

## Environment Notes

### Frontend

The frontend expects:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

This is currently pointing to the frontend itself and will need to be updated when the real backend API integration is completed.

### Backend

The backend uses `.env` for:

- database connection
- environment mode
- JWT secret

Do not commit real secrets or production credentials.

## Defense Summary

A concise project description you can use during defense:

> My project is a Smart Campus Management System that digitizes and integrates the entire student lifecycle, from school discovery and application to academic management and financial tracking, into a single role-based platform.

If you want the stronger SaaS angle:

> It is designed as a multi-tenant SaaS platform, meaning multiple schools can use the same system while keeping their data isolated.

## Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## Important Notes

- The frontend is currently more complete than the backend.
- The backend is still evolving from starter-template code into the final Smart Campus API.
- Some mock services on the frontend will be replaced as real backend modules are implemented.

