# Stardrive template

Stardrive provides the reusable structural layer for a Web Factory Astro project. It includes a document layout, shared navigation integration, a footer, a base stylesheet, and a minimal project scaffold.

The template intentionally does not define a visual brand. Projects and themes provide identity through semantic design-token overrides and optional component overrides.

## Structure

- `src/layouts/BaseLayout.astro` — compatibility wrapper for the document shell.
- `src/layouts/SiteLayout.astro` — document shell that loads the application-owned style composition entry once.
- `@webfactory/sections/header/Header` — the canonical shared site header used by Stardrive page templates.
- `src/components/Footer.astro` — reusable template footer.
- `src/styles/template.css` — structural defaults exposed as `@webfactory/template-stardrive/styles`.
- `scaffold/` — minimal files used when creating a project from this template.

The scaffold composes Shared, Template, the selected Theme, and Project styles in that order. Its Astro configuration resolves the selected template and theme from `webfactory.config.ts`; invalid catalog entries fail config loading.

Pages in the scaffold expose content as a `sections` array with logical section types, so they can be rendered by the Web Factory PageBuilder and resolved through project, theme, template, and shared layers.
