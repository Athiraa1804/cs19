# Crowd-Sourced FAQ Generation System

A beginner-friendly, mobile-responsive FAQ and query support system for the **Vicharanashala Internship**.

The goal of this project is to help interns quickly find answers from existing FAQs, raise queries only when needed, discuss issues with peers/admins, and allow verified answers to become new FAQs.

---

## Project Purpose

Interns often ask repeated questions because answers are hard to find or scattered across different places.

This project solves that by creating a simple support flow:

```txt
Search FAQ
→ View matching answers
→ If unresolved, raise query
→ Peer/Admin discussion
→ Admin verifies best answer
→ Verified answer becomes new FAQ
```

The system follows an **FAQ-first philosophy**.

Before creating a new query, users should be encouraged to check:

1. Existing FAQs
2. Similar solved questions
3. Open discussions

This helps reduce duplicate questions and lowers moderation load.

---

## Current MVP Scope

The MVP focuses on the most important product flow.

### Tier 1 — Must Work

* FAQ page
* Smart FAQ search
* Raise query page
* Query discussion page
* Admin verify answer flow
* Convert verified answer into FAQ

---

## MERN Full-Stack Setup

This project uses the MERN stack:

* MongoDB persistence through Mongoose
* Express backend API
* React frontend
* Node.js runtime
* Intern/admin registration and login
* JWT bearer-token authentication
* bcrypt password hashing
* Authenticated `/api/auth/me` session restore
* Backend role guards for admin-only APIs
* Persistent queries, replies, FAQs, users, and helpful counts
* Zod request validation and auth rate limiting
* Production CORS configuration through `CORS_ORIGIN`
* Frontend `VITE_API_BASE_URL` configuration

Legacy Prisma/PostgreSQL files are temporarily retained for migration review, but the active backend
runtime and repositories use MongoDB/Mongoose.

Running `npm run seed` creates these default accounts:

```txt
admin@example.com / admin12345
intern@example.com / intern12345
```

Change `SEED_ADMIN_PASSWORD`, `SEED_INTERN_PASSWORD`, `JWT_SECRET`, and `ADMIN_REGISTRATION_CODE` before deployment.

### Local Full-Stack Run

Prerequisite:

```powershell
Get-Service MongoDB
```

The service should show `Running`. Configure `server/.env` using `server/.env.example`, then use two terminals.

Terminal 1 — backend:

```bash
cd server
npm run seed
npm run dev
```

Terminal 2 — frontend:

```bash
npm run dev
```

Open:

* Frontend: `http://localhost:5173`
* Backend health: `http://localhost:3001/api/health`

Seeded test accounts:

```txt
Intern: intern@example.com / intern12345
Admin:  admin@example.com / admin12345
```

### Deployment Notes

Frontend:

* Build command: `npm run build`
* Output directory: `dist`
* Set `VITE_API_BASE_URL` to the deployed backend URL.

Backend:

* Build command: `npm run build`
* Start command: `npm start`
* Seed command: `npm run seed`
* Set `MONGODB_URI`, `PORT`, `CORS_ORIGIN`, `JWT_SECRET`, and `ADMIN_REGISTRATION_CODE`.
* Use MongoDB Community Server locally or MongoDB Atlas for a managed database.

Local MongoDB connection:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cs19
```

MongoDB Atlas connection shape:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/cs19
```

Tests:

```bash
npm test
cd server
npm test
```

### Tier 2 — Only If Time Exists

* Category bubbles
* Voice-search UI
* SP urgent points
* Trending FAQs
* Recently opened FAQs
* Stats cards

### Tier 3 — Future Scope

* Real AI chatbot
* LLM-generated answers
* Real-time notifications
* WebSockets
* Advanced analytics
* Complex admin dashboard

---

## Tech Stack

Frontend:

* React
* TypeScript
* Tailwind CSS
* React Router
* Vite

State management:

* Zustand, only where shared/global state is needed

Search:

* Fuse.js or lightweight fuzzy/synonym search logic

Backend:

* Node.js
* Express
* MongoDB
* Mongoose
* JWT authentication
* bcrypt password hashing
* Zod validation

---

## Important Project Documents

This repo contains two important planning files:

```txt
CONTEXT.md
ENGINEERING_STANDARDS.md
```

### `CONTEXT.md`

Explains what we are building.

It includes:

* product vision
* MVP scope
* user roles
* FAQ-first philosophy
* duplicate prevention philosophy
* feature priorities
* future scope boundaries

### `ENGINEERING_STANDARDS.md`

Explains how we should build it.

It includes:

* TypeScript rules
* folder structure
* component rules
* service layer rules
* Zustand usage rules
* mobile safety rules
* accessibility rules
* prompt governance rules
* merge checklist

All contributors and AI tools should follow both files.

---

## Recommended Folder Structure

```txt
src/
  features/
    faq/
      components/
      pages/
      services/
      store/
      types/
      utils/
      mocks/
      tests/

    queries/
      components/
      pages/
      services/
      store/
      types/
      utils/
      mocks/
      tests/

    admin/
      components/
      pages/
      services/
      types/
      utils/

  shared/
    components/
    hooks/
    utils/
    types/
```

---

## Core Product Features

### FAQ Page

The FAQ page should allow interns to:

* view FAQs
* search FAQs
* filter by category
* open accordion answers
* see FAQ source
* see helpful count
* find answers quickly on mobile and desktop

Search should support:

* typo tolerance
* fuzzy matching
* synonyms
* natural language style queries

Example searches:

```txt
money → stipend FAQ
work from home → remote/offline FAQ
how long → internship duration FAQ
joining internship → VINS joining/acceptance FAQ
```

---

### Raise Query Page

The Raise Query page should allow interns to:

* enter a title
* describe their issue
* choose a category
* add tags
* submit a query

Before submitting, the system should suggest:

* matching FAQs
* similar solved questions
* related open discussions

This prevents duplicate questions.

---

### My Questions / Track Issue Page

This page should show:

* user’s raised queries
* status badges
* timestamps
* latest reply preview
* resolved/verified status

---

### Query Discussion Page

This page should show:

* query details
* peer/admin replies
* verified answer badge
* reply form
* resolved status

---

### Admin Verification Flow

Admins can:

* reply to queries
* verify the best answer
* resolve queries
* convert verified replies into FAQs

Interns cannot:

* verify answers
* convert replies into FAQs
* perform admin moderation actions

---

## Development Approach

This project should be built step by step.

Recommended 3-day MVP plan:

### Day 1

Build:

* frontend setup
* FAQ mock data
* FAQ service
* FAQ page
* smart search
* category filter
* accordion UI
* loading/error/empty states
* mobile-safe layout

### Day 2

Build:

* Raise Query page
* query mock data
* query service
* validation
* duplicate FAQ suggestions
* My Questions / Track Issue page
* status badges

### Day 3

Build:

* Query Discussion page
* reply flow
* admin verify answer flow
* convert verified answer to FAQ
* final mobile polish
* final bug fixing

---

## Backend API

The frontend service layer calls the Express API. MongoDB persistence is isolated behind Mongoose repositories.

Main endpoints:

```txt
POST  /api/auth/login
POST  /api/auth/register
GET   /api/auth/me

GET   /api/faqs
PATCH /api/faqs/:id/helpful

GET   /api/queries
GET   /api/queries/:id
POST  /api/queries
PATCH /api/queries/:id/status
GET   /api/users/:userId/queries

GET   /api/queries/:queryId/replies
POST  /api/queries/:queryId/replies

PATCH /api/admin/replies/:replyId/verify
POST  /api/admin/replies/:replyId/convert-to-faq
```

Reply behavior:

* Interns and admins can post replies through the same authenticated endpoint.
* An existing query with no replies returns an empty array and displays `No replies yet`.
* A missing parent query returns `404`.
* Successful replies appear immediately and clear the form.
* Admin-only Verify and Convert-to-FAQ actions remain protected.

---

## Setup Instructions

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Git Workflow

Before starting a feature:

```bash
git checkout main
git pull
git checkout -b feature/feature-name
```

Examples:

```bash
git checkout -b feature/faq-page
git checkout -b feature/smart-search
git checkout -b feature/raise-query
git checkout -b fix/mobile-overflow
```

Before committing:

```bash
npm run build
git status
```

Commit:

```bash
git add .
git commit -m "Add FAQ page"
git push origin feature/faq-page
```

---

## AI Coding Tool Rules

When using Minimax/OpenClaw, always start with:

```txt
Before coding, read CONTEXT.md and ENGINEERING_STANDARDS.md.

Follow them strictly.

Do not rewrite the whole app.
Do not modify unrelated files.
Do not add unrequested features.
Do not create massive monolithic files.
Use strict TypeScript.
Do not use any.
Keep components small.
Use service layer for mock/API data.
Use Zustand only for shared state.
Use local state for forms, modals, and small UI interactions.
Make all UI mobile responsive.
Avoid horizontal overflow.
Include loading, error, and empty states where relevant.

After coding, list files changed, why they changed, and how I should test.
```

---

## Engineering Rules

Important rules:

* Use strict TypeScript
* Do not use `any`
* Keep components small
* Use feature-based folders
* Keep API/mock data logic inside services
* Keep validation logic separate from UI
* Use Zustand only for shared state
* Use local state for forms and small UI interactions
* Always handle loading/error/empty states
* Make every page mobile responsive
* Avoid horizontal overflow
* Avoid unnecessary animations
* Avoid adding future-scope features too early

---

## Mobile Safety Requirements

Every component must:

* avoid horizontal overflow
* support long text wrapping
* support small widths
* avoid fixed widths where possible
* use responsive spacing
* keep buttons usable on mobile
* keep cards readable on mobile

Useful Tailwind classes:

```txt
w-full
max-w-full
min-w-0
break-words
flex-wrap
```

---

## Definition Of Done

A feature is complete only if:

* TypeScript passes
* `npm run build` passes
* responsive UI is verified
* mobile layout is checked
* loading state exists
* error state exists
* empty state exists where needed
* no console errors exist
* no console warnings exist
* components remain maintainable
* service layer is respected
* unrelated files are not modified
* feature follows `CONTEXT.md`
* code follows `ENGINEERING_STANDARDS.md`

---

## Final Goal

The goal is not to build the biggest app.

The goal is to build a simple, secure, reliable, maintainable MVP.

A clean working FAQ + query + verified-answer system is better than a large unfinished AI dashboard.

Project quality will come from:

* stable architecture
* small components
* strict TypeScript
* mobile-safe UI
* controlled AI prompts
* disciplined branching
* incremental development
