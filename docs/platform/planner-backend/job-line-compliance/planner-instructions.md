---
sidebar_position: 8
title: Planner Instructions Summary
---

# Summary of Instructions for Receptor Planner

## 1. Core Objective & Scope

*   **Purpose**: The service handles the *macro-planning and generation phase* of job lines. It creates a diverse pool of AMC-compliant, legally viable, and highly attractive job lines based on a requested count (`num_job_lines`).
*   **Out of Scope**: The service does *not* assign these generated lines to specific individual workers based on their personal preferencing submissions. It generates anonymous templates designed to capture varied interests. It also does *not* manage micro-rostering (e.g., specific shifts, 10-hour breaks).

## 2. Execution Environment & Outputs

*   **Architecture**: A Python CP-SAT solver running synchronously behind a FastAPI gateway.
*   **Performance**: The solver is configured with a strict, customizable time limit (defaulting to ~7 minutes). It prioritizes finding a highly optimal, "good enough" feasible solution over mathematical absolute perfection.
*   **Outputs**:
    1. A verbose JSON payload for deep programmatic debugging.
    2. A formulated Excel spreadsheet (`.xlsx` generated directly by Python) containing the job lines as rows and Weeks 1-52 as columns (with rotations appearing as merged date blocks).
    3. An extra diagnostic sheet within the Excel file detailing underfilled units and dropped excludable positions.

## 3. Hard Constraints (Accreditation & Capacity)

*   **AMC/PMCV Rules**: Strict enforcement of clinical experience categories, 47-week minimums, and specialty/subspecialty percentage caps.
*   **Term Structure**: Rigidly pre-defined via input variables (e.g., 5 terms of 10+10+10+10+12 weeks, or 4 terms of 13 weeks).
*   **Unit Capacities**: Modeled as strict upper bounds ($X \le Capacity$).
*   **Infeasibility Fallback**: If constraints clash, the solver will *arbitrarily* drop predefined 'excludable' positions (like Pathology) to salvage a legal schedule for the remaining mandatory allocations. Outstanding unfilled positions are flagged for manual remediation (e.g., locums or different cohorts).

## 4. Priority Targeting & Continuity

*   **Cohort Scope**: Scheduling is strictly evaluated one clinical year at a time.
*   **Targeted Pathways**: The model accepts explicit instructions to reserve $X$ specific job lines for priority cohorts (e.g., "Generate 10 lines with priority access to Paediatrics/O&G for aspiring GPs, or custom rotations for pre-BPTs"). These templates are built first before the remaining capacity is opened to the general pool. The solver is told at execution time whether these pathways act as *exact* explicit rotations or heavily biased soft-constraints.
*   **Fractional Allocations**: Currently out of scope but planned as a future roadmap feature.

## 5. Medium/Soft Constraints (Affinity, Leave & Diversity)

*   **Annual Leave**: Mandated 5 weeks total. Distributed across the clinical year with a benchmark target of allocating approximately **70% of all annual leave to the first half of the year** to mitigate late-year resignations.
*   **Affinity Matrix**: Rotational synergy (e.g., ICU + Anaesthetics) is scored using linear-scaled Pearson R coefficients derived from the MSIS survey data (Chew et al.).
*   **Abstraction Strategy**: The survey data is abstracted into a standalone, statically loaded JSON configuration file (`affinity_matrix_2026.json`), allowing the affinity weights to be hot-swapped or updated via future localized surveys without altering the core Python solver code or requiring complex API payloads.
*   **Diverse Preference Optimization (DivPO)**: Because generic job lines lack individual human preferences pulling the solver in different directions, the engine uses a Hamming-distance proxy penalty to prevent identical job line "clumping". The solver actively forces global diversity, balancing the highly attractive Affinity Matrix pathways across all generated templates.

## 6. Testing, Validation & Documentation

*   **Validation Data**: Testing relies on historical datasets (rotations, previous manual lines, and 140-worker preferencing data) to benchmark the OR-Tools output against manual planning desirability.
*   **Docusaurus Sync**: Implementation must generate an OpenAPI/Swagger specification and a PostgreSQL schema reference to be embedded directly into the Docusaurus platform (`./documentation/receptor-ecosystem/docs/platform/planner-backend/`).
