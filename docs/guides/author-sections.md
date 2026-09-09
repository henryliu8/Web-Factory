# Author Page Sections

A Section is a large Astro component that can serve as a primary page block, such as a Hero, FeatureGrid, or CTA. Put reusable sections in `packages/sections` and project-specific implementations in the project's override layer.

## Add a Shared Section

1. Choose a stable logical path such as `testimonials/Testimonials`.
2. Implement the component at `packages/sections/src/testimonials/Testimonials.astro`.
3. Use UI primitives and `--wf-*` tokens without customer branding.
4. Add a named export to `packages/sections/src/index.ts`.
5. Add a public subpath to `packages/sections/package.json#exports`.
6. If content drives the section, extend the discriminated union in `packages/core/src/content/schema.ts`.
7. Register the logical key in the application's section registry.
8. Add schema, resolution, and rendering tests.

## Keep Props and Content Aligned

Content schema field names should match component props, or a template should perform an explicit conversion. A component must not read a particular project's Markdown or site configuration; its data should come from the caller.

## Registry Example

```ts
import Testimonials from '@webfactory/sections/testimonials/Testimonials';

const shared = {
  'testimonials/Testimonials': Testimonials,
};
```

The logical path is the section's public identity. Renaming it affects content, registries, and existing projects and should be treated as a breaking architectural change.

## Project-Specific Sections

When only one site needs a section, begin with:

```text
apps/<project>/src/sections/<category>/<Name>.astro
```

Register it in the `project` layer. If multiple projects later need the same feature, remove brand coupling, define reusable props and tests, and then promote it to `packages/sections`.

## Validation Checklist

- The layout works on wide screens, tablets, and phones.
- Heading levels are appropriate and interactions are keyboard accessible.
- Images have an alternative-text strategy.
- Motion respects `prefers-reduced-motion`.
- An unknown section produces a clear error.
- `pnpm --filter @webfactory/sections check` and relevant application checks pass.
