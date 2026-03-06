---
title: Audit Recommendations (260304)
sidebar_label: Recommendations
sidebar_position: 2
---

# Audit Recommendations: Frontend Ecosystem (Audit 260304)

Based on the audit of foundational configuration and stack resilience, the
following actionable improvements are recommended to achieve full enterprise
production readiness.

---

## 🟢 Priority 1: Enterprise Observability & Telemetry

:::important **Issue**: All applications currently rely on `console.error` for
error handling and logging, which is insufficient for clinical production
environments. :::

- **Action**: Integrate a centralized telemetry provider (e.g., **Sentry** or
  **Axiom**).
- **Implementation**:
  - Add `@sentry/nextjs` to all frontend applications.
  - Standardize error reporting in `BaseService.handleError` to automatically
    capture GraphQL and Postgrest errors.
  - Implement breadcrumb logging for high-stakes user flows (e.g., Plan
    creation, Preference submission).

---

## 🟡 Priority 2: Unified Frontend Authorization (RBAC/ABAC)

:::warning **Issue**: `workforce-frontend` lacks explicit frontend permission
guards, relying solely on RLS and standard auth. :::

- **Action**: Port the `PermissionProvider` and `Permitted` guard pattern from
  `planner-frontend` to `workforce-frontend`.
- **Implementation**:
  - Create a shared `PermissionProvider` that maps the `acl_right` entities from
    the database to UI permissions.
  - Wrap action-oriented buttons and navigational links in
    `<Permitted right="position.admin">` guards to ensure UI clinical clarity.

---

## 🔵 Priority 3: Cross-App Pattern Standardization

:::tip **Observation**: `preference-frontend` has an excellent defensive
mutation pattern for handling race conditions that should be a standard across
the ecosystem. :::

- **Action**: Formalize the **Defensive Mutation Pattern** as a platform
  standard.
- **Implementation**:
  - Update the documentation in `gold-standard-state.md` to include guidelines
    on handling "Upsert Race Conditions" via the retry logic found in
    `PreferencingService.ts`.

---

## ⚪ Priority 4: Expansion of Adversarial Testing

- **Action**: Mandate the **Six Adversarial Lenses** for all new feature
  implementations.
- **Implementation**:
  - Create a test template/scaffold that includes placeholders for:
    - Input Validation (Malformed responses)
    - Race Conditions (Simultaneous mutations)
    - Error States (500s/Timeouts)
    - Resilience (Offline/IDB checks)

---

**Auditor**: Antigravity AI **Status**: PENDING IMPLEMENTATION
