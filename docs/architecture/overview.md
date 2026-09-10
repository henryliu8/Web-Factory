# Architecture Overview

Web Factory is a layered website production framework that uses Astro as its application runtime and pnpm workspaces for repository management. Its central goal is to keep shared capabilities upgradeable while giving each customer project independent content, branding, and a small number of necessary overrides.

## Four-Layer Responsibilities

```text
Shared packages → Template → Theme → Project
                                  Later layers override earlier layers
```

| Layer    | Directory         | Primary responsibility                                                                                          |
| -------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Shared   | `packages/`       | Types, configuration validation, design tokens, UI primitives, reusable sections, and foundational capabilities |
| Template | `templates/<id>/` | Page structure, layouts, structural defaults, and the project scaffold                                          |
| Theme    | `themes/<id>/`    | Visual direction such as color, typography, radius, and motion                                                  |
| Project  | `apps/<slug>/`    | Final content, images, site settings, brand overrides, and deployment configuration                             |

Selection precedence is `Project > Theme > Template > Shared`. The implementation merges from low to high precedence, so a later entry replaces an earlier entry with the same logical key.

## Workspace Responsibilities

- `packages/core`: Configuration schemas, deep merge, registries, PageBuilder, content schemas, and the style runtime.
- `packages/tokens`: Stable cross-theme defaults for semantic `--wf-*` tokens.
- `packages/ui`: Low-level reusable Astro components.
- `packages/sections`: Larger blocks that can be composed directly into pages.
- `packages/layouts`, `forms`, `seo`, `animations`, and `utilities`: Minimal package shells at present; do not assume they provide complete functionality.
- `templates/stardrive`: The only current template. It provides document layouts, page templates, and a scaffold.
- `themes/default` and `themes/luxury`: The currently available themes.
- `tools/cli`: Project creation, execution, validation, and resource listing.
- `apps/demo-site`: The reference application used by the core architecture and integration gate.

## Astro Loading Chain

```text
pnpm wf dev/build/check <project>
  → Read apps/<project>/webfactory.config.ts
  → Astro config validates the selected template and theme
  → Vite plugin composes Shared/Template/Theme/Project CSS
  → Astro pages load public template exports
  → Template resolves shared or project section overrides through a registry
  → Astro Content Collections load and validate content
```

The repository root is not an Astro application. Each `apps/<project>` directory owns its `astro.config.mjs`, pages, content, and build output.

## Stable Contracts

1. A project does not modify Shared, Template, or Theme code to express its own brand.
2. Shared components consume semantic design tokens and do not hard-code customer identity.
3. Override keys use complete relative logical paths such as `hero/HeroFullscreen`.
4. CSS always loads in Shared, Template, Theme, Project order.
5. Content remains separate from presentation and is validated with Zod and Astro Content Collections where practical.
6. Cross-workspace imports use `package.json#exports`, not internal `src` paths from another package.

## Current Boundaries

AI agent orchestration, automatic skill loading, a complete showcase, a dynamic plugin system, and `wf sync` are not currently implemented. Astro does not automatically load `skills/` or `agents/`; a separate generation or orchestration layer should read them in the future rather than bundling them into the website runtime.
