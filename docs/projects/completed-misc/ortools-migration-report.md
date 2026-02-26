---
sidebar_position: 6
---

# OR-Tools Migration & Excel Integration Report

This report documents the technical findings and learnings from the migration of the `match-backend` solver from `python-mip` to **Google OR-Tools (CP-SAT)** and the implementation of direct Excel ingestion.

## Executive Summary

The migration was successful, resulting in a more robust and portable solver. Verification against production-representative data (1.xlsx) confirms that the OR-Tools model achieves the **exact same optimisation quality** as the legacy MIP solver, with identical dissatisfaction metrics.

## Key Findings

### 1. Model Equivalence
The transition from Mixed-Integer Linear Programming (MILP) to Constraint Programming (CP-SAT) maintained full functional parity. 
- **Learning**: Even when the literal worker assignments differ (due to multiple equivalent optimal solutions), the total dissatisfaction scores match exactly to the second decimal place (e.g., Worker=351.00, Preferencer=9730.00).
- **Implication**: The system is now verified to produce globally optimal results using modern libraries.

### 2. Environment Compatibility
- **Learning**: `distutils` has been removed from the Python standard library in version 3.12+.
- **Action**: Replaced `distutils.util.strtobool` with a custom lightweight boolean parser to ensure compatibility with modern Python environments (3.12, 3.13+).

### 3. Excel Data Handling
- **Learning**: Exported Excel files for preferencer preferences often use **Fractional Rank Notation** (e.g., values like 70.0 for shared ranks).
- **Action**: Implemented robust detection and parsing for different rank notations directly from Excel files, ensuring the solver correctly interprets "Information" sheet metadata.

## Implementation Details

### Google OR-Tools (CP-SAT)
The new solver uses the `ortools.sat.python.cp_model`. Key constraints implemented include:
- One job per worker.
- Job line capacities.
- Preferencer management caps.
- Stability constraints (Abeledo & Blum 1996 and Custom).
- Weighted objective function (Default 70/30 split).

### Direct Excel Ingestion
The system now supports a `--parse-xlsx` flag that bypasses the Supabase database entirely.
- **Purpose**: Rapid debugging, offline testing, and validation of matching logic without database side-effects.
- **Behavior**: Reads from `.xlsx` and writes to `.xlsx`, skipping all PostgreSQL RPC calls.

## Verification Process

The migration was verified using a newly created automated test suite:
- **Test**: `allocator/tests/test_excel_ingestion.py`
- **Reference Data**: `1.xlsx` (contains 139 workers and historical assignments).
- **Result**: **100% match** on total dissatisfaction metrics.

## Future Recommendations

1. **Complete Supabase Client Migration**: The codebase still contains legacy database patterns that should be refactored to use the Supabase Python client for better integration.
2. **Expand Test Coverage**: Use the new Excel ingestion capability to create a "Golden Suite" of test cases for different edge cases (e.g., highly constrained eligibility).
3. **Performance Benchmarking**: Compare solve times between OR-Tools and MIP for extremely large scales (1000+ workers) to further optimise CP-SAT parameters.
