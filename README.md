# Crowd-Sourced FAQ Generation System
A beginner-friendly, mobile-responsive FAQ and query support system for the **Vicharanashala Internship**.

## Project Goal
The goal of this project is to help interns quickly find answers from existing FAQs, raise queries only when needed, discuss issues with peers/admins, and allow verified answers to become new FAQs.

This project solves that by creating a simple support flow:
1. Existing FAQs can be searched and browsed easily
2. Interns are encouraged to find existing answers before raising new queries
3. Interns can raise queries only when FAQs or similar discussions do not solve their issue
4. Peers/admins can answer queries
5. Admins can verify the best answer
6. Verified answers can be converted into new FAQs

##Our Features
	Low Cognitive Load

	Duplicate Question Prevention

	Beginner Intern Friendliness

	Support Before Escalation

	Attach Files for proof and more Visibility

	Smart Search Facility

	Categorical Distribution of FAQs for both Intern and Admins

	Categorical Distribution of the State of Queries for admin

## Current MVP Scope
The MVP focuses on the most important product flow.
1.	FAQ Page

2.	Smart Search

3.	Raising Query Page

4.	Query Discussion Page

5.	Admin Verification Flow

6.	Labelled FAQs and Queries

7.	Badges on Query Status

## Core Product Features

### FAQ Page
The FAQ page should allow interns to:

* View FAQs
* Enable Smart Search of FAQs
* Filter by Category
* Open accordion answers
* See FAQ source
* See helpful count
* Find answers quickly on mobile and desktop

Search should support:
* typo tolerance
* fuzzy matching
* synonyms
* natural language style queries

Example searches:
money → stipend FAQ
work from home → remote/offline FAQ
how long → internship duration FAQ
joining internship → VINS joining/acceptance FAQ

### Raise Query Page
The Raise Query page should allow interns to:
* Enter a title
* Describe their issue
* Choose a category
* Add tags
* Attach file related to the problem
* Submit a query

Before submitting, the system should suggest:
* matching FAQs
* similar solved questions
* related open discussions
This prevents duplicate questions.

### My Questions / Track Issue Page
This page should show user’s:
*  raised queries
* status badges
* timestamps
* latest reply preview
* resolved/verified status

### Community Q&A
This page should show:
* Query details
* Peer/admin replies
* Verified answer badge (Work mode/General/..)
* Reply form
* Resolved status (Verified/Open/Answered/Resolved)
* Allow peers to post a reply

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
## Backend Integration Status

The Express TypeScript backend is integrated with MongoDB through Mongoose.

**What is connected:**
* Frontend service layer → backend REST APIs for auth, FAQs, queries, replies, and admin actions
* Backend runs at `http://localhost:3001`
* MongoDB persists users, FAQs, queries, replies, helpful counts, and query statuses
* JWT authentication restores sessions and protects role-specific routes
* Admin-only operations are enforced by backend role guards
* `PATCH /api/faqs/:id/helpful` persists helpful-count increments
* `PATCH /api/queries/:id/status` persists admin query-status changes

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

**Reply flow behavior:**
* Both intern and admin roles use `GET/POST /api/queries/:queryId/replies`
* The reply router receives the parent `queryId` through Express merged route parameters
* Existing queries with zero replies return `{ success: true, data: [] }`
* Missing parent queries return `404`
* New replies are persisted in MongoDB and update the query reply preview
* Admin replies move open queries to `answered`
* The UI adds successful replies immediately and keeps typed text after failed submissions

**FAQ source rules**:
* `source: "existing"` — official/preloaded FAQs from seed data
* `source: "crowd-sourced"` — FAQs created via Admin Convert-to-FAQ

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
# FAQ Sources

FAQs may originate from:
1. Existing FAQ system
2. Crowd-sourced verified replies

Use a source field:
```ts
source: "existing" | "crowd-sourced";
```
# API Response Contract
All service/API responses should follow a consistent structure:

```ts
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```
This improves reliability and makes loading/error handling easier.

## Completed

	MVP direction defined
	FAQ feature — full implementation
	types, service layer, mock data (26 realistic Samagama/VINS internship FAQs)
	smart search with synonym expansion, fuzzy/typo tolerance, ranking
	category filter, search bar, accordion UI
	loading, error, empty states
	FAQ mock data uses realistic Samagama/VINS-style internship content.
	No scraped or confidential data — all content is official-style and beginner-friendly
	Raise Query feature
	form, validation, duplicate detection, FAQ + similar query suggestions
	loading/error/success states
	My Questions page — tracks user's own queries
	Query Discussion page — replies, verified answer badge, reply form
	Reply submission errors are shown to user via visible error banner
	Admin Query Review page at `/admin/queries`
	lists all queries grouped by status
	links to discussion page for each query
	Admin reply actions (Verify + Convert to FAQ)
	Verify button marks a reply as verified (verified replies float to top)
	+ FAQ button opens inline dialog, pre-fills question from reply body
	Convert creates a new FAQ via `adminService.convertReplyToFaq()`
	Role-based navigation and route guards
	Intern nav: FAQs, Raise Query, My Questions — Query Review hidden
	Admin nav: FAQs, Query Review — Raise Query and My Questions hidden
	Route-level guards: interns redirected from `/admin/queries` → `/faqs`
	Route-level guards: admins redirected from `/queries/raise` and `/queries/my` → `/admin/queries`
	Root `/` redirects to `/queries/raise` (intern) or `/admin/queries` (admin)
	Helpful button on FAQ answers — visible to interns, hidden for admins

# Future Scope
Possible future improvements:
* real admin dashboard
* notifications
* real-time discussion updates
* AI-assisted FAQ suggestions
* voice search implementation
* rich text replies
* screenshot attachments
* advanced moderation
* analytics dashboard
* search ranking improvements
* chatbot integration

These should only be added after the MVP is stable.

# Important Engineering Philosophy
The goal is not:
* maximum code generation
* maximum features
* maximum animations
* building everything at once

The goal is:
* stable architecture
* maintainable code
* scalable structure
* reliable user experience
* strict TypeScript
* mobile-safe UI
* controlled prompts
* disciplined branching
* incremental development






