---
sidebar_position: 2
---

# Backend Specifications (FastAPI & CP-SAT)

## Role
The `receptor-planner` backend handles pure fast mathematical generation of optimal medical job lines.

## Responsibilities & Data Flow
Instead of the frontend passing a massive array of parameters to FastAPI, FastAPI will be triggered with simple parameters (e.g. `allocation_planner_runs` object ID). 

The backend script will then:
1. Initialize a `supabase-py` client using the internal `SERVICE_ROLE` key securely within Python.
2. Query the Supabase Postgres Database for the specified `allocation_planner_runs` configuration parameters and the relevant `job_lines` and `rotations` associated with the linked plan context.
3. Build the CP-SAT problem matrix based on those constrained objects.
4. Solve the matrix.
5. Create new finalized `job_lines` and `rotations` directly in Postgres via the Service Role client, assigning them to the relevant `allocation_run`.
6. Update the `allocation_planner_runs` state back to `COMPLETED` or `INFEASIBLE`.

## Architectural Adjustments
- **No Worker IDs:** The scheduling requests do not include specific worker IDs during the generalized generation logic. The engine solely calculates combinations of generic job lines and rotations to satisfy the demand metrics.
- **Service Role Writing:** The `Formatter` class will be adapted to execute database `INSERT` commands natively instead of just returning JSON string payloads to an HTTP caller.
- **Asynchronous Execution:** Because CP-SAT solves can take 10s-60s, the backend HTTP endpoint must immediately return a `202 Accepted` to the caller (the Supabase Edge Function) while executing the actual solver utilizing `asyncio.create_task()` in the background to prevent edge function timeouts.
- **Constraint Handling:** The backend reads constraints provided by the frontend as an array of named strings (e.g., `["VIC_PGY2", "NO_NIGHTS"]`). The specific implementation details of these constraints are baked natively into the Python app logic.

:::tip
The Python engine safely operates asynchronously because the Edge Function orchestrates the initial trigger. The user UI tracks completion strictly via Realtime database listening.
:::
