---
sidebar_position: 6
---

# Data Persistence

The Allocator is stateless. It reads everything it needs from Supabase at the start of a run and writes the results back once the optimal solution is found.

- [Supabase Integration Source](https://github.com/dm-ra-01/match-backend/blob/main/allocator/postgres.py)

## Core Schema Mappings

### Inputs (Read)
| Table / RPC | Purpose | Python Model |
|-------------|---------|--------------|
| `allocator_py_runs` | Defines which jobs and workers to include in a solved batch. | `AllocatorRun` |
| `preference_worker_job_lines` | Worker ranks for job lines. | `Preferences` |
| `job_line_eligibility` | Inclusion/Exclusion rules for rotations. | `Eligibility` |
| `get_worker_qualifications` (RPC) | Fetches the set of tags for each worker participating in the run. | `Worker.qualification_ids` |
| `allocation_run_preferencer_weightings` | Organizational preferences and weights. | `Weighting` |

### Outputs (Write)
| Table | Column Updates |
|-------|----------------|
| `allocator_py_allocations` | New rows created for each (Worker, Job) assignment. |
| `allocator_py_runs` | `completed_at` is set to `now()` after a successful solve. |

## The Persistence Flow

1. **Trigger**: An API call or script initializes an `AllocatorService`.
2. **Claiming**: The service fetches all rows in `allocator_py_runs` where `completed_at` is NULL.
3. **Hydration**: 
    - For a specific Run ID, all related Workers and Job Lines are fetched.
    - Preferences are mapped into internal `OrderedDict` structures.
4. **Resolution**: The `Problem` class solves the math.
5. **Commit**:
    ### Writing Allocations
    - **Sink**: `allocator_py_allocations` table.
    - [Persistence Logic Source](https://github.com/dm-ra-01/match-backend/blob/main/allocator/postgres.py#L19)
    - The run record is marked as finished.

## Database Functions (`postgres.py`)

The `postgres.py` module contains the low-level Supabase client interactions:
- `fetchAll(action, run)`: Generic fetcher with switch logic for different data types.
- `post(action, rows, run_id)`: Batch uploader for results.
- `fetch_worker_qualifications(run)`: Direct RPC caller.

## Security & RLS
The Allocator typically runs using a `service_role` key to bypass RLS, as it needs to see all workers and preferences across an organization to perform the global optimisation. However, the API endpoints themselves should be secured.
