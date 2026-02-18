---
sidebar_position: 5
title: Receptor Ecosystem Standards
---

# Receptor Ecosystem Standards

This document outlines the implementation methodology, quality standards, and development workflows used across the **Receptor** ecosystem (including frontend apps like Preference, Worker, and Planner). All new features and applications should adhere to these standards.

## 🛠️ Implementation Methodology

### Technology Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router) with [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) for a modern, responsive design system.
- **Backend**: [Supabase](https://supabase.com/) (Auth, Postgres, Edge Functions).
- **State Management**: React Server Components & Server Actions; use sparingly React state for transient UI.
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration) and [Playwright](https://playwright.dev/) (E2E).

### Quality Standards
- **Security**: Strict Row-Level Security (RLS) policies for multi-tenancy and privilege separation. Verified via integration tests.
- **ISO 27001 & Essential Eight Compliance**: Mandatory adherence to clinical-grade security protocols (MFA, CSP, Audit Logging).
- **Accessibility (Definition of Done)**:
    - Built with semantic HTML5 and [Radix UI](https://www.radix-ui.com/) primitives.
    - Continuous verification using [axe-core](https://github.com/dequelabs/axe-core).
    - Mandatory `aria-label` and `role` attributes for all interactive custom elements.
    - Keyboard navigable focus states with high-contrast outlines.
- **Performance Benchmarks**:
    - **LCP (Largest Contentful Paint)**: < 1.2s
    - **FID (First Input Delay)**: < 100ms
    - **CLS (Cumulative Layout Shift)**: < 0.1
    - Optimized via Next.js Server Components and Tailwind 4's lightweight runtime.
- **Visual Design**: Follows the **Receptor Design System**:
    - **Typography**: Inter (General); Roboto (Data-heavy).
    - **Icons**: [Lucide React](https://lucide.dev/) for consistent stroke icons.
    - **Palette**: Sleek dark modes and high-contrast "Premium Healthcare" accents (Emerald for success, Amber for warnings).

### Engineering Standards
- **Naming Conventions**:
    - **Components**: PascalCase (e.g., `JobLineCard.tsx`).
    - **Logic/Hooks**: camelCase (e.g., `usePreferenceFilter.ts`).
    - **Atomic Layout**: Organized into `components/` (atoms/molecules) and `app/` (pages/templates).
- **Error Handling**:
    - **Global Boundaries**: Graceful failure recovery via Next.js `error.tsx`.
    - **User Feedback**: Immediate, descriptive toast notifications for all async operations.
- **Testing Patterns**:
    - **Mocking**: Supabase clients are mocked in Vitest to isolate logic from network latency.
    - **E2E**: Playwright simulates real-world "on the ward" scenarios (network throttling, mobile emulation).

### Development Workflow
- **TDD (Red/Green/Refactor)**: Write integration/component tests *before* implementation.
- **End-to-End Testing**: Playwright runs in **headless mode** for all CI/CD pipelines, including mobile emulation.
- **CI/CD Quality Gates**: 
    - **GitHub Actions**: Automated linting, type-checking, and testing on every PR.
    - **Code Coverage**: Enforced via [Codecov](https://about.codecov.io/) to prevent regression.

## 🏗️ Project Anatomy

All frontend applications follow a standardised `src/` directory layout to ensure immediate developer familiarity:

```bash
src/
├── app/            # Next.js App Router (Pages, Layouts, Server Actions)
├── components/     # UI Building Blocks (Atoms, Molecules, Organisms)
├── hooks/          # Domain-specific React hooks (e.g., useRotations)
├── lib/            # Shared utilities and configurations
├── providers/      # React Context providers (Auth, Theme, Query)
├── services/       # Layering: Direct Supabase/API interaction logic
├── types/          # Shared TypeScript interfaces & DB definitions
└── utils/          # Pure helper functions and Supabase SSR clients
```

## 🔋 Data Access Patterns

### Supabase SSR Standard
Applications **must** use the `@supabase/ssr` package with the following tripartite file structure in `src/utils/supabase/`:
- **`client.ts`**: Initialises the `createBrowserClient` for client-side interactions.
- **`server.ts`**: Initialises the `createServerClient` for RSCs and Server Actions.
- **`middleware.ts`**: Handles session refreshing and ecosystem-wide redirection logic.

### Unified Authentication (SSO Readiness)
To ensure seamless movement between apps (Planner ↔ Preferencer):
- **Middleware Consistency**: Use a shared redirection pattern for unauthenticated states.
- **Session Parity**: All applications must share the same Supabase project context.
- **Visual Branding**: Login/Logout flows must be visually identical across the platform.

### Primary Data Fetching (TanStack Query)
[TanStack Query](https://tanstack.com/query) is the mandatory caching layer for client interactions.

- **Fetching**: Use `useQuery` for data interactions.
- **Real-Time Sync**: Subscribe to **Supabase Realtime** events. Use `queryClient.invalidateQueries` on events to trigger background re-fetches.
- **Automation**: Use [Supabase Cache Helpers](https://github.com/psteinroe/supabase-cache-helpers) to automate invalidation logic.

### Service Layer & Error Handling
All service layer methods **must** follow the **Result Wrapper Pattern**:

```typescript
type Result<T> = { data: T; error: null } | { data: null; error: Error };
```

### Forms & Validation
- **Requirement**: Use [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/).
- **Pattern**: Define schemas in `schemas/` or adjacent to the component.
- **Multi-Step Forms**: Use URL-driven state (e.g., `?step=1`) to ensure "On the Ward" durability.
- **Gold Standard**: Forms must provide immediate validation and accessible ARIA alerts for async states.

### Clinical Navigation (Deep Linking)
To ensure clinical workflows are shareable and durable:
- **URL-as-State**: All clinical filters (e.g., `ward`, `date_range`, `staff_grade`) **must** be mirrored in the URL search parameters.
- **Cross-App URI Standard**: Applications must use canonical platform URIs (e.g., `receptor://workforce/worker/[uuid]`) for inter-app linking to prevent fragile string concatenation.
- **Benefits**: Allows clinicians to "Copy/Paste" a specific filtered view to colleagues and facilitates seamless movement between platform modules.

## 🎨 UI & Interaction Governance

### Radix UI Primitives
Standardise on [Radix UI](https://www.radix-ui.com/) for complex interactive components (Modals, Popovers, Tabs).

### Loading & Skeleton Patterns
- **Requirement**: Use **Skeleton Screens** for "above-the-fold" RSC fetches. 
- **Goal**: Standardise on a `Skeleton` primitive in `components/ui/` to eliminate layout shift (CLS).

### Iconography
- **Library**: [Lucide React](https://lucide.dev/).
- **Stroke Weight**: Default to `2px`.
- **Consistency**: Use unified icons for actions (e.g., `Save`, `Trash2`, `ClipboardList`).

### Platform Workspace Switcher
Applications **must** include the standard **"Global Workspace Switcher"** in the sidebar/header to allow seamless switching between Receptor apps.

## ⚡ API & Edge Architecture

### Shared Edge Logic
To prevent duplication across Supabase Edge Functions:
- **`_shared` Directory**: All shared logic (e.g., entitlement checks, common types) must be kept in `supabase/functions/_shared`.
- **Response Standard**: Every function must import a standard `ResponseBuilder` to ensure consistent success/error JSON shapes.

### Zod Contracts & Versioning
- **Pattern**: Store Zod schemas for API payloads in a shared `types/contract` directory.
- **Requirement**: Both the Edge Function (Deno) and the Frontend (Next.js) must use the **same schema** to validate data.
- **API Versioning**: All API responses **must** include an `x-receptor-version` header. Frontends must verify this against their local contract version to prevent runtime errors during staggered deployments.

## 🛡️ Resilience & Reliability

### Feature Flagging (Kill-Switches)
Every major feature must be wrapped in a flag to allow immediate disabling without a redeploy.
- **Implementation**: Use a Supabase `config` table or a dedicated provider (e.g., PostHog).
- **Example**:
```typescript
if (flags.isEnabled('new-rostering-algorithm')) {
  return <EnhancedRoster />;
}
return <LegacyRoster />;
```

### Offline Drafting
Wi-Fi "dead zones" are common in clinical settings.
- **Requirement**: Implement an auto-save pattern to `IndexedDB` or `LocalStorage` for all high-stakes clinical forms.
- **User Feedback**: Provide a "Draft Saved Locally" toast indicator during network instability.

## 📱 Platform Interaction Standards

### Persistent User Personalisation
To maintain a unified platform feel, non-clinical user preferences (e.g., Theme, Sidebar state, Table density) **must** be persisted in a global `user_preferences` table in Supabase. These settings must synchronise automatically as the user moves between applications.

### Search & Discovery (Command Palette)
All applications must implement a standard **`Cmd+K` Command Palette**. 
- **Scope**: Local page actions, global resource search (Patients/Staff), and app-switching shortcuts.
- **Goal**: Minimize clicks for power users and ensure high discoverability of features in high-density clinical views.

## 🛡️ Security & Compliance (ISO 27001 / Essential Eight)

### Identity & Access Management (MFA)
- **Mandatory MFA**: All users in the Receptor ecosystem (including developers) **must** have Multi-Factor Authentication enabled.
- **Session Termination**: For physical hospital security, applications must enforce an **idle logout** after 15 minutes of inactivity. Session duration must not exceed 24 hours without re-authentication.

### Application Hardening (CSP)
Every frontend must implement a strict **Content Security Policy (CSP)**. 
- **Requirement**: Forbid `unsafe-inline` scripts and restrict image/frame sources to trusted platform domains. 
- **Goal**: Prevent XSS-based data exfiltration of clinical information.

### Audit Logging (Non-Repudiation)
Beyond error tracking, applications must record **Access Audit Logs**:
- **Scope**: Every "Read" event for a Patient Record or Sensitive File must be logged.
- **Integrity**: Logs must be stored in a tamper-proof Supabase table (Append-only RLS) or off-site logging service.

## 🩺 Observability & Error Handling

### Production Monitoring (Sentry)
[Sentry](https://sentry.io/) is the standard for production error tracking. 
- **Global Error Boundaries**: Implement `error.tsx` at every major route group.
- **Reference IDs**: Fallback UIs must provide a unique Reference ID to the user for support logs.

### Healthcare Data Safety (PHI)
Protecting Patient Health Information (PHI) is critical for our "premium healthcare" reputation:
- **No Console Logs**: Strict `no-console` rule in production.
- **URL Parameter Safety**: Only use UUIDs in URLs; never expose Patient IDs or UR numbers.
- **Client State**: Scrub PHI from any analytics or monitoring payloads before submission.

## 🗄️ Database & Data Governance

### Data Retention & Deletion
- **Standard**: All clinical deletions must use a **Soft Delete** pattern (e.g., `deleted_at`) for auditing purposes. 
- **Hard Deletion**: Implement an automated background scrub for data exceeding the legal retention period (as defined by Australian Health Records Acts).

### Seed Data De-identification
- **Requirement**: `seed.sql` and local development data **must not** contain real patient or staff information.
- **Standard**: Use synthetic data generators (e.g., Faker) or scrubbed production exports where all PII is replaced with non-identifiable tokens.

### Vulnerability Disclosure
Every repository must include a `security.txt` and a standard `SECURITY.md` file outlining the process for ethical vulnerability reporting by third-party researchers.

## 📚 Internal Documentation

### Component Usage Comments
Every file in `src/components/ui/` or domain components (e.g., `JobLineCard.tsx`) must include a header comment describing its role, Radix primitive base, and accessibility considerations.

### Visual Regression (CI Gates)
To maintain our premium aesthetic, **Playwright Visual Comparisons** are a mandatory CI gate.
- **Threshold**: 0% diff allowed for core interactive themes.
- **Baseline**: Screenshots must be captured for both Mobile (iPhone 13) and Desktop viewports.

## 🇦🇺 Localisation (Australian English)

As Receptor serves the Australian healthcare sector, strict adherence to **Australian English** is mandatory for all UI strings:

| Standard | Australian (Receptor) | US / Incorrect |
|----------|-----------------------|---------------|
| Suffixes | `-ise` (e.g., customise) | `-ize` (e.g., customize) |
| Suffixes | `-programme` | `-program` |
| Clinical | `haemorrhage` | `hemorrhage` |
| General  | `labour`, `colour` | `labor`, `color` |
| Dates    | `DD/MM/YYYY` | `MM/DD/YYYY` |

---

## �️ Database Governance

### Declarative Schema Standard
The `supabase/schemas/` directory is the **Primary Source of Truth** for the Receptor data model. 
- **Workflow**: All DDL changes must be implemented within versioned schema files in this directory.
- **Synchronisation**: The local database state should always be aligned with these files via `supabase db reset`.
- **Drift Detection**: Our CI pipeline must perform a `pg_dump` comparison between the current database and the combined declarative schemas to ensure no "Shadow DB" changes have occurred outside of version control.

## 📈 Frontend Scalability

### Performance Budgets
To prevent feature bloat, we enforce hard **JS Bundle Budgets**:
- **Size Gate**: Every PR triggers `next-bundle-analyzer`.
- **Threshold**: < 200kb for First Load JS. Exceeding this requires an "Optimisation Justification" in the PR description.

### Component Verification (Development Previews)
All `components/ui/` primitives must be visually verified in isolation.
- **Primary Tool**: Use **Storybook** within the `design-frontend` workspace.
- **Alternate**: If Storybook is unavailable, use a `(development)` route group in the app router (e.g., `/dev/components/button`) to render all component variants for manual QA.

## 🛠️ Local Development & Scaffolding

### Receptor CLI Scaffolder
To ensure standardisation from Day 1, new applications must be scaffolded using the ecosystem's internal CLI.
- **Usage**: `npm create receptor-app@latest`
- **Pre-configs**: Automatically includes Vitest, Sentry, TanStack Query, and the mandated AU English lint rules.

### Declarative Environment (Env-as-Code)
Manual `.env` management is forbidden. 
- **Standard**: Use a declarative validation library (e.g., `t3-env`) to ensure all required variables are present at build time.
- **Syncing**: Use a shared secret manager (e.g., Infisical or Dotenv Vault) to synchronise non-sensitive development keys across the team.

### Managing Supabase
Sync the backend from the [supabase-receptor](https://github.com/dm-ra-01/supabase-receptor) repository:
```bash
# Start local environment
supabase start
# Apply migrations and reset
supabase db reset
# Seed data
supabase db reset --seed
```

### Environment Strategy
- **Local**: Development and TDD.
- **Staging**: Automated deployments for preview.
- **Production**: Live healthcare environment.
