# Troubleshooting & Maintenance

This guide provides solutions for common issues encountered when setting up or maintaining the Receptor infrastructure.

## Supabase Self-Hosted Issues

### 1. Connection Refused (Port 8000)
- **Symptom:** Unable to access the Supabase dashboard or API.
- **Cause:** Docker containers may not be running or the network failed to create.
- **Fix:**
  ```bash
  docker compose ps
  # If containers are down:
  docker compose up -d
  ```

### 2. Invalid JWT Secret
- **Symptom:** PostgREST or Auth services fail to start, or API requests return `401 Unauthorized`.
- **Cause:** `JWT_SECRET` in `.env` doesn't match the one used to sign `ANON_KEY` or `SERVICE_ROLE_KEY`.
- **Fix:** Re-run the `setup.sh` script or manually verify that the keys were generated using the same secret.

### 3. Database Migration Failures
- **Symptom:** `supabase migration up` fails with "relation already exists" or "column does not exist".
- **Cause:** Schema divergence between local and cloud, or partially applied migrations.
- **Fix:**
  - Check `supabase_migrations.schema_migrations` table to see which migrations have been applied.
  - If necessary, reset the local database: `docker compose down -v` (Warning: deletes data).

### 4. Failed to Load Schemas (Studio)
- **Symptom:** Supabase Studio logins succeed but show errors like "Failed to load schemas" and "password authentication failed for user 'supabase_admin'".
- **Cause:** PostgreSQL role passwords in the database volume are out of sync with the `POSTGRES_PASSWORD` in `.env`. This happens if the password is changed after the initial project bootstrap.
- **Reference:** [Supabase Issue #40725](https://github.com/supabase/supabase/issues/40725)
- **Fix:**
  - The `setup.sh` script includes a patch for `roles.sql` to handle this during initial setup.
  - If it occurs in an existing environment, you can manually reset the passwords by running:
    ```bash
    ./utils/RESET_setup.sh --project-name <NAME> [OPTIONS]
    ```
    (Warning: This deletes all database data).

### 5. Edge Functions / Auth Broken Locally
- **Symptom:** Authentication flows fail with "Unsupported provider" or "Connection Refused" to the `edge_runtime` service.
- **Cause:** The `supabase_edge_runtime` container is stopped or failed to initialize, which blocks the local `auth` function.
- **Fix:**
  ```bash
  docker ps -a | grep edge_runtime
  # If status is not 'Up':
  docker start supabase_edge_runtime_supabase-receptor
  ```

### 6. Stuck on "Finalizing Session"
- **Symptom:** After logging in via the Edge Function, the frontend hangs on a screen saying "Finalizing session".
- **Cause:** In Next.js applications, the `supabase.auth.onAuthStateChange` listener may miss the initial `#access_token` fragment if the client-side instance is initialized too late or if a layout wrapper (like a sidebar) causes a hydration mismatch that resets the auth state.
- **Fix:** 
  1. Ensure the callback page (`/auth/session`) is excluded from global layout wrappers that contain auth-guarded components.
  2. Implement manual fragment parsing in the `/auth/session` page to explicitly call `supabase.auth.setSession()` if the automatic detection fails.
  3. See `preference-frontend/src/app/auth/session/page.tsx` for the reference implementation.

## Common Bond VM Issues

### 1. SSH "Connection Refused"
- **Cause:** SSH service stopped or UFW blocking port 22.
- **Fix:** Use the VM console to run `sudo systemctl restart ssh`.

### 2. Docker Permission Errors
- **Cause:** Current user is not in the `docker` group.
- **Fix:**
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```

### 3. VS Code "ENOSPC" Error (Large Workspace)
- **Symptom:** "Visual Studio Code is unable to watch for file changes in this large workspace" or error `ENOSPC`.
- **Cause:** The number of files in the workspace (including `node_modules`, `.git`, and external repositories) exceeds the system's inotify watcher limit (default `65536`).
- **Fix (Recommended):** Configure VS Code to exclude bloated directories from the file watcher by creating/editing `.vscode/settings.json` in the root of your development folder:
  ```json
  {
    "files.watcherExclude": {
      "**/node_modules/**": true,
      "**/supabase-launchpad/supabase/**": true,
      "**/dist/**": true,
      "**/build/**": true,
      "**/receptor-dev/volumes/db/data/**": true
    }
  }
  ```
- **Fix (Alternative):** Increase the system limit (requires sudo):
  ```bash
  echo "fs.inotify.max_user_watches=524288" | sudo tee /etc/sysctl.d/99-vscode-inotify.conf
  sudo sysctl --system
  ```

## Maintenance Tasks

### Backup Database
Recommended daily:
```bash
docker exec receptor-db pg_dumpall -U postgres | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Updating Images
To pull the latest Supabase images:
```bash
docker compose pull
docker compose up -d
```
