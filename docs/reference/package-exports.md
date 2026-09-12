# Workspace Packages and Public Exports

`packages/` is a collection of shared modules; it is not equivalent to “components.” Components primarily live in `ui` and `sections`, while other packages provide runtime behavior, tokens, or boundaries for future capabilities.

## Current Packages

| Package                                              | Current public capabilities                                                              |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `@webfactory/core`                                   | Configuration, content schemas, registries, PageBuilder, style runtime, and shared types |
| `@webfactory/tokens`                                 | Default CSS tokens and `base.css`                                                        |
| `@webfactory/ui`                                     | Web Factory primitives plus 55 Starwind component families under `starwind/*`            |
| `@webfactory/sections`                               | Header, HeroFullscreen, FeatureGrid, and CTA                                             |
| `@webfactory/template-stardrive`                     | Layouts, page templates, template styles, and types                                      |
| `@webfactory/theme-default`                          | Default theme configuration and styles                                                   |
| `@webfactory/theme-luxury`                           | Luxury theme configuration and styles                                                    |
| `@webfactory/cli`                                    | The `webfactory` command-line program                                                    |
| `@webfactory/layouts/forms/seo/animations/utilities` | Minimal package shells at present; they should not be presented as complete libraries    |

## Recommended Imports

```ts
import { createSectionRegistry, defineProject } from "@webfactory/core";
import { pageContentSchema } from "@webfactory/core/content";
import PageBuilder from "@webfactory/core/page-builder/PageBuilder.astro";
import Button from "@webfactory/ui/primitives/Button";
import { Carousel, CarouselItem } from "@webfactory/ui/starwind/carousel";
import Hero from "@webfactory/sections/hero/HeroFullscreen";
import SiteLayout from "@webfactory/template-stardrive/layouts/SiteLayout";
```

CSS:

```css
@import "@webfactory/tokens";
@import "@webfactory/ui/starwind/styles";
@import "@webfactory/template-stardrive/styles";
@import "@webfactory/theme-default/styles";
```

Applications normally select template and theme styles through the virtual style entry. They should not hard-code imports for multiple themes at the same time.

## Package Creation Rules

A shared package should contain at least `package.json`, a `src/index.ts` or CSS entry, and any required `tsconfig.json`. Export only stable entry points so internal refactoring does not force consumers to change imports. Use `workspace:*` for dependencies on repository packages and avoid dependency cycles.

Do not create a repetitive README containing only a heading for every package. Put substantial location-specific instructions in a README when needed; otherwise maintain the information here.
