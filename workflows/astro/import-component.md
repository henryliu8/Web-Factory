# Import an Astro component

Use this workflow when adapting external Astro code. Read [`component-import`](../../skills/astro/component-import/SKILL.md) first.

## Flow

1. Inspect the source license, dependencies, callers, styles, and assets.
2. Confirm Web Factory does not already provide the same capability.
3. Choose the narrowest correct destination layer.
4. Remove source branding and move content to typed props or project data.
5. Replace private imports and hard-coded design values with public exports and semantic `--wf-*` tokens.
6. Add only required exports or registry entries.
7. Run the affected check and build; run `pnpm test:integration` for public contract or registry changes.

## Complete when

The component is license-compatible, dependency-minimal, reusable at its chosen layer, and verified by the relevant checks.
