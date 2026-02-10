---
sidebar_position: 1
---

# Introduction to Receptor

Welcome to the documentation for **Receptor**, the premier workforce management platform developed by **Common Bond**.

## Our Mission
Common Bond is dedicated to solving the complex challenge of fair job rotation matching in the healthcare sector. We believe that a fair and transparent system for job preferencing leads to better outcomes for both healthcare professionals and the health services they serve.

## The Receptor Ecosystem
Receptor is more than just an app; it's a comprehensive infrastructure designed for the requirements of public health systems.

### Business Planning
Our foundation is built on a clear vision for Australia-wide implementation, focusing on:
- [V/TO (EOS Strategy Core)](https://docs.commonbond.au/corporate/docs/business-planning/operations/eos/vto)
- [Modern Consultant (Hybrid Flywheel)](https://docs.commonbond.au/corporate/docs/business-planning/strategy-vision/modern-consultant)
- [Portfolio Matrix](https://docs.commonbond.au/corporate/docs/business-planning/market-sales/portfolio-analysis)
- [Branding & Identity](https://docs.commonbond.au/corporate/docs/business-planning/brand/)

### Service Offerings
Receptor delivers value through structured service tiers—from Core allocation services available today to Strategic workforce integrations on our long-term roadmap:
- [Service Catalog](https://docs.commonbond.au/corporate/docs/business-planning/product/service-catalog)

### Technical Foundation
We leverage a world-class technology stack to ensure security and scalability:
- [Next.js + Supabase Architecture](app-documentation/architecture)
- [Security & RLS Policies](app-documentation/security)
- [User-Centric Onboarding](app-documentation/onboarding)

### Core Applications
Custom interfaces tailored for specific user personas:
- [Receptor Preferencer](app-documentation/frontend-apps/receptor-preferencer) — Worker-facing preference submission
- [Receptor Planner](app-documentation/frontend-apps/receptor-planner) — Allocation planning and run management
- [Receptor Workforce](app-documentation/frontend-apps/receptor-workforce) — Position and organization master data
- [Receptor Allocator](app-documentation/allocator-backend/) — Intelligent matching and optimization engine


## Documentation Structure
This site is organized into four main sections:
1. **Business Planning**: Strategy, goals, and entrepreneurial considerations.
2. **Projects**: Active development initiatives and migration tracking.
3. **App Documentation**: Architecture, security, and application documentation.
4. **Infrastructure**: Development environment and server configuration.

## Getting Started as a Contributor

New to the project? Start with the **[Development Workspace](infrastructure/development-workspace)** guide. This covers:
- The central development repository structure
- AI Agent Rules that enforce consistent development practices
- How to set up your local environment

The development workspace (`~/development/`) contains AI agent rules in `.agent/rules/` that automatically guide code generation and ensure consistency across all projects.
