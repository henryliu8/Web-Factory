# ADR 0001: Use a pnpm Workspace and Turbo

- Status: Accepted
- Scope: Repository organization and task execution

## Context

Web Factory contains reusable packages, templates, themes, applications, and development tools. They require independent package identities, shared local dependencies, and checks and builds that follow the dependency graph.

## Decision

Use pnpm workspaces to manage:

```text
apps/*
packages/*
templates/*
themes/*
tools/*
```

Internal package dependencies use `workspace:*`. Turbo schedules root tasks, and developers access the CLI through root-level `pnpm wf` rather than memorizing complex filter commands.

## Consequences

- Shared source code is not copied into each project.
- Package `exports` become the public boundary between workspaces.
- Turbo can execute tasks according to dependencies and cache build output.
- pnpm manages `node_modules` and its symlinks; no file inside it should be edited manually.
- A new workspace must live under a declared glob and have a unique package name.

## Alternatives

A single Astro project would mix customer and framework code and make upgrades difficult. Handwritten relative imports would lack stable package boundaries. A heavier monorepo platform is unnecessary at the current scale.
