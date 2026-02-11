---
sidebar_position: 1
---

# Introduction to Receptor

Welcome to the documentation for **Receptor**, the premier workforce management platform developed by **Common Bond**.

## Our Mission
Common Bond is dedicated to solving the complex challenge of fair job rotation matching in the healthcare sector. We believe that a fair and transparent system for job preferencing leads to better outcomes for both healthcare professionals and the health services they serve.

## The Receptor Ecosystem
Receptor is more than just an app; it's a comprehensive infrastructure designed for the requirements of public health systems.

### Technical Foundation
We leverage a world-class technology stack to ensure security and scalability:
- [Next.js + Supabase Architecture](platform/architecture) — System design, data flows, and service topology
- [Security & RLS Policies](platform/security) — Role-based access and row-level security
- [User-Centric Onboarding](platform/onboarding) — Frictionless activation flow

### Core Applications
Custom interfaces tailored for specific user personas:
- [Receptor Preferencer](platform/frontend-apps/receptor-preferencer) — Worker-facing preference submission
- [Receptor Planner](platform/frontend-apps/receptor-planner) — Allocation planning and run management
- [Receptor Workforce](platform/frontend-apps/receptor-workforce) — Position and organization master data
- [Receptor Allocator](platform/allocator-backend/) — Intelligent matching and optimization engine

### Service Offerings
Receptor delivers value through structured service tiers—from Core allocation services available today to Strategic workforce integrations on our long-term roadmap:
- [Service Catalog](https://docs.commonbond.au/corporate/docs/business-planning/product/service-catalog)

## Documentation Structure
This site is organized into three sections:
1. **Platform** — Architecture, security, frontend apps, allocator engine, and core platform documentation.
2. **Infrastructure** — Self-hosted Supabase, database schema, environment setup, security, and DevOps.
3. **Projects** — Active development initiatives and migration tracking.

## Getting Started as a Contributor

New to the project? Start with the **[Development Workspace](infrastructure/environment/development-workspace)** guide. This covers:
- The central development repository structure
- AI Agent Rules that enforce consistent development practices
- How to set up your local environment

The development workspace (`~/development/`) contains AI agent rules in `.agent/rules/` that automatically guide code generation and ensure consistency across all projects.
