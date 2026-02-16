---
sidebar_position: 25
---

# Project: Unified CI/CD Pipeline

Establish a centralized, robust, and automated CI/CD pipeline across the Receptor monorepo to ensure software quality, security, and velocity.

## Project Status

| Component | Status | Notes |
|:----------|:-------|:------|
| Foundational CI | 🟡 In Progress | Basic research completed; roadmap established. |
| Deployment Parity | 🔴 Not Started | |
| Advanced Verification| 🔴 Not Started | |

---

## Phase 1: Foundational PR Gates (Short Term)

Focus on stabilizing the core development flow and preventing regressions.

### 1. Monorepo Orchestration
- [ ] **Root Workflow**: Implement root `.github/workflows/ci.yml` using conditional path filtering.
  - *Evidence*: [Placeholder for CI link]
- [ ] **Dependency Management**: Integrate automated dependency checking for Next.js submodules.

### 2. Backend (Supabase)
- [ ] **DB Linting**: Run `supabase db lint` in CI for all PRs affecting `supabase-receptor/`.
- [ ] **Automated Migrations**: Verify SQL migrations against a transient Supabase container.
- [ ] **RLS Verification**: Execute security benchmark tests on every PR.

### 3. Frontend Quality
- [ ] **Linter & Type Consistency**: Enforce `npm run lint` and `tsc --noEmit` across all React frontends.
- [ ] **Core Unit Testing**: Automate Vitest execution for `planner-frontend` and `preference-frontend`.

---

## Phase 2: Deployment & Environment Parity (Medium Term)

Ensure that what works locally also works in staging and production.

### 1. Environment Management
- [ ] **GitHub Secrets Audit**: Transition secrets from local `.env` to GitHub Environments.
- [ ] **Preview Deployments**: Enable Cloudflare Pages previews for all frontend pull requests.

### 2. Workflow Integration
- [ ] **Automated Doc Sync**: Workflow to run `npm run gen-graph` and push metadata updates back to `main`.
- [ ] **Knowledge Graph Enforcement**: Ensure all PRs pass a knowledge graph consistency check.

---

## Phase 3: Advanced Verification (Long Term)

Implement industry-leading quality and security controls.

### 1. Security & Compliance
- [ ] **SAST/DAST**: Integrate Snyk or CodeQL for static analysis.
- [ ] **Secret Scanning**: Prevent accidental commit of credentials.

### 2. Performance & UI Reliability
- [ ] **Visual Regression**: promote Playwright snapshots to CI gates.
- [ ] **Lighthouse CI**: Enforce performance budgets for the public website and core apps.

---

## Task Completion Tracking

| Task ID | Category | Status | Evidence/Artifact |
|:--------|:---------|:-------|:------------------|
| CICD-001| Research | ✅ Complete | [cicd_report.md](../../../../.gemini/antigravity/brain/1fbee009-3dee-47bf-acc3-0e912685df7e/cicd_report.md) |
| CICD-002| Roadmap | ✅ Complete | [This Document](#) |
| CICD-003| Root CI | 🔴 Not Started | |
| CICD-004| DB Lint | 🔴 Not Started | |

---

## Reference Documentation

- [Infrastructure Operations](../infrastructure/operations/ci-cd)
- [Testing Guide](../infrastructure/operations/testing-guide)
- [Supabase Setup](../../../../supabase-receptor/README.md)
