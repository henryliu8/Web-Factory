# Inheritance Model

Web Factory's override precedence is:

```text
Project > Theme > Template > Shared
```

This contract applies to components, sections, configuration, and styles, although each category uses a different merge mechanism.

## Two Ways to Read the Order

- When looking up the final result, check Project first, then fall back through Theme, Template, and Shared.
- When constructing the final result, merge Shared, Template, Theme, and Project in that order so later layers override earlier layers.

These are two descriptions of the same rule, not two different precedence orders.

## Components and Sections

Registries use logical paths as keys:

```text
hero/HeroFullscreen
features/FeatureGrid
header/Header
```

Each layer supplies an `entries` collection. `createRegistry()` sorts layers into the fixed order and merges them. A missing key naturally falls back to a lower layer; a matching key in a higher layer replaces the lower-layer value.

Projects currently import components and build registries explicitly. The system does not yet scan all directories automatically. See [Component and Section Resolution](component-resolution.md).

## Configuration

`mergeConfig(shared, template, theme, project)` recursively merges plain objects. Arrays and all other values are replaced as a whole by the later layer. Inputs are not mutated, and the result does not retain mutable nested objects from its inputs.

`webfactory.config.ts` currently defines project identity, template, theme, pages, site metadata, and deployment metadata. `defineProject()` validates it with Zod when imported. The Astro configuration currently uses its `template` and `theme` fields primarily to select styles.

## Styles

Styles do not use “first match wins.” Every layer participates in the CSS cascade in this order:

```text
@webfactory/tokens
template stylesheet
theme stylesheet
project.css
```

Project CSS loads last so it can redefine `--wf-*` variables without copying component CSS. See [Style Runtime](style-runtime.md).

## Content

Content belongs to the Project. The Template defines how structured content is presented, Shared provides schemas and reusable sections, and the Theme must not own customer copy. A project may extend its data model while keeping page content separate from Astro presentation components.

## Placement Decisions

| Requirement | Correct location |
| --- | --- |
| Button behavior used by multiple projects | `packages/ui` |
| A complete Hero used by multiple projects | `packages/sections` |
| Header, footer, and page skeleton | `templates/<template>` |
| A switchable visual language | `themes/<theme>` |
| Copy, images, or a special Hero for one customer | `apps/<project>` |
| A semantic value consumed by all components | Define it in `packages/tokens`; Theme and Project only override its value |

If a customer requirement appears to require changing Shared code, first determine whether tokens, slots, props, or a project override can express it.
