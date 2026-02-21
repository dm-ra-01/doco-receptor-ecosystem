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
2. **Ecosystem Integration**: Standardize the database interaction layer to match receptor ecosystem guidelines, moving away from loose scripts towards a service-oriented approach.
3. **Better Tooling**: Introduce modern Python package management (e.g., `uv` or `Poetry`), strict linting/formatting (`Ruff`), and static type enforcement (`mypy`).
4. **Less Redundancy**: De-duplicate constraint generation logic. Remove legacy dead-ends like offline Excel output generation and hardcoded IDs.
5. **Higher Performance**: Optimize the `CpModel` variable generation and search strategy to drop solve-time.
6. **Better Testability**: Build a rigorous automated testing pipeline (`pytest`) ensuring that every constraint (e.g. max 1 rural term, 5 weeks leave) is mathematically verified against mock data without needing a live database connection.

---

## Milestones & Tracking

### Phase 1: Foundation & Tooling
- [ ] Create `receptor-planner` directory and initialize modern Python project structure.
- [ ] Setup dependency manager (`uv`/`Poetry`) and explicitly define versions for `ortools` and `supabase`.
- [ ] Add `pyproject.toml` with `Ruff` and `mypy` configurations.
- [ ] Establish `pytest` testing harness.

### Phase 2: Core Solver Extrication
- [ ] Port the `ortools` CP-SAT solver out of `fill_job_lines.py` into smaller, independent modules (e.g., `constraints/leave.py`, `constraints/rural.py`).
- [ ] Write isolated unit tests for every mathematical constraint to prove correctness.
- [ ] Optimize the combinatorial search strategy.
- [ ] Benchmark CPU and Memory performance against the legacy solver.

### Phase 3: Data Integrations & State Management
- [ ] Refactor `fetch.py` and `update_functions.py` into a clean Repository/Service pattern.
- [ ] Standardize the connection to Supabase using strongly typed models (e.g., `Pydantic`).
- [ ] Implement safety mechanisms (e.g. transactional rollbacks) to prevent partial allocation saves on database failure.

### Phase 4: Final Cutover
- [ ] Refactor the Docusaurus paths, replacing `job-line-compliance` with `receptor-planner`.
- [ ] Archive the legacy `job-line-compliance` codebase.
- [ ] Perform E2E tests against staging planner data to verify compatibility with the frontend apps.
