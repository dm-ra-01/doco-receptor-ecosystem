---
id: presale-demos
title: Presale Strategy & Demo Guide
sidebar_label: Presale Demos
---

# Presale Strategy & Demo Guide

This document outlines the expansive strategy for utilizing the Receptor Planner's automated job line generation capabilities as a primary presales and pitching tool for Health Services.

## Overview

We can programmatically ingest PMCV's published accredited post data (which explicitly outlines capacities and rotation types for PGY1 and PGY2 posts across Victoria). Armed with this data, the Receptor Planner can dynamically generate 100% compliant, structurally perfect job lines for *any* targeted Health Service prior to ever speaking with them.

We approach each organisation with a free, custom-tailored example of their own hospital's rotations mathematically optimized into perfect job lines.

---

## 1. Real World Example Demo and Pitch

**The Scenario:** You secure a 15-minute introductory meeting with the Medical Workforce Unit (MWU) Manager at "Sunshine Hospital".
**The Asset:** You bring a generated Excel/JSON report of *10 perfectly balanced PGY1 job lines* composed entirely of Sunshine Hospital's actual accredited posts.

**The Pitch Script:**
> "Hi [Name]. We know that building compliant job lines that balance Medicine, Surgery, and Emergency requirements while respecting capacity limits (like your 4 ED spots) takes your team weeks of manual spreadsheet tetris."
>
> "Before this meeting, we ran your publicly available PMCV accredited posts through the Receptor Planner algorithm. In less than 5 seconds, it generated these 10 perfectly compliant job lines for your PGY1 cohort. Notice how every line meets the exact 10+10+10+10+12 week structure, the 12-week block is always Term 5, and we never exceed your exact department capacities."
>
> "If we can do this with zero internal data in 5 seconds, imagine what happens when we plug in your doctors' actual preferences and annual leave requests."

---

## 2. Potential Customer Value

The core value propositions highlighted by this demo strategy are:

- **Instant PMCV Compliance:** Demonstrates mathematical proof that the software understands and enforces strict accreditation rules (e.g., Medicine/Surgery/ED balancing, 12-week PGY1 requirement on Term 5).
- **Zero-Lift Proof of Concept:** The hospital doesn't have to provide us with data, sign an NDA, or do any work to see the platform function. We use public PMCV data to show them a reflection of their own world.
- **Capacity Management:** Proves the system respects fundamental constraints (e.g., "If there are 3 ED Mildura positions, only 3 rotations per term appear").
- **Error Elimination:** Highlights the impossibility of a non-compliant line being generated for junior cohorts (HMO1 and HMO2). (Note: HMO3+ are exempt from these PMCV constraints).

---

## 3. Potential Investors

For investors, this presale capability is a massive de-risking factor and growth indicator:

- **Low Customer Acquisition Cost (CAC):** The ability to generate bespoke, highly relevant collateral for *any* hospital without manual effort drastically lowers the friction and cost of sales outreach.
- **Defensible IP:** Demonstrating a working constraint-solver that effortlessly navigates complex, domain-specific rules (PMCV guidelines) proves deep technical moats.
- **"Land and Expand" Hook:** Offering free structural lines is the ultimate "freemium" wedge to secure enterprise B2B SaaS contracts for the full rostering and preference optimization suite.

---

## 4. Sales-focused Strategy

**The Outreach Funnel:**
1. **Target Identification:** Select a hospital from the PMCV public list.
2. **Asset Generation:** Run the `generate_presale_lines` API endpoint targeting that specific hospital and cohort (e.g., PGY1).
3. **Cold Outreach:** Email the MWU Director: *"I generated 10 compliant PGY1 job lines using your exact PMCV capacities. Can I show you how the algorithm built them?"*
4. **The Demo:** Walk through the generated payload. Focus on the constraints the algorithm successfully navigated.
5. **The Close:** Offer a paid pilot to run their *actual* upcoming medical year with real doctor preferences using Diverse Preference Optimization (DivPO).

---

## 5. Technical Implementation for Developers

To support this presales motion, the `planner-backend` requires a dedicated API and generation pipeline.

### Foundational Data Source
Currently, we use a local JSON file (`planner/data/vic_accredited_rotations.json`) scraped from PMCV.
**Next Sprint Requirement:** This data must be migrated into Supabase tables (e.g., `pmcv_accredited_posts`) so the API can dynamically query capacities and rotation types based on a selected `organization_id`.

### The Endpoints
- `POST /api/v1/presale/generate-lines`
  - **Payload:** `{ "organization": str, "cohort": "PGY1" | "PGY2", "count": 10 }`
  - **Response:** JSON structure of Job Lines OR trigger an Excel download (for easy emailing).

### Algorithmic Rules & Constraints
The solver must enforce the following strict rules for PGY1/PGY2 (HMO1/2):
1. **Strict Compliance:** If a compliant line cannot be generated due to mathematical impossibility (e.g., lacking Surgery posts), the algorithm MUST FAIL and not return a non-compliant line.
2. **Strict Capacity Limits:** Respect the `Posts` integer. E.g., if "ED Mildura" has 3 posts, it can only appear 3 times per term across all generated lines.
3. **Term Durations:** PGY1s must follow the 10 + 10 + 10 + 10 + 12 week structure.
4. **Term 5 Enforcement:** The 12-week rotation *must* be scheduled in Term 5.
5. **Balanced Experience:** Lines must contain the requisite mix of Medicine, Surgery, and Emergency as dictated by PMCV.
6. **HMO3+ Exemption:** Ensure logic easily bypasses these strict checks if the targeted generation cohort is HMO3 or above.
