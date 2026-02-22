---
sidebar_position: 14
title: Stage 6 Implementation Audit
---

# Stage 6: Constraint Abstraction & National Scaling Audit

Building on Phase 5's intelligent data extraction capabilities, Phase 6 focused on removing hard-coded Victorian PMCV accreditation rules from the core engine. The goal was to establish a dynamic, nationally scalable rules engine capable of supporting diverse state and cohort requirements natively.

Here is a breakdown of the implementation's compliance status regarding the Stage 6 scope.

## 1. Compliant Features (Fully Implemented)

*   **Constraint Strategy Pattern:** The `PlannerEngine` no longer hard-codes PMCV accreditation math. It dynamically imports a `CohortConstraintStrategy` based on the targeted integration or presale payload. 
*   **National Framework Implementation:**
    *   **Victoria (PMCV):** Fully coded constraint strategies for PGY1 (strict category mixing, term limits, capacity limits) and PGY2 (relaxed but structured routing).
    *   **New South Wales (HETI):** Frameworked constraint structure for HETI's 47-week rules and PGY2 exclusion behaviors.
    *   **Western Australia (PMCWA):** Frameworked constraint structure reflecting the AMC national guidelines.
    *   **Exemptions:** PGY3+ definitions correctly instruct the mathematics engine to skip rotational caps, permitting pure specialization pathways for senior clinical training.
*   **API `UNRESTRICTED` Safeties:** The `SchedulingRequest` payload natively defaults to `state="UNRESTRICTED"` and `cohort="ANY"`. This protects arbitrary API requests from mathematically crashing against state rules they did not explicitly target. The integration tests and production APIs only inject `state="VIC"` when strict PMCV compliance is mandated. 
*   **Engine Structural Integrity Check:** Repaired an engine oversight during the strategy shift that accidentally permitted duplicate rotations in the same job line for the same clinical year.
*   **Fallback Resolution Repair:** The engine's safety `_fallback_solve()` behaviour (which drops Excludable roles like Pathology during mathematical gridlocks) now correctly triggers the decoupled `self.strategy.apply_soft_constraints()` phase.

## 2. Next Steps
*   **National Verification:** With the `CohortConstraintStrategy` pattern deployed, the next logical step involves sourcing raw state-specific template data (e.g. from WA Health or NSW Health) to prove generation compliance against HETI and PMCWA methodologies just as we have done with Victoria.
*   **Fractional Allocations:** Continuing the mathematical roadmap to enable 0.5 FTE equivalents for job line generation.

:::note
**Summary:** The core CP-SAT engine is now fully abstracted from state politics. It functions purely as a mathematical maximization engine capable of mapping highly attractive job lines, while dynamically adopting whatever specific accreditation `state` ruleset is injected at runtime.
:::
