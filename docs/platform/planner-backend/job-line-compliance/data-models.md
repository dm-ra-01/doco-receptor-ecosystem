# Data Models & State

The tool maintains several core entity classes (`classes.py`) mapped to Supabase models:

### `InputModel`
A monolithic wrapper holding context required for an allocation run.
- `org`: Organization properties (locations, tags).
- `allocation_plan`: Ruleset (e.g., term lengths, timezone).
- `allocation_run`: Active run (dates, statuses).
- `positions`: Dictionary of `Position` objects.
- `rotations`: Dictionary of `Rotation` objects linked to positions.

### `OutputModel`
Holds the post-solve dataset:
- `assignments`: The binary matrix dictating which rotations are assigned.
- `solver`: The instantiated `CpSolver` holding final status variables.

### `Position` & `Rotation`
- **Position**: Abstraction of a role on a team (e.g. "Cardiology JMO"). Has a `position_tag_mappings` list representing required skill categories.
- **Rotation**: A specific time-bounded term of a Position. It corresponds to a slot in the `rotation` table mapping to a `assignedjobline`.
