# Common Bond VM Environment

This environment is designed to contain core infrastructure and management tools without interfering with day-to-day personal activities.

## Overview

- **Host Machine**: `SPACESHIP` (Windows 11)
- **Virtualization**: Hyper-V (Gen 2)
- **Guest OS**: Ubuntu 25.10
- **Hostname**: `common-bond`
- **RAM**: 4096 MB (Initial)

## Connectivity

Access to the environment is facilitated through the **Common Bond VMNet**. This ensures secure access from anywhere without exposing ports directly to the internet.

- **SSH Access**: via `cloudflared`
- **VNC Access**: via `cloudflared`
- **RDP Access**: via `xrdp` (connecting over `cloudflared` tunnel)

## Production Infrastructure (`docker-prod`)

The connectivity to this VM is managed by a dedicated Docker Compose setup located in `/home/ryan/hosting/docker-prod`.

### Cloudflared Tunnel
A Cloudflare tunnel is used to securely expose the SSH and RDP ports without opening them to the public internet. This tunnel runs as a container named `cloudflared-tunnel`.

**Setup Details:**
- **Location**: `/home/ryan/hosting/docker-prod/docker-compose.yml`
- **Network**: Uses an external bridge network called `common_bond_prod`.
- **Function**: Forwards traffic from specific hostnames (e.g., `common-bond.myjmoapp.com`) to internal services like SSH (port 22) and RDP (port 3389).

To start the connectivity services:
```bash
cd /home/ryan/hosting/docker-prod
docker compose up -d
```

:::info
The `common_bond_prod` network must be created manually before running the compose file:
```bash
docker network create common_bond_prod
```
:::

## Supabase CLI

The Supabase CLI is essential for managing both the legacy cloud instance (Rotator) and the new local Docker instance (Receptor). It allows for schema migrations, database linking, and running local development environments.

### Installation

For Linux (Ubuntu), the recommended way is to use the binary installation or `npm` (if Node.js is available).

**Using Binary (System-wide):**
```bash
curl -sSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | sudo tar -xz -C /usr/local/bin
```

**Using npm (Project-local or via npx):**
```bash
# Run without installing
npx supabase <command>

# Or install as a dev dependency in your project
npm install -D supabase
```

### Updating

To ensure you have the latest features and security fixes, keep the CLI updated.

**Updating Binary:**
Simply re-run the installation command to fetch the latest release:
```bash
curl -sSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz | sudo tar -xz -C /usr/local/bin
```

**Updating npm:**
```bash
# If installed as a dev dependency
npm install supabase@latest --save-dev

# If using npx, it will automatically use the latest version if not cached, 
# or you can force it:
npx supabase@latest <command>
```

## Local Development Lifecycle

To work on migrations or test the schema locally, use the following commands within the `enlocated_supabase_legacy` or `receptor-supabase` folders.

### Startup
```bash
npx supabase start
```
This starts the Supabase stack in Docker. If it's the first time, it will pull the necessary images.

### Stopping
```bash
npx supabase stop
```

### Resetting the Database
```bash
npx supabase db reset
```
**IMPORTANT**: This will drop the local database and re-initialize it using the migrations in `supabase/migrations` and the seed data in `supabase/seed.sql`.

### Post-Reset Configuration (Test Credentials)

After a `db reset`, the test user credentials and worker mappings often need to be manually re-configured for integration tests.

**1. Reset Passwords**
Use the `pgcrypto` extension to set a known bcrypt hash (e.g., for "password").

```sql
-- Run inside the container or via Studio SQL Editor
UPDATE auth.users 
SET encrypted_password = crypt('password', gen_salt('bf')), 
    email_confirmed_at = now() 
WHERE email IN ('test_user_admin@enlocated.com', 'test_user_worker@enlocated.com');
```

**2. Link Worker Records**
The `rotator_worker` app requires authenticated users to be linked to a worker record in `public.workers`.

```sql
-- Ensure a worker record exists and is linked to the correct auth user
INSERT INTO public.workers (id, firstname, lastname, email, linkeduser, linkedorg) 
VALUES (
    gen_random_uuid(), 
    'Admin', 
    'User', 
    'test_user_admin@enlocated.com', 
    '9d2292c0-ac23-4e86-a573-516b23fbf373', 
    (SELECT id FROM public.orgs LIMIT 1)
) ON CONFLICT (email) DO UPDATE SET linkeduser = EXCLUDED.linkeduser;
```

:::tip
You can execute these commands directly against the Docker container:
`docker exec -it receptor-dev-db-1 psql -U postgres -d postgres -c "SQL_COMMAND"`
:::

### Seeding Data
The `enlocated_supabase_legacy` project uses a curated seed file for development. Ensure `supabase/seed.sql` is correctly configured (it usually imports `supabase/seed_acacia.sql`).

## Usage

The CLI facilitates several critical workflows:
1. **Cloud Access**: Linking to the live Supabase cloud instances (e.g., Rotator: `pkuvchrjppzfjsfjbcks`).
2. **Local Development**: Spinning up a local Supabase stack in Docker for testing.
3. **Migrating**: Moving data and schema between instances.

## Purpose

The `common-bond` instance serves several key functions:

1. **Google Antigravity**: Hosting the agentic AI coding assistant environment.
2. **SSH Server**: Providing a secure entry point for remote management.
3. **Docker Server**: Running containerized services and applications.
4. **Asset Management**: Centralized management of "Common Bond" project assets in an isolated environment.

:::info TODO
- [ ] Document specific `cloudflared` configuration for SSH/VNC.
- [ ] Detail Docker container list and roles.
:::

:::tip Success Tip
Using Hyper-V Gen 2 with Ubuntu provides better performance and support for UEFI secure boot.
:::
