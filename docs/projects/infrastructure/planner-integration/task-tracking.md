---
sidebar_position: 6
---

# Task Tracking

This document breaks down the execution phases based on the new architecture design.

### Phase 1: Database Baseline Preparation
- [ ] **Create Migration (Tracker):** Scaffold a Postgres migration creating `allocation_planner_runs` with columns `created_at`, `status`, `n_job_lines`, `constraints`, and `allocation_run`.
- [ ] **Create Migration (History):** Scaffold a Postgres migration creating `job_lines_history` to snapshot lines before overwriting them.
- [ ] **RLS Policies:** Define RLS on both new tables permitting users with planner roles to insert/read.
- [ ] **Configure Publications:** Add `allocation_planner_runs` to the `supabase_realtime` publication group so the frontend can listen to changes.

### Phase 2: Supabase Edge Function Implementation
- [ ] **Scaffold Orchestrator:** Create the `planner-orchestration` Edge Function within `supabase-receptor/supabase/functions/`. 
- [ ] **Dev Configuration:** Update `setup.conf` or the local start scripts to load and serve the orchestrator.
- [ ] **Security Validation logic:** Build the Deno edge function to pass standard Authorization headers down to the DB to natively test RLS rights upon run creation.
- [ ] **Proxy Trigger:** Code the Deno network request that triggers the FastAPI engine with just the core identifiers.

### Phase 3: Planner Backend Architecture Shift
- [ ] **FastAPI Async Configuration:** Ensure the HTTP handler immediately returns `202 Accepted` to prevent Edge Function timeouts.
- [ ] **Execution Queuing:** Implement a strictly *one-at-a-time* processing queue inside the FastAPI app to prevent multi-trigger CPU starvation.
- [ ] **Service Role Data Fetch:** Update Python payload models so they rely on a Supabase Python client using the injected `SERVICE_ROLE` key to fetch rotations/joblines natively via Postgres reads.
- [ ] **Snapshot & Write-Back Strategy:** Refactor the FastAPI formatter to snapshot existing lines into `job_lines_history`, execute physical row deletes for previous runs, and batch inserts new joblines natively.
- [ ] **Status Flags:** Ensure the Python engine properly catches failures (`INFEASIBLE`) and updates the target `allocation_planner_runs.status` to either `COMPLETED` or `FAILED`.

### Phase 4: Frontend Abstraction & UI Resiliency
- [ ] **UI Rebuild:** Overhaul the `PlannerDashboard` UI code to trigger the new `planner-orchestration` Supabase function via SDK invoke, passing only basic sizing inputs parameters.
- [ ] **Realtime Event Dispatchers:** Configure `@supabase/supabase-js` realtime channel subscribers within React so the UI effectively functions as a background job tracker, notifying the user intelligently when `COMPLETED`, `FAILED`, `CANCELLED`, or `INFEASIBLE` registers natively from the Python database commit.
- [ ] **Form State Recovery:** Ensure the UI retains inputted constraint boundaries gracefully if the run fails so the user doesn't lose complex work.

### Phase 5: Observability & Resilience Sequencing
- [ ] **Heartbeat Monitor:** Implement a heartbeat sweeper (via pg_cron or scheduled Edge Function) to enforce a TTL on runs trapped in the `GENERATING` state if the backend crashes.
- [ ] **Logging Subsystem:** Scaffold a native Supabase logging strategy (e.g., standard Edge logs + a mapped `system_logs` Postgres table using `supabase-py`).
- [ ] **Python Fallback Tracing:** Implement `logging` or traceback saving within FastAPI so background CP-SAT execution crashes are centrally visible to the observability table.
- [ ] **Sequential Flow Implementation:** Assign these phases sequentially to specific AI agents to guarantee atomic, tested milestones rather than attempting a high-risk parallel integration.
