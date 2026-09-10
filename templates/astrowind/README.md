# AstroWind template

This package adapts [AstroWind](https://github.com/arthelokyo/astrowind) to the Web Factory inheritance model. It preserves AstroWind's reusable Astro components while separating structural template code from project content and visual branding.

## Classification

- `src/sections/` — AstroWind widgets exposed as overridable Web Factory sections.
- `src/components/` — UI primitives, blog components, and cross-section helpers.
- `src/layouts/` — document, page, landing, and Markdown layout contracts.
- `src/page-templates/` — generic route fallbacks used by the CLI.
- `src/styles/` — Tailwind v4 structural utilities mapped to `--wf-*` semantic tokens.
- `src/utils/` — image, permalink, frontmatter, and blog utilities.
- `src/integration/` — build-time YAML configuration integration.
- `scaffold/` — project-owned configuration, content, navigation, routes, public files, and style composition.

The template does not own a final brand. AstroWind compatibility variables (`--aw-*`) derive from Web Factory semantic tokens, so the selected theme and project overrides remain authoritative.

## Project images

Source images belong to the consuming project. Import files from the project's `src/assets/` directory and pass the resulting `ImageMetadata` to AstroWind sections, or place unprocessed files under `public/images/` and reference them as `/images/...`. The template deliberately does not glob project files across the package boundary.

## Upstream

Adapted from AstroWind `main`, retrieved 10 September 2026. The upstream MIT license is retained in `LICENSE.md`. Demo-only content, hosting presets, Docker/Nginx files, editor settings, lockfiles, and upstream agent instructions are intentionally not copied because they belong to a project or repository/tooling layer rather than a reusable Web Factory template.
