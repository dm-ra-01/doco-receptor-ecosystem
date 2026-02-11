---
sidebar_position: 12
---

# Key Management Strategy

This document defines the strategy for managing cryptographic keys, API secrets, and infrastructure credentials for the Receptor platform.

## Secrets Tiering

To balance security with developer velocity, we categorize secrets into three tiers:

| Tier | Category | Examples | Lifecycle |
| :--- | :--- | :--- | :--- |
| **Tier 1** | **Infrastructure Core** | `JWT_SECRET`, `POSTGRES_PASSWORD`, `SERVICE_ROLE_KEY` | Generated once during project bootstrap; rotated only on security breach. |
| **Tier 2** | **Third-Party Logic** | `OPENAI_API_KEY`, `SMTP_PASS`, `CLOUDFLARED_TOKEN` | Managed via `setup.conf`; updated as service requirements change. |
| **Tier 3** | **Database Vault** | Encryption keys for PII (Personal Identifiable Information) | Managed internally by PostgreSQL `pgsodium` and `supabase_vault`. |

---

## 1. Development Workflow (Local)

For local development, ease of use is prioritized.

*   **Generation**: The `./utils/setup.sh` script automatically clones the Supabase Docker configuration and runs `generate-keys.sh`.
*   **Storage**: Keys are stored in the project directory (e.g., `receptor-dev/.env`).
*   **Persistence**: Once generated, the `setup.sh` script avoids overwriting existing keys if the `.env` file already exists, ensuring your local dev environment remains stable.

---

## 2. Production Workflow (Self-Hosted)

For production, we move away from manual generation toward **Injection**.

### Principle: "Injected, Never Stored"

In a production VM, the `setup.sh` script should act as an **aggregator** rather than a generator.

1.  **Environment Flag**: The script requires the `--env prod` or `--env staging` flag to activate production-grade security checks.
2.  **Environment Variables**: Core Tier 1 secrets should ideally be injected via the host shell environment (e.g., `export JWT_SECRET=...`). This is the preferred method for CI/CD.
3.  **Interactive Fallback**: If a Tier 1 secret is missing from the environment during a `staging` or `prod` setup, the script will **interactively prompt** the user to provide it securely.
4.  **Configuration**: Tier 2 secrets are defined in the production `setup.conf`.
5.  **Orchestration**: The `setup.sh` script detects existing environment variables. If a variable like `JWT_SECRET` is already set in the shell, it uses that value instead of generating a random one.

---

## 3. Recommended Secrets Vaults

While the platform is agnostic, we recommend the following for managing `setup.conf` and Tier 1 secrets:

*   **Bitwarden Secrets Manager**: A sensible choice for small teams. Can be integrated via CLI into the deployment script.
*   **Doppler**: Excellent for syncing secrets across `receptor-dev`, `receptor-stg`, and `receptor-prod`.
*   **GitLab Secrets**: Since the code is hosted on GitLab, using **CI/CD Variables** to inject Tier 1 secrets into the `setup.sh` run is the most sophisticated and automated approach.

---

## 4. Key Rotation Procedure

:::warning Critical
Rotating Tier 1 keys (like `JWT_SECRET`) will invalidate all current user sessions and break communication between Kong and the database until all services are restarted.
:::

1.  Update the secret in your vault/provider.
2.  Run `./utils/setup.sh --project-name receptor-prod --env prod`.
3.  Restart the stack: `docker compose restart`.
4.  Verify Edge Function connectivity (they rely on the `SERVICE_ROLE_KEY`).

---

:::info TODO
- [ ] Integrate Bitwarden/Doppler CLI support into `setup.sh`.
- [ ] Create a "Safe-to-Commit" version of `setup.conf` that pulls from environment variables.
:::
