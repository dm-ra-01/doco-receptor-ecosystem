---
sidebar_position: 4
---

# Phase 3: Final Ranking

The final step where users force-rank their preferences within buckets to create a definitive list.

## Stories

### WF-04: Vertical Ranking
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to perform a final vertical drag-and-drop within each bucket to create a strict 1-to-n ranking. |
| **Priority** | P0 |
| **Status** | 🟡 **Partially Implemented** |
| **Evidence** | `func_preference_job_line_move_up/down` in [schema.sql](https://github.com/common-bond/antigravity-environment/blob/main/supabase-receptor/schema.sql) |

#### 🛠️ Technical Tasks
- [ ] **Frontend**: Implement reordering UI (drag handles) within specific buckets in `PreferenceGrid` or `PreferenceSummary`.
- [ ] **Integration**: Connect UI to `func_preference_job_line_move_up` and `func_preference_job_line_move_down` RPCs.

### SV-05: Submission Validation
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I must select an X-positive line minimum (suggested by the system based on pool size) before I am allowed to submit. |
| **Priority** | P0 |
| **Status** | 🔴 **Pending** |
| **Notes** | Ensures enough data for matching stability. |

#### 🛠️ Technical Tasks
- [ ] **Backend**: Add configuration for "Minimum Lines" per Allocation Run.
- [ ] **Frontend**: Add validation check to "Submit" button in `PreferenceSummary.tsx`.
