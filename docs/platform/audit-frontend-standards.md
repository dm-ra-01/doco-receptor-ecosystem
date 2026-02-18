---
sidebar_position: 10
title: Frontend Standards Audit
---

# 📋 Frontend Standards Audit

This document audits the three primary Receptor frontend applications against the [Ecosystem Standards](./ecosystem-standards.md).

:::info
This is a living audit. Task IDs should be used in PRs to track remediation.
:::

---

# 🧩 Preference Frontend (`preference-frontend`)

| ID | Category | Priority | Status | Description | Definition of Done |
| --- | --- | --- | --- | --- | --- |
| pref-01 | **Anatomy** | 🟢 Low | ✅ Done | Standardised `src/` directory layout. | Anatomy matches Ecosystem Standards. |
| pref-02 | **Data Access** | 🟢 Low | ✅ Done | Supabase SSR Tripartite pattern. | `client.ts`, `server.ts`, `middleware.ts` implemented. |
| pref-03 | **UI Governance** | 🟢 Low | ✅ Done | Radix UI + Lucide React adoption. | Core components use Radix primitives. |
| pref-04 | **Forms** | 🟢 Low | ✅ Done | `react-hook-form` + `Zod` validation. | Production forms use RHF/Zod. |
| pref-05 | **Observability** | 🔥 High | 🔴 Not Started | Integrate Sentry for error tracking. | `next.config.js` configured with Sentry. |
| pref-06 | **Data Access** | 🔥 High | 🔴 Not Started | Migration to TanStack Query. | `useQuery` used for dynamic data. |
| pref-07 | **Security** | 🔥 High | 🔴 Not Started | Implement PHI Safety (no-console, UUID only). | ESLint rule `no-console` enforced. |
| pref-08 | **Localisation** | 🟡 Med | 🟡 In Progress | Audit UI strings for Australian English. | 0 strings matching US spelling patterns. |
| pref-09 | **API Architecture** | 🟡 Med | 🔴 Not Started | Implement `x-receptor-version` checks. | Version mismatch triggers graceful reload/notify. |
| pref-10 | **Navigation** | 🟡 Med | 🔴 Not Started | Unified Cross-App URI Schema. | `receptor://` links used for workforce navigation. |
| pref-11 | **UI Governance** | 🟡 Med | 🔴 Not Started | Persistent User Personalisation. | Theme/Sidebar state stored in `user_preferences`. |
| pref-12 | **UX** | 🟡 Med | 🔴 Not Started | `Cmd+K` Command Palette. | Palette operational with page-level actions. |
| pref-13 | **DevOps** | 🟡 Med | 🔴 Not Started | Declarative Enviroment (`t3-env`). | App fails to start if local `.env` is incomplete. |
| pref-14 | **Compliance** | 🔥 High | 🔴 Not Started | MFA & 15-min Session Timeout. | Re-auth enforced after 15m idle; MFA mandated. |
| pref-15 | **Security** | 🔥 High | 🔴 Not Started | Strict Content Security Policy (CSP). | No `unsafe-inline`; restricted asset sources. |
| pref-16 | **Governance** | 🟡 Med | 🔴 Not Started | Soft-Delete Standard. | Deletions use `deleted_at`; Hard-scrub path defined. |
| pref-17 | **Observability** | 🔥 High | 🔴 Not Started | Tamper-proof Audit Logging. | Patient record reads logged to append-only table. |
| pref-18 | **DevOps** | 🟡 Med | 🔴 Not Started | Automated Patching (Dependabot). | Security patches reviewed/merged automatically. |

---

# 📅 Planner Frontend (`planner-frontend`)

| ID | Category | Priority | Status | Description | Definition of Done |
| --- | --- | --- | --- | --- | --- |
| plan-01 | **Anatomy** | 🟢 Low | ✅ Done | Standardised `src/` directory layout. | Anatomy matches Ecosystem Standards. |
| plan-02 | **Data Access** | 🟢 Low | ✅ Done | Supabase SSR Tripartite pattern. | SSR clients implemented. |
| plan-03 | **Forms** | 🔥 High | 🔴 Not Started | Standardise on `react-hook-form` + `Zod`. | All forms refactored to use RHF + Zod. |
| plan-04 | **UI Governance** | 🔥 High | 🔴 Not Started | Adopt Radix UI for complex primitives. | Modals and Popovers replaced with Radix. |
| plan-05 | **Observability** | 🔥 High | 🔴 Not Started | Integrate Sentry. | Sentry SDK initialized. |
| plan-06 | **Data Access** | 🔥 High | 🔴 Not Started | Adopt TanStack Query + Result Wrapper. | All services use `useQuery`. |
| plan-07 | **API Architecture** | 🟡 Med | 🔴 Not Started | Implement `x-receptor-version` checks. | API version header validation operational. |
| plan-08 | **Navigation** | 🟡 Med | 🔴 Not Started | Unified Cross-App URI Schema. | Worker profile links use `receptor://` schema. |
| plan-09 | **UI Governance** | 🟡 Med | 🔴 Not Started | Persistent User Personalisation. | Global user settings synced with Supabase. |
| plan-10 | **UX** | 🟡 Med | 🔴 Not Started | `Cmd+K` Command Palette. | Unified search bar for roster/patient lookup. |
| plan-11 | **DevOps** | 🟡 Med | 🔴 Not Started | Declarative Enviroment (`t3-env`). | CI verification of required env variables. |
| plan-12 | **Compliance** | 🔥 High | 🔴 Not Started | MFA & 15-min Session Timeout. | Compliance with ACSC Essential Eight MFA rules. |
| plan-13 | **Security** | 🔥 High | 🔴 Not Started | Strict Content Security Policy (CSP). | CSP headers verified in production. |
| plan-14 | **Observability** | 🔥 High | 🔴 Not Started | Tamper-proof Audit Logging. | Audit logs for roster access/edits. |

---

# 🏥 Workforce Frontend (`workforce-frontend`)

| ID | Category | Priority | Status | Description | Definition of Done |
| --- | --- | --- | --- | --- | --- |
| work-01 | **Forms** | 🟢 Low | ✅ Done | `react-hook-form` + `Zod` validation. | All implementation forms use RHF/Zod. |
| work-02 | **Anatomy** | 🟡 Med | ✅ Done | Suppress `test/` vs `__tests__` divergence. | Test structure verified. |
| work-03 | **UI Governance** | 🔥 High | 🔴 Not Started | Adopt Radix UI primitives. | Foundations migrated to Radix. |
| work-04 | **Observability** | 🔥 High | 🔴 Not Started | Integrate Sentry. | Production errors tracked in Sentry. |
| work-05 | **Data Access** | 🔥 High | 🔴 Not Started | Adopt TanStack Query + Result Wrapper. | Services refactored to `{ data, error } pattern`. |
| work-06 | **Resilience** | 🔥 High | 🔴 Not Started | Implement Offline Drafting for Master Data. | LocalStorage/IndexedDB auto-save implemented. |
| work-07 | **API Architecture** | 🟡 Med | 🔴 Not Started | Implement `x-receptor-version` checks. | Version consistency confirmed at runtime. |
| work-08 | **Navigation** | 🟡 Med | 🔴 Not Started | Unified Cross-App URI Schema. | Cross-app links use canonical platform URIs. |
| work-09 | **UI Governance** | 🟡 Med | 🔴 Not Started | Persistent User Personalisation. | Preferences follow user across the platform. |
| work-10 | **UX** | 🟡 Med | 🔴 Not Started | `Cmd+K` Command Palette. | Fast navigation implemented for master data. |
| work-11 | **DevOps** | 🟡 Med | 🔴 Not Started | Declarative Enviroment (`t3-env`). | Type-safe environment variable validation. |
| work-12 | **Compliance** | 🔥 High | 🔴 Not Started | MFA & 15-min Session Timeout. | ISO 27001 Access Control standard met. |
| work-13 | **Security** | 🔥 High | 🔴 Not Started | Strict Content Security Policy (CSP). | Secure application hardening enforced. |
| work-14 | **Governance** | 🟡 Med | 🔴 Not Started | Soft-Delete Standard. | Clinical entity retention rules enforced. |

---

## 🚀 Unified Remediation Roadmap

:::tip
Prioritize **Security (PHI/CSP)**, **Compliance (MFA/Timeouts)**, and **Observability (Sentry/Audit)** as the core "Clinical Shield" foundations.
:::

1. **Sprint 1**: Sentry + PHI Safety + **MFA/Session Timeouts** + AU English.
2. **Sprint 2**: TanStack Query + **Tamper-proof Audit Logging**.
3. **Sprint 3**: Radix UI + Form Standardisation + **Strict CSP Policy**.
4. **Sprint 4**: **Data Retention Standard** + Bundle Size + Scaffolding.
