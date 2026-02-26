---
sidebar_position: 5
---

# Allocator Refactoring

Modernization project for the Python-based Allocator matching engine.

## Status

| Attribute | Value |
|-----------|-------|
| **Status** | ✅ Completed |
| **Priority** | — |
| **Repository** | [match-backend](https://github.com/dm-ra-01/match-backend) |

## Background

The Allocator is the core matching engine for Receptor. It uses mathematical optimisation to assign workers to job rotations. The system has migrated from MILP (`python-mip`) to **Google OR-Tools (CP-SAT)** to improve performance and maintainability.

## Goals

### 1. Audit & Document Functions/Models

Document all existing Python functions, classes, and data models:

- [x] Core models (`Worker`, `JobLine`, `Problem`, `Solution`, etc.)
- [x] Database functions in `postgres.py`
- [x] Preference handling (`preferences.py`, `weighting.py`)
- [x] Eligibility logic (`eligibility.py`, `job_line_eligibility_restrictions.py`)

### 2. Migrate to Supabase Client

Replace raw `psycopg2` database connections with the Supabase Python client:

- [x] Install `supabase-py` dependency
- [x] Replace `dbConfig()` with Supabase client initialization
- [x] Refactor `fetchAll()` to use Supabase query builder
- [x] Refactor `post()` to use Supabase insert/update
- [x] Update `database.ini` to use `.env` format

### 3. Refactor Excel Output & Input

Modernize the XLS spreadsheet integration:

- [x] Evaluate if XLS output is still required -> Yes, for debugging and offline runs.
- [x] Implement direct XLSX import bypassing database for testing.
- [x] Implement result export to XLSX bypassing Supabase posting.

### 4. Add `--match-id` and `--parse-xlsx` Flags

Allow more granular control over run processing:

- [x] Add `--parse-xlsx` CLI argument for direct file processing.
- [x] Add `--allocator-run-id` CLI argument for processing specific runs.
- [x] Update documentation.

## Success Criteria

- [x] All database operations use Supabase client
- [x] `--allocator-run-id` flag works correctly
- [x] All models and functions documented
- [x] Output format decision made and implemented
- [x] Tests pass with new implementation
