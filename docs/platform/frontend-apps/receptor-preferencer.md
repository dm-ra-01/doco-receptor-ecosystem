---
sidebar_position: 1
---

# Receptor Preferencer (Worker App)

The **Receptor Preferencer** is the primary interface for healthcare workers participating in the rotation process.

> **Implementation**: Desktop and Mobile interfaces are live with real-time Supabase integration. See [My Preferences Microservice](/docs/projects/my-preferences-microservice) for technical specifications.

## Key Tasks
- **View Rotations**: Browse upcoming rotation cycles and their durations.
- **Job Line Discovery**: Search and filter available job lines based on specialty, location, or team.
- **Preference Submission**: Rank job lines using the 5-level preference system (Love/Like/Neutral/Dislike/Never).
- **Status Tracking**: View preferencing window status (Open/Submitted/Closed) with countdown timer.
- **Profile Management**: Update contact information and professional qualifications.
- **Allocation View**: Clear display of the final matching results and schedule.

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
