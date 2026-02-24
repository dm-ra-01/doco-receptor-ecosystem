---
sidebar_position: 7
---

# Technical Design & PRD: Receptor Planner - AI Co-Pilot for Workforce Managers

## 1. Objective
Design a conversational interface that allows System Admins and Workforce Managers to generate, query, and rebalance flawless, AMC-compliant annual job lines using natural language. The LLM handles intent recognition and orchestration, while our existing FastAPI + OR-Tools backend guarantees mathematical and compliance constraints.

## 2. Architecture Flow
The AI Co-Pilot sits within the Next.js `planner-frontend` as a chat interface, acting as a smart proxy between the user and the Receptor Planner Backend.

1. **Natural Language Input:** A manager submits a request (e.g., "We lost a Surgical term at Albury, rebalance the lines to ensure cover").
2. **Context Retrieval:** The AI agent (running securely on a Next.js Server Action or Edge Function) queries Supabase to fetch current state: `allocation_runs`, `workers`, `positions`, and `roster_shifts`.
3. **Parameter Translation:** The LLM translates the intent into structural constraints. It formulates a `SchedulingRequest` JSON payload, modifying the inputs to reflect the lost surgical term.
4. **Deterministic Solving:** The UI passes the payload to the Python FastAPI backend (`/schedule/generate/json`). The CP-SAT solver runs the rigorous AMC-compliant deterministic algorithms.
5. **Response Formatting:** The mathematical output/solution is returned to the Next.js backend, where the LLM formats it into a human-readable response and a visual diff in the UI before persisting to the DB.

## 3. Exception Handling & Trade-offs
When the deterministic engine encounters an over-constrained problem (e.g., "INFEASIBLE"), OR-Tools natively cannot explain *why* in plain english. The AI Co-Pilot intervenes here:
- **Constraint Relaxation Analysis:** If a run fails, the LLM orchestrator automatically triggers subsequent "diagnostic" runs against the FastAPI backend, iteratively relaxing soft constraints (like `affinity` weighting or preferred leave distribution) to find the bottleneck.
- **Plain English Explanations:** The LLM receives the diagnostic matrix and explains the trade-off to the manager. 
  _"I could not fulfil all requirements because there aren't enough PGY2s to cover the mandatory Surgical terms. If we relax the requirement for consecutive leave blocks, I can generate a valid schedule. Would you like to proceed with that trade-off?"_

## 4. Security & Role-Based Access
Strict enforcement of data boundaries ensures the AI cannot hallucinate or leak data outside the manager's purview.
- **JWT Propagation:** The manager's request to the Next.js Server Action automatically carries their Supabase Auth JWT.
- **RLS Pass-through:** When the AI agent executes RAG (Retrieval-Augmented Generation) or fetches contextual data, it uses the manager's JWT to query Supabase via PostgREST. Row-Level Security (RLS) policies inherently restrict the AI's visibility. It will only "see" `organizations`, `positions`, and `workers` that belong to the manager's authorized team/org.
- **Payload Verification:** Before sending the final `SchedulingRequest` to the FastAPI backend, a deterministic validation layer checks that all IDs in the payload correspond to resources the manager actually owns in Supabase.

## 5. Tasks and Sub-tasks

### Phase 1: AI Orchestration Layer & Context Retrieval
- [ ] **Infrastructure Setup:**
    - [ ] Set up the Next.js API routes or Server Actions for the AI Co-Pilot.
    - [ ] Integrate Vercel AI SDK (or similar) into `planner-frontend`.
    - [ ] Configure the Supabase client inside the AI endpoint to securely pass the manager's JWT.
- [ ] **Data Fetching Tools:**
    - [ ] Build deterministic tools that the LLM can call to fetch current context (e.g., `get_allocation_runs`, `get_workers`, `get_active_positions`).
    - [ ] Write unit tests ensuring these tools strictly obey RLS policies and only return data the manager owns.
- [ ] **Intent Parsing & Payload Construction:**
    - [ ] Implement the system prompt to instruct the LLM on translating natural language into `SchedulingRequest` JSON modifications.
    - [ ] Build a validation schema (Zod/Pydantic) to verify the constructed payload structure before it hits the FastAPI backend.

### Phase 2: Engine Integration & Diagnostic Iteration
- [ ] **Backend Communication:**
    - [ ] Update the Next.js backend to securely dispatch the LLM-constructed `SchedulingRequest` to the Python FastAPI solver (`/schedule/generate/json`).
    - [ ] Implement robust error handling for API timeouts or CP-SAT failures.
- [ ] **Diagnostic Relaxation Loop (The Core Neurosymbolic Loop):**
    - [ ] Implement the logic where an 'INFEASIBLE' response triggers the LLM to systematically relax soft constraints (Affinity, Leave distribution) and re-request.
    - [ ] Build a data structure to record the "diffs" of these diagnostic runs so the LLM can analyze the bottleneck.
- [ ] **Response Formatting:**
    - [ ] Instruct the LLM to synthesize the diagnostic results into plain-English trade-off explanations.

### Phase 3: UX/UI Chat Interface
- [ ] **Frontend Components:**
    - [ ] Design and implement the conversational AI interface component (slide-over or integrated chat pane) in `planner-frontend`.
    - [ ] Implement Vercel AI SDK UI components (e.g., streaming responses, tool calling indicators).
- [ ] **Generative UI & Visual Diffs:**
    - [ ] Build React Server Components that render the proposed schedule changes (the visual diff) directly within the chat interface.
    - [ ] Add interactive elements to the Generative UI (e.g., a "Confirm and Apply Trade-off" button).
- [ ] **Persistence:**
    - [ ] Wire up the confirmation actions so the agreed-upon `SchedulingRequest` is saved to the Supabase database, updating exactly as a manual submission would.
    - [ ] Ensure end-to-end Cypress/Playwright tests validate the entire conversational flow to persistence.
