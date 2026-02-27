---
sidebar_position: 5
title: "Clinical Frontend Audit - Lessons Learnt"
description: "A living document tracking best practices, architecture patterns, and technical debt from the clinical-frontend audit, to be applied across the Receptor ecosystem."
---

# Clinical Frontend Audit - Lessons Learnt

This is a **living project document** designed to track the architectural learnings, best practices, and actionable technical debt discovered during the audit of the `clinical-frontend` side project.

Our goal is to continually apply these lessons to the core Next.js applications in the Receptor ecosystem (`planner`, `preferencer`, `workforce`).

:::tip Continuous Improvement
As we implement these patterns across our frontends, we should check off the items below. If new patterns are discovered or refined, add them to this document!
:::

## 1. Project Configuration & Dependencies

The foundation of a reliable application starts with its configuration and tooling.

- [ ] **Unified Tooling**: Ensure all 3 Next.js apps utilize the exact same versions of `@tanstack/react-query`, `zustand`, and Playwright/Vitest to minimize context switching overhead.
- [ ] **Pre-commit Hooks**: Enforce `husky` and `lint-staged` across all frontend repositories to guarantee standard formatting via `prettier` and `eslint` before changes are ever pushed.

## 2. Source Code Architecture & Design Patterns

The `clinical-frontend` demonstrated robust, separated concerns that we must emulate.

:::important Service Layer Abstraction
UI Components must **never** call `supabase.from()` directly. All data access must go through the Data Service -> Hook Layer -> UI Component pipeline.
:::

- [ ] **Service Classes**: Implement abstract `BaseService` patterns (like `patientService.ts`) in all frontends to encapsulate Supabase queries and logic.
- [ ] **Real-time Hooks**: Adopt the `useRealtimeEncounter` pattern utilizing `supabase.channel()` to subscribe to Postgres changes, rather than relying on heavy polling.
- [ ] **Centralized Authorization**: Ensure our `AuthProvider` contexts immediately fetch and inject the user's extended roles (Worker, Workforce Admin, Admin) upon session load.
- [ ] **Offline Resiliency**: Implement robust `localStorage` fallbacks within standard data fetching hooks to maintain UI stability during transient network failures in hospital environments.

## 3. Test Suite & Developer Experience

Testing must be comprehensive but painless to execute locally.

:::info Playwright Lock Workaround
The Next.js `.next/dev/lock` clashing error can be entirely sidestepped by conditionally starting the Playwright `webServer` *only* during CI runs.
:::

- [ ] **Test Configuration Overhaul**: Update `playwright.config.ts` in all projects to use `webServer: process.env.CI ? { ... } : undefined`.
- [ ] **Mocked Environments**: Introduce dedicated mock routes in Playwright (`X-E2E-Mode: mock`) to test frontend logic without polluting or relying on the database.
- [ ] **Unit Testing Isolation**: Ensure Vitest setup files (`setup.ts`) comprehensively mock the Supabase client so unit/component tests evaluate purely local logic without network requests.

---

## Audit History

| Date | Auditor | Focus Area | Actions Generated |
| :--- | :--- | :--- | :--- |
| 2026-02-26 | Antigravity AI | Initial architectural and test suite review | 10 |

