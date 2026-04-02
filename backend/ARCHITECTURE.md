Got it. This is your complete backend blueprint. Read it top to bottom once, then build.

---

# Smart Campus — Complete Backend Blueprint

## Architecture Overview

```
Frontend (Next.js :3000)
        ↕ HTTP/JSON + Bearer JWT
Backend (CI4 :8080)
    /api/v1/*  →  Controllers/Api/
                      ↕
                   Models/
                      ↕
                   MySQL DB
```

Every API response follows this shape:

```
Success:  { status: true,  data: {...},  message: "..." }
Error:    { status: false, data: null,   message: "...", errors: {...} }
```

---

## Database Tables

### 1. `users`

The single identity table for every human in the system. Role determines what they can do.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| name | VARCHAR(100) | full name |
| email | VARCHAR(150) UNIQUE | login identifier |
| password_hash | VARCHAR(255) | argon2id hashed |
| role | ENUM('platform_admin', 'school_admin', 'lecturer', 'finance', 'librarian', 'student', 'applicant') | |
| phone | VARCHAR(20) NULL | |
| avatar_url | VARCHAR(255) NULL | |
| is_active | TINYINT(1) DEFAULT 1 | soft disable |
| email_verified_at | TIMESTAMP NULL | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### 2. `schools`

One record per institution. Multi-tenant anchor — almost every other table references this.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| name | VARCHAR(150) | |
| slug | VARCHAR(150) UNIQUE | URL-safe name |
| description | TEXT NULL | |
| address | VARCHAR(255) NULL | |
| city | VARCHAR(100) NULL | |
| country | VARCHAR(100) DEFAULT 'Cameroon' | |
| phone | VARCHAR(20) NULL | |
| email | VARCHAR(150) NULL | |
| logo_url | VARCHAR(255) NULL | |
| website | VARCHAR(255) NULL | |
| tuition_min | DECIMAL(10,2) NULL | for search filtering |
| tuition_max | DECIMAL(10,2) NULL | |
| pricing_tier | ENUM('basic','standard','premium') DEFAULT 'basic' | platform subscription |
| registration_fields | JSON NULL | dynamic application form schema |
| is_active | TINYINT(1) DEFAULT 1 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### 3. `school_admins`

Junction: which users administrate which school. A user with role `school_admin` must have a row here.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| user_id | INT UNSIGNED FK → users.id | |
| school_id | INT UNSIGNED FK → schools.id | |
| created_at | DATETIME | |

---

### 4. `applications`

An application submitted by anyone (logged in or anonymous) to a school.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| school_id | INT UNSIGNED FK → schools.id | |
| applicant_user_id | INT UNSIGNED NULL FK → users.id | NULL if anonymous |
| applicant_email | VARCHAR(150) | always stored even if user exists |
| applicant_name | VARCHAR(150) | denormalized for quick display |
| payload | JSON | answers to registration_fields schema |
| status | ENUM('pending','under_review','approved','rejected','more_info') DEFAULT 'pending' | |
| reviewer_id | INT UNSIGNED NULL FK → users.id | school admin who acted |
| reviewer_notes | TEXT NULL | |
| reviewed_at | DATETIME NULL | |
| applied_at | DATETIME | |
| updated_at | DATETIME | |

---

### 5. `students`

Created when an application is approved and "Add as student" is triggered. Links a user to a school.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| user_id | INT UNSIGNED FK → users.id | |
| school_id | INT UNSIGNED FK → schools.id | |
| application_id | INT UNSIGNED NULL FK → applications.id | origin application |
| student_number | VARCHAR(50) UNIQUE | generated e.g. SWE24UH022 |
| programme | VARCHAR(150) NULL | e.g. HND Software Engineering |
| level | VARCHAR(50) NULL | e.g. Year 2 |
| admission_year | YEAR | |
| status | ENUM('active','suspended','graduated','withdrawn') DEFAULT 'active' | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### 6. `courses`

Course catalog per school.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| school_id | INT UNSIGNED FK → schools.id | |
| code | VARCHAR(20) | e.g. CS301 |
| title | VARCHAR(150) | |
| description | TEXT NULL | |
| credits | TINYINT UNSIGNED DEFAULT 3 | |
| semester | VARCHAR(50) NULL | e.g. Semester 1 |
| academic_year | VARCHAR(20) NULL | e.g. 2025-2026 |
| is_active | TINYINT(1) DEFAULT 1 | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

---

### 7. `course_lecturers`

Assigns lecturers to courses. A course can have multiple lecturers.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| course_id | INT UNSIGNED FK → courses.id | |
| lecturer_id | INT UNSIGNED FK → users.id | must have role=lecturer |
| school_id | INT UNSIGNED FK → schools.id | denormalized for fast queries |
| assigned_at | DATETIME | |

---

### 8. `course_enrollments`

Which students are enrolled in which courses.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| course_id | INT UNSIGNED FK → courses.id | |
| student_id | INT UNSIGNED FK → students.id | |
| school_id | INT UNSIGNED FK → schools.id | denormalized |
| enrolled_at | DATETIME | |
| status | ENUM('active','dropped','completed') DEFAULT 'active' | |

---

### 9. `attendance_sessions`

A lecturer opens a session for a specific course on a specific date. Generates a QR token.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| course_id | INT UNSIGNED FK → courses.id | |
| lecturer_id | INT UNSIGNED FK → users.id | |
| school_id | INT UNSIGNED FK → schools.id | |
| session_date | DATE | |
| topic | VARCHAR(255) NULL | what was taught |
| qr_token | VARCHAR(100) UNIQUE | random token for QR code |
| token_expires_at | DATETIME | short-lived, e.g. 15 mins |
| is_open | TINYINT(1) DEFAULT 1 | lecturer can close it |
| created_at | DATETIME | |

---

### 10. `attendance_records`

One row per student per session. Marked present/absent/late.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| session_id | INT UNSIGNED FK → attendance_sessions.id | |
| student_id | INT UNSIGNED FK → students.id | |
| school_id | INT UNSIGNED FK → schools.id | |
| status | ENUM('present','absent','late','excused') DEFAULT 'present' | |
| marked_at | DATETIME | |

**Unique constraint:** `(session_id, student_id)` — one record per student per session.

---

### 11. `grades`

One row per student per course. Lecturer enters it, admin publishes.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| student_id | INT UNSIGNED FK → students.id | |
| course_id | INT UNSIGNED FK → courses.id | |
| school_id | INT UNSIGNED FK → schools.id | |
| score | DECIMAL(5,2) NULL | raw score out of 100 |
| grade_letter | VARCHAR(5) NULL | A, B+, etc. computed or entered |
| remarks | TEXT NULL | |
| is_published | TINYINT(1) DEFAULT 0 | admin flips this |
| entered_by | INT UNSIGNED FK → users.id | lecturer |
| created_at | DATETIME | |
| updated_at | DATETIME | |

**Unique constraint:** `(student_id, course_id)` — one grade row per student per course.

---

### 12. `invoices`

School issues an invoice to a student.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| student_id | INT UNSIGNED FK → students.id | |
| school_id | INT UNSIGNED FK → schools.id | |
| invoice_number | VARCHAR(50) UNIQUE | generated e.g. INV-2025-0001 |
| description | VARCHAR(255) | e.g. Tuition Fee Semester 1 |
| amount | DECIMAL(10,2) | |
| status | ENUM('unpaid','partial','paid','overdue','cancelled') DEFAULT 'unpaid' | |
| due_date | DATE NULL | |
| issued_at | DATETIME | |
| updated_at | DATETIME | |

---

### 13. `payments`

A payment made against an invoice.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| invoice_id | INT UNSIGNED FK → invoices.id | |
| student_id | INT UNSIGNED FK → students.id | denormalized |
| school_id | INT UNSIGNED FK → schools.id | denormalized |
| amount | DECIMAL(10,2) | |
| method | ENUM('cash','mobile_money','bank_transfer','card','mock') DEFAULT 'mock' | |
| provider_ref | VARCHAR(150) NULL | external payment reference |
| status | ENUM('pending','completed','failed','refunded') DEFAULT 'completed' | |
| paid_at | DATETIME | |
| notes | TEXT NULL | |

---

### 14. `notifications`

In-app notification per user.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| user_id | INT UNSIGNED FK → users.id | recipient |
| type | VARCHAR(50) | e.g. application_approved, grade_published |
| title | VARCHAR(150) | |
| body | TEXT | |
| is_read | TINYINT(1) DEFAULT 0 | |
| action_url | VARCHAR(255) NULL | where to go on click |
| created_at | DATETIME | |

---

### 15. `emails`

Async email queue. Workers process this table.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| to_email | VARCHAR(150) | |
| to_name | VARCHAR(100) NULL | |
| subject | VARCHAR(255) | |
| body | TEXT | HTML content |
| status | ENUM('queued','sent','failed') DEFAULT 'queued' | |
| attempts | TINYINT DEFAULT 0 | retry counter |
| scheduled_at | DATETIME NULL | send after this time |
| sent_at | DATETIME NULL | |
| created_at | DATETIME | |

---

### 16. `audit_logs`

Every sensitive action is logged here. Non-negotiable for a defense.

| Column | Type | Notes |
|---|---|---|
| id | INT UNSIGNED PK AUTO_INCREMENT | |
| user_id | INT UNSIGNED NULL FK → users.id | NULL for anonymous |
| school_id | INT UNSIGNED NULL | context |
| action | VARCHAR(100) | e.g. application.approved |
| target_type | VARCHAR(50) NULL | e.g. application |
| target_id | INT UNSIGNED NULL | the affected record ID |
| payload | JSON NULL | what changed |
| ip_address | VARCHAR(45) | |
| created_at | DATETIME | |

---

## Controllers

All live under `app/Controllers/Api/`. All return JSON. All are stateless — auth via JWT only.

### AuthController

**File:** `Controllers/Api/AuthController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| register | POST | /api/v1/auth/register | Public | Creates user, returns JWT |
| login | POST | /api/v1/auth/login | Public | Validates credentials, returns JWT |
| logout | POST | /api/v1/auth/logout | JWT | Client discards token (stateless, just confirm) |
| me | GET | /api/v1/auth/me | JWT | Returns current user profile |
| updateProfile | PUT | /api/v1/auth/profile | JWT | Updates name, phone, avatar |
| changePassword | PUT | /api/v1/auth/password | JWT | Old password verify + new hash |

**Validation rules for register:** name required, email valid+unique, password min 8 chars, role only allows 'applicant' from public registration (all other roles assigned by admin).

---

### SchoolController

**File:** `Controllers/Api/SchoolController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| index | GET | /api/v1/schools | Public | Paginated list with search + filters |
| show | GET | /api/v1/schools/:slug | Public | Single school profile |
| store | POST | /api/v1/schools | platform_admin | Create school |
| update | PUT | /api/v1/schools/:id | school_admin | Update own school |
| updateFormSchema | PUT | /api/v1/schools/:id/form | school_admin | Update registration_fields JSON |

**Search filters on index:** `keyword`, `city`, `tuition_min`, `tuition_max`, `pricing_tier`. All optional, all combinable. Pagination via `page` and `per_page`.

---

### ApplicationController

**File:** `Controllers/Api/ApplicationController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| submit | POST | /api/v1/schools/:id/apply | Public | Submit application |
| myApplications | GET | /api/v1/applications/mine | JWT (applicant) | Own application history |
| schoolApplications | GET | /api/v1/schools/:id/applications | JWT (school_admin) | All apps for school |
| show | GET | /api/v1/applications/:id | JWT | Single application |
| review | PUT | /api/v1/applications/:id/review | JWT (school_admin) | Approve/reject/request info |
| addAsStudent | POST | /api/v1/applications/:id/enroll | JWT (school_admin) | Convert approved app to student |

**Business rule on `review`:** Only school_admin of that specific school can review. Status transitions: pending → under_review → approved/rejected/more_info.

**Business rule on `addAsStudent`:** Application must be `approved`. Applicant must have a `users` record. Creates row in `students`. Queues a notification.

---

### StudentController

**File:** `Controllers/Api/StudentController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| index | GET | /api/v1/schools/:id/students | JWT (school_admin) | All students for school |
| show | GET | /api/v1/students/:id | JWT | Student profile |
| myProfile | GET | /api/v1/students/me | JWT (student) | Own student record |
| update | PUT | /api/v1/students/:id | JWT (school_admin) | Update student record |
| suspend | PUT | /api/v1/students/:id/suspend | JWT (school_admin) | Set status=suspended |

---

### CourseController

**File:** `Controllers/Api/CourseController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| index | GET | /api/v1/schools/:id/courses | JWT | All courses for school |
| show | GET | /api/v1/courses/:id | JWT | Single course with enrolled students |
| store | POST | /api/v1/schools/:id/courses | JWT (school_admin) | Create course |
| update | PUT | /api/v1/courses/:id | JWT (school_admin) | Update course |
| assignLecturer | POST | /api/v1/courses/:id/lecturers | JWT (school_admin) | Assign lecturer |
| enroll | POST | /api/v1/courses/:id/enroll | JWT (school_admin) | Enroll student |
| myCourses | GET | /api/v1/courses/mine | JWT (student/lecturer) | Own enrolled/assigned courses |

---

### AttendanceController

**File:** `Controllers/Api/AttendanceController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| createSession | POST | /api/v1/attendance/sessions | JWT (lecturer) | Open session, generate QR token |
| closeSession | PUT | /api/v1/attendance/sessions/:id/close | JWT (lecturer) | Close session |
| markAttendance | POST | /api/v1/attendance/mark | JWT (student) | Student submits QR token |
| sessionRecords | GET | /api/v1/attendance/sessions/:id | JWT | All records for session |
| studentAttendance | GET | /api/v1/students/:id/attendance | JWT | All attendance for student |
| courseSessions | GET | /api/v1/courses/:id/sessions | JWT | All sessions for course |

**Business rule on `markAttendance`:** Validate token exists, is not expired, session is still open. Insert attendance_record. Duplicate check via unique constraint.

---

### GradeController

**File:** `Controllers/Api/GradeController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| enter | POST | /api/v1/grades | JWT (lecturer) | Enter/update grade for student+course |
| publish | PUT | /api/v1/grades/:id/publish | JWT (school_admin) | Flip is_published = 1 |
| courseGrades | GET | /api/v1/courses/:id/grades | JWT (lecturer/admin) | All grades for a course |
| studentGrades | GET | /api/v1/students/:id/grades | JWT | All published grades for student |
| myGrades | GET | /api/v1/grades/mine | JWT (student) | Own published grades |

---

### InvoiceController

**File:** `Controllers/Api/InvoiceController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| store | POST | /api/v1/invoices | JWT (finance/school_admin) | Create invoice |
| studentInvoices | GET | /api/v1/students/:id/invoices | JWT | All invoices for student |
| myInvoices | GET | /api/v1/invoices/mine | JWT (student) | Own invoices |
| show | GET | /api/v1/invoices/:id | JWT | Single invoice |
| recordPayment | POST | /api/v1/invoices/:id/payments | JWT (finance) | Record payment against invoice |
| updateStatus | PUT | /api/v1/invoices/:id/status | JWT (finance) | Mark overdue/cancelled |

---

### NotificationController

**File:** `Controllers/Api/NotificationController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| index | GET | /api/v1/notifications | JWT | Own notifications, unread first |
| markRead | PUT | /api/v1/notifications/:id/read | JWT | Mark one read |
| markAllRead | PUT | /api/v1/notifications/read-all | JWT | Mark all read |
| unreadCount | GET | /api/v1/notifications/count | JWT | Badge count for UI |

---

### DashboardController

**File:** `Controllers/Api/DashboardController.php`

| Method | HTTP | Route | Auth | What it does |
|---|---|---|---|---|
| student | GET | /api/v1/dashboard/student | JWT (student) | Enrolled courses, attendance %, recent grades, unpaid invoices |
| lecturer | GET | /api/v1/dashboard/lecturer | JWT (lecturer) | Assigned courses, upcoming sessions, recent grade entries |
| schoolAdmin | GET | /api/v1/dashboard/school | JWT (school_admin) | Pending applications, student count, revenue summary |
| finance | GET | /api/v1/dashboard/finance | JWT (finance) | Unpaid invoices total, recent payments, overdue list |

---

## Models

One model per table. Each model defines the table name, allowed fields, and validation rules. CI4 models also define relationships via queries (CI4 doesn't have Eloquent-style relationships — you write join queries or use subqueries in your model methods).

| Model | Table | Key methods to write |
|---|---|---|
| UserModel | users | findByEmail(), verifyPassword(), updateLastLogin() |
| SchoolModel | schools | search(filters), findBySlug(), getWithAdmins() |
| SchoolAdminModel | school_admins | getSchoolsForUser(), isAdminOf(userId, schoolId) |
| ApplicationModel | applications | getBySchool(schoolId, filters), getByApplicant(userId), updateStatus() |
| StudentModel | students | getBySchool(schoolId), getByUser(userId), generateStudentNumber() |
| CourseModel | courses | getBySchool(schoolId), getWithEnrollments(), getForLecturer(userId) |
| CourseLecturerModel | course_lecturers | getCoursesForLecturer(), getLecturersForCourse() |
| CourseEnrollmentModel | course_enrollments | getEnrolledStudents(courseId), getStudentCourses(studentId) |
| AttendanceSessionModel | attendance_sessions | createWithToken(), findByToken(), getOpenSessions() |
| AttendanceRecordModel | attendance_records | markPresent(), getBySession(), getStudentSummary() |
| GradeModel | grades | upsert(studentId, courseId), publishBatch(), getStudentReport() |
| InvoiceModel | invoices | generateNumber(), getByStudent(), updateStatusFromPayments() |
| PaymentModel | payments | getByInvoice(), getTotalPaid(invoiceId) |
| NotificationModel | notifications | getUnread(userId), markAllRead(userId), countUnread(userId) |
| EmailModel | emails | queue(to, subject, body), getQueued(), markSent() |
| AuditLogModel | audit_logs | log(userId, action, targetType, targetId, payload) |

---

## Filters (Middleware)

| Filter | File | Applied to | What it does |
|---|---|---|---|
| AuthFilter | Filters/AuthFilter.php | All `/api/v1/*` except auth routes | Validates JWT, injects user into request |
| RoleFilter | Filters/RoleFilter.php | Specific route groups | Checks user role matches required role |
| SchoolAccessFilter | Filters/SchoolAccessFilter.php | School-scoped routes | Checks school_admin belongs to that school |

**How RoleFilter works:** You pass the allowed roles as filter arguments in Routes.php. The filter reads the authenticated user's role (already set by AuthFilter) and returns 403 if it doesn't match.

**How SchoolAccessFilter works:** Reads `school_id` from the route parameter, checks `school_admins` table to confirm the authenticated user is an admin of that school. Returns 403 if not.

---

## Route Groups

Organize `Routes.php` into these groups:

```
Public (no filter):
  POST /api/v1/auth/register
  POST /api/v1/auth/login
  GET  /api/v1/schools
  GET  /api/v1/schools/:slug
  POST /api/v1/schools/:id/apply

Protected (AuthFilter on all):
  GET  /api/v1/auth/me
  POST /api/v1/auth/logout
  PUT  /api/v1/auth/profile
  PUT  /api/v1/auth/password
  ... all other routes

School Admin only (AuthFilter + RoleFilter + SchoolAccessFilter):
  GET/POST/PUT /api/v1/schools/:id/applications
  GET/POST/PUT /api/v1/schools/:id/students
  GET/POST/PUT /api/v1/schools/:id/courses
  PUT /api/v1/applications/:id/review
  POST /api/v1/applications/:id/enroll

Lecturer only (AuthFilter + RoleFilter):
  POST /api/v1/attendance/sessions
  POST /api/v1/grades

Finance only (AuthFilter + RoleFilter):
  POST /api/v1/invoices
  POST /api/v1/invoices/:id/payments
```

---

## JWT Flow

```
Login request
    ↓
Validate email + password
    ↓
Issue JWT payload: { id, email, role, school_id (if school_admin) }
    ↓
Frontend stores token (localStorage or memory)
    ↓
Every request: Authorization: Bearer <token>
    ↓
AuthFilter intercepts → verifies signature → decodes payload
    ↓
Injects user object into CI4 request for controller to use
    ↓
RoleFilter checks role if route requires it
```

Token expiry: 24 hours (`86400` seconds). No refresh token for MVP — just re-login.

---

## Key Business Rules (do not forget these in defense)

**Registration fields are per-school.** The `registration_fields` JSON on `schools` drives the application form. When validating an application submission, you must dynamically build validation rules from that JSON schema — not hardcoded rules.

**Only approved applications can become students.** The `addAsStudent` endpoint must check `status = approved` before creating a student record.

**Only existing platform users can be added as students.** If the applicant has no `users` record, you can only send an invite email — you cannot create a student record.

**Grades are only visible to students after `is_published = 1`.** The `myGrades` and `studentGrades` endpoints filter by `is_published = 1` unless the requester is a lecturer or school admin.

**Attendance tokens are short-lived.** The `token_expires_at` on `attendance_sessions` should be 15 minutes from creation. The `markAttendance` endpoint must check this before accepting.

**School admins only see their own school's data.** Every query in a school-scoped controller must include `WHERE school_id = ?` using the admin's assigned school from `school_admins`. Never trust a school_id from the request body for access control — always derive it from the authenticated user's record.

---

## Demo Seed Data You Need

For a convincing defense demo you need:

- 1 platform_admin user
- 2 schools (HITBAMAS + one other)
- 1 school_admin per school
- 2 lecturers per school
- 1 finance officer per school
- 5–10 students per school (mix of active + one suspended)
- 3–4 courses per school with lecturers assigned
- 10–15 applications (mix of pending, approved, rejected)
- Attendance sessions with records for at least 2 courses
- Grades entered and some published, some not
- 2–3 invoices per student (mix of paid and unpaid)
- Notifications for each user

This gives you a live demo that shows every role dashboard populated with real-looking data without having to click through the full flow during defense.

---

That is the complete map. You now know every table, every column, every controller, every route, every model method, every filter, and every business rule. Start with migrations, then models, then auth, then routes outward from there.
