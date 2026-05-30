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

* Not required for initial MVP
* Mock services are used first
* Real backend integration can be added later

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

## Backend Plan

The first MVP uses mock services.

This means data comes from local mock files first.

Example:

```txt
faq.mock.ts
query.mock.ts
reply.mock.ts
```

Service files should be written so that real backend APIs can replace mock data later.

Example:

```ts
faqService.getFaqs()
queryService.createQuery()
adminService.verifyReply()
```

Later backend routes may include:

```txt
GET /faqs
POST /queries
GET /queries
GET /queries/:queryId
POST /queries/:queryId/replies
PATCH /replies/:replyId/verify
PATCH /queries/:queryId/resolve
POST /faqs/from-reply/:replyId
```

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
