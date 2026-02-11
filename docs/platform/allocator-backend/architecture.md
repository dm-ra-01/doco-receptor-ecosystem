import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

---
sidebar_position: 2
---

# System Architecture

The Allocator is structured as a stateless service layer that translates database records into a mathematical optimization problem.

<Tabs>
  <TabItem value="orchestration" label="Service Orchestration" default>
    The primary entry point is the **Service Layer** (`service.py`), which coordinates data fetching, problem formulation, and result persistence.
    - [Orchestration Source](https://github.com/dm-ra-01/match-backend/blob/main/allocator/service.py)
  </TabItem>
  <TabItem value="solver" label="Solver Logic">
    The **Problem Layer** (`problem.py`) contains the core mathematical formulation.
    - [Solver Source](https://github.com/dm-ra-01/match-backend/blob/main/allocator/problem.py#L1202)
  </TabItem>
</Tabs>

## Directory Structure

```text
allocator/
├── main.py           # CLI Entry point
├── api.py            # FastAPI Entry point
├── service.py        # Central Service Layer (Orchestration)
├── problem.py        # Core Logic: Problem Formulation & Solver
├── solver.py         # Solver wrappers
├── postgres.py       # Data Access Layer (Supabase/Postgres)
├── models/           # Data models (Worker, JobLine, etc.)
└── tests/            # Test suite
```

## Internal Flow

### 1. Orchestration (`service.py`)
The `AllocatorService` is the brains of the operation. It handles the lifecycle of an allocation run:
- Identifies pending runs in the database.
- Orchestrates the fetching of all required data (Jobs, Workers, Prefs).
- Calls the `Problem` class to formulate and solve the match.
- Handles post-processing and result persistence.

### 2. The Formulation (`problem.py`)
The `Problem` class transforms business objects into a mathematical model. It:
- Shuffles inputs (with a deterministic seed) to ensure fairness.
- Builds the **Dissatisfaction Matrix**.
- Adds hard constraints (Capacity, One-Job-Per-Worker).
- Adds soft/optional constraints (Stability, Preferencer Limits).

### 3. Data Access (`postgres.py`)
Uses the Supabase Python client to interact with:
- **Tables**: `allocator_py_runs`, `allocator_py_allocations`, `preference_worker_job_lines`.
- **RPCs**: `get_worker_qualifications`, `populate_allocation_run`.

## Entry Points

### FastAPI Web Service (`api.py`)
Exposes endpoints for integration with the frontend or external triggers.
- `POST /runs/process-pending`: Triggers the service to look for and solve any runs with `completed_at IS NULL`.
- `POST /runs/{run_id}/solve`: Forces a specific run ID to be processed.

### CLI (`main.py`)
Used for local development, debugging, and manual data processing (e.g., from Excel).
- `allocator`: Run in database mode (default).
- `allocator --parse-xlsx input.xlsx`: Run in local analysis mode.
