---
name: component-import
description: Import or adapt an external Astro component into Web Factory. Use when copying a component from another project, template, package, snippet, or generated source; use component-create for new components.
---

# Import Astro components

Inspect the source component, its callers, styles, assets, imports, dependencies, and license. Reuse an equivalent Web Factory component when one exists.

Choose the narrowest destination:

- `apps/<project>` for project-only components and overrides.
- `themes/<theme>` for necessary theme-specific markup; prefer tokens and styles.
- `templates/<template>` for template-only structure.
- `packages/ui` for reusable primitives.
- `packages/sections` for reusable website sections.

Remove source-project assumptions: move content to typed props or project data, replace cross-package relative imports with public `@webfactory/*` exports, and replace brand values with existing semantic `--wf-*` tokens. Preserve semantic HTML, keyboard access, focus behavior, and reduced-motion support.

Add a public package export or registry entry only when another layer must consume or override the component. For overridable sections, preserve stable logical paths such as `hero/HeroFullscreen` and Project > Theme > Template > Shared precedence.

Run the affected package or project Astro check and build. Run `pnpm test:integration` when public exports, registries, scaffolding, or style composition change.
