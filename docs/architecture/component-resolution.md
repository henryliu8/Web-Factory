# Component and Section Resolution

Web Factory uses explicit registries to map stable logical paths to Astro components. Logical paths are independent of physical file locations, allowing a project to replace an implementation without changing the `type` stored in content.

## Current Flow

`packages/core` provides:

- `createRegistry()`: The general layered merge function.
- `createComponentRegistry()`: A semantic alias for component registries.
- `createSectionRegistry()`: A semantic alias for section registries.
- `resolveEntry()` / `requireEntry()`: Look up any registered entry.
- `resolveSection()`: Look up a section and produce a development error that includes the available keys.
- `PageBuilder.astro`: Accept `sections` and `sectionRegistry`, then render the resolved components in order.

Registry layer names are fixed to `shared | template | theme | project`. Core merges them in that order even when the caller supplies the layers in a different order.

## Build a Registry

```ts
import { createSectionRegistry } from '@webfactory/core';
import SharedHero from '@webfactory/sections/hero/HeroFullscreen';
import ProjectHero from '../overrides/sections/hero/HeroFullscreen.astro';

export const sectionRegistry = createSectionRegistry([
  { name: 'shared', entries: { 'hero/HeroFullscreen': SharedHero } },
  { name: 'template', entries: {} },
  { name: 'theme', entries: {} },
  { name: 'project', entries: { 'hero/HeroFullscreen': ProjectHero } },
]);
```

The final `hero/HeroFullscreen` entry points to `ProjectHero`. Removing that project entry makes resolution fall back to the shared Hero.

## Logical Path Rules

- Use POSIX-style `/`; backslashes are normalized.
- Extensions such as `.astro`, `.ts`, `.tsx`, `.js`, or `.jsx` may be included or omitted.
- A key must include both a directory and name; `HeroFullscreen` alone is invalid.
- Do not use basenames as unique keys. `hero/Card` and `features/Card` must be able to coexist.

## Resolve Components in a Template

When Stardrive's `HomeTemplate` receives a `sectionRegistry`, it calls `resolveSection()` for Header, Hero, FeatureGrid, and CTA. Without a registry, it imports those shared sections directly. This fallback is compatibility behavior owned by the template; it does not indicate repository-wide automatic discovery.

A content-driven page can use PageBuilder directly:

```astro
---
import PageBuilder from '@webfactory/core/page-builder/PageBuilder.astro';
import { sectionRegistry } from '../config/sectionRegistry';

const sections = entry.data.sections;
---

<PageBuilder {sections} {sectionRegistry} />
```

## Automation Not Yet Implemented

The specification allows a future build-time implementation based on `import.meta.glob()`. Registries are currently explicit, and the CLI's `sync` command does not generate them. Before automatic scanning is introduced, define an unambiguous directory-to-key mapping, collision errors, and cross-platform path tests.
