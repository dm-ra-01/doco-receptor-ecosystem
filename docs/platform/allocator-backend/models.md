---
sidebar_position: 3
---

# Core Data Models

The system uses specific Python classes to represent the complex entities involved in a matching run. These models encapsulate both data and business logic (like dissatisfaction calculation).

## Worker
Represents a single healthcare worker participating in the match.

- **Attributes**:
    - `id`: Unique identifier (UUID).
    - `qualification_ids`: List of tags/certifications (used for eligibility).
    - `preferences`: A `Preferences` object containing the worker's ranked choices.
- **Logic**:
    - `dissatisfaction(job_line)`: Returns the raw rank-based dissatisfaction score for a specific assignment.

## JobLine
Represents a specific rotation or job rotation available for assignment.

- **Attributes**:
    - `id`: Unique identifier (UUID).
    - `max_n_workers`: Capacity limit.
    - `must_have_workers`: Boolean flag. If true, the solver adds a constraint ensuring at least one worker is assigned.
    - `preferencers`: List of supervisors who manage this job line.
- **Logic**:
    - `is_preferenced_by(preferencer)`: Check management relationship.

## Preferences
Handles the complex logic of ranking and tied preferences.

- **Budgeting (The "Unranked Item" Rule)**:
    If a worker only ranks 5 out of 20 jobs, the system calculates an "unranked item dissatisfaction".
    - `Total Dissatisfaction Pool` = Sum of ranks $[1 \dots N]$ (where $N$ is total jobs).
    - `Allocated Dissatisfaction` = Sum of ranks for explicit choices $[1 \dots 5]$.
    - `Unallocated Dissatisfaction` = Pool - Allocated.
    - `Score for any unranked job` = Unallocated / (Number of unranked jobs).
    This ensures that workers who don't rank everything are not unfairly advantaged or disadvantaged.

## AllocatorRun
A configuration object representing a single matching event.

- **Attributes**:
    - `id`: The UUID of the run record in `allocator_py_runs`.
    - `allocation_run_id`: The ID of the parent allocation group (business logic entity).
    - `included_job_lines`: UUID list of specific jobs to include in this solve.
    - `included_worker_mappings`: UUID list of specific workers to include.
    - `is_exclusive`: Boolean.

## Weighting
Represents "Preferencer Weightings" (Organizational preferences).

- **Logic**:
    Weightings can be "Global" (applied to a worker across all jobs) or "Specific" (applied to a worker for a specific job). These are cumulative and influence the final dissatisfaction score using the `preferencer_weight` alpha.
