---
sidebar_position: 1
---

# Development Workspace

The **Common Bond Development Workspace** is the central repository that ties together all project components and maintains consistency across AI-assisted development workflows.

## Repository Location

```
~/development/
```

This workspace serves as the parent directory containing:
- Frontend applications (Next.js for worker preferencing, Flutter legacy for admin)
- Supabase infrastructure (schema, migrations, Docker environments)
- Documentation (this Docusaurus site)
- **AI Agent Rules** for consistent development practices

## Purpose

The development workspace exists to:

1. **Maintain Antigravity Agent Rules** — Define and enforce AI agent directives that ensure consistent, high-quality code generation across all projects.
2. **Promote a Consistent Development Environment** — Provide a single point of configuration for VS Code workspaces, agent behaviors, and development standards.
3. **Coordinate Cross-Repository Work** — Link related repositories (frontend, backend, documentation, infrastructure) under a unified workflow.

## Repository Structure

```
development/
├── .agent/
│   └── rules/               # AI agent rules and directives
├── .vscode/                 # VS Code settings and configurations
├── frontend/
│   ├── preference-frontend/  # Next.js worker preferencing app
│   └── rotator_worker/       # Flutter legacy admin (Phase 1)
├── receptor-documentation/  # Docusaurus documentation (this site)
├── supabase-receptor/       # Supabase infrastructure
│   ├── receptor-supabase/   # Database schema and migrations
│   ├── receptor-dev/        # Docker development environment
│   └── receptor-prod/       # Docker production environment
└── common-bond.code-workspace  # VS Code workspace configuration
```

## AI Agent Rules

The `.agent/rules/` directory contains Markdown files that define behavioral rules for AI assistants (e.g., Antigravity). These rules are automatically loaded and ensure that AI-generated code adheres to project standards.

### Available Rules

| Rule | Purpose |
|------|---------|
| **Backend-Frontend Contract** | Ensures database schema changes are reflected in Flutter frontend models |
| **Declarative Migrations** | Enforces schema-driven development using Supabase CLI |
| **Environment Parity** | Maintains consistency between development and production environments |
| **Infrastructure & Doco Sync** | Keeps documentation synchronized with infrastructure changes |
| **RLS Policy Safety** | Ensures all tables have proper Row Level Security policies |
| **Script Consolidation** | Reduces technical debt by consolidating redundant script logic |
| **Secrets Standard** | Standardizes handling of environment variables and secrets |
| **SQL Schema Quality** | Enforces SQL naming conventions and documentation standards |

### Rule Format

Each rule file follows YAML frontmatter format:

```markdown
---
trigger: always_on
---

Rule: [Rule Name]

Objective
[What the rule aims to achieve]

Trigger Conditions
[When the rule should be invoked]

Mandatory Agent Workflow
[Steps the AI agent must follow]

Definition of Done
[Criteria for task completion]
```

### How Rules Work

When an AI assistant (like Antigravity) operates in this workspace:

1. **Automatic Loading** — Rules with `trigger: always_on` are loaded into the agent's context
2. **Conditional Triggers** — Specific rules activate based on the files being modified
3. **Workflow Enforcement** — The agent follows mandatory steps defined in each rule
4. **Completion Verification** — Tasks are only considered complete when the "Definition of Done" is satisfied

## For New Contributors

### Getting Started

1. **Read the README** — Start with `~/development/README.md` for an overview
2. **Open the Workspace** — Use `code ~/development/common-bond.code-workspace` to open VS Code with all projects
3. **Review Agent Rules** — Familiarize yourself with the rules in `.agent/rules/`
4. **Follow the Patterns** — When contributing, ensure your changes align with established rules

### Key Principles

- **Documentation First** — All infrastructure changes must include documentation updates
- **Schema-Driven Development** — Use declarative SQL schemas; avoid manual migration edits
- **Security by Default** — All tables must have RLS policies defined
- **Consistency Across Environments** — Dev and prod configurations should match unless explicitly documented

## Related Documentation

- [Configuration Guide](./config-guide.md) — Environment variables and secrets
- [Supabase Self-Hosted](./supabase-self-hosted.md) — Docker infrastructure setup
- [Database Initialization](./database-initialization.md) — Schema and migration workflow
- [Troubleshooting](./troubleshooting.md) — Common issues and solutions
