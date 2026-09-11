---
name: component-create
description: Create a new Astro component or section for Web Factory. Use when implementing a project component, shared UI primitive, reusable section, template structure, or theme-specific component from scratch.
---

# Create Astro components

Inspect existing components and callers first. Extend or compose an existing component when that is smaller than adding another public component.

Place the component in the narrowest valid layer:

- `apps/<project>/src/components` or `src/sections` for project-only behavior.
- `themes/<theme>` only when a theme must replace markup; prefer style overrides.
- `templates/<template>` for reusable template structure.
- `packages/ui` for content-agnostic primitives.
- `packages/sections` for reusable page sections.

Use TypeScript props, semantic HTML, Astro, Tailwind CSS v4, and existing `--wf-*` tokens. Keep content in props or project-owned data and branding out of shared components. Prefer CSS and native browser behavior over client hydration.

Add a package export or registry entry only when required by a real consumer. Registry keys use relative logical paths such as `features/FeatureGrid`.

Run the narrowest affected Astro check and build. Use `pnpm test:integration` when a public contract or override path changes.
