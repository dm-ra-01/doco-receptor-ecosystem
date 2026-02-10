---
sidebar_position: 2
---

# Database Functions & Business Logic

Receptor leverages PostgreSQL functions and triggers to handle core business logic within the Supabase environment. Functions are organized by domain in `supabase/schemas/05_functions/` and `supabase/schemas/09_rbac/`.

## Business Logic Functions

### Preferencing

| Function | Purpose | Inputs |
|----------|---------|--------|
| `func_allocation_run_submit_preferences()` | Finalizes and locks a worker's preference list | `mapping_id (uuid)` |
| `func_preference_job_line_move_up()` | Moves a job line up in a worker's ranking | `mapping_id`, `job_line_id` |
| `func_preference_job_line_move_down()` | Moves a job line down in a worker's ranking | `mapping_id`, `job_line_id` |
| `func_preferencing_finalise_match()` | Locks final allocation results | `allocation_run_id` |
| `func_preferencing_unfinalise_match()` | Unlocks allocation for re-processing | `allocation_run_id` |
| `func_release_allocations()` | Releases allocations to workers | `allocation_run_id` |
| `func_detail_worker_allocation_mappings()` | Returns detailed worker mapping info | `mapping_id` |
| `func_email_job_line_assignment()` | Sends assignment notification email | `worker_id`, `job_line_id` |

| `func_populate_allocation_run()` | Populates an entire allocation run hierarchy | `p_data (jsonb)` |

### Planning

| Function | Purpose | Inputs |
|----------|---------|--------|
| `func_create_allocation_plan()` | Initializes a new allocation plan with defaults | `org`, `name`, etc. |
| `func_check_allocation_plan_privilege()` | Checks if user has plan access | `plan_id`, `privilege` |
| `func_check_allocation_run_privilege()` | Checks if user has run access | `run_id`, `privilege` |
| `func_check_is_allocation_run_admin()` | Checks if user is run admin | `run_id` |
| `func_list_allocation_plan_rights()` | Lists user rights for a plan | `plan_id` |
| `func_list_allocation_plan_teams()` | Lists teams in an allocation plan | `plan_id` |
| `func_list_allocation_run_positions()` | Lists positions in an allocation run | `run_id` |
| `func_list_team_tag_mappings_for_allocation_plan()` | Lists team tag mappings | `plan_id` |

### Workers

| Function | Purpose | Inputs |
|----------|---------|--------|
| `func_invite_worker()` | Triggers the onboarding flow for a worker | `worker_id (uuid)` |
| `func_claim_worker_account()` | Links auth user to worker record | `worker_id` |
| `func_list_user_workers()` | Lists workers accessible to user | — |

### Organizations

| Function | Purpose | Inputs |
|----------|---------|--------|
| `handle_new_org_assign_rights()` | Auto-assigns admin rights on org creation | Trigger function |

### Messages

| Function | Purpose | Inputs |
|----------|---------|--------|
| `func_send_email_message()` | Central email dispatch function | `to`, `subject`, `body` |
| `send_email_sendgrid()` | SendGrid email provider | Internal |
| `send_email_clicksend()` | ClickSend email provider | Internal |
| `send_email_inbucket()` | Local dev email testing | Internal |

---

## Permission Functions (RBAC)

These functions validate user access and are called by RLS policies.

| Function | Purpose |
|----------|---------|
| `func_check_is_admin()` | Global admin check |
| `func_check_has_privilege()` | Organization-level privilege check |
| `fun_check_is_acl_group_admin()` | ACL group admin check |
| `fun_check_is_acl_group_member()` | ACL group membership check |
| `check_is_allocation_plan_viewer_for_worker()` | Worker's plan visibility check |

---

## Technical Architecture

These functions are designed to ensure that business rules are enforced regardless of the client (Mobile, Web, or Admin). They often delegate permission checks to internal helpers:

- **Global Admin Check**: `public.func_check_is_admin()`
- **Organization Privilege Check**: `public.func_check_has_privilege(...)`

## Security Strategy

:::info Permission Enforcement
Data access is restricted via **Row Level Security (RLS)**, which often invokes these same permission functions to determine if the `auth.uid()` has sufficient rights to perform the requested operation.
:::

## Source Location

All function definitions are in the schema repository:

```
supabase-receptor/supabase/schemas/
├── 05_functions/          # Business logic functions
│   ├── messages/          # Email/notification functions
│   ├── orgs/              # Organization management
│   ├── planning/          # Allocation plan functions
│   ├── preferencing/      # Preference submission
│   └── workers/           # Worker management
└── 09_rbac/               # Permission check functions
    ├── acls/              # ACL group functions
    ├── planning/          # Plan privilege checks
    └── preferencing/      # Viewer access checks
```
