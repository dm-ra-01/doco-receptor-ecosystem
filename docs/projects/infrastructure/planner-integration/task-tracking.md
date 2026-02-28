---
sidebar_position: 6
---

# Task Tracking

This document breaks down the execution phases based on the new architecture design.

### Phase 1: Database Baseline Preparation
- [x] **Create Migration (Tracker):** Scaffold a Postgres migration creating `allocation_planner_runs` with columns `created_at`, `status`, `n_job_lines`, `constraints`, and `allocation_run`.
- [x] **Create Migration (History):** Scaffold a Postgres migration creating `job_lines_history` to snapshot lines before overwriting them.
- [x] **RLS Policies:** Define RLS on both new tables permitting users with planner roles to insert/read.
- [x] **Configure Publications:** Add `allocation_planner_runs` to the `supabase_realtime` publication group so the frontend can listen to changes.

### Phase 2: Supabase Edge Function Implementation
- [x] **Scaffold Orchestrator:** Create the `planner-orchestration` Edge Function within `supabase-receptor/supabase/functions/`. 
- [x] **Dev Configuration:** Update `setup.conf` or the local start scripts to load and serve the orchestrator.
- [x] **Security Validation logic:** Build the Deno edge function to pass standard Authorization headers down to the DB to natively test RLS rights upon run creation.
- [x] **Proxy Trigger:** Code the Deno network request that triggers the FastAPI engine with just the core identifiers.

### Phase 3: Planner Backend Architecture Shift
- [x] **FastAPI Async Configuration:** Ensure the HTTP handler immediately returns `202 Accepted` to prevent Edge Function timeouts.
- [x] **Execution Queuing:** Implement a strictly *one-at-a-time* processing queue inside the FastAPI app to prevent multi-trigger CPU starvation.
- [x] **Service Role Data Fetch:** Update Python payload models so they rely on a Supabase Python client using the injected `SERVICE_ROLE` key to fetch rotations/joblines natively via Postgres reads.
- [x] **Snapshot & Write-Back Strategy:** Refactor the FastAPI formatter to snapshot existing lines into `job_lines_history`, execute physical row deletes for previous runs, and batch inserts new joblines natively.
- [x] **Status Flags:** Ensure the Python engine properly catches failures (`INFEASIBLE`) and updates the target `allocation_planner_runs.status` to either `COMPLETED` or `FAILED`.

### Phase 3.5: Discrepancy & Test Remediation
- [x] **Model Alignment Fix:** Resolve `Pydantic.ValidationError` in legacy `tests/` by updating test fixtures to match the new `PlannerRunConfig` nested schema.
- [x] **Supabase Service Unit Tests:** Implement a mock-based test suite for `supabase_service.py` to verify DB operations without side effects.
- [x] **API Orchestration Tests:** Create FastAPI `TestClient` cases for the `/run` endpoint to verify the one-at-a-time lock and background task triggering.
- [x] **Edge Function Integration Testing:** Verified the internal key handshake and RLS check logic via frontend integration tests and backend logging.

### Phase 4: Frontend Abstraction & UI Resiliency
- [x] **UI Rebuild:** Overhauled the `PlannerDashboard` UI code to trigger the new `planner-orchestration` Supabase function via SDK invoke, passing basic inputs parameters and constraints.
- [x] **Realtime Event Dispatchers:** Configured `@supabase/supabase-js` realtime channel subscribers within React in `usePlannerOrchestration` hook. The UI now functions as a background job tracker, displaying status updates for `PENDING`, `GENERATING`, `COMPLETED`, `FAILED`, and `INFEASIBLE`.
- [x] **Form State Recovery & Metadata:** Implemented `result_metadata` column to capture solver outcomes. The UI displays these results upon completion.

### Phase 5: Observability & Resilience Sequencing
- [ ] **Heartbeat Monitor:** Implement a heartbeat sweeper (via pg_cron or scheduled Edge Function) to enforce a TTL on runs trapped in the `GENERATING` state if the backend crashes.
- [ ] **Logging Subsystem:** Scaffold a native Supabase logging strategy (e.g., standard Edge logs + a mapped `system_logs` Postgres table using `supabase-py`).
- [ ] **Python Fallback Tracing:** Implement `logging` or traceback saving within FastAPI so background CP-SAT execution crashes are centrally visible to the observability table.
- [ ] **Sequential Flow Implementation:** Assign these phases sequentially to specific AI agents to guarantee atomic, tested milestones rather than attempting a high-risk parallel integration.
