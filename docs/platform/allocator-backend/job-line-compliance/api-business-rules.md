# API & Business Rules

## Data Synchronisation
The system fetches records over the Supabase REST API via `fetch.py`. To update assigned lines across the ecosystem:
1. Records are created in the `job_line` table with a `sort_order`.
2. Existing records in `rotation` are updated to set `assignedjobline = job_line.id`.
3. (Optional) Legacy output is generated to localized `spreadsheet.xlsx`.

## Business Limitations
- Positions lacking tags, specifically categorization (e.g., `AMC_EC_A_P`), are skipped in category metrics.
- Unfilled job lines represent algorithm infeasibility; partial lines are not resolved inherently without relaxing constraints.
- `go.py` exists as a secondary or legacy solver referencing an `import.xlsx` format directly without communicating with the database.

:::caution Work in Progress
This module directly alters live assignment relationships on the database. In the future platform refactor, this should ideally be placed behind a state transactional layer to avoid dirty partial assignments on failure.
:::
