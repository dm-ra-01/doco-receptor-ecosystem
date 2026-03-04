# GraphQL Implementation & Testing Standard

## Overview

This document outlines the standardized approach to GraphQL implementation and
the associated testing framework within the Receptor ecosystem. This standard
ensures consistent data fetching, type safety, and robust verification across
all applications.

---

## 1. GraphQL Implementation Strategy

### **Tooling & Code Generation**

- **Engine**: We use **Supabase (pg_graphql)** as our backend GraphQL engine.
- **Type Safety**: `@graphql-codegen` is used to generate TypeScript hooks and
  types from `.graphql` files and the live schema.
- **Execution**: Run `npm run codegen` (or equivalent) to sync local types with
  schema changes. Never manually author GraphQL types for domain data.

### **The Urql Client**

Located in `src/lib/graphql/client.ts`.

- **Exchanges**:
  1. **`cacheExchange` (Graphcache)**: A normalized cache that handles data
     consistency and optimistic UI.
  2. **`authExchange`**: Manages Supabase JWT injection and automatic session
     refreshing.
  3. **`fetchExchange`**: The final network layer exchange.
- **Persistence**: Configured with `makeDefaultStorage` (IndexedDB) for offline
  resilience.

### **Service Layer Pattern**

- **Hooks**: Prefer using generated hooks (e.g., `useGetOrgPlansQuery`) directly
  in Providers.
- **Services**: Complex orchestrations or one-off mutations used outside of
  React lifecycle should reside in the service layer (`src/services/`),
  consuming direct `client.mutation` calls.

---

## 2. Testing Framework

Our testing strategy follows the **"Network-Layer Mocking"** paradigm to ensure
tests are resilient to internal implementation changes.

### **Core Toolchain**

- **Test Runner**: **Vitest** (configured with workspace segregation for unit
  vs. integration tests).
- **Network Mocking**: **Mock Service Worker (MSW)**. We mock the GraphQL API at
  the network boundary, not the React hooks or the Urql client.
- **Environment**: **JSDOM** for UI testing, simulating browser-like behavior.

### **MSW Mocking Patterns**

- Store mocks in `src/test/mocks/handlers.ts` or local test files using
  `graphql.query` and `graphql.mutation`.
- **Validation**: Ensure mock data adheres strictly to the generated GraphQL
  types.

### **Adversarial Testing Philosophy**

We apply the **Six Adversarial Lenses** to design our test cases:

1. **Input Validation**: Can the UI handle malformed or unexpected data from the
   API?
2. **Race Conditions**: What happens if two mutations occur simultaneously?
3. **Error States**: How does the UI respond to `CombinedError` or 500 status
   codes?
4. **Resilience**: Does the app function offline? (Enabled by IDB persistence).
5. **Boundaries**: Testing empty collections, large datasets, and extreme
   timeouts.
6. **Permission**: Ensuring UI reflects correct RLS-based access (mocked via JWT
   responses).

### **Test Wrapper Usage**

All UI tests must use the standardized `render` utility (usually in
`src/test/test-wrapper.tsx`) which provides the necessary `UrqlProvider`,
`OrgProvider`, and other context dependencies.

---

## Summary of Benefits

- **Resilience**: MSW tests actual network behavior, catching serialization and
  type mismatches.
- **Speed**: Vitest parallelization (enabled by workspace segregation) ensures
  fast feedback loops.
- **Clarity**: Separation of "How we fetch" (Urql) from "How we verify" (MSW)
  reduces test brittleness.
