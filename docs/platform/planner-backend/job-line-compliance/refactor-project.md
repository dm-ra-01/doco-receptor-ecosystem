---
sidebar_position: 1
---

# Project: Receptor Planner (Refactor)

:::info Live Tracker
This is a live project tracking document. It tracks the modernization of the legacy "Job Line Compliance" tool into the new **Receptor Planner** service within the Receptor Ecosystem.
:::

## Vision & Goals

The legacy Python script successfully proved the mathematical viability of assigning medical rotations via Google OR-Tools. The objective now is to mature this script into a high-performance, maintainable backend service.

### Primary Objectives
1. **Modernise & Rename**: Transition the project identity officially to **Receptor Planner**.
2. **Ecosystem Integration**: Standardize the database interaction layer to match receptor ecosystem guidelines, moving away from loose scripts towards a structured, API-first service approach.
3. **Better Tooling**: Introduce modern Python package management (e.g., `uv` or `Poetry`), strict linting/formatting (`Ruff`), and static type enforcement (`mypy`).
4. **Dual-Mode I/O (API & File Injection)**: Mirror the `match-backend` strategy. Support extracting constraints directly from Supabase (for production API routes), while simultaneously allowing `.xlsx` file injection for offline simulations, rigorous localized debugging, and non-destructive experimentation.
5. **Higher Performance**: Optimise the `CpModel` variable generation and search strategy to drop solve-time. Run solver requests non-blockingly via FastAPI Background Tasks.
6. **Better Testability**: Build a rigorous automated testing pipeline (`pytest`) ensuring that every constraint (e.g., max 1 rural term, 5 weeks leave) is mathematically verified against mock data objects without needing a live database connection.

---

## Architecture: I/O & Interfaces

By learning from the `match-backend` codebase, **Receptor Planner** will support dual-mode initialization and exporting:

### 1. Database & API Mode (Production)
- **Input**: Exposed via a `FastAPI` endpoint (e.g. `POST /runs/{run_id}/solve`). The server fetches data directly from Supabase, applying authentication and Row-Level Security.
- **Processing**: The request is handed off to a Background Task to prevent HTTP timeouts during long CP-SAT mathematical solutions.
- **Output**: The finalized assignment grid is pushed back up to Supabase using a unified `AllocatorService` persistence routine.

### 2. File Injection Mode (Simulation & Debugging)
- **Input**: Executed via an entrypoint CLI argument (e.g., `python main.py data.xlsx --parse-xlsx`). The solver models its constraints directly from the provided spreadsheets without making network calls.
- **Output**: The results are exported out locally as `.xlsx` / `.csv` artifacts, making it easy to visually audit the math models offline, and preserving the tool's utility in environments completely divorced from the active staging/production database.

---

## Milestones & Tracking

### Phase 1: Foundation & Tooling
- [ ] Create `receptor-planner` directory and initialize modern Python project structure.
- [ ] Setup dependency manager (`uv`/`Poetry`) and explicitly define versions for `ortools`, `fastapi`, and `supabase`.
- [ ] Add `pyproject.toml` with `Ruff` and `mypy` configurations.
- [ ] Establish `pytest` testing harness.

### Phase 2: Core Solver & Domain Modeling
- [ ] Port the `ortools` CP-SAT solver out of `fill_job_lines.py` into smaller, independent constraint modules (e.g., `constraints/leave.py`, `constraints/rural.py`).
- [ ] Define standardized Domain Models (`Pydantic` or `dataclasses`) for Inputs and Outputs, fully isolated from both File I/O and DB I/O.
- [ ] Write isolated unit tests for every mathematical constraint using mock Domain Models to prove correctness.
- [ ] Benchmark CPU and Memory performance against the legacy solver.

### Phase 3: Input/Output Services & Data Integration
- [ ] Implement `file_parser.py` logic to load Domain Models from `.xlsx` files and write back output artifacts (File Injection/Export).
- [ ] Refactor legacy `fetch.py` and `update_functions.py` into a clean Repository/Service pattern (`supabase_client.py`).
- [ ] Implement the `AllocatorService` orchestrator that standardizes the workflow: `Fetch Data -> Build Problem -> Solve -> Persist Result`.

### Phase 4: API Layer & Final Cutover
- [ ] Build the `FastAPI` application (`api.py`) exposing asynchronous endpoints to trigger planning runs in the background.
- [ ] Implement robust safety mechanisms (e.g., transactional rollbacks or safe soft-deletes) to prevent partial allocation saves on database failure.
- [ ] Refactor the Docusaurus paths, replacing `job-line-compliance` with `receptor-planner`.
- [ ] Archive the legacy `job-line-compliance` codebase.
- [ ] Perform E2E tests against staging planner data.
