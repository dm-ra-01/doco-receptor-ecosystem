---
sidebar_position: 7
title: Survey Abstraction Strategy
---

# Survey Data Abstraction Strategy for OR-Tools

## Introduction

The mathematical optimisation of medical job lines using the OR-Tools CP-SAT solver relies heavily on an overarching "Affinity Matrix" to quantify the desirability and thematic cohesion of rotation pairings. While the foundational matrix is seeded by the **Medical Specialty Interest Survey (MSIS)** (Chew et al., 2023), it is critical to abstract this data source from the core solver logic.

Abstracting the survey data ensures that the Receptor Planner remains adaptable. As new prevailing trends emerge, vocational training requirements shift, or localized hospital surveys are conducted, the underlying affinity weights can be updated or entirely replaced without requiring structural changes to the Python CP-SAT service.

## Abstraction Methodology

The CP-SAT solver will not parse raw survey documents or PDFs. Instead, it will consume a standardized **Affinity Weight Profile**.

### 1. Standardization of Metrics
The MSIS survey utilizes Pearson $R$ coefficients ranging from -1 (strong negative linear relationship) to +1 (strong positive linear relationship). 
To present a uniform interface to the CP-SAT objective function, any ingested survey data must be normalized and linearly scaled into an integer-based weight system (e.g., -100 to +100). Integer scaling is computationally superior and natively supported by the OR-Tools boolean objective formulation.

### 2. The Abstracted Data Interface
The solver will expect an adjacency matrix or a dictionary mapping of rotation pairs to their integer weights. 

```json
{
  "affinity_profile_version": "1.0",
  "source": "MSIS_2023_Adapted",
  "weights": {
    "INTENSIVE_CARE_MEDICINE": {
      "ANAESTHESIA": 67,
      "GENERAL_MEDICINE": 10,
      "SURGERY_GENERAL": -5
    },
    "GENERAL_PRACTICE": {
      "PSYCHIATRY": 45,
      "PAEDIATRICS": 36,
      "SURGERY_GENERAL": -23
    }
  }
}
```

## Re-Surveying and Updating Weights

When future surveys are conducted (e.g., a localized health service survey capturing specific institutional preferences):

1. **Data Collection**: New preference data is collected.
2. **Statistical Analysis**: The raw data is analyzed to generate a new correlation matrix (e.g., Pearson R coefficients).
3. **Weight Translation Pipeline**: A standalone utility script (outside of the core CP-SAT loop) scales these newly calculated coefficients into the standard integer format.
4. **Profile Injection**: The new JSON configuration is injected into the Receptor Planner. The solver reads the new mapping at runtime and inherently adjusts its optimisation targets—favoring the newly identified pathways without requiring algorithmic refactoring.

## Benefits of the Abstraction Layer

*   **Longevity**: The solver's constraint logic remains pristine and legally focused (Hard/Medium constraints), while behavioral logic (Soft constraints) is hot-swappable.
*   **A/B Testing**: Planners can run the CP-SAT solver with two different affinity profiles (e.g., "National Average" vs. "Local Survey") and compare the resulting job lines.
*   **Versioning**: Historical job line generation can be audited by tracking which specific Affinity Weight Profile generation was active at the time of execution.
