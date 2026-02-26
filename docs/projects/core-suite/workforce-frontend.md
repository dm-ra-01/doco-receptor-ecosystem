---
sidebar_position: 7
---

# Project: Workforce Frontend

The **workforce-frontend** is a Next.js application dedicated to managing organizational master data for the Receptor platform. It serves as the single source of truth for the structure of the healthcare service.

## Core Responsibilities

1. **Organization Management**: Manage global settings, multi-tenancy configurations, and branding for the specific health service.
2. **Team Categories**: Define high-level groupings of teams (e.g., "Medical", "Surgical", "Emergency").
3. **Team Management**: CRUD for specific teams (e.g., "General Medicine A", "Orthopaedics"), including their associated category and default settings.
4. **Location Management**: Define campuses, buildings, and specific wards/locations where work occurs.
5. **Position Management**: Define standardized position titles (e.g., "Intern", "Resident", "Registrar") and their requirements.
6. **Staff Directory**: Manage the pool of workers, their contact details, and their primary organizational associations.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Vanilla CSS (Priority on flexibility and control)
- **Testing**: TDD with Vitest (Unit) and Playwright (E2E)
- **Backend**: Supabase (via `supabase-receptor`)

## Database Integration

The project interacts with the following primary tables in the `public` and `planning` schemas:
- `orgs`
- `team_categories`
- `teams`
- `locations`
- `positions`
- `workers` (profiles)

## Status

| Milestone | Status |
| :--- | :--- |
| Project Initialization | ✅ Done |
| Infrastructure Setup (CSS, Services) | ✅ Done |
| Team & Category Management Pages | ✅ Done |
| Location Management Pages | ✅ Done |
| Position Management Pages | ✅ Done |
| Create/Edit Modals | ✅ Done |
| Form Validation (zod) | ✅ Done |
| Staff Directory | 🔴 Not Started |

## Migration from Flutter

This application will replace the organizational management screens currently found in the `rotator_worker` Flutter app:
- `lib/admin/screens/org_management/`
- `lib/admin/screens/team_management/`
- `lib/admin/screens/worker_management/`
