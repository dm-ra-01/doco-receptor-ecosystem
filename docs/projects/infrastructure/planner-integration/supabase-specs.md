---
sidebar_position: 4
---

# Supabase Specifications (PostgreSQL)

## Role
The single source of truth for the entire ecosystem. It proxies state and coordinates the handover between the Frontend User Context and the Backend Service Machine.

## New Tables

### `allocation_planner_runs`
A state-tracking table specifically for CP-SAT run definitions and processing queues.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key for this specific planner generation request. |
| `created_at` | Timestamptz | When the run was requested. |
| `status` | Enum | E.g., `PENDING`, `GENERATING`, `COMPLETED`, `INFEASIBLE`, `FAILED`, `CANCELLED`. |
| `n_job_lines` | Int | Target quantity of job lines to generate. |
| `allocation_run` | UUID | Foreign Key linking back to the parent allocation container. The parent `allocation_run` table is the definitive source of truth for the applied **constraints** arrays, allowing the user UI state to easily recover. |

## Publication Configuration (Realtime)
The deployment of this new infrastructure **must** include an alter script enabling Realtime events specifically for the `allocation_planner_runs` table:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE allocation_planner_runs;
```
This is critical; the frontend relies entirely on WebSocket broadcasts from this publication to escape the "Loading..." state.

## RLS Security Specifications
- **Planner Frontend (Users):** Users must have standard JWT credentials and pass existing RLS policies (e.g., verifying they hold `allocationPlanner.create` rights within their organization) in order to legitimately invoke the edge function and insert an `allocation_planner_runs` row.
- **Planner Backend (Engine):** The FastAPI engine operates using the Supabase `SERVICE_ROLE` key natively, bypassing RLS to rapidly batch insert the calculated `job_lines` output.

:::caution
Because `SERVICE_ROLE` bypasses RLS, the backend Python script must be carefully audited to ensure it strictly respects the original `allocation_run` context boundaries and does not write malformed data across organizational boundaries.
:::
