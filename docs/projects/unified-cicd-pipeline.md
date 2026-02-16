---
sidebar_position: 25
---

# Project: Unified CI/CD Pipeline

Establish a centralized, robust, and automated CI/CD pipeline across the Receptor monorepo to ensure software quality, security, and velocity.

## High-Level Roadmap

| Phase | Focus | Status |
| :--- | :--- | :--- |
| **Phase 1: Foundation** | PR Gates: Linting, Unit Tests, RLS Security | 🟡 In Progress |
| **Phase 2: Parity** | Integrated E2E, Deployment Previews, Doc Sync | 🔴 Not Started |
| **Phase 3: Advanced** | Performance Budgets, SAST/DAST, Visual Regressions | 🔴 Not Started |

---

## 1. Monorepo Orchestration (Global)

Centralized management of the monorepo lifecycle.

- [ ] **Root Workflow**: Implement `.github/workflows/ci.yml` at the environment root.
  - Path-based filtering (using `actions/labeler` or `dorny/paths-filter`).
  - Cross-repo dependency triggers.
- [ ] **Unified Status Dashboard**: A single GitHub Action view showing health across all submodules.
- [ ] **Automated Doc Sync**: Enforce `npm run gen-graph` across documentation submodules on every infrastructure change.

---

## 2. Per-Application CI/CD Status

### 🗄️ Supabase Backend (`supabase-receptor`)
- **Primary Goal**: Automated schema validation and RLS enforcement.
- [x] **Automated Migrations**: Verification via ephemeral containers (active in Frontend CI).
- [x] **RLS Verification**: SQL-based security benchmarks (active in Frontend CI).
- [ ] **DB Linting**: Integrate `supabase db lint` into server-side PR gates.
- [ ] **Seed Integrity**: Automated verification of the Acacia dataset consistency.

### ⚙️ Match Backend (`match-backend`)
- **Primary Goal**: Algorithm correctness and optimization performance tracking.
- [ ] **Algorithm Regression**: Run solver consistency tests on every core physics change.
- [ ] **Performance Benchmarking**: Track solver time/memory usage relative to baseline datasets.
- [ ] **Containerization**: Automated Docker build and push to registry on merge to main.

### 🗓️ Planner Frontend (`planner-frontend`)
- **Primary Goal**: Reliability of complex workforce planning UI.
- [x] **Unit & Integration**: Vitest suite with high coverage requirements.
- [x] **RLS Security Gating**: Integrated security tests using `test-utils.ts`.
- [ ] **Deployment Previews**: Automatic Cloudflare Pages previews for every PR.
- [ ] **Visual Regression**: Playwright snapshot testing for complex planning matrices.

### 🙋 Preference Frontend (`preference-frontend`)
- **Primary Goal**: Mobile/Web accessibility and worker submission reliability.
- [ ] **Accessibility (A11y) Gates**: Enforce `axe-core` checks in CI to ensure WCAG compliance.
- [ ] **Mobile Simulation**: Automated Playwright tests across multiple viewport sizes.
- [ ] **Unit Testing**: Port existing manual test suite to automated CI runners.

### 👥 Workforce Frontend (`workforce-frontend`)
- **Primary Goal**: Data integrity for organizational master data.
- [ ] **Form Validation Audit**: Automated testing of complex organizational hierarchy inputs.
- [ ] **CRUD Integration**: E2E tests verifying data propagation from Frontend to Supabase.

### 🎨 Design Frontend (`design-frontend`)
- **Primary Goal**: Component library consistency and visual standards.
- [ ] **Component Documentation**: Automated build/deploy of the Storybook/Registry.
- [ ] **Visual Regression**: Baseline snapshots for every core UI component.
- [ ] **Package Publishing**: Automated versioning and publishing to internal registry.

### 🌐 Website Frontend (`website-frontend`)
- **Primary Goal**: SEO, Performance, and Marketing conversion.
- [ ] **SEO Auditing**: Automated Meta-tag and Heading hierarchy checks.
- [ ] **Lighthouse CI**: Enforce Performance (90+), SEO, and Best Practice scores.
- [ ] **Automated Deployment**: Direct deployment to Cloudflare production on `main` merge.

---

## Task Completion Tracking

| Task ID | Category | App | Status | Evidence/Artifact |
|:--------|:---------|:----|:-------|:------------------|
| CICD-001| Research | Global | ✅ | [audit-2026-02-16.md](../infrastructure/operations/audit-2026-02-16) |
| CICD-005| Unit Tests| Planner| ✅ | [Codecov Workflow](https://github.com/dm-ra-01/planner-frontend/blob/main/.github/workflows/codecov.yml) |
| CICD-006| Security | Supabase| ✅ | [RLS Test Suite](https://github.com/dm-ra-01/planner-frontend/blob/main/src/test/security/RLS.test.ts) |

---

## Reference Documentation
- [Infrastructure Operations](../infrastructure/operations/ci-cd)
- [Testing Guide](../infrastructure/operations/testing-guide)
- [Audit Report (Feb 16)](../infrastructure/operations/audit-2026-02-16)
