---
sidebar_position: 6
---

# Blind Spot Analysis (Planner Engine)

In transitioning from a direct-fetch setup to a generalized, highly asynchronous CP-SAT architecture utilizing a Supabase intermediary, multiple hidden risks emerge around performance limits, resilience against failure bounds, and logging visibility. 

## 1. Performance & Compute Choking
**The Blind Spot:** CP-SAT (Google OR-Tools) is extremely CPU and memory intensive. If 10 administrators simultaneously trigger "Generate Plan" across 10 different organizations, the FastAPI backend will attempt to spawn 10 `asyncio.create_task()` processes concurrently. 
**The Risk:** The Python container/pod will memory-fault or suffer severe CPU starvation, causing all 10 processes to drastically slow down or die completely.
**Mitigation Strategy:** 
- The Python application **must implement a single-thread queuing mechanism** so that CP-SAT solves are processed one at a time, preventing CPU starvation.
- Supabase Edge Functions should perhaps utilize rate-limiting to prevent "Denial of Wallet" attacks where users aggressively spam the generate endpoint.

## 2. Reliability & "Zombie" Runs
**The Blind Spot:** Because the Edge Function fires and immediately returns to the UI, the `allocation_planner_runs` table remains in a `GENERATING` state until Python explicitly replies `COMPLETED` or `FAILED`.
**The Risk:** If the FastAPI backend server hard-crashes, reboots, or deploys an update mid-solve, the Postgres database row will be trapped in `GENERATING` indefinitely. The user's UI will spin forever holding on the WebSocket channel.
**Mitigation Strategy:**
- Implement a **heartbeat monitoring function** or "Time-To-Live" (TTL) sweeper. If an `allocation_planner_runs` record has been in `GENERATING` for an extended period, the heartbeat monitor forcibly marks it `FAILED` and logs a "Timeout" error so the user's UI can escape the loading state.

## 3. Security Boundary Leaks (Service Role)
**The Blind Spot:** We are exclusively using the Supabase `SERVICE_ROLE` key within FastAPI to rapidly bypass RLS when fetching constraints and pushing back optimized job lines.
**The Risk:** Generating data outside RLS means the Python script acts as God. If a logic bug exists where the script writes generated arrays to the wrong UUID, the database will silently accept the payload, corrupting data for distinct organizations/hospitals.
**Mitigation Strategy:**
- *Deprioritized for later implementation.* When approached, the payload sent from Deno to Python must explicitly include the target Organization ID alongside the Run ID to enforce strict multi-tenant boundary isolation natively in the insert query.

## 4. Observability & State Debugging
**The Blind Spot:** Asynchronous silent failures. Fast API instantly returning `202 Accepted` means standard HTTP access logs won't record the CP-SAT engine blowing up 30 seconds later inside the event loop.
**The Risk:** Debugging a failed schedule generation in Production becomes impossible because no logs link the `allocation_runner_id` to the specific Python stack trace.
**Mitigation Strategy:**
- Implement a dedicated Logging Subsystem. Utilize Python's standard `logging` library hooked up to the Supabase native observability tier, or use `supabase-py` to write raw string tracebacks directly into a dedicated `planner_execution_logs` table (linked to the run_id) if the asynchronous task blows up inside the Exception handler block. This allows an admin UI to query exactly *why* it failed.

## 5. Destructive Data Rollbacks
**The Blind Spot:** Generating a new schedule natively overwrites all previous job lines for the target allocation run. 
**The Risk:** A user accidentally clicks regenerate, realizes the constraints were wrong, and permanently loses the meticulously modified 100 job lines they had manually tweaked.
**Mitigation Strategy:**
- Implement a `job_lines_history` table. The backend will perform a silent snapshot inserting the current lines to this history table right before running the delete and insert generation commands, allowing historical retrieval if needed. 
