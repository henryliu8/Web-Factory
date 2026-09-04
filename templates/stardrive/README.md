# Stardrive template

Stardrive provides the reusable structural layer for a Web Factory Astro project. It includes a document layout, shared navigation integration, a footer, a base stylesheet, and a minimal project scaffold.

The template intentionally does not define a visual brand. Projects and themes provide identity through semantic design-token overrides and optional component overrides.

## Structure

- `src/layouts/BaseLayout.astro` — document shell with token and template styles.
- `src/components/Header.astro` — integration with the shared UI header.
- `src/components/Footer.astro` — reusable template footer.
- `src/styles/template.css` — structural defaults only.
- `scaffold/` — minimal files used when creating a project from this template.

Pages in the scaffold expose content as a `sections` array with logical section types, so they can be rendered by the Web Factory PageBuilder and resolved through project, theme, template, and shared layers.
