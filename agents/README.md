# Web Factory roles

These files define reusable working roles for people or coding assistants. They are instructions, not implemented autonomous agents or an orchestration system.

## Roles

- [Planner](planner/AGENT.md) — turns a request into scoped work and acceptance criteria.
- [Designer](designer/AGENT.md) — defines visual direction, responsive behavior, and design-token changes.
- [Developer](developer/AGENT.md) — implements approved changes in the correct architecture layer.
- [QA](qa/AGENT.md) — verifies behavior, accessibility, responsiveness, and build quality.
- [Deployer](deployer/AGENT.md) — prepares and performs an explicitly authorized deployment.

## How to use

Tell the worker which role to adopt and provide the task and project name:

```text
Use agents/planner/AGENT.md to plan the demo-site homepage update.
```

```text
Use agents/developer/AGENT.md and workflows/astro/import-component.md to import this component into demo-site.
```

Use only the roles needed:

```text
Small fix:       Developer -> QA
Visual change:   Designer -> Developer -> QA
New project:     Planner -> Designer -> Developer -> QA
Release:         QA -> Deployer
```

Every role reads the root `AGENTS.md`, the relevant project documentation, the selected [workflow](../workflows/README.md), and only the skills needed for its task. The user's latest instructions take precedence. A role must hand off unresolved decisions, changed files, checks, and failures instead of silently expanding scope.
