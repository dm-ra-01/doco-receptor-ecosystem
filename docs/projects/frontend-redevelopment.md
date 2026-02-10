---
sidebar_position: 4
---

# Project 3: Frontend Redevelopment

Migration from **rotator_worker** (Flutter) to a modern, multi-app Next.js architecture.

:::note
This initiative has evolved into a quartet of specialized services—**Workforce, Planner, Preferencer, and Allocator**—to better isolate concerns, improve security (RLS), and streamline development.
:::

## Core Services Architecture

Receptor's functionality is divided into four specialized components:

| Component | Target Users | Core Responsibilities | Repository |
|:---|:---|:---|:---|
| **Preferencer Frontend** | Healthcare Workers | Preference submission, Profile management, Rotation viewing. | [preference-frontend](https://github.com/dm-ra-01/preference-frontend) |
| **Planner Frontend** | Workforce Managers | Allocation plans, Runs, Position/Worker mappings, Rotation customisation. | [planner-frontend](https://github.com/dm-ra-01/planner-frontend) |
| **Workforce Frontend** | System Administrators | Organizations, Teams, Team Categories, Locations, Positions. | [workforce-frontend](https://github.com/dm-ra-01/workforce-frontend) |
| **Public Landing Page**| Potential Clients | Marketing, Branding, Strategic Vision, Lead Generation. | [website-frontend](https://github.com/dm-ra-01/website-frontend) |
| **Allocator Backend** | System / Managers | The matching engine, optimization logic, and audit trail generation. | [match-backend](https://github.com/dm-ra-01/match-backend) |


## Project Status

| Component | Status | Notes |
|:----------|:-------|:------|
| **Preferencer Frontend** | 🟡 In Progress | Mobile-first workflow, Magic Link auth, Preference engine. |
| **Planner Frontend** | 🟢 Complete | Plans, Runs, Mappings, and Rotation Customisation builder. |
| **Workforce Frontend** | 🟡 In Progress | CRUD pages created for Teams, Locations, Categories, Positions. |
| **Shared Layout/UI** | 🟢 Complete | Vanilla CSS design system ported across apps. |
| **Public Landing Page**| 🟢 Complete | High-fidelity branding hub with secondary views. |
| **Auth Consolidation** | 🟢 Complete | Improved Session Handoff page with robust fallback. |

---

## 🏗️ Workforce Frontend (New Initiative)

The **Workforce Frontend** is the foundation of the administrative suite. It manages the static organizational data that feeds into the Planner and Preferencer.

### Core Features:
- **Organization Management**: Multi-tenancy settings and global defaults.
- **Team Management**: CRUD for teams and team categories (e.g., Medicine, Surgery).
- **Location Management**: Campus and ward definition.
- **Position Management**: Standardized position titles and qualification requirements.
- **User/Staff Directory**: Comprehensive view of all workers within the organization.

---

## 🗂️ Global Repository Structure

```
frontend/
├── [preference-frontend](https://github.com/dm-ra-01/preference-frontend)   # Worker-facing (Project 4)
├── [planner-frontend](https://github.com/dm-ra-01/planner-frontend)      # Planning-facing (Project 3A)
├── [workforce-frontend](https://github.com/dm-ra-01/workforce-frontend)    # Organization-facing (Project 3B)
├── [website-frontend](https://github.com/dm-ra-01/website-frontend)      # Public Landing Page (Marketing)
└── [rotator_worker](https://github.com/dm-ra-01/rotator_worker)        # Legacy Flutter App (DEPRECATED)
```

---

## 🔄 Migration Progress

### Phase 1: Planning Foundation (Planner Frontend)
- [x] Initialized `planner-frontend`
- [x] Implemented Allocation Plans & Runs
- [x] Developed Rotation Customisation UI
- [x] Established TDD with Vitest/Playwright

### Phase 2: Worker Submission (Preferencer Frontend)
- [x] Initialized `preference-frontend`
- [x] Finalized "Magic Link" Session Handoff
- [ ] Implement Mobile-First Job Line Browser
- [ ] Build Ranking/Preferencing interface

### Phase 3: Organizational Master Data (Workforce Frontend)
- [x] Initialized `workforce-frontend` with Next.js 16
- [x] Created Vanilla CSS shared design system
- [x] Built CRUD services (Location, Team, TeamCategory, Position)
- [x] Created list pages for Locations, Teams, Categories, Positions
- [x] Add form validation with zod + react-hook-form
- [x] Implement Create/Edit modal for Locations
- [x] Implement Create/Edit modals for Teams, Categories, Positions

---

## Technical Decisions

### Technology Stack (Standardized)

| Layer | Technology | Notes |
|:------|:-----------|:------|
| Framework | Next.js 15+ | App Router, Server Actions |
| Styling | Vanilla CSS / Tailwind | Consistent design system across apps |
| UI Library | shadcn/ui | Radix UI primitives |
| State | React Context + Hooks | Selective use of Server Components |
| Testing | Vitest + Playwright | Mandatory TDD for services |

### Environment Variables (Shared Pattern)

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Reference Documentation

- [Receptor Preferencer](../app-documentation/frontend-apps/receptor-preferencer)
- [Receptor Planner](./planner-frontend)
- [Receptor Workforce](./workforce-frontend)
- [Project 1: Supabase Migration](./supabase-migration)
- [Project 4: My Preferences](./my-preferences-microservice)
