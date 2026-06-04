# Bug Tracker — cs19 FAQ MVP

**Project:** Crowd-Sourced FAQ Generation System for Vicharanashala Internship  
**Branch:** `test/fullstack-mvp-testing`  
**Testing Guide:** See `TEAM_TESTING_GUIDE.md` for instructions

---

## 1. Purpose

This file tracks all bugs found by teammates during the testing phase of the MVP.

Every bug must be reported using the template in Section 3. This keeps the team organised, prevents duplicates, and makes it easy to see what is open, in progress, or closed.

**Who updates this file:** Anyone who finds a bug adds a new entry. The assigned person updates the status as the bug moves through fix → retest → close.

**Where bugs get fixed:** Fixes are made in feature branches. This file tracks the bug status, not the code itself.

---

## 2. Bug Severity Guide

Use this guide to classify every bug you report. The severity affects how quickly it gets prioritised.

| Severity | What it means | Examples |
|---|---|---|
| **Critical** | App crashes, page is unusable, data cannot be submitted, or role security is broken | Page goes blank on load, intern can access admin page, query submission silently fails with no error |
| **Major** | An important feature is broken but the rest of the app is still usable | Search returns no results even for valid queries, category filter does nothing, reply form cannot be submitted |
| **Minor** | A UI issue, text error, or small layout problem that does not stop the feature from working | A label is spelled wrong, a button is slightly off-centre, a tooltip is missing |
| **Improvement** | Not a bug — something that could be better, but the current behaviour is acceptable | "The empty state could be more helpful", "It would be nice if the search had autocomplete" |

**When in doubt:** report it as Minor. It is better to have a low-priority entry than to miss a real issue.

---

## 3. Bug Report Template

Copy the template below, fill it in, and add a new entry to the bug table in Section 4.

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

## 4. Bug Table

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

## 5. Retesting Rules

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

## 6. What NOT to Report As Bug

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

## Quick Reference: Status Meanings

| Status | What it means |
|---|---|
| **Open** | Bug reported, not yet assigned or started |
| **In Progress** | Someone is actively fixing it |
| **Fixed** | Code fix is done, waiting for retest |
| **Retest** | Fix needs to be verified by a different teammate |
| **Closed** | Retester confirmed the bug is fixed and gone |