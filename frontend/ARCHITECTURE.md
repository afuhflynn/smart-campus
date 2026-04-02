Good. I have everything I need. Here is your complete frontend blueprint.

---

# Smart Campus — Complete Frontend Blueprint

## Current State Assessment

Three things to fix before anything else works:

**1. API client is named wrong.** It says `IdeasVault` — rename everything to Smart Campus. More importantly, your error handler reads `response.data.error` but your backend returns `response.data.message`. Fix that field name or every error will silently throw "An unexpected error occurred."

**2. Auth store must be the single source of truth.** Token lives in the Zustand persisted store. The private axios instance reads the token from the store on every request via an interceptor — not from a variable, not from a prop. If the store has a token, the request is authenticated. Period.

**3. Role guard is currently a placeholder.** `check-auth.ts` and `check-role.ts` are empty. Until those are implemented, any user can hit any dashboard URL directly. This will kill you in a defense demo.

---

## Folder Structure (target state)

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx          ← MISSING
│   ├── (general)/
│   │   ├── page.tsx                   ← landing
│   │   ├── schools/
│   │   │   ├── page.tsx               ← school search
│   │   │   └── [slug]/
│   │   │       ├── page.tsx           ← school profile
│   │   │       └── apply/page.tsx     ← application form
│   │   ├── about/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── contact/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                 ← EMPTY, needs auth check
│   │   ├── student/
│   │   │   ├── page.tsx               ← student dashboard
│   │   │   ├── courses/page.tsx       ← MISSING
│   │   │   ├── attendance/page.tsx    ← MISSING
│   │   │   ├── grades/page.tsx        ← MISSING
│   │   │   └── invoices/page.tsx
│   │   ├── lecturer/
│   │   │   ├── page.tsx               ← lecturer dashboard
│   │   │   ├── courses/page.tsx       ← MISSING
│   │   │   ├── grading/page.tsx       ← MISSING
│   │   │   └── attendance/page.tsx
│   │   ├── finance/
│   │   │   ├── page.tsx
│   │   │   ├── invoices/page.tsx      ← MISSING
│   │   │   └── payments/page.tsx      ← MISSING
│   │   ├── library/
│   │   │   ├── page.tsx
│   │   │   ├── catalog/page.tsx       ← MISSING
│   │   │   └── loans/page.tsx         ← MISSING
│   │   └── admin/
│   │       └── email-center/page.tsx
│   └── [schoolId]/
│       └── school/
│           ├── page.tsx               ← school admin dashboard
│           ├── applications/page.tsx  ← MISSING
│           ├── students/page.tsx      ← MISSING
│           ├── courses/page.tsx       ← MISSING
│           └── form-builder/page.tsx
├── components/
│   ├── auth/
│   │   ├── role-guard.tsx             ← needs real implementation
│   │   └── auth-guard.tsx             ← new, wraps dashboard layout
│   ├── layout/
│   │   ├── public-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── app-sidebar.tsx
│   │   ├── navbar.tsx                 ← fix /auth/login → /login
│   │   └── topbar.tsx
│   └── shared/
│       ├── multi-step-application.tsx
│       └── dynamic-form.tsx
├── lib/
│   ├── api-client.ts                  ← rewrite
│   └── mocks/                         ← keep for fallback during dev
├── config/
│   └── axios.config.ts                ← fix base URL + interceptor
├── store/
│   └── use-auth-store.ts              ← needs token + user + role
├── hooks/
│   ├── use-auth.ts                    ← new
│   └── use-api.ts                     ← new
└── types/
    └── api.types.ts                   ← expand significantly
```

---

## Auth Architecture

This is the most important thing to get right. Everything else depends on it.

### Zustand Store Shape

Your store needs to hold exactly this:

| Field | Type | Purpose |
|---|---|---|
| token | string or null | JWT from backend |
| user | User or null | decoded user object |
| isAuthenticated | boolean | derived from token != null |
| isLoading | boolean | during login/register calls |
| login(token, user) | function | sets both, persists |
| logout() | function | clears both, redirects |
| setUser(user) | function | update profile without re-login |

Persist `token` and `user` to localStorage via Zustand persist middleware. On app boot, the store rehydrates from localStorage — this is how login survives a page refresh.

### Axios Config — what it must do

Your `privateAxios` instance needs a request interceptor that reads the token from the Zustand store and attaches it to every request as `Authorization: Bearer <token>`. It also needs a response interceptor that catches 401 responses and calls `logout()` on the store, then redirects to `/login`.

Your `publicAxios` instance needs no interceptors — just the base URL.

Base URL must read from `process.env.NEXT_PUBLIC_API_URL` — never hardcoded. For local dev that env var is `http://localhost:8080/api/v1`.

### Dashboard Layout Auth Check

The `(dashboard)/layout.tsx` is currently empty. It must do one thing: check if the user is authenticated. If not, redirect to `/login`. This is a server component check using the store's persisted token, or a client component that renders a loading state while checking.

### Role Guard

`role-guard.tsx` must accept a `allowedRoles` prop (array of role strings). It reads the current user's role from the auth store. If the role is not in `allowedRoles`, it redirects to the appropriate dashboard for that role — not to login, not to a 404. Wrong role gets sent to their own dashboard.

---

## API Client — Complete Structure

Rename from `IdeasVault` to Smart Campus and expand to cover every backend endpoint. Organize it to mirror the backend controllers exactly:

```
api.auth.register(data)
api.auth.login(data)
api.auth.logout()
api.auth.me()
api.auth.updateProfile(data)
api.auth.changePassword(data)

api.schools.list(filters)         ← public
api.schools.show(slug)            ← public
api.schools.update(id, data)
api.schools.updateForm(id, schema)

api.applications.submit(schoolId, data)   ← public
api.applications.mine()
api.applications.forSchool(schoolId, filters)
api.applications.show(id)
api.applications.review(id, decision)
api.applications.enroll(id)

api.students.forSchool(schoolId, filters)
api.students.show(id)
api.students.me()
api.students.update(id, data)

api.courses.forSchool(schoolId)
api.courses.show(id)
api.courses.create(schoolId, data)
api.courses.mine()
api.courses.enroll(courseId, studentId)
api.courses.assignLecturer(courseId, lecturerId)

api.attendance.createSession(data)
api.attendance.closeSession(sessionId)
api.attendance.mark(token)
api.attendance.sessionRecords(sessionId)
api.attendance.forStudent(studentId)
api.attendance.forCourse(courseId)

api.grades.enter(data)
api.grades.publish(gradeId)
api.grades.forCourse(courseId)
api.grades.forStudent(studentId)
api.grades.mine()

api.invoices.create(data)
api.invoices.forStudent(studentId)
api.invoices.mine()
api.invoices.show(id)
api.invoices.recordPayment(invoiceId, data)

api.notifications.list()
api.notifications.markRead(id)
api.notifications.markAllRead()
api.notifications.unreadCount()

api.dashboard.student()
api.dashboard.lecturer()
api.dashboard.schoolAdmin()
api.dashboard.finance()
```

---

## Page-by-Page Blueprint

---

### `/login`

**Route fix needed:** navbar, role-guard, and dashboard-layout all link to `/auth/login`. Change all three to `/login`.

**What it does:** Email + password form. On submit calls `api.auth.login()`. On success stores token + user in Zustand, redirects based on role:

| Role | Redirect |
|---|---|
| student | /student |
| lecturer | /lecturer |
| school_admin | /:schoolId/school |
| finance | /finance |
| librarian | /library |
| platform_admin | /admin |
| applicant | /schools |

**State:** form state (email, password), loading bool, error string.
**No auth required.**

---

### `/register`

**Status: MISSING — must build.**

**What it does:** Name, email, password, confirm password. Role is always `applicant` — public registration only creates applicants. On success auto-logs in and redirects to `/schools`.

**State:** form fields, loading, error.
**No auth required.**

---

### `/schools`

**Status: Exists, has query key bug.**

**Fix:** Change query key from `location` to `params.city`.

**What it does:** Search bar + filters (city, tuition range). Calls `api.schools.list(filters)` via TanStack Query. Paginated grid of school cards. Each card links to `/schools/[slug]`.

**Filters:** keyword, city, tuition_min, tuition_max. All stored in URL via nuqs — already wired, just needs real API call replacing mock.

**State:** URL search params via nuqs, TanStack Query for data fetching.

---

### `/schools/[slug]`

**Status: Exists, uses mock data.**

**What it does:** Full school profile. Name, description, city, tuition range, programmes. Shows the application form fields preview. Big "Apply Now" CTA that goes to `/schools/[slug]/apply`.

**API call:** `api.schools.show(slug)` — public, no auth needed.

**State:** TanStack Query for school data.

---

### `/schools/[slug]/apply`

**Status: Exists, uses mock data.**

**What it does:** Multi-step application form. Step 1 renders dynamic fields from `school.registration_fields`. Step 2 is review. Step 3 is confirmation. If user is logged in, pre-fill name and email from auth store. If not logged in, show soft CTA to create account but allow submission anyway.

**API call:** `api.applications.submit(schoolId, payload)`.

**State:** multi-step local state, form data, loading, success/error.

---

### `(dashboard)/layout.tsx`

**Status: Empty — must implement.**

**What it does:** Wraps all dashboard routes. Checks auth store — if no token, redirect to `/login`. Renders `DashboardLayout` with sidebar and topbar. Passes user to sidebar for role-based menu rendering.

This is a client component. It shows a loading spinner while the store rehydrates from localStorage on first render.

---

### `/student` — Student Dashboard

**Status: Exists, mock data.**

**What it does:** KPI cards (enrolled courses count, attendance %, GPA, unpaid invoice total). Recent activity feed. Quick links to courses, grades, attendance.

**API call:** `api.dashboard.student()` — single call returns all KPIs.

---

### `/student/courses`

**Status: MISSING — must build.**

**What it does:** Grid of enrolled courses. Each course card shows: code, title, lecturer name, credits, semester. Click opens course detail (can be a modal or a new page — modal is faster to build).

**API call:** `api.courses.mine()`.

**State:** TanStack Query.

---

### `/student/attendance`

**Status: MISSING — must build.**

**What it does:** Two sections. Top: QR scanner or token input field — student enters the session token to mark themselves present. Bottom: attendance history table grouped by course showing present/absent/late per session with overall attendance percentage per course.

**API calls:** `api.attendance.mark(token)` for marking. `api.attendance.forStudent(studentId)` for history.

**State:** token input local state, TanStack Query for history, mutation for marking.

---

### `/student/grades`

**Status: MISSING — must build.**

**What it does:** Table of all published grades grouped by course. Columns: course code, course title, score, grade letter, remarks. Summary row showing GPA or average. Only shows `is_published = true` grades.

**API call:** `api.grades.mine()`.

**State:** TanStack Query.

---

### `/student/invoices`

**Status: Exists, mock data.**

**What it does:** List of all invoices with status badges (unpaid red, paid green, overdue orange). Each row shows invoice number, description, amount, due date, status. Unpaid invoices have a "Pay" button — for demo this triggers a mock payment that calls the API with `method: 'mock'`.

**API calls:** `api.invoices.mine()`, `api.invoices.recordPayment(id, {method:'mock', amount})`.

---

### `/lecturer` — Lecturer Dashboard

**Status: Exists, mock data.**

**What it does:** KPI cards (assigned courses, total students, sessions this week, pending grades). List of assigned courses with quick action buttons.

**API call:** `api.dashboard.lecturer()`.

---

### `/lecturer/courses`

**Status: MISSING — must build.**

**What it does:** List of courses assigned to this lecturer. Each course card shows enrollment count, next session date. Click expands to show enrolled student list.

**API call:** `api.courses.mine()`.

---

### `/lecturer/attendance`

**Status: Exists, partially built.**

**What it does:** Two modes. Mode 1 (Create Session): select course, enter topic, click "Open Session" — calls `api.attendance.createSession()`, receives QR token back, displays QR code and the token string for students to scan/enter. Button to close session. Mode 2 (History): past sessions list with attendance counts.

**API calls:** `api.attendance.createSession()`, `api.attendance.closeSession()`, `api.attendance.forCourse(courseId)`.

**Important:** QR code display — use the `qrcode` npm package to render the token as a QR image client-side. No external QR service needed.

---

### `/lecturer/grading`

**Status: MISSING — must build.**

**What it does:** Select course from dropdown. Table of enrolled students with score input per student. Bulk entry — lecturer fills all scores then clicks "Save All". Each row: student name, student number, score input (0–100), grade letter (auto-computed from score), remarks textarea.

**API call:** `api.grades.enter(data)` per student, or batch if you build a batch endpoint.

**Grade letter computation (do it on the frontend):**

- 80–100 → A
- 70–79 → B+
- 60–69 → B
- 50–59 → C
- 40–49 → D
- Below 40 → F

**State:** selected course, grade rows local state, save mutation.

---

### `/finance` — Finance Dashboard

**Status: Exists, mock data.**

**What it does:** KPI cards (total invoiced, total collected, outstanding amount, overdue count). Recent payments list.

**API call:** `api.dashboard.finance()`.

---

### `/finance/invoices`

**Status: MISSING — must build.**

**What it does:** Table of all invoices for the school. Filter by status (all/unpaid/paid/overdue). Search by student name or invoice number. Each row: student name, invoice number, description, amount, status badge, due date, action button. Action: "Record Payment" opens a modal with amount + method fields.

**API calls:** `api.invoices.forStudent()` or school-scoped invoices endpoint, `api.invoices.recordPayment()`.

---

### `/finance/payments`

**Status: MISSING — must build.**

**What it does:** Payment history table. Columns: date, student, invoice number, amount, method, reference, status. Filter by date range and method. Total received amount shown at top.

**API call:** Reuse invoice data with payment sub-records, or add a dedicated payments list endpoint.

---

### `/library` — Librarian Dashboard

**Status: Exists, mock data.**

**What it does:** KPI cards (total books, books on loan, overdue loans, available books). Recent loan activity.

**Note:** Library is out of scope for backend MVP. Keep this page on mock data for the defense. Tell the examiner library is implemented as a future phase — the UI is ready.

---

### `/library/catalog` and `/library/loans`

**Status: MISSING.**

**Recommendation:** Build these as static/mock pages only. The UI is what matters for defense. Wire them up after the core MVP is solid.

---

### `/:schoolId/school` — School Admin Dashboard

**Route fix needed:** All sidebar links and role-guard redirects currently go to `/school/...`. They must go to `/:schoolId/school/...`. The `schoolId` comes from the logged-in school admin's record in the auth store — store it there at login time.

**What it does:** KPI cards (pending applications, total students, active courses, revenue this month). Quick actions: review applications, add student.

**API call:** `api.dashboard.schoolAdmin()`.

---

### `/:schoolId/school/applications`

**Status: MISSING — must build. Highest priority.**

**What it does:** The core review workflow. Table of applications with filters (pending/approved/rejected/all). Each row: applicant name, email, applied date, status badge. Click row to open application detail panel (slide-over or modal). Detail panel shows all submitted fields from payload JSON. Action buttons: Approve, Reject, Request More Info. Each action has a notes textarea. On approve: if applicant has account, show "Add as Student" button.

**API calls:**

- `api.applications.forSchool(schoolId, filters)`
- `api.applications.show(id)`
- `api.applications.review(id, {status, notes})`
- `api.applications.enroll(id)` — only shown after approval + account exists

**State:** TanStack Query for list, selected application local state, review mutation, filter URL params.

---

### `/:schoolId/school/students`

**Status: MISSING — must build.**

**What it does:** Table of all enrolled students. Search by name or student number. Filter by programme, level, status. Each row: student number, name, programme, level, admission year, status badge. Row actions: view profile, suspend.

**API calls:** `api.students.forSchool(schoolId)`, `api.students.suspend(id)`.

---

### `/:schoolId/school/courses`

**Status: MISSING — must build.**

**What it does:** Course catalog management. Table of courses with columns: code, title, credits, semester, enrolled count, assigned lecturers. Actions: create course (modal), edit, assign lecturer (dropdown of school's lecturers), enroll students.

**API calls:** `api.courses.forSchool(schoolId)`, `api.courses.create()`, `api.courses.assignLecturer()`, `api.courses.enroll()`.

---

### `/:schoolId/school/form-builder`

**Status: Exists.**

**What it does:** Drag-and-drop or list-based editor for `registration_fields` JSON. Each field has: name, label, type (text/email/select/number/textarea), required toggle, options (for select). Preview panel shows live form. Save calls `api.schools.updateForm(schoolId, schema)`.

**API call:** `api.schools.updateForm(id, schema)`.

---

## TanStack Query — Key Patterns

Every data fetch goes through TanStack Query. Never fetch in `useEffect`. The patterns are:

**Query key convention:** Always include the resource type and its ID parameters. Examples: `['schools', filters]`, `['applications', schoolId, status]`, `['grades', 'mine']`. This ensures cache invalidation works correctly — when you approve an application, invalidate `['applications', schoolId]` and the list auto-refreshes.

**Mutations:** Every write operation (approve, submit, create) is a TanStack mutation. On success, invalidate the relevant query keys. Show toast on success and error — you already have this wired.

**Loading states:** Every page that fetches data shows a skeleton loader while `isLoading` is true. Every page that has a mutation shows a spinner on the action button while `isPending` is true. Never disable the whole form — just the submit button.

---

## State Management Rules

| What | Where |
|---|---|
| Auth token + user | Zustand (persisted) |
| Server data | TanStack Query cache |
| URL filters and search params | nuqs |
| Form state | React local state (useState) |
| Modal open/close | React local state |
| Selected row / active item | React local state |

Nothing server-related goes into Zustand. Nothing URL-related goes into useState. Nothing persistent goes into TanStack Query. Follow this and you will have zero state bugs.

---

## Route Fix Checklist

These are broken right now and will cause demo failures:

| File | Current (wrong) | Fix to |
|---|---|---|
| navbar.tsx line 62 | `/auth/login` | `/login` |
| role-guard.tsx line 20 | `/auth/login` | `/login` |
| dashboard-layout.tsx line 16 | `/auth/login` | `/login` |
| role-guard.tsx line 33 | `/school/...` | `/:schoolId/school/...` |
| app-sidebar.tsx line 81 | `/school/...` | `/:schoolId/school/...` |
| axios.config.ts line 3 | wrong base URL | `process.env.NEXT_PUBLIC_API_URL` |
| axios.config.ts line 29 | redirects to `/sign-in` | redirects to `/login` |
| schools/page.tsx line 31 | query key uses `location` | use `params.city` |
| app/(dashboard)/layout.tsx | empty | implement auth check |
| check-auth.ts | empty | implement token check |
| check-role.ts | empty | implement role check |

---

## Types You Need

Expand `types/api.types.ts` to cover every entity. The minimum you need:

`User` — id, name, email, role, phone, avatar_url, is_active, school_id (for school_admin)

`School` — all fields from the DB table plus `registration_fields: FormField[]`

`FormField` — name, label, type, required, options (string array, for select)

`Application` — all fields, plus `applicant: User | null`, `school: School`

`Student` — all fields, plus `user: User`, `school: School`

`Course` — all fields, plus `lecturers: User[]`, `enrollment_count: number`

`AttendanceSession` — all fields, plus `records_count: number`

`AttendanceRecord` — session_id, student_id, status, marked_at, plus `student: Student`

`Grade` — all fields, plus `student: Student`, `course: Course`

`Invoice` — all fields, plus `student: Student`, `payments: Payment[]`

`Payment` — all fields

`Notification` — all fields

`ApiResponse<T>` — `{ status: boolean, data: T, message: string, errors?: Record<string, string[]> }`

`PaginatedResponse<T>` — `{ data: T[], meta: { total, per_page, current_page, last_page } }`

---

## Environment Variables

Create `.env.local` in the frontend root:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_NAME=Smart Campus
```

Never hardcode the API URL anywhere else in the codebase.

---

## Build Order for the Frontend

Given you have 6 hours, do this in this exact order:

1. Fix all 9 route bugs in the checklist above — 20 minutes
2. Fix axios config (base URL + interceptors) — 15 minutes
3. Implement Zustand auth store with token + user + role — 20 minutes
4. Expand api-client.ts with all endpoints — 30 minutes
5. Implement dashboard layout auth check — 15 minutes
6. Implement role-guard — 15 minutes
7. Wire login page to real API — 20 minutes
8. Build `/register` — 20 minutes
9. Wire school search to real API — 15 minutes
10. Wire application submit to real API — 15 minutes
11. Build `/:schoolId/school/applications` — 45 minutes (highest value for defense)
12. Build `/student/courses`, `/student/grades`, `/student/attendance` — 30 min each
13. Build `/lecturer/grading` — 30 minutes
14. Build `/finance/invoices` — 30 minutes
15. Build `/:schoolId/school/students` and `/courses` — 30 minutes each

That is roughly 6.5 hours of focused work. Prioritize 1–11 — those are the ones that will be demoed and examined.
