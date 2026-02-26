---
sidebar_position: 6
---

# Project: Planner Frontend

The **planner-frontend** is a Next.js application dedicated to planning and management tasks for Common Bond and customer workforce staff. It replaces the legacy planning functionality in **rotator_worker**.

## Core Responsibilities

1. **Allocation Plans**: Create and manage high-level planning structures and default settings.
2. **Allocation Runs**: Execute specific matching windows, tracking status (Draft, Open, Closed).
3. **Position Mappings**: Map staff positions from the organization pool to specific requirements in a plan.
4. **Worker Mappings**: Dedicated recruitment module for assigning workers to specific allocation runs.
5. **Job Line Management**: Create and organize horizontal roster slots for each run.
6. **Rotation Customisation**: Precision displacement builder with timeline visualization and overlap prevention.
7. **Lifecycle Automation**: Managed transitions between planning, preferencing, and execution stages.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Vanilla CSS (Priority on flexibility and control)
- **Testing**: TDD with Vitest (Unit) and Playwright (E2E)
- **Backend**: Supabase (via `supabase-receptor`)

## Database Integration

The project interacts with the following primary tables in the `planning` schema:
- `allocation_plans`
- `allocation_runs`
- `allocation_plan_position_mappings`
- `allocation_plan_team_tag_customisations`
- `rotations`
- `job_lines`

## Status

| Milestone | Status |
| :--- | :--- |
| Project Initialization | ✅ Done |
| Infrastructure Setup | ✅ Done |
| TDD Setup | ✅ Done |
| Allocation Plan Management | ✅ Done |
| Allocation Run Management | ✅ Done |
| Position Mappings | ✅ Done |
| Job Line Management | ✅ Done |
| Worker Mappings | ✅ Done |
| Rotation Customisation | ✅ Done |
