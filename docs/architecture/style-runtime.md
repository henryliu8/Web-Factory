# Style Runtime

The Web Factory styling stack combines Tailwind CSS v4, CSS custom properties, and Astro scoped CSS. Theme selection happens during Astro/Vite configuration and build, not through browser-time filesystem access.

## Fixed Load Order

The project's `src/styles/global.css` is the single composition entry:

```css
@import '@webfactory/tokens';
@import 'virtual:webfactory-template-style';
@import 'virtual:webfactory-theme-style';
@import './project.css';
```

The final order is always:

```text
Shared → Template → Theme → Project
```

Project CSS loads last so it can override theme tokens or add project-specific styles.

## How Astro Selects Styles

Each application's `astro.config.mjs`:

1. Imports `webfactory.config.ts`.
2. Supplies a static template and theme catalog to `createStyleRuntime()`.
3. Places the returned Vite plugin before the Tailwind plugin.
4. Lets the plugin replace the two virtual imports with the selected packages' public style exports.

The static catalog is an intentional build-time boundary. Selecting an unknown template or theme fails during configuration and lists the available entries. Unselected themes are not included in the final CSS.

## Tailwind v4 Sources

The scaffold's `global.css` also declares:

```css
@source '../../node_modules/@webfactory/ui/src';
@source '../../node_modules/@webfactory/sections/src';
@source '../../node_modules/@webfactory/template-stardrive/src';
```

This allows Tailwind to scan classes in linked workspace packages. If a new shared package or template contains Tailwind classes, add the corresponding `@source` to the application composition entry. Dynamically constructed class names may still be invisible to scanning, so use complete static class names or a controlled mapping.

## Responsibilities Within the Stack

- Design tokens: Stable semantic contracts for color, typography, spacing, and radius.
- Tailwind: Layout, responsive behavior, grid/flex, and rapid composition.
- Astro scoped CSS: Component-specific or structurally complex rules that are not well expressed as utilities.

Shared components must not embed project branding in Tailwind classes or scoped CSS. Prefer `var(--wf-...)` references.

## Adding a Template or Theme

After adding a workspace package and its public `./styles` export, update the catalog in the scaffold and existing applications' `astro.config.mjs` files. The current implementation does not automatically discover and inject style catalog entries from disk.

## Validation

Core unit tests validate composition order, exclusive theme selection, and invalid catalog entries. The end-to-end gate additionally checks that the built CSS contains the selected theme and project tokens without including an unselected theme.
