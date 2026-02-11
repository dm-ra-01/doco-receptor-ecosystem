# Legacy to New Migration

This guide outlines the transition from the legacy Supabase Cloud project to the new, self-hosted Docker environment. This transition represents a significant rewrite of both the backend infrastructure and the frontend (now Next.js).

## Context of the Rewrite

- **No Syncing:** We are NOT syncing data or schema changes from the cloud project to the local project. This is a fresh start.
- **Improved Schema:** The schema in `enlocated_supabase_legacy/supabase/schema.sql` and the associated migrations serve as the reference baseline for the new Docker environment.
- **Frontend Shift:** The new Next.js frontend is designed to interact with this specific self-hosted Supabase configuration.

## Key Differences

| Aspect | Legacy (Cloud) | New (Docker/Self-Hosted) |
| :--- | :--- | :--- |
| **Hosting** | Supabase Managed | Self-hosted via Docker Compose |
| **Environment** | Cloud Dashboard | Local CLI & Studio |
| **Frontend** | Old Architecture | New Next.js App |
| **Authentication** | Managed GoTrue | Self-hosted GoTrue with local SMTP |

## Compatibility Audit

Ensure your local Docker environment matches the Cloud capabilities.

### Postgres Version
- **Cloud**: Typically Postgres 15.x or 16.x.
- **Docker**: The current setup uses `supabase/postgres:15.8.1.085`.
- **Action**: Verify your cloud project version in `Settings > Infrastructure`.

### Extensions Mapping
The following extensions must be available in the Docker image:

| Extension | Purpose | Schema |
| :--- | :--- | :--- |
| `pg_net` | HTTP requests from SQL | `extensions` |
| `pgsodium` | Encryption / Vault support | `pgsodium` |
| `http` | HTTP client for SQL | `public` |
| `pg_graphql` | GraphQL support | `graphql` |
| `supabase_vault` | Secrets management | `vault` |
| `pgcrypto` | Cryptographic functions | `extensions` |
| `pgjwt` | JWT handling | `extensions` |
| `uuid-ossp` | UUID generation | `extensions` |

## Environment Variables Mapping

| Cloud Setting (Dashboard) | Docker `.env` Variable | Description |
| :--- | :--- | :--- |
| Project URL | `API_EXTERNAL_URL` | e.g., `http://localhost:8000` |
| API Keys (anon) | `ANON_KEY` | Must be re-generated or copied |
| API Keys (service_role) | `SERVICE_ROLE_KEY` | Must be re-generated or copied |
| JWT Secret | `JWT_SECRET` | Critical for token verification |
| SMTP Host | `SMTP_HOST` | Local default is `supabase-mail` |
| Site URL | `SITE_URL` | Your frontend application URL |
| Database Password | `POSTGRES_PASSWORD` | Used for all internal service connections |

:::danger
If moving encrypted data (Vault/pgsodium), ensure the keys match or re-encrypt data.
:::

## Migration Steps

### 1. Schema Baseline
The baseline for the new environment is established using the `schema.sql` file (full dump) and supplementary migrations in `supabase/migrations/`. The source of truth for these files is the **declarative schema** defined in `supabase/schemas/`.

### 2. Manual Data Porting
If specific data needs to be moved from the legacy system, it should be done carefully via SQL export/import, ensuring it aligns with the updated schema structure.

### 3. Verification of Triggers & Functions
While the schema is ported, many functions and triggers have been updated and are now organized by domain in `supabase/schemas/05_functions` and `supabase/schemas/07_triggers`.

- [ ] Ensure local Docker health checks pass before running migrations.
- [ ] Backup any local data before re-initializing the schema.

## Migration Testing Strategy

To ensure a robust transition, we leverage existing test infrastructure and follow a multi-stage verification process.

### Phase 1: Legacy Baseline
1. **Leverage Rotator Tests**: Use existing Dart test code in `rotator_worker/test` (e.g., `seed.dart`).
2. **Verify Against Dev**: Run these tests against the `enlocated_supabase_legacy` development environment to establish a working baseline.

### Phase 2: Receptor Validation
1. **Schema Population**: Populate the refactored schema into the `receptor-supabase` instance.
2. **Compatibility Verification**: Run the established Dart tests against the `receptor-supabase` environment.
3. **Fix & Refine**: Address any schema mismatches or logic changes discovered during testing.

### Phase 3: Next Phase
1. **TDD for Frontend**: Once the backend is verified, transition to Test Driven Development (TDD) for extending the `preference-frontend`.
2. **Integration Testing**: Verify the full stack from Next.js to the self-hosted Supabase instance.

## Pitfalls to Avoid

- **Incremental Sync Attempts:** Do not use `supabase db pull` against the legacy cloud project to update the new environment, as schema differences may cause conflicts.
- **Assuming Feature Parity:** Some Supabase Cloud features may require different manual interaction in the self-hosted Studio.

---

## Technical Reference: Manual Data Porting

While a "fresh start" is recommended, use these protocols if you must move data.

### Option A: Supabase CLI
```bash
supabase login
supabase link --project-ref your-project-ref
supabase db pull
supabase db push
```

### Option B: Raw PostgreSQL Dump
```bash
# Export from Cloud
pg_dump "postgres://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" \
  --clean --if-exists --quote-all-identifiers \
  --exclude-table-data 'storage.objects' \
  -f cloud_dump.sql

# Import to Docker
docker exec -i receptor-dev-db-1 psql -U postgres < cloud_dump.sql
```

### Storage Migration
1. **Copy Files**: Transfer files from Cloud buckets to `./volumes/storage`.
2. **Sync Metadata**: Ensure `storage.buckets` and `storage.objects` tables are migrated.
