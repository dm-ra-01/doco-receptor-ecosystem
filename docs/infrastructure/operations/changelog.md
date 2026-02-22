---
sidebar_position: 99
---

# Changelog

All notable changes to the Receptor platform and documentation are logged here.

## [Unreleased]

### Infrastructure
- Downgraded `preference-frontend` to Next.js **v15.5.9** (stable/patched) for improved security and reliability.
- Integrated **generated Supabase TypeScript types** into `preference-frontend` utilities and middleware for full type-safety.
- Refactored `preference-frontend` ESLint configuration to use Flat Config (ESLint 9) for compatibility with Next.js 15.
- Optimised `preference-frontend` test suite to separate Vitest unit tests from Playwright E2E tests.

### Documentation
- Updated `testing-guide.md` with instructions for separated unit and E2E testing in `preference-frontend`.
- Updated `database-schema.md` to reflect the use of generated TypeScript types for frontend development.
- Expanded `database-functions.md` from 6 to 30+ functions with full categorization
- Updated `database-schema.md` with `qualification_tags` and `shifts` table documentation
- Refactored `allocator-backend.md` to summary format linking to GitLab
- Fixed `architecture.md` Mermaid diagram (Flutter, not Next.js for Admin Portal)
- Added `match-backend/` to Related Repositories across README files

---

## [2026-01-14]

### Documentation
- Initial changelog created
- Completed documentation structure audit
- Standardized sidebar ordering with `sidebar_position` frontmatter

---

## Format

This changelog follows [Keep a Changelog](https://keepachangelog.com/) conventions:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for bug fixes
- **Security** for vulnerability fixes
- **Documentation** for documentation-only changes
- **Infrastructure** for DevOps/deployment changes
