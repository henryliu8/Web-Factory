---
name: create-template
description: Create a reusable Web Factory Astro template. Use when adding a structural site template under templates with layouts, page templates, section composition, configuration, and a minimal project scaffold.
---

# Create a template

Inspect existing templates and the CLI scaffold flow before creating files. A template owns site structure and functional defaults; it must not hard-code the final visual brand.

Create the smallest complete package under `templates/<template>` with public exports, structural source files, template styles, configuration, and a minimal `scaffold/` that can generate a runnable project. Reuse shared packages instead of copying them into the scaffold.

Keep generated pages thin and content project-owned. Use public `@webfactory/*` imports, stable section logical paths, Tailwind CSS v4, and the existing style runtime. Preserve Project > Theme > Template > Shared override behavior.

Verify the template appears in `pnpm wf list templates`. Generate a temporary project through `pnpm wf create`, then run its check and build. Run `pnpm test:integration` when changing the CLI, scaffold contract, registries, or style composition.
