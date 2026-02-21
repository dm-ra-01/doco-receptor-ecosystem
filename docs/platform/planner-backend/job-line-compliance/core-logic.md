# Core Logic & Constraints

The generation of job lines relies on Google OR-Tools in `fill_job_lines.py`. 

## Hard Constraints
- **No Overlap**: Interval variables ensure a rotation's start/end dates do not overlap for the same assigned job line (`AddNoOverlap`).
- **Total Duration**: Weeks assigned plus annual leave must equal the total required weeks (e.g., 52).
- **Category Exposure**: Job lines must receive exposure to all core AMC categories (`AMC_EC_A`, `B`, `C`, `D`).
- **Rural Limit**: Maximum of 1 rotation tagged as `Rural` per job line.
- **Nights / Relief Limit**: Maximum 1 `Relief` or `Nights` position per job line.
- **Unique Assignment**: A rotation can only be assigned to a maximum of one job line.
- **Annual Leave Rule**: Exactly 5 weeks of annual leave. It must be continuous (5 weeks) or split into exactly 2+3/3+2 weeks with at least a 13-week gap.
- **Term Grouping**: Rotations in the same 13-week term period should be assigned continuously.

## Objective Function
The engine maximizes team and team category coverage to ensure broad experience for junior medical officers (JMOs). It uses a greedy diversity heuristic by giving a point for each unique team visited per job line.

[Logic Source: `fill_job_lines.py`](file:///Users/ryan/development/common_bond/antigravity-environment/backend/job-line-compliance/fill_job_lines.py)
