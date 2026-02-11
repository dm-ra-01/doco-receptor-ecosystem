---
sidebar_position: 1
---

# Receptor Preferencer (Worker App)

The **Receptor Preferencer** is the primary interface for healthcare workers participating in the rotation process.

> **Implementation**: Desktop and Mobile interfaces are live with real-time Supabase integration. See [My Preferences Microservice](/docs/projects/my-preferences-microservice) for technical specifications.

## User Tasks & Capabilities

The following tasks are supported to ensure a seamless and efficient preferencing experience for healthcare workers.

### ❤️ The Three-Step Workflow
To manage the complexity of ranking up to 140 job lines, the Preferencer utilizes a structured three-phase workflow:

1.  **Phase 1: Sentiment Discovery (Specialties)**  
    Users sort high-level specialties and teams into five sentiment buckets using a drag-and-drop interface. This establishes the worker's clinical and professional interests.
2.  **Phase 2: Job Line Evaluation (Attractiveness)**  
    The system calculates a "Job Line Attractiveness Score" by cross-referencing Phase 1 sentiments with the specific rotations in each line. Users then refine these automated scores by sorting job lines into their own sentiment buckets.
3.  **Phase 3: Deep Ranking (1-to-n)**  
    Inside each bucket, users perform a final vertical drag-and-drop to establish an absolute 1-to-n priority list, which serves as the final input for the Allocator engine.

### 🧠 Intelligence & Safety
- **Attractiveness Engine**: Normalizes sentiments to highlight the most compatible job lines immediately.
- **Conflict Set Detection**: Prompts users to review "mixed signals" (e.g., a "Loved" specialty inside a "Disliked" job line) to ensure data integrity.
- **Power User Matrix**: Allows global blacklisting of specific hospital-specialty combinations.
- **Submission Guardrails**: Requires an **X-positive line minimum** to ensure robust allocation results. The system calculates the required depth based on the total available pool (e.g., for a 50+ job line run, a 12-positive minimum is typically enforced to prevent allocation failure).

### 📤 Submission & Status
- **Status Tracking**: Monitor the preferencing window with real-time countdowns and status indicators (Open/Submitted/Locked).
- **Submission Confirmation**: Finalize preferences with a clear summary and confirmation screen.
- **Edit/Retract**: Modify or retract submissions at any time before the organization locks the window.

### 📋 Post-Allocation
- **Allocation View**: Access final match results and detailed rotation schedules once the cycle is complete.
- **Profile Management**: Maintain professional qualifications and contact details ensuring accurate payroll and compliance data.

---

## Technical Progress & Stories

Implementation of these features is tracked via the detailed **[User Story Registry](./receptor-preferencer-user-stories)**.

## Preference Levels

Workers express their preferences using a simple 5-level system:

| Level | Icon | Description |
|:------|:-----|:------------|
| **Love** | ❤️ | Strong preference - will be prioritized in matching |
| **Like** | 👍 | Positive preference |
| **Neutral** | ➖ | No strong feelings either way |
| **Dislike** | 👎 | Would prefer to avoid if possible |
| **Never** | 🚫 | Cannot accept under any circumstances |

:::info TODO
- [x] Complete Receptor Preferencer worker-facing UI.
- [x] Implement live data integration with Supabase.
- [ ] Implement magic link invitation system.
- [ ] Add PWA support for "Add to Home Screen".
:::

:::tip Success Tip: Mobile-First is a Must
Healthcare workers rarely have time to sit at a desk. Ensure the Preferencer app is perfectly responsive and lightning-fast on mobile devices. If a worker can't submit their preferences in under 2 minutes during a coffee break, usage rates will drop.
:::

## User Interface Goals
- **Mobile First**: Designed for use "on the ward" during brief breaks.
- **Clarity**: High-contrast UI with clear ranking indicators.
- **Feedback**: Instant confirmation of preference submission with optimistic updates.
- **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support.
## Performance Goals
- **Performance**: First Contentful Paint under 1.2 seconds on 4G networks.

## Testing Suite

The Preferencer app includes a dedicated connectivity test suite to ensure reliable integration with the Supabase backend.

- **Automated Tests**: Powered by Vitest.
- **Connectivity Validation**: Verifies worker authentication and database access across the `orgs` schema.
- **Data Integrity**: Includes automated record creation and pre-test data cleanup hooks.

To run the tests:
```bash
cd frontend/preference-frontend
npm test
```



## Repository Context

- **Repository**: [preference-frontend](https://github.com/dm-ra-01/preference-frontend)
- **Port**: `http://localhost:3000` (development)

## Related Documentation

- [**UI/UX Design Mockups**](./receptor-preferencer-ui-design) - Visual designs and component specifications
- [My Preferences Microservice Design](../../projects/my-preferences-microservice) - Full technical specification
- [UI/UX Plans](../ui-ux-plans) - Overall design system
- [Frontend Redevelopment](../../projects/frontend-redevelopment) - Admin app development
