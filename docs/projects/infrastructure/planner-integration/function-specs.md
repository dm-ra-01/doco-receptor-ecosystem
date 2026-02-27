---
sidebar_position: 5
---

# Supabase Edge Function Specifications

## Role
The Deno-based `planner-orchestration` Edge Function operates as the secure broker separating the public internet (and authenticated Next.js client) from the raw CP-SAT processing power.

## Scope Summary (`supabase/functions/planner-orchestration`)
1. **Receive:** Absorbs HTTP POST from the frontend, receiving the user JWT (`Authorization` header) and generation configurations.
2. **Context Validation:** Validates the user has rights to generate plans via Supabase context (using the normal `supabase-js` client instantiated with the frontend's Authorization header to strictly adhere to Postgres RLS policies).
3. **Database Insertion:** Inserts a new record into `allocation_planner_runs` with a starting status of `PENDING`. This table becomes the anchor point.
4. **Trigger FastAPI:** Constructs a minimal JSON payload (e.g., `{ "planner_run_id": "uuid-here" }`) and issues an asynchronous HTTP POST request to the Python FastAPI backend engine to initiate work. If the Python backend is completely offline or unresponsive, Deno catches the connection exception and immediately returns an HTTP 503 (Service Unavailable) error back to the frontend.
5. **Return Fast:** If triggered successfully, Deno returns the newly created `planner_run_id` back to the frontend immediately so the UI can commence Realtime listening for the background completion.

## Integration Needs
- The `supabase-receptor/setup.conf` will need local development port definitions to ensure Deno spawns the Edge Function appropriately alongside the `auth` system during `npm run build` variations.
