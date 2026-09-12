# Starwind components

Web Factory vendors the 55 Astro component families from Starwind UI 3.3.2 in
`packages/ui/src/starwind`. They are Shared capabilities and must not be copied
into individual projects.

Import a component family through its public package path:

```astro
---
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@webfactory/ui/starwind/carousel";
---
```

Projects using these components must load the shared bridge after tokens:

```css
@import "@webfactory/tokens";
@import "@webfactory/ui/starwind/styles";
```

The bridge maps Starwind's semantic roles to `--wf-*` values, so Theme and
Project token overrides remain authoritative. Existing Web Factory primitives
keep their original paths and APIs.

The families cover forms, navigation, overlays, feedback, layout, data display,
and media. They stay together in `packages/ui` because several compound
components share controls and Runtime behavior; splitting them between packages
would introduce circular dependencies.

Update the vendored source from `packages/ui`:

```sh
pnpm dlx starwind@3.3.2 update --all --yes --framework astro --package-manager pnpm
```

Review upstream changelogs and the generated diff before changing the pinned CLI
version in `packages/ui/starwind.config.json`.
