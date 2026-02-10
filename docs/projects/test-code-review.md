---
sidebar_position: 3
---

# Project 2: Test Code Review

Audit and improvement of the `rotator_worker` test suite to robustly validate the receptor-supabase migration.

:::warning
Several tests are currently **DISABLED** in the codebase. These gaps must be addressed before migration can be considered validated.
:::

## Project Status

| Area | Status | Notes |
|:-----|:-------|:------|
| Test Inventory | 🟢 Complete | Documented below |
| Gap Analysis | 🟡 In Progress | Disabled tests identified |
| Documentation | 🔴 Not Started | |
| receptor-supabase Compatibility | 🔴 Not Started | |

---

## Current Test Inventory

**Source**: [main_test.dart](https://github.com/dm-ra-01/rotator_worker/blob/master/test/main_test.dart)

### Working Tests

| Test | File/Module | Category |
|:-----|:------------|:---------|
| Org CRUD | `seed.dart` | Core |
| AppDatabase init | `services/app_database.dart` | Services |
| Location CRUD | `org/location.dart` | Org |
| Team Category CRUD | `org/team_category.dart` | Org |
| Team CRUD | `org/team.dart` | Org |
| Team Tag CRUD | `org/team_tag.dart` | Org |
| ACL Group CRUD | `auth/acl_group.dart` | Auth |
| OrgDatabase init | `services/org_database.dart` | Services |
| TeamDatabase init | `services/team_database.dart` | Services |
| Position CRUD | `position/position.dart` | Position |
| Position Tag CRUD | `position/position_tag.dart` | Position |
| Position Tag Mapping | `position/position_tag_mapping.dart` | Position |
| Rotation CRUD | `position/rotation.dart` | Position |
| Shift Role CRUD | `shift/shift_role.dart` | Shift |
| Allocation Plan CRUD | `allocation/allocation_plan.dart` | Allocation |
| Allocation Plan Team Tags | `allocation/allocation_plan_team_tags.dart` | Allocation |
| Allocation Run CRUD | `allocation/allocation_run.dart` | Allocation |
| Preferencing Setup | `preferencing/preferencing_1_setup.dart` | Preferencing |
| Draft Restrictions | `preferencing/preferencing_2_draft_restrictions.dart` | Preferencing |
| Preference Submission | `preferencing/preferencing_3_preference.dart` | Preferencing |
| Admin Preferencing | `preferencing/preferencing_4_admin.dart` | Preferencing |
| PreferenceDatabase init | `services/preference_database.dart` | Services |
| Position Allocation Plan | `allocation/position_allocation_plan.dart` | Allocation |
| Job Line CRUD | `allocation/job_line.dart` | Allocation |
| Job Line Eligibility | `allocation/job_line_eligibility.dart` | Allocation |
| AllocationDatabase init | `services/allocation_database.dart` | Services |
| Qualification Tag | `worker/qualification_tag.dart` | Worker |

### Disabled Tests ⚠️

| Test | Reason | Priority |
|:-----|:-------|:---------|
| OrgGroup CRUD | Unknown - returns early | Medium |
| Shift CRUD | Unknown - returns early | High |
| Listing Management | Unknown - returns early | Medium |

---

## Identified Gaps

### Missing Test Coverage

- [ ] **Storage API tests** - No tests for file upload/download
- [ ] **Auth edge cases** - Only ACL group tests, no login flow tests
- [ ] **RLS policy validation** - No explicit row-level security tests
- [ ] **Error handling** - Limited negative test cases
- [ ] **Concurrent operations** - No race condition tests

### Documentation Gaps

- [ ] Test prerequisites not documented
- [ ] Environment variable requirements unclear
- [ ] No test data setup instructions
- [ ] Missing receptor-supabase specific test notes

---

## Sub-Tasks

### 1. Enable Disabled Tests

- [ ] Investigate why `Shift CRUD` test was disabled
- [ ] Investigate why `OrgGroup CRUD` test was disabled
- [ ] Investigate why `Listing Management` test was disabled
- [ ] Fix and re-enable or document why they should remain disabled

### 2. Add receptor-supabase Compatibility Tests

- [ ] Add explicit test that validates connection to receptor-supabase
- [ ] Add health check verification test
- [ ] Add schema version check

### 3. Document Test Infrastructure

- [ ] Document required environment variables
- [ ] Document test user setup (`test_user_credentials.json`)
- [ ] Document seed data requirements
- [ ] Add README to `test/` directory

### 4. Add Missing Test Categories

- [ ] Add Storage API tests
- [ ] Add RLS policy tests
- [ ] Add auth flow tests (login, logout, session refresh)

---

## Test Configuration

**Environment variables required:**
```dart
TEST_ADMIN_EMAIL     // Test admin user email
TEST_ADMIN_PASSWORD  // Test admin user password
```

**Configuration file**: `test_user_credentials.json` (gitignored, local only)

**Constants**: [constants.dart](https://github.com/dm-ra-01/rotator_worker/blob/master/test/constants.dart)

---

## Validation Criteria

Migration testing is successful when:

1. ✅ All enabled tests pass against receptor-supabase
2. ✅ Disabled tests are either fixed or documented
3. ✅ New tests cover storage, auth, and RLS
4. ✅ Test documentation is complete
5. ✅ CI/CD pipeline can run tests automatically
