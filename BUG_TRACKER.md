# Bug Tracker — cs19 FAQ MVP

**Project:** Crowd-Sourced FAQ Generation System for Vicharanashala Internship  
**Branch:** `test/fullstack-mvp-testing`  
**Testing Guide:** See `TEAM_TESTING_GUIDE.md` for instructions

---

## 1. What Is a Bug Tracker?

A bug tracker is a shared document where the whole team records problems they find during testing. Think of it like a shared notepad for the team — instead of telling one person privately, you write it here so everyone can see the status of every issue.

When a teammate finds a bug, they add it here. When a developer fixes it, they update the status. When a different teammate confirms the fix works, the bug gets closed. This way nothing gets lost and everyone knows what is still open.

This file lives in the project root: `BUG_TRACKER.md`

---

## 2. Why We Use It

If a teammate just says "the button is not working" in a chat, that is not enough to fix the problem. The developer does not know:

- Which page they were on
- Whether they were testing as intern or admin
- What they clicked before the button failed
- What should have happened instead
- Whether it was on mobile or desktop

A good bug report answers all of these questions. The more detail you give, the faster the bug gets fixed. Lazy reports = lazy fixes, or no fix at all.

**The rule:** Every bug report must include: page name, role (intern/admin), steps to reproduce, expected result, actual result, and a screenshot. If any of these is missing, the report is incomplete.

---

## 3. How to Add a Bug — Step by Step

**Step 1:** Check the "Before reporting a bug" checklist in Section 12. Make sure it really is a bug.

**Step 2:** Copy the Bug Report Template in Section 9, fill in every field.

**Step 3:** Give the bug a unique ID. Look at the bug table in Section 7 — use the next available number. If the last entry is `006`, yours is `007`.

**Step 4:** Add the bug to the table in Section 7 with a one-line summary, your name, today's date, and status "Open".

**Step 5:** The team lead reviews your report, assigns it to a developer, and updates the status. You do not need to assign bugs yourself unless told otherwise.

**Step 6:** After a developer fixes the bug, the bug moves through: In Progress → Fixed → Retest → Closed. You may be asked to help retest.

---

## 4. Filled Example Bug Report

Below is a complete, realistic bug report. Use this as a reference when writing your own.

---

**Example: Admin Verify button does not mark a reply as verified**

```
## Bug #003

**Reported by:** Rahul
**Date reported:** 2026-06-04
**Page / Route:** /queries/raise → then to /queries/abc123 (Query Discussion)
**Role tested as:** admin
**Device:** Laptop — Dell XPS 13
**Browser:** Chrome 126

### Steps to Reproduce
1. Set role to 'admin' in roleSim.ts and save.
2. Go to /queries/raise and submit a new query with title "How do I apply for leave?".
3. On the success screen, click "View My Questions".
4. Click on the new query card to open the Query Discussion page.
5. In the reply form, fill in Name: "Rahul", Role: "admin", Message: "You need to raise a formal leave request via the portal."
6. Click Submit Reply.
7. The reply appears in the list.
8. I click the "Verify" button on the reply.

### Expected Result
The reply should:
- Show a verified badge (e.g. ✓ Verified or "Verified Answer" label)
- Move to the top of the reply list

### Actual Result
The reply does not change at all. No badge appears. The Verify button still says "Verify" and the reply stays in its original position.

### Screenshot / Video
[Screenshot: QueryDiscussion-Admin-VerifyButton-NoChange.png]

### Severity
[ ] Critical
[x] Major — this is a core admin feature that does not work at all
[ ] Minor
[ ] Improvement

### Status
[x] Open
[ ] In Progress
[ ] Fixed
[ ] Retest
[ ] Closed

### Assigned to
_(leave blank — team lead assigns)_

### Notes
This was tested twice. Both times Verify button appeared but did nothing. No error in browser console.
```

---

## 5. Bug Severity Guide

Use this guide to classify every bug you report. The severity affects how quickly it gets prioritised.

| Severity | What it means | Examples |
|---|---|---|
| **Critical** | App crashes, page is unusable, data cannot be submitted, or role security is broken | Page goes blank on load, intern can access admin page, query submission silently fails with no error |
| **Major** | An important feature is broken but the rest of the app is still usable | Search returns no results even for valid queries, category filter does nothing, reply form cannot be submitted |
| **Minor** | A UI issue, text error, or small layout problem that does not stop the feature from working | A label is spelled wrong, a button is slightly off-centre, a tooltip is missing |
| **Improvement** | Not a bug — something that could be better, but the current behaviour is acceptable | "The empty state could be more helpful", "It would be nice if the search had autocomplete" |

**When in doubt:** report it as Minor. It is better to have a low-priority entry than to miss a real issue.

---

## 6. Bug Report Template

Copy the template below, fill it in, and add a new entry to the bug table in Section 7.

```
## Bug #[ID]

**Reported by:** [Your name]
**Date reported:** [YYYY-MM-DD]
**Page / Route:** [/faqs, /queries/raise, /queries/my, /queries/:id, /admin/queries]
**Role tested as:** [intern / admin]
**Device:** [laptop / mobile — specify model if known]
**Browser:** [e.g., Chrome 126, Firefox 128, Safari]

### Steps to Reproduce
1. Go to [page]
2. Click on [element]
3. [Action]
4. Observe [what happens]

### Expected Result
[What should happen]

### Actual Result
[What actually happens]

### Screenshot / Video
[Attach screenshot or paste link to recording]

### Severity
[ ] Critical
[ ] Major
[ ] Minor
[ ] Improvement

### Status
[ ] Open
[ ] In Progress
[ ] Fixed
[ ] Retest
[ ] Closed

### Assigned to
[Name of person fixing this — leave blank if not yet assigned]

### Notes
[Any extra context, link to fix branch, or discussion notes]
```

---

## 7. Bug Table

The table below holds all reported bugs. Add a new row for each bug using the template above.

| ID | Bug Summary | Page | Severity | Reported By | Date | Status | Assigned To |
|---|---|---|---|---|---|---|---|
| 001 | _(add summary here) | | | | | Open | |
| 002 | | | | | | | |
| 003 | | | | | | | |
| 004 | | | | | | | |
| 005 | | | | | | | |
| 006 | | | | | | | |
| 007 | | | | | | | |
| 008 | | | | | | | |
| 009 | | | | | | | |
| 010 | | | | | | | |

---

## 8. Retesting Rules

Every bug fix must be retested by **someone other than the person who fixed it** before it is marked Closed. This prevents the fixer from missing their own mistake.

### Retest Process

1. The fixer completes the fix in a feature branch, merges it to `test/fullstack-mvp-testing`, and updates the bug status to **Retest**.
2. A different teammate is assigned to retest.
3. The retester:
   - Pulls the latest code from `test/fullstack-mvp-testing`
   - Follows the original **Steps to Reproduce**
   - Confirms the bug is actually fixed
   - Updates the bug status to **Closed** in this file
4. If the bug is **not fixed**, the retester sets status back to **Open** and adds a note explaining what still fails.

### Retest Checklist

```
BUG #[ID] — RETEST CHECKLIST
Fix branch used: _____________________
Retester: _____________________
Date: _____________________

□ Followed original Steps to Reproduce exactly
□ Confirmed expected result now matches actual result
□ Tested on: [ laptop / mobile — specify ]
□ Tested as role: [ intern / admin ]
□ Bug is resolved: [ YES / NO ]

If NO — describe what still fails:
___________________________________________________

Status updated to: [ Closed / Open ]
Retester signature: ___________________
```

---

## 9. What NOT to Report As Bug

The following are **not bugs** — do not add them to the tracker. If you are unsure, ask your team lead first.

### Known MVP Limitations

These are already documented in `TEAM_TESTING_GUIDE.md` Section 11 (Known MVP Limitations). Do not report them:

| Do NOT report | Because |
|---|---|
| No real authentication | MVP uses a hardcoded role constant — this is by design |
| Data resets on backend restart | Backend uses in-memory storage — no database yet |
| No real-time updates | Reply appears only after page refresh — known gap |
| `markFaqHelpful` not persisting | Backend endpoint does not exist yet |
| No notifications | Not part of MVP scope |
| Role switch requires editing a file | No UI for role switching in MVP |
| No query status transitions | Backend does not update statuses automatically yet |

### Missing Future Features

These are planned for post-MVP versions. Do not report them as bugs:

- Real AI / LLM chatbot or answer generation
- File or screenshot attachments in queries or replies
- Real-time WebSocket-based updates
- Push or in-app notifications
- Gamification, points, or leaderboards
- Advanced analytics or dashboard
- Multi-level nested replies
- Email or SMS alerts
- Persistent user accounts and login

### Personal Design Preferences

If something works correctly but you would personally prefer a different colour, font, or layout, that is a design opinion — not a bug.

**Exception:** If a design choice makes the app harder to use, unclear, or inaccessible, that is a **Minor** bug. For example:

- Text so small it is unreadable on mobile → Minor bug
- You prefer purple over yellow accent colour → Not a bug
- Button is positioned in an unexpected place → Minor bug if it confuses users, otherwise Not a bug

---

## 10. Team Workflow — Who Does What

Here is how a bug travels from finding to fixing to closing:

```
Tester finds a bug
        ↓
Tester adds it to BUG_TRACKER.md (status: Open)
        ↓
Team lead reviews and assigns to a developer
        ↓
Developer fixes the bug in a feature branch (e.g. fix/rahul-verify-button)
        ↓
Developer merges fix to test/fullstack-mvp-testing
        ↓
Developer updates BUG_TRACKER.md (status: Retest)
        ↓
Different teammate retests the bug (NOT the same person who fixed it)
        ↓
If fixed: Retester sets status to Closed
If not fixed: Retester sets status back to Open with a note
```

**Important:** The same person who fixes a bug should NOT be the one to close it. A second pair of eyes must verify.

---

## 11. One Bug Per Report — Rule

**One bug report = one issue only.**

If you find two separate bugs, file two separate reports. Do not combine them.

**Why?**
- If bug #1 is fixed but bug #2 is not, the developer cannot mark the combined report as resolved.
- It is harder to track, assign, and close separately.

**Example of what NOT to do:**

> ❌ "The FAQ page search is broken AND the Raise Query button does not work"

**Correct approach:**

> ✅ Bug #010 — FAQ search returns no results for valid queries
> ✅ Bug #011 — Raise Query submit button does nothing when clicked

---

## 12. Before Reporting a Bug — Pre-Flight Checklist

Before you file a bug report, run through this checklist. Most "bugs" turn out to be one of these issues.

- [ ] **Are you on the correct branch?**
  Run: `git branch --show-current`
  Must print: `test/fullstack-mvp-testing`
  If you are on a different branch, switch before testing.

- [ ] **Is the frontend running?**
  You should see the app at `http://localhost:5173`.
  If you see a blank page or Vite error, the frontend is not running.

- [ ] **Is the backend running?**
  The backend runs at `http://localhost:3001`.
  If you see "Network error" on every page, the backend may have stopped.
  To restart: `cd server` then `npm run dev`.

- [ ] **Did you refresh the page?**
  Many UI issues fix themselves after a refresh. Try Ctrl+F5 (hard refresh) before reporting.

- [ ] **Did you check the browser console for red errors?**
  Press F12 → Console tab.
  Red text = JavaScript error. Screenshot any red errors and include them in your report.

- [ ] **Did you take a screenshot?**
  Every bug report needs visual evidence. No screenshot = incomplete report.

- [ ] **Is this a known MVP limitation?**
  Check Section 9 (What NOT to Report). If it is listed there, do not report it.

- [ ] **Is this a personal design preference?**
  If the feature works correctly but you would prefer a different look, it is not a bug. Ask the team lead if unsure.

If you answered **yes** to all applicable checks and you still see the issue — it is a real bug. File the report.

---

## 13. Good Bug Report vs Bad Bug Report

### Bad Bug Reports (Too Vague — Do Not Do This)

**Example 1:**
> "Button not working"

Problem: Which button? Which page? Which role? What did you expect to happen? No screenshot, no steps.

---

**Example 2:**
> "The FAQ page is broken"

Problem: Broken how? Does it load? Does it not show FAQs? Does search fail? Nothing is actionable here.

---

**Example 3:**
> "I tried to submit a query but it didn't work. Using admin account."

Problem: No route, no steps, no expected vs actual result, no screenshot.

---

### Good Bug Reports (Clear and Complete — Do This)

**Example 1:**
> **Bug #004**
> Page: Raise Query `/queries/raise`
> Role: intern
> Steps:
> 1. Go to /queries/raise
> 2. Fill in Title: "How do I get my certificate?"
> 3. Fill in Description: "I completed my internship 2 months ago..."
> 4. Select Category: "Certificate"
> 5. Click Submit
> Expected: Loading state appears, then success screen, then redirect to My Questions
> Actual: Page freezes for 5 seconds, then shows "Network error" even though backend is running
> Screenshot: [attached]

---

**Example 2:**
> **Bug #005**
> Page: FAQ Page `/faqs`
> Role: intern
> Steps:
> 1. Go to /faqs
> 2. Click the "Samagama Portal" category chip
> 3. Observe the FAQ list
> Expected: Only FAQs with category "Samagama Portal" are shown
> Actual: All FAQs are still shown — category filter has no effect
> Screenshot: [attached — shows all categories mixed despite filter being active]

---

The pattern is simple: **Someone else should be able to read your report, follow your steps exactly, and see the same bug happen.**

---

## 14. Quick Reference: Status and Severity

### Severity Reference

| Severity | What it means | Examples |
|---|---|---|
| **Critical** | App crashes, page is unusable, data cannot be submitted, or role security is broken | Page goes blank on load, intern can access admin page, query submission silently fails with no error |
| **Major** | An important feature is broken but the rest of the app is still usable | Search returns no results even for valid queries, category filter does nothing, reply form cannot be submitted |
| **Minor** | A UI issue, text error, or small layout problem that does not stop the feature from working | A label is spelled wrong, a button is slightly off-centre, a tooltip is missing |
| **Improvement** | Not a bug — something that could be better, but the current behaviour is acceptable | "The empty state could be more helpful", "It would be nice if the search had autocomplete" |

**When in doubt:** report it as Minor. It is better to have a low-priority entry than to miss a real issue.

### Status Reference

| Status | What it means |
|---|---|
| **Open** | Bug reported, not yet assigned or started |
| **In Progress** | Someone is actively fixing it |
| **Fixed** | Code fix is done, waiting for retest |
| **Retest** | Fix needs to be verified by a different teammate |
| **Closed** | Retester confirmed the bug is fixed and gone |