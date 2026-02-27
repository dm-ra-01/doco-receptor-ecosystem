---
sidebar_position: 3
---

# Frontend Specifications (Next.js)

## Role
The `planner-frontend` serves as the user experience shell for administrators managing allocations, but is heavily decoupled from the generation mechanics.

## Responsibilities & Data Flow
1. **Trigger Configuration:** The UI allows the user to define constraints, the quantity of job lines to build, and relevant parameters.
1. **Invoke Execution:** Upon pressing "Generate", the frontend updates the parent `allocation_run` in Postgres with the selected constraints natively, and then invokes a Supabase Edge Function (`planner-orchestration`) with a secure JWT payload and the basic run definition configurations.
3. **Background Task UI:** The frontend treats the schedule generation as a long-running background task. It should navigate the user to a pending state queue/list or simply show a passive loading state notification without freezing the UI.
4. **Realtime Updates:** The frontend uses `@supabase/supabase-js` to listen for Postgres changes to the newly created `allocation_planner_runs` record's `status` field.
5. **Completion Notification:** When the realtime subscription fires indicating a status of `COMPLETED`, the frontend alerts the user and refetches the newly populated job lines created by the Python script to render in the UI.

## Code Adjustments Needed
- **Remove API Hooks:** The `src/services/plannerApiService.ts` direct-fetch calls built previously can be deprecated regarding sending huge configuration payloads locally. Remove `NEXT_PUBLIC_PLANNER_API_URL` completely from the environment configurations.
- **Edge Function Client:** Refactor the UI to use `supabase.functions.invoke('planner-orchestration', {...})` using the standard Supabase credentials.
- **Realtime Listener:** Scaffold a standard React `useEffect` or React Query Subscription hook pointing to the `allocation_planner_runs` table listening for `UPDATE` events based on the dispatched run ID.

:::caution
The UI must explicitly warn the user before triggering a new generation run that **current existing job lines linked to the targeted allocation_run will be overwritten**. Historical rollbacks must rely on 12-hourly Postgres Point-In-Time recovery (PITR) rather than soft deletes for the immediate term.
:::
