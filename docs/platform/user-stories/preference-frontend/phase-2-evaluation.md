---
sidebar_position: 3
---

# Phase 2: Evaluation

This phase involves the detailed review and categorization of individual Job Lines.

## Stories

### WF-02: Attractiveness Score
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want the system to calculate and display an "Attractiveness Score" for each job line based on my Phase 1 sentiments. |
| **Priority** | P0 |
| **Status** | 🟡 **In Progress** |
| **Evidence** | [func_calculate_job_line_attractiveness.sql](https://github.com/common-bond/antigravity-environment/blob/main/supabase-receptor/supabase/schemas/05_functions/preferencing/func_calculate_job_line_attractiveness.sql) (Algorithm) |
| **Notes** | Uses normalization to highlight best matches. |

#### 🛠️ Technical Tasks
- [x] **Algorithm**: Implement `func_calculate_job_line_attractiveness` to normalize Phase 1 sentiments into job line scores.
- [x] **Backend**: Expose score in `preference_worker_job_lines` view.
- [x] **Frontend**: Add "Match Score" badge/indicator to `JobLineCard.tsx`.

### WF-03: Job Line Bucketing
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to sort individual job lines into sentiment buckets to refine my high-level preferences. |
| **Priority** | P0 |
| **Status** | 🟡 **In Progress** |
| **Evidence** | [PreferenceGrid.tsx](https://github.com/common-bond/antigravity-environment/blob/main/frontend/preference-frontend/src/components/preferencing/PreferenceGrid.tsx) (Desktop), `MobileListView.tsx` (Mobile UI) |

#### 🛠️ Technical Tasks
- [ ] **Frontnend (Mobile)**: Implement swipe/tap logic in `MobileListView.tsx` to actually update preferences.
- [ ] **Frontend (Desktop)**: Verify drag-and-drop interactions in `PreferenceGrid.tsx` are fully wired to API.

### UI-01: Batch Dragging
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to batch-drag job lines into buckets to save time during evaluation. |
| **Priority** | P2 |
| **Status** | 🔴 **Pending** |
| **Notes** | UI efficiency feature. |

#### 🛠️ Technical Tasks
- [ ] **Frontend**: Implement multi-select state in `PreferenceGrid`.
- [ ] **Frontend**: Allow dragging multiple selected items at once.

### AI-01: Conflict Detection
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to be prompted to review "Conflict Sets" (e.g., a Job Line contains a 'Dislike' rotation but the Specialty is 'Love'). |
| **Priority** | P1 |
| **Status** | 🟡 **In Progress** |
| **Evidence** | [view_worker_preference_conflicts.sql](https://github.com/common-bond/antigravity-environment/blob/main/supabase-receptor/supabase/schemas/03_tables/preferencing/z_view_worker_preference_conflicts.sql) (Backend/Logic) |
| **Notes** | Prevents mixed signals in the matching engine. |

#### 🛠️ Technical Tasks
- [x] **Backend/Logic**: Implement `view_worker_preference_conflicts` for identifying conflicts (Preference vs. Implied Sentiment).
- [ ] **Frontend**: Design "Conflict Resolution" modal or view.
