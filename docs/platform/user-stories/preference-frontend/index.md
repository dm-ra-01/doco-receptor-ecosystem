---
sidebar_position: 1
---

# Preference Frontend

**Audience**: Junior Medical Officers (Workers)  
**Goal**: Submit rotation preferences quickly and accurately.

This section tracks the user stories for the **Preference Frontend** (the worker-facing application). The development follows a **Three-Step Workflow** designed to manage the cognitive load of ranking up to 140 job lines.

## 👥 Personas
- **JMO (Junior Medical Officer)**: Needs to submit rotation preferences quickly during breaks without getting overwhelmed by choice.
- **Power User (Doctor)**: Needs granular control over hospital-specialty combinations and absolute ranking.

## 🚦 Implementation Status Legend
- 🟢 **Complete**: Fully implemented and verified.
- 🟡 **In Progress**: Currently being developed or partially implemented.
- 🔴 **Pending**: Planned for future release.
- ⚪ **Legacy**: Exists in legacy Flutter app; needs porting to the new workflow.

## Workflow Overview
1.  **Phase 1: High-Level Sentiment Alignment** - Sort specialties and set constraints.
2.  **Phase 2: Job Line Evaluation** - detailed review of specific rotations.
3.  **Phase 3: Final Ranking** - Strict 1-to-n ordering.
