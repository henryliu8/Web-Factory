---
name: migration-component-import
description: Audit and adapt external Astro components into Web Factory. Use for migration work that must classify components as Project, Theme, Template, or Shared before importing; use astro/component-create for components authored from scratch.
---

# External Component Import Skill

## Purpose

Adapt external Astro components into Web Factory.

## Destination decision

Classify before implementation:

Project-specific
→ apps/<project>/src/components

Generic UI primitive
→ packages/ui

Reusable website section
→ packages/sections

Template-specific structural component
→ templates/<template>

## Rules

- Remove client-specific branding.
- Convert hard-coded content to typed props.
- Preserve accessibility.
- Preserve responsive behaviour.
- Prefer Astro and browser-native APIs.
- Preserve Tailwind CSS v4.
- Do not introduce Tailwind v3 configuration.
- Use Web Factory semantic --wf-* tokens.
- Use public @webfactory/* imports across package boundaries.
- Do not use ../../../packages imports.
- Do not use absolute developer paths.
- Add dependencies only when genuinely required.
- The package that imports a dependency must declare it.
- Keep project-specific components in Project first.
- Do not promote to Shared prematurely.

## Validation

Run:

pnpm install
pnpm -r --if-present run check
pnpm wf check <project>
pnpm wf build <project>
git diff --check

Then perform Ponytail review where appropriate.
