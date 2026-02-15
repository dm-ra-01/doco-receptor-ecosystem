---
sidebar_position: 5
---

# Enhancements & Power Features

Additional features for context and advanced control.

## Context & Notes

### NT-01: Rotation Notes
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to record a private note on a specific Rotation (e.g., "Great commute"). |
| **Priority** | P2 |
| **Status** | 🔴 **Pending** |

#### 🛠️ Technical Tasks
- [x] **Backend**: Create table/fields for rotation-specific notes per worker.
- [x] **Frontend**: Add "Add Note" button/modal to Rotation cards in `MobileListView`/`PreferenceGrid`.

### NT-02: Job Line Notes
| Attribute | Detail |
|:---|:---|
| **User Story** | As a JMO, I want to record a private note on a specific Job Line (e.g., "Best for training"). |
| **Priority** | P2 |
| **Status** | 🔴 **Pending** |

#### 🛠️ Technical Tasks
- [x] **Backend**: Create table/fields for job-line-specific notes per worker.
- [x] **Frontend**: Add "Add Note" button to `JobLineCard` (triggers `NoteModal`).

## Power User Tools

### PU-01: Matrix View
| Attribute | Detail |
|:---|:---|
| **User Story** | As a Power User, I want to access a High-Level Matrix View to see all options at once. |
| **Priority** | P2 |
| **Status** | 🟢 **Complete** |

#### 🛠️ Technical Tasks
- [x] **Frontend**: Design dense table view (React Table / Data Grid) for Desktop.

### PU-02: Global Filtering
| Attribute | Detail |
|:---|:---|
| **User Story** | As a Power User, I want to globally blacklist specific Hospital-Specialty combinations. |
| **Priority** | P1 |
| **Status** | 🔴 **Pending** |

#### 🛠️ Technical Tasks
- [ ] **Backend**: filtering logic in SQL views.
- [ ] **Frontend**: Advanced Filter UI.
