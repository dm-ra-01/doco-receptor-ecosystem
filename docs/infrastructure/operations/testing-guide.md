# Testing Guide

This guide details how to run automated tests for the Receptor project, covering both Flutter frontend and Supabase backend logic.

## Flutter Testing

Flutter tests are located in the `test/` directory of the `rotator_worker` repository.

### Prerequisites

- A running Supabase dev environment (see [Self-Hosted Setup](../environment/supabase-self-hosted.md)).
- Test credentials configured in `test_user_credentials.json`.

### Configuration: `test_user_credentials.json`

To avoid hardcoding credentials or passing long lists of `--dart-define` flags, use a JSON file.

**`test_user_credentials.json`** (gitignored, local only):
```json
{
  "TEST_ADMIN_EMAIL": "test_user_admin@enlocated.com",
  "TEST_ADMIN_PASSWORD": "your-password",
  "TEST_WORKER_ID": "188f23fe-ad4f-4f0b-9073-daaf4ca1b48c",
  "API_URL_OVERRIDE": "https://receptor-dev.yourdomain.com",
  "API_KEY_OVERRIDE": "your-anon-key"
}
```

### Running Tests

#### Using the `test.sh` Wrapper
The `rotator_worker` repository includes a `test.sh` script that simplifies the process by automatically passing the correct `--dart-define-from-file` and other necessary flags:

```bash
cd ~/development/rotator_worker
./test.sh [dart test arguments]
```

Example: Run a specific test by name:
```bash
./test.sh --plain-name 'Initiate AllocationDatabase and verify model'
```

#### Manual Execution
If you prefer running `flutter test` directly:

```bash
cd ~/development/rotator_worker
flutter test test/main_test.dart --dart-define-from-file=test_user_credentials.json
```

:::tip API Keys Change!
Every time you run `./utils/RESET_setup.sh --project-name <NAME>`, your Supabase instance generates **new** `ANON_KEY` and `SERVICE_ROLE_KEY` values. You **must** update the `API_KEY_OVERRIDE` in `test_user_credentials.json` with the new `ANON_KEY` printed at the end of the setup script.
:::

## Next.js Frontend Testing

Tests for the `preference-frontend` are located in `src/__tests__/`. We use **Vitest** for unit and integration testing.

### Prerequisites

- A running Supabase dev environment.
- Root `.env.local` configured with test admin credentials.

### Configuration: `.env.local`

The test suite uses a `SeedingService` to provision data, which requires the `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for administrative setup (like creating Organizations).

**`.env.local`**:
```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TEST_ADMIN_EMAIL=test_user_admin@commonbond.com
TEST_ADMIN_PASSWORD=your-password
```

### Running Tests

Run the full suite or specific test files:

```bash
cd ~/development/preference-frontend
npm test                                     # Full unit/integration suite (Vitest)
npm test src/__tests__/preferencing/context.test.ts  # Integration (Context Mapping)
npm test src/__tests__/preferencing/actions.test.ts  # Server Actions (Mocked)
npm test src/__tests__/components/PreferenceWorkflow.test.tsx  # Component UI
```

:::note E2E Exclusion
Unit tests (`npm test`) automatically exclude Playwright E2E files (mapped in `src/__tests__/e2e/`) to prevent conflicts between Vitest and Playwright test runners. Use `npm run test:e2e` for end-to-end browser verification.
:::

---

## E2E Testing (Playwright)

We use **Playwright** for end-to-end testing of the `preference-frontend`. These tests interact with the real Next.js application and the local Supabase instance.

### Prerequisites

- A running Supabase dev environment with the `edge_runtime` container healthy.
- Next.js development server running (`npm run dev`).
- Seed data applied (`./utils/cli.sh db reset`).

### Configuration: `.env.local`

Playwright tests use worker credentials to verify real-world user flows.

**`.env.local`**:
```bash
TEST_WORKER_EMAIL=test_user@commonbond.com
TEST_WORKER_PASSWORD=your-password
```

### Global Authentication Setup

To improve test efficiency, we use a `setup` project in Playwright that authenticates a user once and saves the storage state to `playwright/.auth/user.json`. Subsequent tests use this file to skip the login flow.

### Running E2E Tests

```bash
cd ~/development/preference-frontend
npm run test:e2e                     # Runs all E2E tests across all projects
npx playwright test --project=setup  # Re-runs only the authentication setup
npx playwright test --project=desktop-chrome  # Runs tests on Desktop Chrome
npx playwright test --project=mobile-safari   # Runs tests on iPhone 13 (Safari)
```

:::tip View Interactive UI
Use `npx playwright test --ui` to open the Playwright test runner with time-travel debugging and interactive screenshots.
:::

:::info Admin Auth vs Service Role
All frontend tests now use an authenticated admin session rather than bypassing RLS with a service role key. This ensures RLS logic (including database triggers) is consistently tested and that `auth.uid()` dependencies function correctly.
:::

:::warning Sequential Execution
When using authenticated seeding (which triggers database logic like `trigger_on_org_creation`), you **must** run E2E tests sequentially to avoid race conditions and unique constraint violations (e.g., `workers_email_key`).
- Use `--workers 1` when running Playwright locally.
- In `playwright.config.ts`, you can set `workers: 1` specifically for E2E project configurations.
:::

:::tip Complex Auth Flow & Playwright
Since the `preference-frontend` and `planner-frontend` use a custom "session handoff" flow (Edge Function → Redirect with Hash → Manual Finalization), Playwright tests that perform an initial login must wait for the `/auth/session` page to complete its task before assuming the user is logged in. The `setup` project in `playwright.config.ts` handles this by waiting for the dashboard to become visible.
:::

---

## Allocator Backend Testing (Python)

The `match-backend` repository contains a data-driven test suite designed for offline verification of the matching algorithm using `pytest`.

### Architecture

The tests are categorized into three levels:

1.  **Unit Tests (`test_models.py`, `test_preferences.py`)**: Isolated tests for core logic, rank conversions, and data model constraints.
2.  **Logic Tests (`test_solver.py`)**: Verification of solver behavior (capacity, eligibility, mandatory assignments) without file I/O.
3.  **Excel Ingestion Scenarios (`test_excel_ingestion.py`)**: End-to-end tests that verify the data-loading pipeline using real-world datasets like `input.xlsx`.

### Running Tests

```bash
cd ~/development/match-backend
# Run the full suite
python3 -m pytest

# Run with verbose capture to see match rates and dissatisfaction scores
python3 -m pytest allocator/tests/test_excel_ingestion.py -s
```

> [!TIP]
> **Avoid `--verbose`**: The CLI's `--verbose` flag is extremely noisy and intended for debugging the MILP model. Use the `-s` flag in `pytest` instead to see important metrics (Match Rate/Stats) without the solver logs.

### Interpreting Success

A "successful" test on a dataset like `input.xlsx` consists of three metrics:

*   **Match Rate**: Usually **100%**. This indicates the solver successfully assigned a job to every worker while respecting constraints.
*   **Dissatisfaction Scores**: Must match the "Gold Standard" values exactly. These are the objective measures of assignment quality.
*   **Match Consistency**: Even if dissatisfaction scores are identical, the specific allocations might differ if there are multiple equally optimal solutions. The test produces `output_test.xlsx` for manual sanity checks.

### Platform-Specific Workarounds (Apple Silicon)

The `mip` (Mixed-Integer Programming) library used for some solvers has known architecture conflicts on ARM64 Macbooks.

*   **Symptoms**: `NameError: name 'cbclib' is not defined`.
*   **Solution**: The test suite defaults to `OptimizeMethod.ABRAHAM_WORKER` or **OR-Tools (CP-SAT)**, which are architecture-independent and highly stable.

---

## Backend Regression Testing

### Migration Verification

Whenever you apply migrations, the `migrate.py` script ensures that the schema is consistent. If a migration fails, the script stops immediately to prevent a corrupted state.

### Seed Validation

To verify that the database is correctly seeded, you can run simple SQL checks via the Supabase Studio (`http://localhost:8001`) or `psql`:

```sql
SELECT count(*) FROM workers;
SELECT email FROM auth.users WHERE email = 'test_user_admin@enlocated.com';
```

---

## Database Testing (pgTAP)

We use **pgTAP** for unit testing PostgreSQL logic, Row Level Security (RLS) policies, and database triggers. These tests are located in `supabase/tests/database/`.

### Prerequisites

- A running Supabase dev environment.
- `pgtap` extension enabled (handled by `setup.sh`).

### Running Database Tests

Use the Supabase CLI to execute pgTAP tests:

```bash
cd ~/development/supabase-receptor
npx supabase test db                         # Run all database tests
npx supabase test db --path tests/database/32_functional_rls.test.sql  # Run specific test
```

### Key Test Categories

| Test File | Description |
|-----------|-------------|
| `11_security_policies.test.sql` | Verifies RLS is enabled on all tables. |
| `30_functional_privileges.test.sql` | Tests ACL rights and group-based access. |
| `32_functional_rls.test.sql` | Verifies data isolation (e.g., workers only see own data). |
| `33_functional_triggers.test.sql` | Tests database triggers and automation logic. |

:::tip Mocking Auth
Tests use a custom `auth.uid()` mock to simulate different user personas. See `32_functional_rls.test.sql` for implementation patterns using `set local test.auth_uid`.
:::

---

## Troubleshooting Tests

### 530 Domain Errors
If you see `statusCode: 530` or authentication fetch errors, it usually indicates that the Cloudflare Tunnel is not properly routing traffic to your local Supabase instance.
- Check tunnel logs: `docker compose logs tunnel`
- Verify `SUPABASE_PUBLIC_URL` in `.env`.

### Function Does Not Exist (`uuid_generate_v4`)
Ensure that the `extensions` schema is in the `search_path` for the role executing the query. This is handled automatically by `setup.sh` by configuring both the database roles and the PostgREST `PGRST_DB_EXTRA_SEARCH_PATH`. See [Database Initialization](../database/database-initialization.md) for more details.
