# Team Testing Guide — cs19 FAQ MVP

**Project:** Crowd-Sourced FAQ Generation System for Vicharanashala Internship  
**Branch:** `test/fullstack-mvp-testing`  
**Last updated:** 2026-06-04

---

## 1. How to Run the Backend

The backend is a Node.js/Express API server with in-memory data storage (no database).

```bash
cd server
npm install          # only needed once
npm run dev          # starts server at http://localhost:3001
```

- The server runs on **port 3001**.
- Data is stored in memory — it resets every time the server restarts.
- CORS is enabled for `http://localhost:5173` (Vite dev server).
- If you see `Network error` in the app, check the backend is still running.

---

## 2. How to Run the Frontend

The frontend is a Vite + React + TypeScript + Tailwind app.

```bash
# From the project root (not inside /server)
npm install          # only needed once
npm run dev          # starts at http://localhost:5173
```

- Ensure the backend is running **before** starting the frontend.
- The frontend proxies API calls to `http://localhost:3001`.

---

## 3. How to Switch Between Intern and Admin Role

**There is no login system.** Role simulation is controlled by a single constant in one file:

```
src/features/queries/types/roleSim.ts
```

To switch roles, edit this line:

```ts
// Current role: change 'admin' to 'intern' or vice versa
export const CURRENT_ROLE: SimulatedRole = 'admin';
```

| Value | What you see |
|---|---|
| `'intern'` | Nav shows: FAQs, Raise Query, My Questions. Query Review is hidden. |
| `'admin'` | Nav shows: FAQs, Query Review. Raise Query and My Questions are hidden. |

> ⚠️ **Important:** After changing the role, save the file. The Vite dev server will hot-reload. If it doesn't, press `Ctrl+C` in the terminal and run `npm run dev` again.

---

## 4. What Each Team Member Should Test

There are **9 team members**. Assign one section below to each person. Everyone tests mobile and desktop unless told otherwise.

| Member | Area to Test |
|---|---|
| **Member 1** | FAQ page — search, category filter, accordion, helpful button |
| **Member 2** | FAQ page — loading, error, empty states; edge cases |
| **Member 3** | Raise Query — form validation, submission, duplicate detection flow |
| **Member 4** | Raise Query — loading/success/error stages |
| **Member 5** | My Questions page — query listing, status badges, empty state |
| **Member 6** | Query Discussion — reply submission, loading/error states |
| **Member 7** | Query Discussion — admin actions (Verify, Convert to FAQ), admin view |
| **Member 8** | Admin Query Review page — all-query view, status grouping |
| **Member 9** | End-to-end flow: raise a query → get replies → verify → convert to FAQ |

---

## 5. Frontend Routes and Pages to Test

| Route | Page | Who Can See It | Notes |
|---|---|---|---|
| `/` | Redirects to home | Both | Intern → `/queries/raise`, Admin → `/admin/queries` |
| `/faqs` | FAQ Page | Both | Search bar, category filter, FAQ list |
| `/queries/raise` | Raise Query | Intern only | Form → duplicate check → submit |
| `/queries/my` | My Questions | Intern only | List of own queries |
| `/queries/:id` | Query Discussion | Both | Replies, reply form, admin actions |
| `/admin/queries` | Query Review | Admin only | All queries grouped by status |

### What to Check on Each Page

**FAQ Page (`/faqs`)**
- [ ] Search bar filters FAQs as you type (fuzzy/typo-tolerant)
- [ ] Category filter buttons narrow results
- [ ] FAQ accordion expands/collapses on click
- [ ] "Was this helpful?" button is visible (interns only)
- [ ] Source label shows "existing" or "crowd-sourced"
- [ ] Empty state appears when no results match
- [ ] Loading spinner appears while FAQs load
- [ ] Error state with retry button appears on failure
- [ ] Long question/answer text wraps correctly on mobile

**Raise Query Page (`/queries/raise`)**
- [ ] Form validation: empty title/description/category shows inline errors
- [ ] Submitting the form shows a loading state (prevents double-click)
- [ ] After submit, the duplicate-check stage appears with suggestions
- [ ] "Yes, Submit Query" creates the query successfully
- [ ] Success screen shows then redirects to My Questions
- [ ] Error screen shows if submission fails, with retry option
- [ ] Cancel returns to the form

**My Questions Page (`/queries/my`)**
- [ ] Lists only queries created by the current intern
- [ ] Query cards show title, status badge, timestamp, reply count
- [ ] Clicking a card navigates to the Query Discussion page
- [ ] "+ New Query" link works
- [ ] Empty state with a CTA shows when no queries exist
- [ ] Loading spinner shows while fetching

**Query Discussion Page (`/queries/:id`)**
- [ ] Shows the query title, description, category, status
- [ ] Shows all replies for this query
- [ ] Verified reply has a visible badge and floats to the top
- [ ] Reply form: name, role selector, text area, submit button
- [ ] Submitting a reply adds it to the list without page reload
- [ ] Submit error shows a visible error banner
- [ ] **Admin only:** Verify button marks a reply as verified
- [ ] **Admin only:** "+ FAQ" button opens the Convert-to-FAQ dialog
- [ ] **Admin only:** Confirming Convert-to-FAQ shows a success message
- [ ] Back link navigates to My Questions

**Admin Query Review Page (`/admin/queries`)**
- [ ] Only accessible when role is set to `admin`
- [ ] Shows all queries from all interns (not just own queries)
- [ ] Queries are grouped into: Needs Attention / In Progress / Resolved / Closed
- [ ] Clicking a query card goes to its discussion page
- [ ] Empty state shows when no queries exist
- [ ] Loading spinner shows while fetching

---

## 6. Backend Endpoints to Test

All endpoints are at `http://localhost:3001/api/`.

> **Note:** Admin endpoints require the `x-role: admin` header (MVP auth substitute). Postman/Thunder Client testers, add this header manually.

### FAQ Endpoints

| Method | Endpoint | Description | Test with |
|---|---|---|---|
| `GET` | `/api/faqs` | List all FAQs | `?search=stipend`, `?category=Benefits` |
| `GET` | `/api/faqs/:id` | Get single FAQ | Valid ID and an invalid ID |

### Query Endpoints

| Method | Endpoint | Description | Test with |
|---|---|---|---|
| `GET` | `/api/queries` | List all queries | `?status=open`, `?search=leave` |
| `GET` | `/api/queries/:id` | Get single query | Valid ID and invalid ID |
| `POST` | `/api/queries` | Create a query | Body: `{ title, description, category, tags?, createdBy }` |
| `GET` | `/api/users/:userId/queries` | Queries by user | Any `userId` string |

### Reply Endpoints

| Method | Endpoint | Description | Test with |
|---|---|---|---|
| `GET` | `/api/queries/:queryId/replies` | Replies for a query | Valid and invalid `queryId` |
| `POST` | `/api/queries/:queryId/replies` | Post a reply | Body: `{ body, authorName, authorRole }` |

### Admin Endpoints (requires `x-role: admin` header)

| Method | Endpoint | Description | Test with |
|---|---|---|---|
| `PATCH` | `/api/admin/replies/:replyId/verify` | Verify a reply | Valid `replyId` |
| `POST` | `/api/admin/replies/:replyId/convert-to-faq` | Convert verified reply to FAQ | Body: `{ question: string }` |

### Backend Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ status: "ok" }` if server is up |

### Minimal Valid Request Bodies

**Create a query (`POST /api/queries`)**
```json
{
  "title": "How do I apply for sick leave?",
  "description": "I was unwell for 2 days last week...",
  "category": "Leave & Holidays",
  "tags": ["leave", "sick"],
  "createdBy": "user_1"
}
```

**Post a reply (`POST /api/queries/:queryId/replies`)**
```json
{
  "body": "You can apply for sick leave by raising a query here...",
  "authorName": "Jane Doe",
  "authorRole": "admin"
}
```

**Convert to FAQ (`POST /api/admin/replies/:replyId/convert-to-faq`)**
```json
{
  "question": "How do I apply for sick leave?"
}
```

---

## 7. Mobile Testing Checklist

Apply this checklist to **every page**. Test on a real phone or browser DevTools mobile viewport (e.g., 375px wide).

### General Mobile Checks
- [ ] No horizontal scroll — page fits within screen width
- [ ] All text wraps correctly, nothing is cut off
- [ ] Buttons are large enough to tap (min 44×44px touch target)
- [ ] Nav bar is usable on small screens (no overflow)
- [ ] Cards and forms don't overflow the container
- [ ] Loading spinners and empty states are visible without scrolling

### FAQ Page
- [ ] Search bar is accessible and usable
- [ ] Category filter scrolls horizontally without breaking layout
- [ ] FAQ accordion items expand without pushing content off-screen
- [ ] Long FAQ questions and answers wrap correctly

### Raise Query / My Questions
- [ ] Form fields are full-width and easy to tap
- [ ] Inline validation errors are visible
- [ ] Query cards are readable, title and status badge visible

### Query Discussion
- [ ] Reply form is usable without keyboard cutting off inputs
- [ ] Reply cards are readable
- [ ] Admin action buttons are accessible and labelled clearly

---

## 8. Bug Report Format

When you find a bug, report it like this:

```
## Bug Report

**Page:** [e.g., FAQ Page, Raise Query, Query Discussion]
**Route:** [e.g., /faqs, /queries/raise, /queries/abc123]
**Role tested:** [intern / admin]
**Device:** [desktop / mobile — and browser if known]

### Steps to Reproduce
1. Go to [page]
2. Click on [element]
3. Observe [what happens]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Severity
[ ] Critical — app crashes or data loss
[ ] Major — core feature doesn't work
[ ] Minor — visual/UX issue, feature works with work-around

### Screenshots / Screenshare
[Attach screenshots or recording if available]
```

---

## 9. Git Branch Rules for Teammates

These rules keep the codebase stable and reviewable.

### Branch Naming

Use this format for all branches:

```txt
test/yourname-feature
fix/yourname-bug-description
docs/yourname-something
```

**Examples:**
```txt
test/member1-faq-search
fix/member3-form-validation
docs/member9-testing-notes
```

### Workflow

1. **Always branch from `test/fullstack-mvp-testing`** — never from `main` or other branches directly.
2. **One focused change per branch** — don't mix unrelated fixes.
3. **Keep branches small and reviewable** — if a branch has more than 10 files changed, split it.
4. **Write a clear PR description** — explain what you tested and what you changed.
5. **Test locally before pushing** — make sure nothing is broken before asking for a review.
6. **Do not commit directly to `main` or `test/fullstack-mvp-testing`** — use PRs only.

### Before Creating a Branch

```bash
# Make sure you're on test/fullstack-mvp-testing and it's up to date
git checkout test/fullstack-mvp-testing
git pull origin test/fullstack-mvp-testing

# Create your new branch
git checkout -b test/member1-faq-search
```

### Before Opening a PR

```bash
# Review what you've changed
git diff --stat

# Run a final check
npm run build    # frontend builds without errors
cd server && npm run build   # backend builds without errors
```

### What NOT to Do

- ❌ Do not commit broken code that doesn't build.
- ❌ Do not change `roleSim.ts` and commit it — that's a demo file, not a feature.
- ❌ Do not create massive branches that change 20+ files at once.
- ❌ Do not modify `src/App.tsx`, `src/features/queries/types/roleSim.ts`, or any backend route/controller without checking with the team first.
- ❌ Do not push directly to `test/fullstack-mvp-testing`.

---

## 10. Known MVP Limitations

These are **known gaps** — do not file bugs for them. They are tracked for future development.

| # | Limitation | Impact | Future Fix |
|---|---|---|---|
| 1 | **No real authentication** | Anyone can access any page by changing `roleSim.ts`. Role is hardcoded constant. | JWT/session auth |
| 2 | **Data is in-memory only** | All data (queries, replies, FAQs) resets when the backend server restarts. | MongoDB integration |
| 3 | **`markFaqHelpful` not connected** | Clicking "Helpful" on an FAQ only logs to console, doesn't persist. | Backend endpoint + DB |
| 4 | **No query status transitions** | Query statuses (open → answered → resolved → verified → closed) exist in types but backend does not update them automatically. | Status endpoint |
| 5 | **Admin endpoints use header-based auth** | `x-role: admin` header is the only admin gate. Not secure for production. | Server-side session/JWT |
| 6 | **No real-time updates** | When a reply is posted, the page must be refreshed to see it. | WebSocket / polling |
| 7 | **No file/screenshot attachments** | Replies and queries are text-only. | File upload (future) |
| 8 | **No notification system** | Users don't get notified when their query gets a reply. | Notification system (future) |
| 9 | **Search is local-only** | Search happens in the frontend service layer using fuzzy matching, not a full-text database search. | Elasticsearch / Atlas Search (future) |
| 10 | **Role switch requires code edit** | There's no UI to switch between intern/admin — you must edit `roleSim.ts`. | Auth-based role UI |

---

## Quick Test Checklist for QA

Copy this and tick off as you test.

```
□ Backend is running at localhost:3001
□ Frontend is running at localhost:5173
□ Role is set to: [ intern / admin ]

FAQ PAGE (/faqs)
□ Search works with typos (e.g. "stitpend")
□ Category filter narrows results
□ FAQ accordion expands and collapses
□ Loading spinner shows on fresh load
□ Empty state shows for no-match search
□ Error state shows if API fails (stop backend to test)

RAISE QUERY (/queries/raise)
□ Empty form submit shows validation errors
□ Form submits and shows duplicate suggestions
□ "Yes, Submit Query" works
□ Success screen appears then redirects

MY QUESTIONS (/queries/my)
□ Shows only this user's queries
□ Empty state shows when no queries exist
□ Clicking card opens discussion page

QUERY DISCUSSION (/queries/:id)
□ Replies load and display correctly
□ Posting a reply works
□ Reply error banner shows on failure
□ [Admin] Verify button marks reply verified
□ [Admin] + FAQ button opens dialog
□ [Admin] Convert-to-FAQ creates a new FAQ

ADMIN QUERY REVIEW (/admin/queries)
□ [Admin] Shows all queries from all users
□ [Admin] Grouped into Needs Attention / In Progress / Closed
□ [Intern] Redirected to /faqs if visiting this page

MOBILE (test at 375px wide)
□ No horizontal scroll
□ All text wraps correctly
□ Buttons are tappable
□ Forms are usable
```