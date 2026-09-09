# Content Model

Web Factory follows the principle that content belongs to the Project while presentation belongs to components and templates. Editors should normally update Markdown, structured data, and images rather than changing Astro page structure.

## Current Implementation

Each generated project contains:

```text
src/content.config.ts
src/content/*.md
src/pages/*.astro
src/config/site.ts
```

`content.config.ts` defines a `pages` collection with Astro's `glob` loader and reuses the `pageContentSchema` exported by `@webfactory/core/content`. Pages call `getEntry('pages', id)` to retrieve validated data.

## Page Schema

The shared schema currently supports:

- Pages with `title`, optional `description`, and `sections`.
- `hero/HeroFullscreen`.
- `features/FeatureGrid`.
- `cta/CTA`.

Section types form a Zod discriminated union using `type`. Objects may contain additional fields, but known required fields are still validated. When adding a shared section type, update the schema, types, registry, and tests together.

## Keep Pages Thin

Page files should primarily:

1. Retrieve a content entry.
2. Produce a clear error when it is missing.
3. Select a template or PageBuilder.
4. Pass content and site metadata into the presentation layer.

Customer copy must not be scattered through shared components. Some example body copy in the current `demo-site` remains inline in page files; this is an integration reference, not the final pattern for a content-heavy production project.

## Content-to-Section Flow

The intended data path is:

```text
Markdown frontmatter.sections
  → Astro Content Collection/Zod
  → PageBuilder
  → sectionRegistry
  → resolved Astro component
```

The logical type must match a registry key, for example `type: hero/HeroFullscreen`.

## Images and General Data

- Put directly accessible static images in `public/images/` and reference them as `/images/...`.
- Put source images that need Astro optimization and metadata inference under the project's `src/`, then import them explicitly from components.
- Put cross-page navigation, contact details, and similar site data in `src/config` or `src/data`.
- Keep content structures serializable; do not store component implementations in Markdown frontmatter.

## Extending the Schema

If a field belongs only to one project, compose or extend the schema in that project's `content.config.ts`. Promote it to Core only after multiple projects share the same content contract. Shared schemas must not introduce customer-specific branding fields.
