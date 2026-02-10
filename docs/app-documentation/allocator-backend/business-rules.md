---
sidebar_position: 8
---

# Business Rules & Configuration

The Allocator's behavior can be fine-tuned via global configuration parameters and specific data-driven rules.

## Global Configuration (`config.py`)

These parameters affect every run processed by the engine:

| Parameter | Default | Effect |
|-----------|---------|--------|
| `preferencer_weight` | 0.3 | The $(\alpha)$ value in the objective function. $0.3$ means 30% organizational voice, 70% worker voice. |
| `preference_power` | 1.0 | The exponent $(k)$ for dissatisfaction. Higher values penalize lower ranks more aggressively. |
| `max_seconds` | $10^{100}$ | Timeout for the solver. For most healthcare datasets (50-200 nodes), it solves in &lt;5 seconds. |
| `rng_seed` | 1234 | Ensures that if multiple optimal solutions exist, the same one is picked every time (determinism). |
| `allow_worker_preference_ties` | True | If false, the engine will error if a worker provides two "#1" choices. |

## Rank Notation Systems

The system supports three ways of expressing rank, which are all normalized to **Fractional** notation internally:

- **Competition (1, 1, 3)**: Standard sporting rank. If two people are #1, the next is #3.
- **Dense (1, 1, 2)**: No gaps. If two people are #1, the next is #2.
- **Fractional (1.5, 1.5, 3)**: The average of the positions the tied items would occupy.

## Organizational Weightings

Organizations can influence the result without overriding worker preferences completely by using **Weightings**:

1. **Global Weighting**: Add a fixed dissatisfaction/satisfaction score to a worker across all possible jobs.
2. **Job-Specific Weighting**: Add a score to a worker only for a specific rotation.

**Formula Contribution**:
**D_preferencer(p,s) = Base Rank + Sum(Applicable Weightings)**

## Special Overrides

### Mandatory Job Fills
A Job Line can be flagged as `must_have_workers`. This forces the solver to assign at least one worker to it, even if it leads to a higher overall dissatisfaction. This is typically used for critical night shifts or emergency departments.

### Worker-to-Job Pins
Manual overrides can be achieved by setting eligibility to `False` for all but one specific Job Line for a worker, effectively "pinning" them.
