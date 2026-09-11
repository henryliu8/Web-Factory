---
name: ui-design
description: Design or refine Web Factory interfaces using the shared semantic token system and reusable UI hierarchy. Use for visual styling, component variants, themes, and project-specific brand customization in this repository.
---

# UI design

Start from the content hierarchy and reuse existing primitives and sections before creating markup. Put the change in the narrowest valid layer:

- Project branding and one-off composition belong in `apps/<project>`.
- Reusable visual direction belongs in `themes/<theme>`.
- Reusable structure belongs in templates or shared packages.

Use existing `--wf-*` semantic tokens from `packages/tokens`. Add a token only when it represents a reusable design decision; keep project-only values in the project's final style layer. Do not encode brand names into shared tokens or components.

Prefer CSS and Astro over client-side JavaScript. Preserve readable typography, clear hierarchy, visible focus, sufficient contrast, and usable interactive states. Keep variants content-agnostic and avoid duplicating components for cosmetic differences.

Verify the affected pages at small and large viewport widths, then run the affected project's Astro check and build.
