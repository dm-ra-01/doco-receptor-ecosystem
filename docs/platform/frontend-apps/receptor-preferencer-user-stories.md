---
sidebar_position: 2
---

# Receptor Preferencer User Stories

This document tracks the user stories for the Preference Frontend (Worker-facing app) and their implementation status. The development follows a **Three-Step Workflow** designed to manage the cognitive load of ranking up to 140 job lines.

## 👥 Personas
- **JMO (Junior Medical Officer)**: Needs to submit rotation preferences quickly during breaks without getting overwhelmed by choice.
- **Power User (Doctor)**: Needs granular control over hospital-specialty combinations and absolute ranking.
- **Workforce Administrator**: Needs high-quality preference data for optimal matching.

---

## 🚦 Implementation Status Legend
- 🟢 **Complete**: Fully implemented and verified.
- 🟡 **In Progress**: Currently being developed.
- 🔴 **Pending**: Planned for future release.
- ⚪ **Legacy**: Exists in legacy Flutter app; needs porting to the new workflow.

---

## 🏗️ Core Workflow: The Three-Step Process

### Phase 1: High-Level Sentiment Alignment
| ID | User Story | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| WF-01 | As a JMO, I want to sort Specialties/Teams (e.g., Dermatology, Gen Surg) into five sentiment buckets using a drag-and-drop grid. | P0 | 🔴 | Foundation for automated job line scoring. |
| CR-01 | As a JMO, I want to answer negative constraint questions (travel limits, specialty exclusions) to automatically screen out job lines. | P1 | 🔴 | Reduces initial list size early. |

### Phase 2: Job Line Evaluation & Sentiment
| ID | User Story | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| WF-02 | As a JMO, I want the system to calculate and display an "Attractiveness Score" for each job line based on my Phase 1 sentiments. | P0 | 🔴 | Uses normalization to highlight best matches. |
| WF-03 | As a JMO, I want to sort individual job lines into sentiment buckets to refine my high-level preferences. | P0 | 🟢 | Core `JobLineCard` interaction implemented. |
| UI-01 | As a JMO, I want to batch-drag job lines into buckets to save time during evaluation. | P2 | 🔴 | UI efficiency feature. |
| AI-01 | As a JMO, I want to be prompted to review "Conflict Sets" (e.g., a Job Line contains a 'Dislike' rotation but the Specialty is 'Love'). | P1 | 🔴 | Prevents mixed signals in the matching engine. |

### Phase 3: Final 1-to-n Ranking
| ID | User Story | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| WF-04 | As a JMO, I want to perform a final vertical drag-and-drop within each bucket to create a strict 1-to-n ranking. | P0 | 🔴 | Final output for the Allocator engine. |

---

## 📝 Features & Enhancements

### Context & Notes
| ID | User Story | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| NT-01 | As a JMO, I want to record a private note on a specific Rotation (e.g., "Great commute"). | P2 | 🔴 | Helps memory across sessions. |
| NT-02 | As a JMO, I want to record a private note on a specific Job Line (e.g., "Best for training"). | P2 | 🔴 | Visible during final ranking. |

### Power User Tools
| ID | User Story | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| PU-01 | As a Power User, I want to access a High-Level Matrix View to see all options at once. | P2 | 🔴 | Desktop-optimized dense layout. |
| PU-02 | As a Power User, I want to globally blacklist specific Hospital-Specialty combinations. | P1 | 🔴 | Overrides default job line scores. |

### Verification & Submission
| ID | User Story | Priority | Status | Notes |
|:---|:---|:---:|:---:|:---|
| SV-05 | As a JMO, I must select an X-positive line minimum (suggested by the system based on pool size) before I am allowed to submit. | P0 | 🔴 | Ensures enough data for matching stability (e.g. 12 for 50+ lines). |

---

## 🛠️ Legacy Porting Tracker
| Task | Source | Status |
|:---|:---|:---:|
| Magic Link Login | legacy Edge Func | 🟢 |
| Live Supabase Sync | legacy Service | 🟢 |
| 5-Level Rating | legacy Widget | 🟢 |
| Team Tag Filter | legacy UI | ⚪ |

---

*Last Updated: 2026-02-11*
