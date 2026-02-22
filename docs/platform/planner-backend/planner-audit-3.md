---
sidebar_position: 11
title: Stage 3 Implementation Audit
---

# Stage 3: Phase 4 Affinity Matrix & Soft Constraints Audit

Based on the completion of Phase 4, the backend service has advanced significantly from hardcoded heuristics to a dynamic, mathematical optimization model driven by empirical survey data and soft constraint tuning.

Here is a breakdown of the implementation's compliance status regarding the Affinity Matrix and soft constraint features.

## 1. Compliant Features (Fully Implemented)

*   **Affinity Matrix Ingestion (MSIS Abstraction):** The `SchedulingRequest` payload and internal Pydantic models cleanly accept an `AffinityProfile` containing empirical transition weights (e.g., `-100` to `100` mapping specific specialties).
*   **Sequential Maximization:** The CP-SAT `PlannerEngine` actively maximizes contiguous boolean implications ($X_{t} \rightarrow X_{t+1}$). This soft constraint mathematically encourages continuous strings of highly compatible sub-specialties without enforcing brittle, hardcoded rotation pathways.
*   **Diverse Preference Optimization (DivPO):** The engine combats job line cloning by injecting piecewise Hamming-distance proxy penalties. The CP-SAT model dynamically minimizes square collisions within a single term, actively sorting equivalent clinical workers evenly across available combinations before maximizing local affinity pools. 
*   **Annual Leave Heuristics:** The planner successfully categorizes specific dummy rotations as leave blocks, aggressively weighting distribution directly into Semester 1 (Terms 1 & 2) via $+200 / -200$ bi-directional scalars.
*   **Targeted Priority Pathways:** The engine explicitly accepts predefined strings (e.g. Rural Generalist constraints), locking the specified worker to the required `target_id` sequence before unrolling the broader unconstrained population payload.
*   **Testing and Validation:** Independent mathematical unit tests explicitly confirm linear scoring biases. The system correctly verifies that isolated components transition precisely according to the weighted affinity survey tables (`test_affinity.py`).

## 2. Next Steps
*   **Integration with Frontend:** The Next.js / Flutter frontends must be updated to securely serialize the `AffinityProfile` state (from the MSIS backend or user preference config) directly into the `SchedulingRequest` FastAPI submission endpoint.
*   **Benchmarking (Pending):** A performance audit is needed to quantify solver duration impacts under maximum load (e.g. 100+ simulated workers against 40+ constrained rotations) considering the heavy combinatorial explosion introduced by the DivPO Hamming penalties.

:::note
**Summary:** The Receptor Planner's core optimization mechanism is fully decoupled from static heuristics. It is now strictly governed by quantifiable input matrices, providing ultimate flexbility to adapting clinical requirements and EBA modifications year-over-year.
:::
