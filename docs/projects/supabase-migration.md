---
sidebar_position: 2
---

# Project 1: Supabase Migration

Migration from **enlocated_supabase** (cloud-hosted) to **receptor-supabase** (self-hosted Docker).

:::warning
This is a **fresh start** migration, not a sync. The new environment uses a refined schema based on `enlocated_supabase_legacy` as the reference baseline. 
:::

## Project Status

| Component | Status | Notes |
|:----------|:-------|:------|
| Schema Refactoring | 🟡 In Progress | Rebuilt as declarative schemas in `supabase/schemas`. |
| Auth Functions | 🔴 Not Started | |
| Email Configuration | 🔴 Not Started | |
| Seed Data Migration | 🔴 Not Started | |
| Validation Plans | 🔴 Not Started | |

---

## Sub-Tasks

### 1. Schema Refactoring

**Source**: `supabase/schemas` (declarative) and `supabase/migrations` (CLI tracked)

**Tasks:**
- [x] Convert monolith `schema.sql` to declarative schema files
- [x] Organize schema by numeric ordering and domain (01..11)
- [x] Generate initial migrations from declarative state using `db diff`
- [x] Redesign `setup.sh` to remove legacy migration logic
- [ ] Audit all table definitions for deprecated patterns
- [ ] Review and update foreign key relationships
- [ ] Verify extension compatibility with Docker image
- [ ] Document schema changes from cloud version

**Key entities (now in `10_references` and `03_tables`):**
- `workers` — Core worker records
- `allocations` — Job allocations (various tables)
- `preferences` — Worker preferences (various tables)
- `teams` / `positions` — Organizational structure

---

### 2. Auth Functions Migration

Migrate OAuth provider configurations from Supabase Cloud to self-hosted GoTrue in **receptor-supabase**.

**Configuration files:**
- `supabase-receptor/utils/setup.sh`: OAuth provider setup automation
- `supabase-receptor/setup.conf`: Provider credentials (gitignored)

**Tasks:**

#### Google OAuth
- [ ] **Obtain Credentials**: Get `CLIENT_ID` and `SECRET` from GCP Console
- [ ] **Update Config**: Add to `setup.conf`:
  ```bash
  GOTRUE_EXTERNAL_GOOGLE_ENABLED=true
  GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=...
  GOTRUE_EXTERNAL_GOOGLE_SECRET=...
  ```
- [ ] **Update Setup Script**: Ensure `setup.sh` exports these vars to `.env`
- [ ] **Verify**: Login via `http://localhost:8000`

#### Apple Sign-In
- [ ] **Obtain Credentials**: Get `CLIENT_ID` (Service ID), `KEY_ID`, `TEAM_ID`
- [ ] **Secret Key**: Place `.p8` file in `supabase-receptor/receptor-supabase/certs/`
- [ ] **Update Config**: Add to `setup.conf`
- [ ] **Validation**: Verify JWT generation logic in GoTrue

#### Common Actions
- [ ] **Redirect URLs**: Update Allowed Redirect URLs in GoTrue config to include:
  - `http://localhost:3000/auth/callback` (Next.js)
  - `io.supabase.flutter://auth/callback` (Flutter)

---

### 3. Email Configuration

**Source**: `setup.conf` (generated locally, gitignored)

**Tasks:**
- [ ] Configure SMTP settings in `setup.conf`
- [ ] Set up email templates for:
  - [ ] Password reset
  - [ ] Email confirmation
  - [ ] Magic link login
- [ ] Test email delivery in local environment
- [ ] Document mail server requirements for production

**Current SMTP configuration pattern:**
```bash
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_SENDER_NAME="Receptor"
```

---

### 4. Seed Data Migration

**Source**: `seed_acacia.sql` (within `receptor-supabase`)

**Tasks:**
- [ ] Review seed data for PII or sensitive information
- [ ] Adapt seed SQL for Docker environment
- [ ] Create test-specific seed variants
- [ ] Verify seed data populates correctly via `utils/migrate.py`
- [ ] Document seed data structure (Acacia dataset)

**Seed data includes:**
- Organizations, teams, locations
- Workers and positions
- Allocation plans and runs
- Qualification tags and mappings

---

### 5. Validation Plans

**Tasks:**
- [ ] Define acceptance criteria for each component
- [ ] Create validation SQL scripts
- [ ] Cross-reference with [Project 2: Test Code Review](./test-code-review)
- [ ] Document rollback procedures
- [ ] Create migration checklist

**Validation checkpoints:**
1. ✅ All services healthy (`docker ps`)
2. ✅ Studio accessible on port 8001
3. ✅ Auth endpoints responding
4. ✅ PostgREST queries return data
5. ✅ Flutter test suite passes against new backend

---

## Reference Documentation

- [Legacy to New Migration Guide](../infrastructure/legacy-to-new-migration)
- [Technical Specs](https://github.com/dm-ra-01/supabase-receptor/blob/main/specs.md)
- [Setup Script](https://github.com/dm-ra-01/supabase-receptor/blob/main/utils/setup.sh)
- [Migration Script](https://github.com/dm-ra-01/supabase-receptor/blob/main/utils/migrate.py)
