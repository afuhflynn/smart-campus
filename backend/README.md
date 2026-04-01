# Smart Campus Backend

This is the CodeIgniter 4 backend for the Smart Campus Management System.

It is intended to provide:

- authentication and authorization
- tenant-aware business logic
- admissions workflows
- academic and finance APIs
- validation, reporting, and data access

## Purpose

The backend is the system-of-record layer for the platform.

Its long-term responsibilities are:

- managing schools, users, and permissions
- receiving and validating student applications
- supporting admissions decisions
- powering course, attendance, grading, and invoice workflows
- enforcing school-level data isolation in a multi-tenant SaaS model

## Current Status

The backend is still in an early implementation stage.

What exists today:

- CodeIgniter 4 starter setup
- MySQL configuration
- JWT package installed
- custom request validation utility
- custom JWT session extraction helper
- custom auth filter
- default root route

What does not yet exist in live routed code:

- full Smart Campus REST API
- domain models
- migrations for the main system entities
- admissions endpoints
- course/attendance/grade/payment endpoints

Much of the intended API logic is currently drafted in `TODO.md`, not yet wired into the live application.

## Stack

- PHP 8.1+
- CodeIgniter 4
- MySQL
- Firebase PHP-JWT
- PHPUnit

## Folder Structure

```text
backend/
├── app/
│   ├── Config/
│   ├── Controllers/
│   ├── Database/
│   ├── Filters/
│   ├── Libraries/
│   ├── Models/
│   └── Views/
├── public/
├── tests/
├── writable/
├── composer.json
└── spark
```

## Important Custom Backend Pieces

### `app/Libraries/ApiRequestValidator.php`

Custom request validator for:

- JSON payload validation
- nested field validation
- unexpected field rejection
- reusable rule-based validation messages

### `app/Libraries/GetSession.php`

JWT helper that:

- reads `Authorization: Bearer <token>`
- validates JWT using `JWT_KEY`
- extracts a normalized user/session payload

### `app/Filters/AuthFilter.php`

Auth filter that:

- checks request authentication before protected routes
- returns JSON `401 Unauthorized` when auth fails

## Current Live Routes

At the moment, only one route is registered:

- `GET /` -> default `Home::index`

That means the backend is not yet serving the full Smart Campus API.

## Planned API Direction

Based on the current project design, the backend is expected to evolve into a tenant-aware JSON API with modules for:

- auth
- schools
- application forms
- applications
- admissions review
- students
- lecturers
- courses
- attendance
- grades
- invoices
- payments
- reports

Target role set:

- `platform_admin`
- `school_admin`
- `student`
- `lecturer`
- `finance_officer`

## Setup

### Requirements

- PHP 8.1 or newer
- Composer
- MySQL

### Install dependencies

```bash
cd backend
composer install
```

### Configure environment

Create or update `.env` with:

- `CI_ENVIRONMENT`
- database host, name, username, password
- `JWT_KEY`

Example areas already expected by the app:

- database settings
- JWT secret

Important:

- Do not commit real secrets.
- Rotate any secrets that were previously committed during development.

### Run the development server

```bash
php spark serve
```

Default local URL:

- `http://localhost:8080`

## Testing

Run tests with:

```bash
vendor/bin/phpunit
```

Current test state:

- The repository still contains CodeIgniter starter tests.
- Some tests fail if the SQLite3 PHP extension is not installed.
- Project-specific Smart Campus tests have not been added yet.

## Current Limitations

- The backend is still closer to a starter template than a complete product API.
- No real Smart Campus models are implemented yet.
- No production admissions routes are wired.
- No tenant-aware data model is present yet.
- CORS configuration is still essentially default and needs frontend-aware setup.
- The planned auth/controller logic in `TODO.md` is not yet integrated into `app/Controllers`.

## Suggested Backend Roadmap

1. Create real API routes under `/api`.
2. Implement auth endpoints using the existing JWT utility approach.
3. Add database migrations for schools, users, forms, and applications.
4. Implement the admissions MVP first.
5. Extend into academics, finance, and reporting after admissions is stable.

## Notes

The backend already has the beginnings of a solid API foundation:

- reusable validation
- JWT-based session extraction
- filter-driven protection

The next step is to turn that foundation into the real Smart Campus domain API.
