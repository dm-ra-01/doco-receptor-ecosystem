---
sidebar_position: 1
---

# Public Landing Page

The **Public Landing Page** (website-frontend) is the primary marketing and informational hub for Common Bond and the Receptor platform. It is designed to project a high-fidelity, professional image that aligns with the organization's "Doctor-Developer" DNA.

## Core Responsibilities

- **Brand Presentation**: Establishing credibility in the medical workforce sector through elegant design and typography.
- **Value Proposition**: Communicating the unique bridge between clinical authority and technical precision.
- **Product Showcase**: Providing a high-level overview of the four core Receptor applications (Workforce, Planner, Preferencer, Allocator).
- **Public Roadmap**: Showcasing future horizons like Roster and Shift management.
- **Lead Generation**: Providing clear calls-to-action for consultations and inquiries.

---

## Design Philosophy

The website follows a premium, minimalist visual language:

- **High-Fidelity UI**: Modern aesthetics with glassmorphism, vibrant gradients, and smooth animations.
- **Typography**: Uses the **Outfit** font family for a geometric, enterprise-grade feel.
- **Professional Palette**: Centered around **Indigo (#4f46e5)** and **Deep Slate (#0f172a)**.
- **Agile Performance**: Built with **Vite** and **Tailwind CSS** for near-instant load times and rapid iteration.

---

## Technical Architecture

The application is built as a lightweight, performant React single-page application (SPA).

| Layer | Technology | Notes |
|:------|:-----------|:------|
| **Framework** | React 18+ (Vite) | High-performance build setup |
| **Styling** | Tailwind CSS | Utility-first design system |
| **Animations** | Framer Motion | Fluid micro-interactions and transitions |
| **Icons** | Lucide React | Lightweight line iconography |
| **Deployment** | GitLab Pages / S3 | Static hosting ready |

---

## Page Structure

- **Landing Page**: The main high-fidelity entry point with sections for DNA, Product Suite, and Roadmap.
- **Product Suite View**: Detailed breakout of the the core suite's features and capabilities.
- **Case Studies View**: Highlights the founder's unique dual-expertise and technological validation.
- **Pricing View**: Enterprise-focused partnership and licensure model.

---

## Repository Context

- **Repository**: [website-frontend](https://github.com/dm-ra-01/website-frontend)
- **Port**: `http://localhost:5178` (development)
- **Primary Assets**: Located in `public/img/` (Logos, Icons)

:::info Strategic Role
Unlike the specialized functional apps (Planner, Preferencer), the Public Landing Page is the "face" of Common Bond, designed to build institutional trust with hospital executives and government bodies.
:::

:::tip Content Updates
All marketing content, value pillars, and roadmap items should be synchronized with the latest **Business Planning** documents in this Docusaurus site.
:::

---

## Related Documentation

- [**Branding & Identity**](https://docs.commonbond.au/corporate/docs/business-planning/brand/) — Branding decisions and guidelines
- [**V/TO (EOS Strategy)**](https://docs.commonbond.au/corporate/docs/business-planning/operations/eos/vto) — The "Why" behind the Receptor platform
- [**Service Catalog**](https://docs.commonbond.au/corporate/docs/business-planning/product/service-catalog) — Detailed catalog of offerings
- [**Frontend Redevelopment Project**](../../projects/frontend-redevelopment) — Project roadmap and milestones
