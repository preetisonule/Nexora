# Nexora — Go Programming Learning Platform

> **Learn. Practice. Build. Prove.**
> A full-stack e-learning web app for mastering the **Go (Golang)** programming language through structured lessons, real coding assignments, quizzes, a capstone project and a verifiable certificate.

This is a **college mini project** built with the MERN stack (MongoDB, Express, React, Node.js) plus a real Go compiler on the backend. The user interface is built with **Material UI (MUI)** and follows the purple-and-yellow look of the *"Eduvance — Education Website"* design template.

---

## Table of Contents

1. [Features](#features)
2. [UI Design](#ui-design)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Demo Login](#demo-login)
7. [Pages & Routes](#pages--routes)
8. [REST API Endpoints](#rest-api-endpoints)
9. [Database Models](#database-models)
10. [How Learning Progress Works](#how-learning-progress-works)
11. [Available Scripts](#available-scripts)
12. [Testing](#testing)
13. [Team](#team)

---

## Features

### For Learners
- **Account system** — register, sign in, sign out, forgot / reset password (JWT stored in an HTTP-only cookie).
- **Course catalog** — search courses and filter by level.
- **10-module Go course** with ~60 lessons: from installing Go to generics, testing and concurrency.
- **Lesson viewer** — formatted explanations, runnable code examples, common mistakes and knowledge checks.
- **Coding workspace** — Monaco code editor (the VS Code editor) with custom stdin, **Run** and **Submit** buttons.
- **Coding Practice page** — every coding assignment grouped by module, with locked / solved status.
- **Real Go compiler** — code is compiled once with `go build` in a temporary folder, then the program runs with a time limit.
- **Automatic grading** — submissions are checked against visible and hidden test cases.
- **Quizzes & module assessments** — multiple-choice tests with a 70% pass mark and attempt history.
- **Sequential learning path** — Module 1 is open; each next module unlocks only after the previous one is completed.
- **Progress dashboard** — "continue learning" card, overall %, completed lessons, assessments and assignments.
- **Capstone project** — submit the *CLI Task Manager* final project (repository link + documentation) for admin review; resubmit if it is rejected.
- **Certificates** — claim a certificate after finishing the course, download it as PDF, and share a **public verification page** with a QR code.
- **Account settings** — change your display name and password.
- **Light / dark mode** toggle, saved in the browser.
- **Responsive design** — works on phones, tablets and desktops.

### For Admins
- **Admin console** with its own sidebar layout (roles: `admin`, `superadmin`).
- **Dashboard metrics** — total learners, enrollments, submissions, certificates.
- **Content management** — courses, modules, lessons, quizzes / questions, coding assignments / test cases.
- **User management** — change user roles and suspend / activate accounts.
- **Project reviews** — approve or reject capstone submissions with a score and feedback (approval is required before a learner can claim a certificate).
- **Certificate management** — view all issued certificates and revoke them.
- **Analytics** — charts built with Recharts.
- **Audit logs** — record of important admin actions.

### Security
- Passwords hashed with **bcrypt**.
- **JWT** authentication in HTTP-only cookies.
- **Helmet** security headers, **CORS** restricted to the frontend URL.
- **Rate limiting** on authentication routes.
- **Module locks enforced on the server** — lessons, quizzes and coding assignments of a locked module cannot be opened or submitted.
- Request validation with **Zod** schemas shared between frontend and backend.
- Role-based route protection on both client and server.

---

## UI Design

The frontend was redesigned with **Material UI components** to match the *Eduvance* education template (Figma, by Peterdraw Studio).

### Design System

| Token | Value | Used for |
|---|---|---|
| Primary (purple) | `#7C3AED` | Brand colour, headings accents, buttons, active nav |
| Secondary (yellow) | `#FFC727` | Call-to-action buttons, highlight marker, category section |
| Lavender surface | `#F3EEFF` | Soft section backgrounds, chips |
| Ink | `#1E1B2E` | Main text |
| Muted | `#6B6880` | Secondary text |
| Font | **Plus Jakarta Sans** | All UI text |
| Code font | **JetBrains Mono** | Code blocks and editor |
| Radius | 14–32 px | Rounded cards, pill-shaped buttons |

The MUI theme lives in [`apps/web/src/theme.ts`](apps/web/src/theme.ts) and supports both light and dark mode. Older Tailwind-styled pages were re-coloured with the same palette in [`tailwind.config.js`](apps/web/tailwind.config.js) so the whole app looks consistent.

### Landing Page Sections (same layout as the reference design)

| # | Section | Description | Main MUI components |
|---|---|---|---|
| 1 | **Navbar** | Logo, pill-style links (Home, Courses, Learning Path, Certificates), theme toggle, *Get Started* button, mobile drawer | `AppBar`, `Toolbar`, `Button`, `Drawer`, `Menu`, `Avatar` |
| 2 | **Hero** | "**Master** Your Future With Practical **Go Skills**" with yellow highlight, CTA buttons, stats (10+ modules, 60 lessons, 50+ challenges), code-editor preview card, 90% pass-rate gauge and learners avatar card | `Typography`, `Chip`, `Paper`, `CircularProgress`, `AvatarGroup` |
| 3 | **Tech stack strip** | Go · React · Material UI · Node.js · MongoDB (like the logo row) | `Stack`, icons |
| 4 | **Learning Categories** | Yellow block with 4 category cards (Go Foundations, Data & Types, Interfaces & Tooling, Concurrency & Capstone); the featured card is purple | `Card`, `CardContent`, `IconButton` |
| 5 | **About Us** | "Gateway To Personal And Professional Growth" with tilted decorative tiles | `Typography`, `Box` |
| 6 | **Our Value** | "What We Stand For" — 4 values with icons | `Avatar`, `Stack` |
| 7 | **Access plans** | Pricing-style cards: Visitor / **Learner (Best Choice)** / Admin with ✓ and ✗ feature lists | `Card`, `Chip`, `Button` |
| 8 | **How It Works** | "Your Learning Journey In 4 Simple Steps" | `Card`, `Avatar` |
| 9 | **Insights & Ideas** | Blog-style grid of Go topics with *View More* button | `Card`, `Box` |
| 10 | **FAQ** | "Frequently Asked Questions" accordion | `Accordion`, `AccordionSummary`, `AccordionDetails` |
| 11 | **Call to action** | Purple banner with *Create Free Account* | `Button` |
| 12 | **Footer** | Dark purple footer with links | `Link`, `Divider` |

### Other Redesigned Screens
- **Login / Register / Forgot Password** — two-panel card (purple info panel + form) using `TextField` with icons, password-rule `Chip`s and an *Auto-fill Demo Admin* button.
- **Learner workspace layout** — collapsible `Drawer` sidebar, search bar, notifications `Badge` + `Menu`, profile menu.
- **Admin console layout** — `Drawer` navigation with 10 sections, role indicator.
- **Course catalog** — search `TextField`, level `Select`, course `Card`s with `LinearProgress`.
- **Toasts** — MUI `Alert` notifications; **loading** — `CircularProgress`; **404 page**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, **Material UI 6** (+ MUI Icons, Emotion), Tailwind CSS (older pages), React Router 6, React Hook Form, Zod, Monaco Editor, Recharts, jsPDF + html2canvas, canvas-confetti |
| Backend | Node.js, Express 4, TypeScript, Mongoose 8, JWT, bcryptjs, Helmet, express-rate-limit, cookie-parser, qrcode, uuid |
| Database | MongoDB |
| Code runner | Go toolchain (`go build` + run) executed by the backend |
| Shared | `@compilo/shared` package with TypeScript types and Zod schemas |
| Testing | Vitest |
| Tooling | npm workspaces (monorepo) |

---

## Project Structure

```
GOLANG COURSE/
├── package.json              # npm workspaces root + scripts
├── .env.example              # sample environment variables
├── packages/
│   └── shared/               # shared TypeScript types & Zod schemas
│       └── src/index.ts
└── apps/
    ├── api/                  # Express + MongoDB backend
    │   ├── src/
    │   │   ├── app.ts        # express app, middleware, routes
    │   │   ├── index.ts      # server entry
    │   │   ├── config/       # env config & DB connection
    │   │   ├── controllers/  # route handlers
    │   │   ├── middleware/   # auth, roles, validation, errors
    │   │   ├── models/       # Mongoose schemas
    │   │   ├── routes/       # API routes (/api/v1/...)
    │   │   ├── services/     # Go execution, grading, progress, certificates
    │   │   ├── seed.ts       # seeds course, 10 modules, lessons, quizzes, admin
    │   │   └── seedData/     # module/lesson content
    │   └── test/api.test.ts
    └── web/                  # React frontend
        ├── index.html
        ├── tailwind.config.js
        └── src/
            ├── theme.ts      # MUI theme (purple + yellow)
            ├── App.tsx       # routes
            ├── components/
            │   ├── common/   # Header, Footer, AuthShell, ui.tsx (logo, accents), ProtectedRoute
            │   ├── learner/  # LearnerLayout (sidebar workspace)
            │   └── admin/    # AdminLayout
            ├── context/      # Auth, Theme (MUI ThemeProvider), Toast
            ├── pages/        # Landing, auth, learner and admin pages
            └── services/api.ts
```

---

## Getting Started

### Prerequisites
- **Node.js** 18 or newer and **npm**
- **MongoDB** running locally (default `mongodb://127.0.0.1:27017`)
- **Go** 1.21 or newer installed (needed for running learners' code)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file into the API folder and adjust if needed (especially `GO_BINARY_PATH`):

```bash
cp .env.example apps/api/.env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | API port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/compilo_learn` |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Token signing secret and lifetime | dev value / `7d` |
| `COOKIE_SECRET` | Cookie signing secret | dev value |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin account created by the seed script | see `.env.example` |
| `GO_BINARY_PATH` | Full path to `go` executable | `C:\Program Files\Go\bin\go.exe` |
| `GO_EXECUTION_TIMEOUT_MS` | Max run time of the learner's program (compile time not included) | `6000` |
| `GO_COMPILE_TIMEOUT_MS` | Max time for `go build` | `60000` |
| `MAX_OUTPUT_BUFFER_BYTES` | Max captured output | `65536` |

### 3. Seed the database

Creates the Go course, 10 modules, lessons, quizzes, assignments and the admin user:

```bash
npm run seed
```

### 4. Run the app

Start the backend and frontend in two terminals:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` requests to `http://localhost:5000`.

---

## Demo Login

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@compilolearn.com` | `Admin@123456` |

On the login page you can also click **"Auto-fill Demo Admin Credentials"**. Learners can create their own account from the **Register** page.

> These are development-only credentials from `.env.example`. Change them before deploying anywhere.

---

## Pages & Routes

### Public
| Route | Page |
|---|---|
| `/` | Landing page |
| `/login`, `/register`, `/forgot-password` | Authentication |
| `/courses` | Course catalog |
| `/courses/:slug` | Course details & syllabus |
| `/verify` | Certificate lookup (enter an ID) |
| `/verify/:certificateId` | Public certificate verification |

### Learner (login required)
| Route | Page |
|---|---|
| `/dashboard` | Learner dashboard |
| `/courses/:courseSlug/learning-path` | Module roadmap with lock states |
| `/learn/:courseSlug/module/:moduleId` | Module details |
| `/learn/:courseSlug/lesson/:lessonId` | Lesson viewer |
| `/learn/:courseSlug/assignment/:assignmentId` | Coding assignment (Monaco editor) |
| `/learn/:courseSlug/assessment/:assessmentId` | Quiz / module test |
| `/practice` | Coding Practice — all assignments with status |
| `/projects` | Capstone project submission |
| `/certificates`, `/certificates/:certificateId` | My certificates & certificate view |
| `/settings` | Account settings |

### Admin (`admin` / `superadmin`)
`/admin/dashboard`, `/admin/courses`, `/admin/modules`, `/admin/lessons`, `/admin/quizzes`, `/admin/assignments`, `/admin/users`, `/admin/projects` (Project Reviews), `/admin/certificates`, `/admin/analytics`, `/admin/audit-logs`

---

## REST API Endpoints

Base URL: `http://localhost:5000/api/v1` · Health check: `GET /api/health`

🔒 = login required · 🛡️ = admin only

| Area | Method & Path | Description |
|---|---|---|
| **Auth** | `POST /auth/register` | Create account |
| | `POST /auth/login` | Sign in (sets cookie) |
| | `POST /auth/logout` | Sign out |
| | `GET /auth/me` 🔒 | Current user |
| | `PATCH /auth/me` 🔒 | Update display name |
| | `POST /auth/change-password` 🔒 | Change password (needs current password) |
| | `POST /auth/forgot-password` | Generate reset token |
| | `POST /auth/reset-password` | Set new password |
| **Courses** | `GET /courses`, `GET /courses/:slug` | List / get course (admins also see unpublished) |
| | `POST`, `PATCH /:id`, `DELETE /:id` 🛡️ | Manage courses |
| **Modules** | `GET /modules`, `GET /modules/:id` | List / get modules (with lock state) |
| | `POST`, `PATCH /reorder`, `PATCH /:id`, `DELETE /:id` 🛡️ | Manage modules |
| **Lessons** | `GET /lessons/:id` 🔒 | Get lesson |
| | `POST /lessons/:id/complete` 🔒 | Mark lesson complete |
| | `POST`, `PATCH /:id`, `DELETE /:id` 🛡️ | Manage lessons |
| **Quizzes** | `GET /quizzes?moduleId=` | List quizzes of a module (with your best score when logged in) |
| | `GET /quizzes/:id` 🔒 | Get quiz |
| | `POST /quizzes/:id/attempts` 🔒 | Submit attempt |
| | `GET /quizzes/attempts/:id/results` 🔒 | Attempt results |
| | `POST/PATCH/DELETE` quizzes & `/questions` 🛡️ | Manage quizzes and questions |
| **Assignments** | `GET /assignments?moduleId=` | List coding assignments (with your status when logged in) |
| | `GET /assignments/:id` 🔒 | Get assignment |
| | `POST /assignments/run` 🔒 | Run Go code with stdin |
| | `POST /assignments/:id/submit` 🔒 | Submit & auto-grade |
| | `GET /assignments/:id/submissions` 🔒 | Submission history |
| | `POST/PATCH/DELETE` assignments & `/test-cases` 🛡️ | Manage assignments and test cases |
| **Progress** | `GET /progress/me` 🔒 | My overall progress |
| | `GET /progress/courses/:courseId` 🔒 | Progress for a course |
| **Certificates** | `GET /certificates/me` 🔒 | My certificates |
| | `POST /certificates/claim` 🔒 | Claim certificate |
| | `GET /certificates/:certificateId` | Certificate details |
| | `GET /certificates/:certificateId/verify` | Public verification |
| **Projects** | `GET /projects` 🛡️ | All capstone submissions (pending first) |
| | `POST /projects/submit` 🔒 | Submit capstone |
| | `GET /projects/me` 🔒 | My submission |
| | `PATCH /projects/:id/review` 🛡️ | Approve / reject with score and notes |
| **Admin** | `GET /admin/metrics` 🛡️ | Dashboard metrics |
| | `GET /admin/users`, `PATCH /admin/users/:id/role`, `PATCH /admin/users/:id/status` 🛡️ | User management |
| | `GET /admin/certificates`, `PATCH /admin/certificates/:id/revoke` 🛡️ | Certificate management |
| | `GET /admin/audit-logs` 🛡️ | Audit logs |

All responses use the format `{ "success": true, "data": ... }` or `{ "success": false, "error": "..." }`.

---

## Database Models

| Model | Purpose |
|---|---|
| `User` | Name, email, hashed password, role (`learner`, `instructor`, `admin`, `superadmin`), status |
| `Course` | Title, slug, description, level, objectives, duration |
| `Module` | Ordered module with prerequisites and completion rules |
| `Lesson` | Lesson content, code examples, knowledge checks |
| `Quiz`, `Question` | Quizzes / module tests and their questions |
| `Assignment`, `TestCase` | Coding tasks with visible & hidden test cases |
| `Submission` | Learner code submissions and grading results |
| `AssessmentAttempt` | Quiz attempts and scores |
| `Enrollment` | Learner ↔ course enrollment |
| `LessonProgress`, `ModuleProgress` | Per-lesson and per-module progress |
| `FinalProjectSubmission` | Capstone submissions and review status |
| `Certificate` | Issued certificates with unique ID and status (`valid` / `revoked`) |
| `AuditLog` | Admin action history |

---

## How Learning Progress Works

1. A new learner starts with **Module 1 unlocked**; all others are locked.
2. Inside a module the learner completes **lessons**, passes **quizzes**, solves **coding assignments** and passes the **module test** (≥ 70%).
3. When a module's completion rules are met, the **next module unlocks**.
4. The learner submits the **CLI Task Manager capstone project**; an admin approves it on the **Project Reviews** page.
5. Once all 10 modules are complete and the project is approved, the learner **claims a certificate** with a unique ID like `COMPILO-GO-2026-XXXXX`, which anyone can verify at `/verify`. If an admin revokes it, the verify page shows it as revoked.

### How code execution works
1. The learner's code is sent to `POST /assignments/run` or `/assignments/:id/submit`.
2. The backend writes it to a temporary folder as `main.go` and compiles it **once** with `go build` (a build error is shown as a compile error).
3. The compiled program runs with the given stdin; stdout / stderr are captured and the program is stopped if it runs longer than `GO_EXECUTION_TIMEOUT_MS`.
4. For submissions, the same compiled program runs once per test case, output is compared with the expected output, and a score is saved. The module's progress is then recalculated.
5. The temporary folder is deleted.

---

## Available Scripts

Run from the project root:

| Command | What it does |
|---|---|
| `npm install` | Install all workspace dependencies |
| `npm run dev:api` | Start the API with hot reload (tsx) on port 5000 |
| `npm run dev:web` | Start the Vite dev server on port 5173 |
| `npm run seed` | Seed MongoDB with the Go course and admin user |
| `npm run build` | Build shared package, API and web app |
| `npm test` | Run the API test suite (Vitest) |

---

## Testing

The API integration tests in [`apps/api/test/api.test.ts`](apps/api/test/api.test.ts) check that:

1. The Go course has exactly 10 modules.
2. Sequential unlocking works (Module 1 open, Module 2 locked for a new learner).
3. The real Go compiler runs valid code with stdin and captures stdout.
4. Compilation errors are reported cleanly.
5. Verifying an invalid certificate ID returns "not valid".

```bash
npm test
```

> MongoDB must be running and Go must be installed for the tests to pass.

---

## Team

| Juno Roll No. | Name | GitHub | Repository |
|---|---|---|---|
| 11 | Shreeya Amit Kalebere | [@ShreeyaKalebere](https://github.com/ShreeyaKalebere) | [ShreeyaKalebere/Nexora](https://github.com/ShreeyaKalebere/Nexora) |
| 12 | Shubham Shankar Pattewar | [@shubham-pattewar](https://github.com/shubham-pattewar) | [shubham-pattewar/Nexora](https://github.com/shubham-pattewar/Nexora) |
| 13 | Anuj Arun Powar | [@Anujpowar03](https://github.com/Anujpowar03) | [Anujpowar03/Nexora](https://github.com/Anujpowar03/Nexora) |
| 14 | Virendra Vilas Katale | [@Virendrak0741](https://github.com/Virendrak0741) | [Virendrak0741/Nexora](https://github.com/Virendrak0741/Nexora) |
| 15 | Preeti Nishikant Sonule | [@preetisonule](https://github.com/preetisonule) | [preetisonule/Nexora](https://github.com/preetisonule/Nexora) |

**Subject:** MERN Stack Development (Assignment No. 13) · **College:** D. Y. Patil College of Engineering and Technology, Kolhapur — Computer Science &amp; Engg.

---

### Credits
- UI inspired by the **Eduvance — Education Website** Figma template by Peterdraw Studio.
- Icons from **Material UI Icons**.
- Go gopher and Go are trademarks of Google LLC; this project is for educational use only.
