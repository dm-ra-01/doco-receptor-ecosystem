# Gold Standard: State Management & GraphQL for Receptor Ecosystem

## Overview

This document defines the "Gold Standard" architectural model for state
management across all Receptor ecosystem frontend applications. This model
prioritizes minimalism, strict type safety, offline resilience, and
high-performance UX.

---

## 1. Core Principles

1. **Single Source of Truth (Server State)**: All domain data must reside in the
   **Urql Graphcache**. Avoid synchronizing server data into external stores
   (Redux, Zustand) unless a specific transactional drafting requirement exists.
2. **Minimalist UI State**: Use **React Context** sparingly for high-level UI
   concerns (current organization, current path, cross-component signaling).
3. **Unified Data Layer**: Standardize on **100% GraphQL** using Supabase's
   pg_graphql. Deprecate REST implementations to enable a shared, normalized
   cache.
4. **Strict Type Safety**: Use `@graphql-codegen` to generate TypeScript types
   directly from the schema and `.graphql` documents. Use these types
   exclusively in service layers and providers.

---

## 2. Resilience: Offline Persistence

All applications must be configured for offline-first resilience to handle
intermittent network conditions in clinical settings.

- **Implementation**: Use `@urql/exchange-graphcache/default-storage` to enable
  **IndexedDB** persistence.
- **TTL**: Standardize on a **7-day** retention policy (`maxAge: 7`).
- **Defensive guards**: Always check for `window` and `indexedDB` existence to
  ensure compatibility with Node/JSDOM environments during testing.

---

## 3. UX: Optimistic UI & Performance

Perceived performance is critical. Users should never wait for a server
round-trip for standard CRUD operations.

- **Optimistic Updates**: Implement `optimisticResponse` for all high-frequency
  mutations (inserts, updates, deletes).
- **Cache Integrity**: Use the `updates` configuration in Graphcache to handle
  collection invalidation when inserting or deleting records, ensuring the UI
  remains consistent across different views.

---

## 4. Stability: Background Sync Protection

The **"Clobbering"** problem (background refetches overwriting active user
input) must be prevented by design.

- **The `isEditing` Pattern**:
  - Expose an `isEditing` boolean and `setIsEditing` function via feature
    providers (e.g., `PlanProvider`).
  - Pass this flag to the `pause` condition of underlying queries.
  - **Rule**: Queries must pause when `isEditing` is true.
  - **Rule**: Forms and complex selection UI must set `isEditing(true)` on mount
    and `isEditing(false)` on unmount/save.

---

## 5. Testing & Verification

Maintain a high standard for testability by following a network-layer mocking
strategy.

1. **MSW Integration**: Use Mock Service Worker to intercept and respond to
   GraphQL operations at the network level.
2. **Contract Testing**: Ensure mock data matches the generated types exactly.
3. **Adversarial Lenses**: Test for race conditions, intermittent network
   failures (offline mode), and input validation using the Six Adversarial
   Lenses.

---

## Summary Table

| Concern             | Gold Standard Recommendation   |
| :------------------ | :----------------------------- |
| **Primary State**   | Urql Graphcache (Normalized)   |
| **Secondary State** | React Context (UI-only)        |
| **Communication**   | 100% GraphQL                   |
| **Persistence**     | IndexedDB (makeDefaultStorage) |
| **Performance**     | Optimistic UI for all CRUD     |
| **Sync Safety**     | `isEditing` Query Pausing      |
| **Type Source**     | Schema-driven Codegen          |
| **Mocking**         | Network-layer (MSW)            |

---

## Implementation Example (client.ts)

```typescript
const storage =
    (typeof window !== "undefined" && typeof indexedDB !== "undefined")
        ? makeDefaultStorage({ idbName: "receptor-cache-v1", maxAge: 7 })
        : undefined;

const client = createClient({
    exchanges: [
        cacheExchange({
            schema,
            storage,
            optimistic: {
                updateMyRecord: (variables) => ({
                    __typename: "MyRecordMutationResponse",
                    records: [{
                        ...variables.set,
                        updatedat: new Date().toISOString(),
                    }],
                }),
            },
        }),
        fetchExchange,
    ],
});
```
