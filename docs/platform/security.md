---
sidebar_position: 1
---

# Security & Permissions

Security is paramount in healthcare applications. Receptor leverages Supabase's native security features to ensure data isolation and integrity.

## Supabase RLS (Row Level Security)

New RLS policies are being developed to replace legacy configurations. The goal is to ensure:
- **Workers**: Can only see their own preferences, allocations, and relevant job lines.
- **Managers**: Can only see workers and rotations within their own organization (`org_id`).
- **Global Admins**: Have cross-organizational visibility but limited PII access.

:::info TODO
- [ ] Finalize Supabase RLS policies for worker data isolation.
:::

:::tip Success Tip: The Principle of Least Privilege
In healthcare, data leaks are often catastrophic. Start with **Restrictive RLS by default**. Only grant access to the specific rows and columns needed for a specific user role. It's much easier to loosen a policy later than it is to recover from a data breach.
:::

### Planned RLS Policies (Draft)

| Table | Policy Name | Description |
|-------|-------------|-------------|
| `workers` | `worker_self_access` | Allows a user to view/update their own worker record. |
| `preferences` | `worker_pref_access` | Restricts preference viewing to the owner. |
| `job_lines` | `org_job_access` | Limits job line visibility to workers in the same organization. |

## Authentication Flow
Receptor uses OAuth2 and Magic Links through Supabase Auth, streamlining the onboarding process for healthcare workers who may not have traditional corporate credentials.
