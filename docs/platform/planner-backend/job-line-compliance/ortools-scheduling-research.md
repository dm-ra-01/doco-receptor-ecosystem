---
sidebar_position: 6
title: OR-Tools Scheduling Research
---

# Technical Design Specifications: Optimisation of Medical Prevocational Job Lines Using OR-Tools CP-SAT

## Introduction to Algorithmic Medical Workforce Optimisation

The scheduling and allocation of prevocational medical staff—specifically Postgraduate Year 1 (PGY1) interns and Postgraduate Year 2 (PGY2) workers—represents a highly complex combinatorial optimisation problem that sits at the intersection of stringent regulatory compliance, industrial relations law, and human behavioral psychology. Health networks across Australia, and particularly within the state of Victoria, are required annually to generate "job lines." These job lines are predetermined, year-long sequences of clinical rotations allocated to junior doctors, serving as the architectural foundation of their training and the operational backbone of hospital staffing models.

Traditionally, the generation of these job lines has relied on manual heuristics, historical templates, and localized administrative knowledge maintained by Medical Education Units. However, the introduction of the revised Australian Medical Council (AMC) National Framework for Prevocational Medical Training—implemented nationwide in 2024 for PGY1 interns and systematically rolling out in 2025 and 2026 for PGY2 workers—has drastically altered the regulatory and operational landscape, rendering manual compilation obsolete.

The AMC's transition from rigid, time-based "core terms" to dynamic, patient-care-focused "Clinical Experiences" demands a level of structural flexibility that manual planning cannot sustainably accommodate. Previously, compliance was a simple arithmetic exercise of ensuring an intern completed a mandatory ten weeks of surgery, ten weeks of medicine, and eight weeks of emergency medical care. Under the new paradigm, job lines must be dynamically mapped against four distinct clinical experience categories (Undifferentiated, Chronic, Acute/Critical, and Peri-procedural illness care) while simultaneously balancing strict percentage-based caps on specialty exposure, subspecialty concentration, and service term allocations. Furthermore, the algorithmic allocation must strictly adhere to the industrial parameters outlined in state enterprise bargaining agreements, such as the comprehensive *Medical Practitioners (Victorian Public Sector) Enterprise Agreement 2022-2026*.

Beyond mere regulatory and industrial compliance, the generation of job lines faces a critical behavioral challenge: ensuring the lines themselves are inherently attractive and logical for future preferencing. It is important to note that the Receptor Planner's scope is strictly constrained to the **planning and generation phase** of job lines; it does not handle the downstream assignment of individual workers based on their submitted preferences. Instead, drawing from medical education research that indicates highly skewed trainee interest toward specific specialized tracks, the objective is to generate a comprehensive roster of job lines that are structurally diverse and holistically attractive, mitigating the "clumping" of popular rotations into a few elite lines while vital community and generalist lines remain under-preferenced.

This technical design specification delineates the comprehensive architecture for utilizing Google OR-Tools, specifically the Constraint Programming Boolean Satisfiability (CP-SAT) solver, to automate the generation of medical job lines. The CP-SAT engine is selected for its fundamental superiority in resource utilization, logic-based feasibility enforcement, and Lazy Clause Generation over traditional stable-matching algorithms. While algorithms like the Nobel-prize-winning Gale-Shapley method are exceptional for stable matching, they inherently prioritize individual stability over global utilization, frequently leaving essential clinical roles unfilled if stable matches cannot be achieved. Conversely, Constraint Programming operates primarily on feasibility—narrowing down billions of potential schedules by applying arbitrary, complex constraints to find valid global solutions. By framing the medical scheduling problem through the rigorous lens of Hard Constraints (accreditation), Medium Constraints (industrial agreements), and Soft Constraints (affinity and diversity), this architecture provides a robust, compliant, and preference-aware scheduling ecosystem tailored directly to the Victorian healthcare context.

## Mathematical Ontology and Domain Definition

To effectively leverage the OR-Tools CP-SAT solver, the highly nuanced clinical environment of a Victorian health service must be abstracted into a rigorous mathematical ontology. This involves defining finite sets, establishing multidimensional parameters, and declaring the boolean decision variables that the solver will manipulate.

The scheduling model is built upon a foundation of fundamental sets:
*   **D**: The set of all prevocational workers requiring scheduling, partitioned into `D_{PGY1}` (interns) and `D_{PGY2}` (second-year workers).
*   **T**: The set of time intervals or clinical terms (typically 4 or 5 terms per year).
*   **R**: The set of all available clinical rotations (e.g., General Medicine, Colorectal Surgery).
*   **C**: The set of AMC Clinical Experience categories: `C = {A, B, C, D}`.
*   **S**: Overarching medical specialties and subspecialties (`S_{sub}`).

Every rotation `r \in R` is characterized by a mapping profile:
*   **MapExp(r)** `\subseteq C`: Clinical experience mapping (max 2 categories).
*   **MapSpec(r)** `\in S`: Parent specialty.
*   **MapSubSpec(r)** `\in S_{sub}`: Specific subspecialty.
*   **IsService(r)** `\in {0, 1}`: Boolean flag for service terms (e.g., night relief).
*   **`Cap_{r,t}`**: Integer parameter for trainee capacity.

The decision variable is a multi-dimensional tensor:
`X_{w,t,r} \in {0, 1}`, where `X_{w,t,r} = 1` if worker `w` is assigned to rotation `r` during term `t`.

## Hard Constraints: Formulating AMC and PMCV Accreditation Standards

Hard constraints are non-negotiable boolean boundaries. The most fundamental is that every worker must be assigned to exactly one rotation per term, and the total clinical time must be at least 47 weeks full-time equivalent (FTE).

### Intern (PGY1) and PGY2 Program Accreditation Constraints

| Parameter | PGY1 (Intern) Constraints | PGY2 Constraints |
| :--- | :--- | :--- |
| **Minimum Total Length** | 47 weeks FTE | 47 weeks FTE |
| **Term Structure** | Predetermined structural inputs. E.g., either 5 terms (10, 10, 10, 10, 12 weeks) or 4 terms (13, 13, 13, 13 weeks). | Predetermined structural inputs (same options as PGY1). |
| **Specialty Max Limit** | Max 50% in any parent specialty | No hard parent specialty cap |
| **Subspecialty Max Limit** | Max 25% in any single subspecialty | Max 25% in any single subspecialty |
| **Service Term Max Limit** | Max 20% of the clinical year | Max 25% of the clinical year |
| **Clinical Team Embedding** | Min 50% of the year | Min 50% of the year |
| **Required Clinical Exp.** | Categories A, B, C, and D | Categories A, B, and C (D optional) |

### 6-Month Rotation Logic (PGY2)
In Victoria, 6-month rotations for PGY2s are only valid if:
1. The specialty contains two distinct subspecialty components.
2. It is tied to a diploma or certificate.
3. There is a documented requirement from a vocational college.
4. The rest of the year satisfies Categories A, B, and C.

In CP-SAT, this is modeled using `model.AddImplication()`.

## Medium Constraints: State Enterprise Bargaining Agreements (EBA)

Industrial legality is governed by the *Medical Practitioners (Victorian Public Sector) Enterprise Agreement 2022-2026*.

*   **Annual Leave Allocation**: Five weeks (190 hours) mandated per doctor. The solver must optimally place this pseudo-rotation block within the year without violating core experience requirements.
*   **Macro-Rostering Viability**: While the solver does not generate daily shift patterns (excluding micro-rostering concepts like 14-hour max shifts or 10-hour breaks), it ensures that the macroscopic allocation provides the structural capacity and `MinStaffing` thresholds required for downstream unit rosterers to create legal, EBA-compliant shift templates.

## Soft Constraints: Optimising Career Affinity and Mitigating Clumping

### The Affinity Matrix and Specialty Career Tracks
Using the **Medical Specialty Interest Survey (MSIS)** (Chew et al., 2023) correlation findings, an Affinity Matrix $A(r_1, r_2) \in [-1, 1]$ defines thematic synergy between different clinical rotations based on Pearson $R$ coefficients. This quantifiable data enables the solver to measure job line cohesion mathematically:

*   **Strong Positive Affinity**: Pairings such as Intensive Care Medicine + Anaesthesia ($R = 0.67$) or General Practice + Psychiatry ($R = 0.45$) represent highly synergistic training pathways.
*   **Strong Negative Affinity**: Surgical specialties consistently exhibit negative correlations with generalist/internal medicine trajectories (e.g., Surgery vs. General Practice: $R \in [-0.23, -0.16]$).
*   **Isolated Tracks**: Specialties like Psychiatry (mean $R = 0.088$) and General Practice (mean $R = 0.106$) show low baseline correlations with most other fields. This means they require specific, targeted combinations (like GP + Paediatrics) rather than broad generalist pairing.

The CP-SAT objective function utilizes these coefficients by **linearly scaling** the Pearson R values into discrete integer weights. The solver sums these linear affinity weights for all rotation pairs within a job line, significantly increasing the logical "attractiveness" of the schedule and ensuring job lines are cohesive for later preferencing.

### Diverse Preference Optimisation (DivPO)
To prevent "clumping" (where the solver hoards all popular rotations into a few elite lines), a **Diversity Penalty** is introduced. If a new job line `J_k` is too similar to `J_{k-1}` (measured via Hamming distance), it is penalized. This forces the solver to create "hybrid" lines, pairing competitive terms with less popular but vital ones, flattening the preference curve.

## Algorithmic Implementation and Infeasibility Management

Implementation uses the Python `cp_model` library from OR-Tools. The process involves:
1. Instantiating `cp_model.CpModel()`.
2. Creating variables with `model.NewBoolVar()`.
3. Adding hard and medium constraints.
4. Setting a global objective function with affinity rewards and diversity penalties.

### Execution Environment and Performance
The CP-SAT model will run as a synchronous service behind a FastAPI gateway. As job line generation is a low-volume operation (~20 requests per month), it will accept incoming HTTP requests containing the required variables (number of workers, term lengths, rotation capacities) and a reference to an ingested JSON file containing the Affinity Weight Profile. 
Because mathematical optimisation can run indefinitely searching for the absolute peak optimal solution, the solver is configured with a strict, customizable time limit (defaulting to 7 minutes). The objective isn't necessarily establishing mathematical perfection, but finding a highly optimal, "good enough" feasible solution before the API timeout occurs.

### Diagnostics
If the model is `INFEASIBLE`, the architecture employs:
*   **Presolve Phase Analytics**: Identifying contradictory constraints.
*   **Excludable Position Dropping (Fallback)**: If mathematically impossible to satisfy all core compliance metrics within the rigid term structure, the model defers to a predefined list of 'excludable' or 'sacrificial' positions (e.g., specific Pathology or elective terms). The solver will arbitrarily iteratively drop these excludable positions from the overall capacity pool, prioritizing the generation of a valid schedule over filling every minor role.

## Conclusion

By encoding AMC frameworks and Victorian EBA protections into Google OR-Tools, health networks can generate legally and educationally bulletproof schedules. The integration of Diverse Preference Optimisation (DivPO) ensures that high-value clinical experiences are distributed equitably, improving workplace equity and junior doctor satisfaction.
