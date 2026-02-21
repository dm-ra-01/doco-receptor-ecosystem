# Architecture

The tool is structurally divided into five phases:

1. **Initialization (`functions.py`)**: Boots the Supabase client.
2. **Data Fetching (`fetch.py`, `fetch_functions.py`)**: Extracts existing `Org`, `AllocationPlan`, `AllocationRun`, `Position`, and `Rotation` entities into local objects.
3. **Logic Domain (`classes.py`)**: Data models mapping external database attributes to Python types.
4. **Constraint Solver (`fill_job_lines.py`)**: The core algorithm using Google's OR-Tools. Processes matrices for permutations of assignment.
5. **Data Output (`update_functions.py`)**: Exports generated job lines mapping directly back onto the Supabase PostgreSQL instance via REST APIs.

## Integration points
- **Supabase**: Relies on specific tables (`org`, `worker`, `allocation_plan`, `allocation_run`, `job_line`, `rotation`, `position`).

## Dependency Mapping
- `ortools`: Required for constraint programming (`cp_model`).
- `supabase`: Official Python client for fetching and updating state.
- `openpyxl`: For legacy spreadsheet imports and exports.
- `questionary`: For terminal-based user prompts during local execution.
