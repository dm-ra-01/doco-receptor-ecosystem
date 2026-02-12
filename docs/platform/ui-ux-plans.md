---
sidebar_position: 6
---

# UI/UX Development Plan

This document outlines the design philosophy and implementation strategy for the Receptor frontend applications.

## Overview

The Receptor platform follows a **Core Suite Strategy** with distinct requirements for each service:

| Service | Focus | Key Principle |
|:----|:-------------|:--------------|
| **Workforce** | Administrative clarity | CRUD efficiency, data consistency |
| **Planner** | Data-dense dashboards | Complex workflows, timeline visualization |
| **Preferencer** | Mobile-first, speed | Sub-2-minute preference submission |
| **Allocator** | Intelligence & Audit | Explanability, fairness, and transparency |


---

## Preferencer Design Philosophy

The Preferencer is designed for healthcare workers who need to submit preferences quickly during brief breaks:

- **Three-Step Workflow**: Guide users through Specialty Sentiment (Phase 1) → Job Line Attractiveness (Phase 2) → Absolute Ranking (Phase 3).
- **Intelligent Scoring**: Automatically calculate job line "Attractiveness" based on specialty sentiment to reduce cognitive load.
- **Visual Timelines**: Use horizontal grids (Desktop) and vertical cards with mini-timelines (Mobile) to represent job lines and their constituent rotations.
- **Immediate Feedback**: Actions like liking, disliking, or re-ordering should provide instant visual feedback.
- **Data Integrity**: Ensure the UI accurately reflects the Supabase schema (`AllocationRun`, `JobLine`, `Rotation`) and enforces an **X-positive-selection minimum** based on the total job line pool (e.g. 12 minimum for 50+ lines).

### Responsive Strategy

| Breakpoint | Layout | Description |
|:-----------|:-------|:------------|
| **Desktop** (≥ 1024px) | Horizontal grid | Rows = job lines, Columns = time (weeks) |
| **Mobile** (< 1024px) | Vertical list | Cards with summary timelines |

---

## Planner Design Philosophy

The Planner serves workforce managers who need to orchestrate complex allocation processes:

- **Data Density**: Display maximum information without overwhelming the user.
- **Timeline Visualization**: Rotation customisation requires precise date selection and overlap detection.
- **Layered Architecture**: Use service → hook → component pattern for testability.

---

## Workforce Design Philosophy

The Workforce app serves system administrators managing organizational master data:

- **Administrative Efficiency**: Fast CRUD operations with clear data relationships.
- **Hierarchy Visualization**: Show relationships between orgs → locations → categories → teams → positions.
- **Validation**: Strong form validation to ensure data consistency.

---

## Shared Design System

All management applications (Planner, Workforce) share a **Vanilla CSS Design System**:

- **CSS Variables**: Consistent theming across apps
- **CSS Modules**: Component-isolated styles
- **Dark Mode Ready**: Theme tokens support future dark mode implementation
- **Accessibility**: WCAG 2.1 AA compliance target

The design system is defined in each app's `src/app/globals.css`.

---

## Schema Integration

The UI maps to the following core entities:

| Entity | Description | Primary App |
|:-------|:------------|:------------|
| `AllocationRun` | The umbrella for a specific preferencing cycle | Planner |
| `JobLine` | A sequence of rotations that a worker is preferencing | Planner |
| `Rotation` | A specific clinical placement within a job line | Planner |
| `Preference` | The worker's ranking and qualitative rating | Preferencer |
| `Location`, `Team`, `Position` | Organizational structure | Workforce |
| `Match Result`, `Constraint` | Allocation outcomes and rules | Allocator |
| `Audit Log` | Decision justification trail | Allocator |

---

## Related Documentation

- [Receptor Preferencer UI Design](./frontend-apps/receptor-preferencer-ui-design) — Detailed mockups and specifications
- [My Preferences Microservice](../projects/my-preferences-microservice) — Technical specification
- [Architecture Design](./architecture) — Overall system architecture
