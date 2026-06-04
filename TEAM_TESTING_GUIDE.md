# Team Testing Guide — cs19 FAQ MVP

**Project:** Crowd-Sourced FAQ Generation System for Vicharanashala Internship  
**Branch:** `test/fullstack-mvp-testing`  
**Last updated:** 2026-06-04

---

## 0. What Teammates Must Submit

After each testing session, every teammate must submit:

1. **Screenshots** — minimum 1 per assigned page showing the happy-path working correctly
2. **Completed checklist** — copy the Quick Test Checklist at the end of this doc, tick every item
3. **Bug reports** — if you found any bugs, fill in the Bug Report format in Section 8
4. **No-bugs report** — if you found nothing broken, write clearly: "No bugs found in this session"

Your submission must also include:
- **Pages tested** — which pages did you cover
- **Role tested as** — intern or admin (or both)
- **Browser and device** — e.g., Chrome desktop, Chrome DevTools mobile (375px), or real phone

> **Where to submit:** Share in your team's agreed channel (group chat, docs, or PR description).
> If testing reveals a bug, also file it using the Bug Report format in Section 8.

---

## 0b. Before You Start

Run through this checklist before testing anything:

- [ ] Confirm you are on the correct branch: `test/fullstack-mvp-testing`
  - Run: `git branch --show-current` — must print `test/fullstack-mvp-testing`
  - If you are on a different branch: `git checkout test/fullstack-mvp-testing`
- [ ] Do not edit any files outside of `TEAM_TESTING_GUIDE.md` or your own test notes
- [ ] Run the backend server (see Section 1 below) if your assigned pages need it
- [ ] Run the frontend dev server (see Section 2 below)
- [ ] Check both servers started without errors in your terminal
- [ ] Open `http://localhost:5173` in your browser and confirm the app loads
- [ ] Confirm no red errors in DevTools Console (press F12 → Console tab) on the homepage

**Important — shared test data:**
All interns share the same mock user ID (`user_1`) in the MVP. If multiple teammates test "My Questions" at the same time, queries may overlap or overwrite each other. **Coordinate:** test user-specific flows (My Questions, Raise Query) one person at a time, or test different things first. Always report which role and approximate context you tested under.

---

## 0c. DevTools Basics for Beginners

DevTools is a browser tool that helps you see what's happening behind the scenes.

### How to open it
- Press **F12** on your keyboard, OR
- Right-click anywhere on the page → select **Inspect**

A panel will open at the bottom or right of your browser.

### Check the Console tab (for errors)
- Click the **Console** tab at the top of DevTools
- Look for anything in **red** — those are JavaScript errors
- If you see red errors when something breaks, screenshot them
- A clean console looks like this: `[system] ✓` or shows no red text

### Check the Network tab (for failed API calls)
- Click the **Network** tab at the top of DevTools
- Reload the page (F5) to see all network requests appear
- Find an API call (e.g. `/api/faqs`) and look at its **Status** column:
  - **200** = success — the API call worked
  - **400** = bad request — something wrong with the data you sent
  - **401 / 403** = unauthorised — admin-only endpoint was called without the right header
  - **404** = not found — wrong URL
  - **500** = server error — the backend crashed or has a bug
  - Anything **red** means something failed

> If the app shows a generic "Network error" message, check the Network tab to see if the backend is down or returning an error status.

---

## 0d. How to Trigger Error States

Error states let you confirm the app handles failures gracefully. Here's how to trigger them:

1. **Keep the backend running** for all normal tests
2. **To test error handling: stop the backend** — go to the terminal running `npm run dev` inside `/server` and press **Ctrl+C**
3. Now try these actions while the backend is stopped:
   - Refresh the FAQ page — should show an **error state** with a retry button
   - Refresh My Questions — should show an **error state** with a retry button
   - Go to Raise Query and submit the form — should show a **"Network error"** message
   - Open Query Discussion — should show an **error state**
4. Confirm the error message is **user-friendly** (not a blank screen or raw code)
5. **Restart the backend** after testing: `npm run dev` in the `/server` folder
6. Refresh the page and confirm everything works again

> **Important:** Always restart the backend after testing error states. Other teammates need it running.

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

### FAQ Page — Testing Checklist with Expected Results

| # | Test This | Expected Result |
|---|---|---|
| 1 | Load `/faqs` fresh (no cache) | Loading spinner appears first, then FAQ list loads |
| 2 | Search for "stitpend" (typo) | Matching stipend FAQs appear — search is typo-tolerant |
| 3 | Search for "work from home" (phrase) | Remote/online internship FAQs appear |
| 4 | Click a category filter chip | Only FAQs in that category are shown |
| 5 | Click an FAQ accordion item | It expands to show the answer; other items stay closed |
| 6 | Collapse the open accordion item | It closes cleanly with no visual glitch |
| 7 | Click "Was this helpful?" (intern role) | Button state changes or a thank-you response appears |
| 8 | Search for something with no match (e.g. "xyzabc") | Empty state appears: "No FAQs found" or similar friendly message |
| 9 | Refresh the page while backend is running | FAQs reload correctly from the API |
| 10 | Long FAQ text: find the longest question and answer | Text wraps, nothing is cut off, no horizontal scroll |

**Screenshot to submit for FAQ Page:** the search results or accordion open state showing FAQ content and source label.

**Role needed:** intern or admin (both can see FAQ page)

**Mobile extra:** also confirm category chips scroll horizontally without breaking the layout.

### Raise Query Page — Testing Checklist with Expected Results

| # | Test This | Expected Result |
|---|---|---|
| 1 | Open `/queries/raise` | Form with Title, Description, Category, Tags fields loads |
| 2 | Click Submit with all fields empty | Inline validation errors appear under each required field |
| 3 | Fill only Title and Description, click Submit | Validation error on Category field |
| 4 | Fill all required fields, click Submit | Loading spinner appears, button is disabled (double-click prevented) |
| 5 | After submit: duplicate detection | A suggestion screen appears with similar existing FAQs or queries |
| 6 | **Duplicate detection with keyword:** type "stipend" as the title and submit | Similar stipend-related FAQs appear before the final submit |
| 7 | Screenshot the suggestion screen | Capture it — include it in your test report |
| 8 | Click "Yes, Submit Query" | Success screen shows, then auto-redirects to My Questions |
| 9 | Check My Questions for the new query | New query card appears with status "open" |
| 10 | Click Cancel on the suggestion screen | Returns to the form, form data is preserved |
| 11 | Stop backend, then try to submit the form | "Network error" message appears in a user-friendly way |
| 12 | Restart backend, fill and submit form again | Everything works normally again |

**Screenshot to submit for Raise Query:** the duplicate suggestion screen showing similar FAQs/queries.

**Role needed:** intern only (admin is redirected away from this page)

**Important:** All interns share the mock user ID `user_1`. If your new query doesn't appear in My Questions, it may be overwritten by another teammate. Coordinate with your team.

### My Questions Page — Testing Checklist with Expected Results

| # | Test This | Expected Result |
|---|---|---|
| 1 | Open `/queries/my` when you have no queries | Empty state with a message and a CTA ("Raise a new query" link) |
| 2 | After raising a query in Section 5, refresh My Questions | New query card appears with your title and "open" status |
| 3 | Check that the query card shows: title, status badge, timestamp, reply count | All four pieces of info are visible |
| 4 | Click the query card | Navigates to the correct Query Discussion page for that query |
| 5 | Click "+ New Query" link | Navigates to `/queries/raise` |
| 6 | Stop backend, then open My Questions | Error state with retry button appears |
| 7 | Restart backend, refresh My Questions | Page loads normally, query data is back |

**Screenshots to submit for My Questions:** empty state (if no queries) OR query card with title and status badge visible.

**Role needed:** intern only (admin is redirected away from this page)

### Query Discussion Page — Testing Checklist with Expected Results

| # | Test This | Expected Result |
|---|---|---|
| 1 | Open the discussion page for an existing query | Query card shows title, description, category, and status |
| 2 | Check that existing replies are displayed | Replies appear in chronological order |
| 3 | Check the reply form | Fields: Name, Role selector, Message textarea, Submit button |
| 4 | Post a reply: fill form and click Submit | Reply appears in the list immediately without page reload |
| 5 | Post a reply with backend stopped | Error banner appears: "Network error" or similar user-friendly message |
| 6 | Restart backend, post another reply | Reply posts successfully |

#### Admin Actions (switch role to `admin` in `roleSim.ts` first)

| # | Test This | Expected Result |
|---|---|---|
| 7 | With admin role: find a reply and click **Verify** | Verified badge (✓ or "Verified") appears on that reply |
| 8 | Check the verified reply's position | It moves to the **top** of the reply list |
| 9 | On the verified reply: click **+ FAQ** button | Convert-to-FAQ dialog opens with question field pre-filled from the reply |
| 10 | Edit the question if needed and submit | Success message appears; dialog closes |
| 11 | Go to `/faqs` and search for the new FAQ | It appears with source label **"crowd-sourced"** |
| 12 | Screenshot the new FAQ on the FAQ page | Include in your report as proof of convert-to-FAQ working |

**Screenshots to submit for Query Discussion:**
- Reply form and posted replies (intern role)
- Verified badge + top placement (admin role)
- Convert-to-FAQ dialog (admin role)
- New FAQ on `/faqs` with "crowd-sourced" label (admin role)

**Back link:** Clicking the back link on the discussion page should navigate to My Questions.

### Admin Query Review Page — Testing Checklist with Expected Results

| # | Test This | Expected Result |
|---|---|---|
| 1 | With role = `intern`, navigate to `/admin/queries` | You are redirected to `/faqs` — admin page is not accessible |
| 2 | Switch role to `admin`, navigate to `/admin/queries` | Page loads showing all queries from all interns |
| 3 | Check that queries are grouped | Groups visible: "Needs Attention", "In Progress", "Resolved", "Closed" |
| 4 | Click a query card | Navigates to that query's discussion page |
| 5 | With no queries in the system: check empty state | Empty state appears with a friendly message |
| 6 | Stop backend, open Admin Query Review | Error state with retry button appears |
| 7 | Restart backend, refresh | Page loads normally |

**Screenshot to submit for Admin Query Review:** the grouped query list (or empty state if no data).

**Role needed:** admin only

---

## 6. Backend Endpoints to Test (Advanced — API Testers Only)

> **Note for UI testers:** If you are only testing the app by clicking through pages in your browser, you can **skip this section entirely**. Focus on Section 5 (Frontend Routes and Pages) instead. Only use this section if you are specifically testing the backend API with Postman, Thunder Client, or a similar tool.

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

### Testing Error States via API

To test how the backend responds to bad requests:

| Scenario | What to do | Expected result |
|---|---|---|
| Invalid FAQ ID | `GET /api/faqs/invalid-id` | `404` — "FAQ not found" |
| Invalid query ID | `GET /api/queries/invalid-id` | `404` — "Query not found" |
| Missing required fields | `POST /api/queries` with empty body | `400` — validation error |
| Missing admin header | `PATCH /api/admin/replies/abc/verify` without `x-role: admin` | `403` — forbidden |

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

## 6. Screenshot Proof Format

Screenshots are your evidence. Without them, bugs are hard to verify. Follow this format for every screenshot you submit.

### Screenshot Rules
- Label each screenshot with: **Page name | Role | What it shows**
- Screenshots must be clear enough to read text
- Include the browser address bar or DevTools to show the URL
- For error states: include the visible error message in the screenshot

### Required Screenshots by Page

| Page | What to screenshot |
|---|---|
| FAQ Page | Search results or accordion open showing answer + source label |
| Raise Query | Duplicate suggestion screen (mandatory — this is the key proof) |
| My Questions | Query card with title and status badge, OR empty state |
| Query Discussion | Posted reply in list, OR verified badge (admin), OR convert-to-FAQ dialog (admin) |
| Admin Query Review | Grouped query list |
| Error state | The error message/empty state itself (stop backend to trigger) |
| New FAQ (crowd-sourced) | The FAQ page showing the new FAQ with "crowd-sourced" label |

### Screenshot Naming Convention

```
[Page]-[Role]-[WhatItShows].png
```

**Examples:**
```
FAQ-Intern-SearchResults-Stipend.png
RaiseQuery-Intern-DuplicateSuggestions-Stipend.png
QueryDiscussion-Admin-VerifiedBadge-TopPlacement.png
FAQ-Admin-CrowdSourced-NewFAQ.png
```

### How to Label in Your Report

If you can't rename files, describe them in the report text:

```
**Screenshot 1:** FAQ Page | intern | Search results for "stipend" — 3 matching FAQs shown
**Screenshot 2:** Raise Query | intern | Duplicate suggestion screen showing 2 similar FAQs
**Screenshot 3:** Query Discussion | admin | Verified badge on reply + reply moved to top
```

---

## 7. Role-Based Testing — What to Test as Intern vs Admin

This section clarifies exactly what each role can and should test.

### As an Intern — Test These Flows

**FAQ Page (`/faqs`)**
- Browse and search FAQs
- Filter by category
- Open/close FAQ accordions
- Click "Was this helpful?" button
- Observe source labels

**Raise Query (`/queries/raise`)**
- Fill and submit the query form
- See duplicate suggestions after submission
- Confirm your query appears in My Questions

**My Questions (`/queries/my`)**
- See your own queries only
- Click a query to open its discussion page
- Post replies to your own queries

**Query Discussion (`/queries/:id`)**
- Read replies from admins and other interns
- Post a reply (your name and role appear on the reply)
- Verify that you do **NOT** see a Verify button or + FAQ button

### As an Admin — Test These Flows

**FAQ Page (`/faqs`)**
- Browse and search FAQs (same as intern)
- Confirm "Was this helpful?" button is **hidden** (not shown for admins)

**Query Review (`/admin/queries`)**
- View all queries from all interns
- Click any query to go to its discussion page

**Query Discussion (`/queries/:id`)**
- Read all replies
- Post a reply (your authorRole will be "admin")
- **Verify** a reply — see badge + top placement
- **Convert to FAQ** a verified reply — see new FAQ appear in `/faqs`

**What admins CANNOT do:**
- Cannot access `/queries/raise` (redirected to `/admin/queries`)
- Cannot access `/queries/my` (redirected to `/admin/queries`)

### How to Report Role Testing

In every submission, include:

```
**Role tested:** intern
**Pages tested:** FAQ Page, Raise Query, My Questions, Query Discussion

**Role tested:** admin
**Pages tested:** FAQ Page, Query Review, Query Discussion
```

---

## 8. Mobile Testing Checklist

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

## 7. FAQ Categories

The FAQ page has category filter chips. The current categories in the preloaded FAQ data are:

| Category | What it covers |
|---|---|
| **Samagama Portal** | login, profile, CV upload, offer acceptance |
| **Documentation** | NOC, certificates |
| **Internship Mode** | online vs offline, switching modes |
| **Equipment** | laptop requirements |
| **Mentor Sessions** | sync sessions, manager availability |
| **Projects** | GitHub submission, project assignment |
| **Duration** | internship length, cohort start dates |
| **Stipend & Benefits** | stipend payment, leave, taxes |
| **Certificate** | completion certificate, experience letter |
| **Support** | raising queries, escalation |

When testing the category filter, try filtering by a few of these categories and confirm only matching FAQs are shown. In your test report, mention which categories you filtered by.

To see all categories programmatically, open your browser and visit:
```
http://localhost:3001/api/faqs
```
Look at the `category` field of each object in the JSON.

---

## 9. Bug Report Format

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

## 10. Git Branch Rules for Teammates

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

## 11. Known MVP Limitations

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

## 11. Quick Test Checklist for QA

Copy this into your test report. Tick every item you checked. If an item fails, file a bug using the format in Section 8.

```
BEFORE STARTING
□ git branch shows: test/fullstack-mvp-testing
□ Frontend running at localhost:5173
□ Backend running at localhost:3001 (if testing pages that use it)
□ No red errors in DevTools Console (F12 → Console tab)
□ Browser confirms app loads at localhost:5173

ROLE: [ intern / admin ] — switch in roleSim.ts if needed

──────────────────────────────────────────
FAQ PAGE (/faqs)
──────────────────────────────────────────
□ Search works with typos (e.g. "stitpend" matches "stipend")
□ Search with full phrase works (e.g. "work from home")
□ Category filter narrows results (try 2–3 different categories)
□ FAQ accordion expands and collapses smoothly
□ "Was this helpful?" button visible (only if role = intern)
□ Source label shows "existing" on preloaded FAQs
□ Empty state appears when search has no matches
□ Loading spinner shows on first load
□ Long FAQ question and answer text wrap correctly on mobile
□ No horizontal scroll on mobile (375px wide)

──────────────────────────────────────────
RAISE QUERY (/queries/raise) — intern role required
──────────────────────────────────────────
□ Empty form submit shows validation errors on all required fields
□ Submit button shows loading state and prevents double-click
□ Duplicate detection: type keyword like "stipend" or "leave" → submit
  → Suggestion screen appears with similar FAQs or queries
  → Screenshot taken of suggestion screen
□ "Yes, Submit Query" creates the query
□ Success screen appears and auto-redirects to My Questions
□ Error screen appears if submission fails (or test with backend stopped)
□ Cancel returns to form

──────────────────────────────────────────
MY QUESTIONS (/queries/my) — intern role required
──────────────────────────────────────────
□ Shows only the current user's own queries
□ Empty state appears when no queries exist
□ Query card shows title, status badge, timestamp, reply count
□ Clicking a card opens the Query Discussion page
□ "+ New Query" link works
□ Loading spinner shows while fetching

──────────────────────────────────────────
QUERY DISCUSSION (/queries/:id)
──────────────────────────────────────────
□ Query detail card shows title, description, category, status
□ Replies load and display correctly
□ Reply form: name, role selector, text area, submit button all present
□ Posting a reply adds it to the list without page reload
□ Reply submit error shows a visible error banner (or test with backend stopped)
□ BACKEND ERROR TEST: stop backend → try to post a reply → error banner appears

Admin actions (role must be admin — switch in roleSim.ts):
□ [Admin] "Verify" button visible on at least one reply
□ [Admin] Clicking Verify adds a verified badge to the reply
□ [Admin] Verified reply moves to the top of the reply list
□ [Admin] "+ FAQ" button appears on verified replies
□ [Admin] + FAQ dialog opens with question pre-filled
□ [Admin] Submitting dialog shows a success message
□ [Admin] New FAQ appears in FAQ page with source "crowd-sourced" — confirm by visiting /faqs

──────────────────────────────────────────
ADMIN QUERY REVIEW (/admin/queries) — admin role required
──────────────────────────────────────────
□ Only accessible when role = admin (intern is redirected to /faqs)
□ Shows ALL queries from ALL interns, not just own queries
□ Queries grouped under: Needs Attention / In Progress / Resolved / Closed
□ Clicking a query card opens its discussion page
□ Empty state shows when there are no queries
□ Loading spinner shows while fetching

──────────────────────────────────────────
BACKEND ERROR STATE TESTING
──────────────────────────────────────────
□ Stop backend: Ctrl+C in the terminal running npm run dev in /server
□ Refresh FAQ page → error state with retry button appears
□ Refresh My Questions → error state with retry button appears
□ Open Query Discussion → error state appears
□ Try to submit Raise Query form → "Network error" message appears
□ Restart backend: npm run dev in /server
□ Refresh pages — everything should work normally again
□ Mention in your report: "Error states tested by stopping backend"

──────────────────────────────────────────
MOBILE TESTING (375px wide — use DevTools device toolbar)
──────────────────────────────────────────
□ No horizontal scroll on any page
□ All text wraps correctly, nothing is cut off
□ Buttons are large enough to tap (44×44px minimum)
□ Nav bar does not overflow or wrap incorrectly
□ FAQ accordion stays readable when expanded
□ Form fields are full-width and easy to tap
□ Reply form keyboard does not cover the text area
□ Admin action buttons (Verify, + FAQ) are labelled clearly and tappable

──────────────────────────────────────────
SUBMISSION CHECKLIST
──────────────────────────────────────────
□ Screenshots attached — minimum 1 per tested page
□ Screenshots labelled with page name and role
□ Screenshot of duplicate suggestion screen (Raise Query test)
□ Screenshot of verified reply badge and top placement (if tested as admin)
□ Screenshot of new FAQ with "crowd-sourced" label (if tested convert-to-FAQ)
□ Screenshot of error state (if tested backend-stopped scenario)
□ All Quick Test items above are ticked off
□ Role tested as: [ intern / admin / both ]
□ Browser and device: [ e.g. Chrome desktop, Chrome DevTools mobile ]
□ If any bugs found: Bug Report filed (Section 9 format)
□ If no bugs found: "No bugs found in this session" written in report
```

---

## 12. Teammate Sign-Off Checklist

Complete this section and include it in every test report you submit.

```
─────────────────────────────────────────────────────
TEAMMATE SIGN-OFF
─────────────────────────────────────────────────────
Name:         _____________________________
Date:         _____________________________
Branch used:  test/fullstack-mvp-testing

ROLE TESTED THIS SESSION: [ intern / admin / both ]

PAGES TESTED:
  □ FAQ Page (/faqs)
  □ Raise Query (/queries/raise)
  □ My Questions (/queries/my)
  □ Query Discussion (/queries/:id)
  □ Admin Query Review (/admin/queries)  ← admin only

MOBILE TESTED: [ Yes / No ]
  If Yes, device/viewport: ____________________

BACKEND ERROR STATES TESTED: [ Yes / No ]
  (Stopped backend to test error UI on pages)

SCREENSHOTS SUBMITTED: [ number ] of required screenshots

MINIMUM SCREENSHOTS CHECK:
  □ FAQ page screenshot included
  □ Raise Query duplicate suggestion screenshot included
  □ Query Discussion screenshot included
  □ Admin-only screenshot(s) if admin role tested
  □ Error state screenshot if backend-stop test done

BUGS FOUND THIS SESSION: [ number ]
  If any: Bug Report(s) filed using Section 9 format
  If zero: "No bugs found in this session" stated in report

QUICK TEST CHECKLIST: [ all items ticked / some items skipped ]
  Skipped items (if any): _____________________

ROLE-SWITCH TESTED:
  □ Switched role from intern to admin and retested relevant pages

SHARED-USER NOTE:
  □ Confirmed which role/mock-user context I tested under
  □ Coordinated with teammates if testing My Questions / Raise Query

I confirm:
  - I tested on test/fullstack-mvp-testing branch
  - I did not modify any app code
  - All screenshots are labelled with page name and role
  - All items above are completed honestly

Signed: _____________________________ Date: __________
─────────────────────────────────────────────────────
```

> Copy this sign-off block into your test report. Fill it in, sign it, and submit alongside your screenshots. This makes it easy for the team lead to track who tested what and whether coverage was complete.