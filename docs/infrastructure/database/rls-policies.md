# Row Level Security (RLS) Strategy

This document outlines the proposed Row Level Security (RLS) strategy for the Receptor platform, moving from the legacy ACL system to a more streamlined, role-based approach using Supabase/PostgreSQL features.

## Proposed Roles

We define three primary tiers of access:

### 1. End User (Worker / JMO)
- **Objective**: "Need to know" access for lodgement of preferences.
- **Scope**: Can only see data within their assigned Organization.
- **Restrictions**: 
  - Cannot see other workers' preferences or personal details.
  - Can only view "Open" allocation runs they are mapped to.
  - Can view core configuration data (Locations, Team Categories, Teams, Positions, Rotations) only as required for the current allocation process.

### 2. Workforce Manager
- **Objective**: Manage organization-level staff and rotations.
- **Scope**: Full CRUD access to all data within their specific Organization.
- **Restrictions**: 
  - Cannot access data from other healthcare organizations.
  - **Clinical Year Maintenance**: Retain write access to `rotations` and `allocation_runs` even in `closed` or `archived` states to support rotation swaps and adjustments during the clinical year.

### 3. Global Administrator
- **Objective**: Platform maintenance and cross-org management.
- **Scope**: Full access to all data across the platform.

---

## Policy Definition by Table (Public Schema)

| Table | End User (Worker) | Workforce Manager | Global Admin |
| --- | --- | --- | --- |
| `orgs` | SELECT (Own Org) | SELECT (Own Org) | ALL |
| `users` | SELECT/UPDATE (Self) | SELECT/UPDATE/INSERT (Org Staff) | ALL |
| `workers` | SELECT (Self) | ALL (Org Workers) | ALL |
| `teams` | SELECT (In Allocation Run) | ALL (Org Teams) | ALL |
| `positions` | SELECT (In Allocation Run) | ALL (Org Positions) | ALL |
| `rotations` | SELECT (In Allocation Run) | ALL (Org Rotations) | ALL |
| `job_lines` | SELECT (In Allocation Run) | ALL (Org Job Lines) | ALL |
| `preference_worker_job_lines` | ALL (Self-preferences) | ALL (Org preferences) | ALL |
| `allocation_run_worker_mappings` | SELECT (Own mapping) | ALL (Org mappings) | ALL |
| `allocationplans` | - | SELECT (Org-scoped view) | ALL |
| `allocationruns` | - | SELECT (Org-scoped view) | ALL |
| `allocation_plan_team_tag_customisations` | SELECT (Associated Plan) | ALL (Org-level) | ALL |
| `allocation_planner_runs` | SELECT / INSERT (via Privilege) | SELECT / INSERT (via Privilege) | ALL |
| `job_lines_history` | SELECT (via Privilege) | SELECT (via Privilege) | ALL |

---

## Status-Gated Modification Protection (Worker Level)

To ensure data integrity and prevent post-hoc changes to finalized schedules by workers, the following tables have RLS policies that block Worker-level `UPDATE` and `DELETE` operations unless the associated `allocation_run.status` is `open`:

- `preference_worker_rotations`: Workers can only submit or modify preferences while the run is in the `open` phase. Once `closed` or `archived`, only Workforce Managers or Global Admins can perform modifications.

Admins (Workforce managers) retain modify access to `rotations` and `allocation_runs` during `closed` and `archived` states to support necessary clinical year maintenance.

---

## Technical Implementation Notes

### Declarative Policy Definition

Policies are now defined declaratively in the `supabase/schemas/11_policies` directory. Files are organized by domain:
- `orgs.sql`: Policies for organizations and teams.
- `planning.sql`: Policies for allocation plans and runs.
- `preferencing.sql`: Policies for worker preferences.
- `workers.sql`: Policies for worker profiles and qualifications.

### User Metadata
To support organization-scoped RLS, we will store the `org_id` and `role` in the `auth.users` raw app metadata or a dedicated `public.user_roles` table.

### Permission Functions
We will implement helper functions to check access in policies (located in `09_rbac`):
- `func_check_has_privilege(org_id, ...)`: Core RBAC check.
- `func_check_allocation_plan_privilege(plan_id, permission)`: Checks plan-level or organization-level permission.
- `is_global_admin()`: Checks if current user has `global_admin` role.

### Example Policy: `teams`
```sql
CREATE POLICY "Workers can view teams in active runs"
ON public.teams
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.allocation_run_worker_mappings m
    JOIN public.allocationruns r ON m.allocation_run = r.id
    -- Logic to link team to the allocation run via plans
    WHERE m.worker = auth.uid() 
    AND r.status = 'open'
  )
);
```

:::warning TODO
- [x] Convert policies to declarative files in `11_policies`.
- [ ] Define precise SQL for all helper functions in `09_rbac`.
- [ ] Audit all tables in `match` and `messages` schemas for RLS compliance.
- [ ] Implement a migration to populate `auth.users` metadata with roles for existing users.
:::

## 🛡️ Abuser Stories & Security Acceptance Criteria

RLS policies are verified against specific **Abuser Stories** to ensure the "Principle of Least Privilege" is maintained.

### Priority Scenarios

1.  **[AB-01: Illegal Preference Modification](../../platform/user-stories/preference-frontend/index.md#ab-01-illegal-preference-modification)**: Attackers using stolen API keys must be blocked from modifying worker preferences.
2.  **AB-02: Cross-Org Data Access**: Users from Organization A must never be able to `SELECT` or `UPDATE` records belonging to Organization B, even if they have a valid session.

These scenarios are tested as part of the `RLS.test.sql` and `RLS.test.ts` test suites.
