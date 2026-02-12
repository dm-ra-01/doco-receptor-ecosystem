---
sidebar_position: 2
---

# Phase 1: Sentiment Alignment

This phase establishes the high-level preferences to help filter and score the hundreds of available job lines.

## Stories

### WF-01: Specialty Sorting
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to sort Specialties/Teams (e.g., Dermatology, Gen Surg) into five sentiment buckets using a drag-and-drop grid. |
| **Priority** | P0 |
| **Status** | 🟢 **Production Ready** |
| **Evidence** | [worker_specialty_sentiments.sql](file:///Users/ryan/development/common_bond/antigravity-environment/supabase-receptor/supabase/schemas/03_tables/preferencing/worker_specialty_sentiments.sql) (Backend), [SpecialtySentimentGrid.tsx](file:///Users/ryan/development/common_bond/antigravity-environment/frontend/preference-frontend/src/components/preferencing/SpecialtySentimentGrid.tsx) (Frontend), [Final UI Screenshot](file:///Users/ryan/.gemini/antigravity/brain/32c74abc-dce8-49fa-9466-706f00921796/specialty-sorting-final.png) |
| **Notes** | Foundation for automated job line scoring. High-fidelity drag-and-drop implemented with Framer Motion. |

#### 🛠️ Technical Tasks
- [x] **Backend**: Create table for `worker_specialty_sentiments` to store user sentiment per specialty.
- [x] **Frontend**: Build drag-and-drop grid component for specialties (distinct from Job Line grid).
- [x] **Test**: E2E verification of drag-and-drop and mobile responsiveness.
- [ ] **Algorithm**: Implement logic to boost/penalize Job Lines based on their specialty's sentiment score. (Logic defined in `func_calculate_job_line_attractiveness`)

### CR-01: Negative Constraints
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to answer negative constraint questions (travel limits, specialty exclusions) to automatically screen out job lines. |
| **Priority** | P1 |
| **Status** | 🟡 **In Progress** |
| **Evidence** | [worker_screening_rules.sql](https://github.com/common-bond/antigravity-environment/blob/main/supabase-receptor/supabase/schemas/03_tables/preferencing/worker_screening_rules.sql) (Backend) |
| **Notes** | Reduces initial list size early. |

#### 🛠️ Technical Tasks
- [x] **Backend**: Define schema for constraints (`worker_screening_rules` table).
- [ ] **Frontend**: Design and implement a "Constraints Questionnaire" wizard step.
- [ ] **Algorithm**: Add filtering logic to `allocator_py` or SQL views to exclude job lines matching constraints.
