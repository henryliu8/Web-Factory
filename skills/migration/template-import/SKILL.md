# External Template Import Skill

## Purpose

Adapt an external Astro site/template into the Web Factory Template layer.

## Template owns

- layout structure
- page structure
- section composition
- structural responsive behaviour
- project scaffold

## Template does NOT own

- customer content
- client branding
- project-specific assets
- Theme identity
- deployment
- generic Web Factory runtime

## Migration classification

Upstream layouts
→ Template

Upstream page composition
→ Template

Generic UI primitives
→ packages/ui

Reusable sections
→ packages/sections after generalisation

Visual identity
→ Theme

Blog / RSS / analytics / advanced features
→ defer unless explicitly requested

Deployment configuration
→ usually ignore

## Rules

Reuse existing:

@webfactory/core
@webfactory/ui
@webfactory/sections

Do not duplicate existing Shared components.

Template-specific widgets should remain Template-local first.

Remove upstream aliases such as:

~/

Use public @webfactory/* imports across package boundaries.

Preserve Tailwind CSS v4.

Do not copy an entire upstream application into templates/<name>.

## Validation

Create a real project using:

pnpm wf create <test-project> \
  --template <template> \
  --theme default

Then validate with:

default
luxury

Both must work.