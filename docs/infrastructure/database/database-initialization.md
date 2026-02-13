# Database Initialization

This guide explains how to initialize the database for a new self-hosted Supabase instance using the **Supabase CLI** and declarative schema structure.

## Prerequisites

- A running Supabase instance (see [Self-Hosted Setup](../environment/supabase-self-hosted.md)).
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed locally.

## Initialization Workflow

The initialization process has been redesigned to leverage the native Supabase migration tracking system.

### 1. Environment Setup

Run the setup script to initialize the project folder, Docker containers, and environment variables:

```bash
cd ~/development/supabase-launchpad/receptor-supabase
./utils/setup.sh --project-name <NAME> --env dev
```

This prepares the `receptor-dev` folder with the necessary configuration but **does not** apply the schema or seed data.

### 2. Generate Initial Migration

Once the containers are healthy, generate a single migration file that represents your current declarative schema state:

```bash
# From the receptor-supabase directory
./utils/cli.sh db diff -f initial
```

This command compares the declarative files in `supabase/schemas` (if configured) or the difference between your local state and the running database, then generates a file in `supabase/migrations`.

### 3. Apply Schema and Seed Data

Use the `db reset` command to apply all migrations and populate the database:

```bash
# From the receptor-supabase directory
./utils/cli.sh db reset
```

The reset command will:
1. Drop the local database.
2. Re-create it from scratch.
3. Apply all migrations in `supabase/migrations`.
4. (Optional) Run any seeds defined in the Supabase configuration.

:::note E2E Test Preparation
The internal seed data includes specific mappings and workers required for the Playwright E2E test suite. Running `db reset` is the recommended way to prepare a clean test environment.
:::

---

## Declarative Development Workflow

1. **Modify Schema**: Edit files in `receptor-supabase/supabase/schemas/`.
2. **Commit Changes**: Use `db diff` to capture changes into a new migration file.
   ```bash
   ./utils/cli.sh db diff -f feature_name
   ```
3. **Verify**: Use `db reset` to ensure the schema can be built cleanly from the migration history.
4. **Reconcile**: Capture all applied changes into the top-level `schema.sql` to maintain a human-readable declarative baseline.
   ```bash
   ./utils/cli.sh db diff -f schema.sql --local
   ```

---

## Important: Role Search Path Configuration

In self-hosted environments, extensions (like `uuid-ossp`) are installed in the `extensions` schema. This is handled at the database level during the `setup.sh` phase by patching the project's `volumes/db/roles.sql` file.

Additionally, the `PGRST_DB_EXTRA_SEARCH_PATH` environment variable in `docker-compose.yml` ensures PostgREST sessions include the `extensions` schema.

---

## Legacy Workflow (Deprecated)

The `migrate.py` script is now deprecated. It remains in the `utils/` folder for reference but should not be used for new deployments.

---

## Critical Notes

- **One Source of Truth**: The `supabase/migrations` folder is now the definitive record of the database state.
- **CLI Wrapper**: Always use `./utils/cli.sh` to wrap `npx supabase` commands; this ensures the correct `--db-url` and local environment variables are applied.
