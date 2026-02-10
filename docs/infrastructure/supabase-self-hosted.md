# Supabase Self-Hosted Setup

This guide details the configuration for the self-hosted Supabase instance used by Receptor.

## Prerequisites

Before setting up Supabase, ensure that Docker and the Docker Compose plugin are installed on your system.

```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

## Domains

- **API/Supabase**: `api.commonbond.au`
- **Frontend**: `receptor.commonbond.au`

## Production Networking

For production, all Supabase services should run on a dedicated Docker network to isolate traffic and manage DNS within the container ecosystem.

### Create Network
```bash
docker network create --driver bridge receptor-prod
```

This network should be referenced in your `docker-compose.yml`:
```yaml
networks:
  receptor_net:
    name: receptor-prod
    external: true
```

## Automated Setup

The preferred way to set up the Supabase environment is using the `setup.sh` script located in the `supabase-receptor` repository. This script automates key generation, network creation, and `docker-compose.yml` customization.

### 1. Configure `setup.conf`

Before running the setup script, copy the template and edit it with your environment details:

```bash
cd ~/development/supabase-launchpad/receptor-supabase
cp setup.conf.example setup.conf
nano setup.conf
```

Refer to the [Configuration Guide](./config-guide.md) for detailed descriptions of these variables.

### 2. Run Setup Script

Run the modularized setup script. By default, it will automatically start Docker containers and apply migrations:

```bash
./setup.sh --project-name receptor-dev --env dev
```

#### Mandatory Configuration
- `--project-name <NAME>`: The name of the project folder (e.g., `receptor-dev`).
- `--env <dev|test|staging|prod>`: Sets the configuration context. 

:::info Secrets Prompt
In `staging` and `prod` environments, the script will interactively prompt for `JWT_SECRET` and `POSTGRES_PASSWORD` if they are not already set as environment variables.
:::

#### Optional Flags

You can customize the automation behavior using the following flags:

- `--no-docker-compose`: Skips starting the Docker containers.
- `--skip-migration`: Skips running the `migrate.py` script.
- `--skip-seed`: Runs migrations but skips applying the seed data (e.g., `seed_acacia.sql`).

#### What the script does:
- Creates the Docker network (default: `receptor_dev_net`).
- **Orchestrates folder structure**: Clones the official Supabase repository and creates the project folder (`receptor-dev`) within the **parent directory** (`supabase-launchpad`).
- Generates secure random keys and secrets.
- **Patches roles.sql**: Automatically sets the `search_path` for all Supabase roles (`authenticator`, `authenticated`, `postgres`, `supabase_auth_admin`, etc.) to include the `extensions` schema.
- **Customizes docker-compose.yml**: Injects the `PGRST_DB_EXTRA_SEARCH_PATH` environment variable into PostgREST and configures the `functions` service with necessary volumes and environment variables for Edge Functions.
- Injects custom configurations into `.env`.
- **(New)** Starts Docker containers (`docker compose up -d`).
- **(New)** Provides next steps for running migrations via `./utils/cli.sh`.

### 3. Manual Steps (If skipped)

If you used the skip flags, you can run the steps manually:

```bash
# Start containers
cd receptor-dev
docker compose up -d

# Run migrations (using the CLI wrapper in supabase-receptor)
cd ../supabase-receptor
./utils/cli.sh db reset
```

## Key Configuration Variables

Beyond standard Supabase variables, the following are injected for Receptor compatibility:

| Variable | Source | Purpose |
| :------- | :----- | :------ |
| `PGRST_DB_EXTRA_SEARCH_PATH` | `setup.sh` | Adds `extensions` to PostgREST search path. |
| `CLOUDFLARED_TUNNEL_TOKEN` | `setup.conf` | Token for the integrated Cloudflare Tunnel service. |
| `POOLER_TENANT_ID` | `setup.sh` | Randomized tenant ID for Supavisor pooling. |

## Management & Troubleshooting

### Viewing Logs
```bash
docker compose logs -f
```

### Resetting the Environment
If you need to start from scratch, use the `RESET_setup.sh` script in the `utils/` folder. This script will safely stop containers, clean up data volumes (including root-owned files), and re-run the setup:

```bash
./utils/RESET_setup.sh --project-name <NAME> --env <ENV> [OPTIONS]
```

#### Optional Flags

- `--skip-setup`: Stops after stopping containers and cleaning up the project directory. Does not automatically run `setup.sh`. This is useful for manual troubleshooting or when you need to change configurations before re-initializing.
- `--help`: Displays usage information and exits.
:::warning
This will delete all existing data in your local database.
:::

## Using the Supabase CLI

The `setup.sh` script automatically adds a containerized `supabase-cli` service to the Docker Compose stack. This allows you to run CLI commands without needing to install the CLI on your host machine.

### Syntax
Because the service uses an entrypoint, you should **omit** the `supabase` command from your arguments. It is also recommended to use the `--rm` flag to remove the container after the command completes.

**General Command:**
```bash
docker compose run --rm cli <subcommand> [flags]
```

### Examples

**List available commands:**
```bash
docker compose run --rm cli help
```

**List database migrations:**
```bash
docker compose run --rm cli migration list
```

**Generate TypeScript types:**
```bash
docker compose run --rm cli gen types typescript --local > types.ts
```

### How it works
The service uses the `node:20-slim` image and executes the CLI via `npx`. The first time you run a command, it will download the latest version of the Supabase CLI into the container.

## Service Configuration Checklists

### 1. SMTP Server (Email)
To enable authentication emails (confirmation, password reset), configure the following in `.env`:
- `ENABLE_EMAIL_SIGNUP=true`
- `SMTP_HOST`: e.g., `smtp.sendgrid.net` or `smtp.clicksend.com`
- `SMTP_PORT`: Usually `465` (SSL) or `587` (TLS)
- `SMTP_USER`: Your service username (e.g., `apikey` for SendGrid)
- `SMTP_PASS`: Your service API key
- `SMTP_SENDER_NAME`: `Receptor`
- `SMTP_ADMIN_EMAIL`: `noreply@commonbond.au`

### 2. OAuth Providers
#### Google Auth
1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Configure OAuth consent screen.
3. Create OAuth 2.0 Client ID for a Web Application.
4. Set Redirect URI: `https://api.commonbond.au/auth/v1/callback`
5. Update `.env`:
   - `GOTRUE_EXTERNAL_GOOGLE_ENABLED=true`
   - `GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID=your-client-id`
   - `GOTRUE_EXTERNAL_GOOGLE_SECRET=your-client-secret`

#### Apple Auth
1. [Configure Sign in with Apple](https://developer.apple.com/sign-in-with-apple/get-started/) in the Apple Developer Portal.
2. Update `.env`:
   - `GOTRUE_EXTERNAL_APPLE_ENABLED=true`
   - `GOTRUE_EXTERNAL_APPLE_CLIENT_ID=com.commonbond.receptor`
   - `GOTRUE_EXTERNAL_APPLE_SECRET=your-p8-key-content`

### 3. Logflare Analytics
1. Sign up at [Logflare](https://logflare.app/).
2. Create a new source and get your API Key.
3. Update `.env`:
   - `LOGFLARE_PUBLIC_ACCESS_TOKEN=your-token`
   - `LOGFLARE_PRIVATE_ACCESS_TOKEN=your-private-token`

### 4. Edge Functions & Centralized Authentication
The `auth` Edge Function serves as the central identity provider (IdP) for the platform.

- **Login Flow**:
  - The function validates credentials and generates a secure, short-lived authorization code.
  - Users are redirected to the frontend callback URL with `?code=<auth_code>`.
  - The frontend exchanges this code server-side for a session using the `/exchange` endpoint.
- **Session Management**:
  - Requires the `secure` schema in the database to store authorization codes.
  - **Database URL**: Use the internal Docker network URL: `postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/postgres`.
- **Session Recognition**:
  - The function automatically detects an existing session if the `Authorization` header or session cookie is present.
  - If authenticated, it serves a "Logged In" status page instead of the login form.
- **Sign Out**:
  - The "Logged In" page provides a "Sign Out" option (triggered by `?action=logout`) which invalidates the session and returns the user to the login screen.

## Deployment & Persistence

### Storage
Supabase Storage uses the filesystem by default. Ensure the storage volume is persisted:
```yaml
storage:
  volumes:
    - ./volumes/storage:/var/lib/storage:z
```

### Backups
Implement a daily cron job to backup the Postgres database:
```bash
docker exec supabase-db pg_dumpall -U postgres | gzip > backup_$(date +%Y%m%d).sql.gz
```

:::tip Readiness Checklist
- [x] Configure RLS policies for all public tables.
- [ ] Set up automated backup script.
- [ ] Transition `edge-runtime` to [Immutable Atomic Images](./future-immutable-architecture.md).
- [ ] Finalize SSL termination via `cloudflared` or Nginx.
:::

## Deployment Strategies

### Current: Development/Bootstrap (Bind-Mounts)
The `setup.sh` script currently configures the environment using **Docker Bind Mounts**. This allows developers to modify code in `supabase/functions/` and see changes reflected instantly in the local or dev server runtime. This is the recommended approach for rapid iteration and bootstrapping new environments.

### Future: Production (Immutable Images)
For high-availability production environments, we are moving toward an **Immutable Architecture**. Instead of mounting local folders, we will build custom Docker images for our functions. See the [Future: Immutable Deployment Architecture](./future-immutable-architecture.md) guide for the roadmap.
