---
name: astro-debug
description: Diagnose Astro build, rendering, hydration, content, import, and routing failures in Web Factory. Use when an Astro page or component errors, renders incorrectly, cannot resolve an entry, or fails check or build.
---

# Debug Astro

Reproduce the smallest failing command or route, read the complete error, and trace the failing component through its callers before editing. Fix the shared root cause when sibling callers use the same path.

Check the likely boundary:

- Astro frontmatter, props, imports, content collections, and route generation.
- Public package exports and `@webfactory/*` import paths.
- Section logical paths and Project > Theme > Template > Shared registry order.
- Shared, template, theme, and project stylesheet composition.
- Client directives only when the failure involves hydration.

Do not hide type, schema, or resolution errors with casts or fallback content. Preserve useful development errors and avoid adding dependencies for diagnosis.

Run the originally failing check after the fix, then the affected project build. Run `pnpm test:integration` for shared registry, scaffold, style runtime, or package-contract fixes.
