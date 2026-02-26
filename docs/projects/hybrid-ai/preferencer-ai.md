---
sidebar_position: 8
---

# Technical Design & PRD: Receptor Preferencer - AI Assistant for Healthcare Workers

## 1. Objective
Design an agentic AI assistant integrated into the `preference-frontend`. This assistant helps individual healthcare workers navigate complex AMC requirements, facility idiosyncrasies, and personal constraints (e.g., "I want to do pediatrics next year near Dandenong") to generate and submit an optimal timeline of ranked job preferences.

## 2. Architecture Flow
The AI assistant operates seamlessly within the Next.js server-centric architecture, utilizing AI for discovery and filtering, and Supabase for persistence.

1. **Intent Capture:** The worker opens the chat interface during the preference activation flow and types their goals (e.g., "Show me lines that get my mandatory Emergency term done early in the year, preferably near the city.")
2. **Translation to Queries:** The LLM acts as an advanced filter generator. It translates the raw text into structured Supabase queries against the `positions`, `job_lines`, and `organizations` tables.
3. **Data Retrieval:** The Next.js Server Action executes these queries against Supabase.
4. **Recommendation Engine:** The LLM analyses the returned job lines against the worker's stated goals, scoring them. 
5. **Presentation:** The assistant returns a curated list of job lines via rich UI components (Vercel AI SDK generative UI), explaining *why* they match the criteria. The user can simply click "Add to Preferences" to update their `preference_worker_rotations` rankings natively.

## 3. Row-Level Security (RLS) Integration
To guarantee absolute security and prevent any cross-tenant data spillage, the AI Assistant is completely neutered of administrative privileges.
- **Auth Context:** The worker's session is established via the central Supabase Edge Function (`/functions/v1/auth`). Their JWT is held in the Next.js HTTP-only cookies.
- **Agent Executions:** Every database query formulated by the LLM is executed utilizing the worker's own JWT. We instantiate the Supabase client using `createServerClient` in the Server Action. 
- **Database Enforcement:** Because queries execute with the worker's JWT, Supabase RLS policies natively prune the search space. The AI can literally never access or recommend a job line outside of the worker's assigned `worker_groups` or active `allocation_runs`. Hallucinations of invalid job lines are cryptographically impossible to extract from the DB.

## 4. UX/UI Integration
The UI introduces the AI as a helpful "Co-Pilot" slide-over or contextual chat window during the frictionless preference flow, adhering to our "Mobile-First" and "High Clarity" design philosophies.
- **Progressive Disclosure:** Instead of replacing the existing manual drag-and-drop hierarchy, the AI acts as a smart filter on the sidebar. Users can chat to filter, and the main screen's matching job lines highlight dynamically.
- **Generative UI Components:** Using React Server Components, the AI's chat response yields functional UI elements (e.g., a mini rotation timeline card). Workers can click "Add to Top 5" directly inside the chat bubble.
- **Stateless Chat:** The chat history does not need persistent storage in Supabase; it's a transient tool to facilitate the creation of the final `preference_worker_rotations` records.

## 5. Tasks and Sub-tasks

### Phase 1: AI Orchestration & Secure Tooling
- [ ] **Infrastructure Setup:**
    - [ ] Create Next.js API routes / Server Actions in `preference-frontend` to host the AI Assistant.
    - [ ] Integrate Vercel AI SDK.
    - [ ] Ensure the Supabase client strictly inherits the active worker's session JWT (`createServerClient`).
- [ ] **Secure Query Tools:**
    - [ ] Develop tools the LLM can invoke to safely search the database (e.g., `search_job_lines_by_facility`, `search_job_lines_by_specialty`, `get_amc_requirements`).
    - [ ] Write integration tests verifying that these tools respect RLS (e.g., a worker cannot fetch job lines belonging to a different organization).
- [ ] **Agent Prompt Engineering:**
    - [ ] Design the system prompt focusing on understanding healthcare slang, AMC terminology, and geographical nuances.

### Phase 2: Recommendation & Reasoning Engine
- [ ] **Retrieval-Augmented Generation (RAG):**
    - [ ] Vectorize (if necessary) or structure facility descriptions and idiosyncrasies so the LLM can answer qualitative questions ("Is Albury hospital good for pediatrics?").
- [ ] **Scoring & Trade-off Logic:**
    - [ ] Implement logic where the LLM can evaluate returned `job_lines` against the worker's stated goals and rank them.
    - [ ] Ensure the LLM explicitly explains *why* a particular job line was recommended (e.g., "This fulfills your Emergency requirement and keeps you in Metropolitan hospitals").

### Phase 3: Generative UI & Interaction
- [ ] **Conversational Interface Build:**
    - [ ] Develop the mobile-first "Co-Pilot" chat sidebar/overlay in `preference-frontend`.
    - [ ] Integrate typing indicators and robust loading states appropriate for low-bandwidth mobile connections.
- [ ] **React Server Components (RSC) Implementation:**
    - [ ] Build custom RSCs that the LLM can render (e.g., `JobLineRecommendationCard`, `AMCRequirementStatus`).
    - [ ] Connect interactable elements within those components (e.g., an "Add to Preferences" CTA).
- [ ] **State Synchronization:**
    - [ ] Ensure actions taken *inside* the generative UI (like adding a preference) immediately update the main application's state and trigger Supabase mutations.
    - [ ] Write Playwright E2E tests validating the flow from natural language query to successful database submission.
