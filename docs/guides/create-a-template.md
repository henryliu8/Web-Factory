# Create a Template

A Template defines structure rather than final branding. It may provide layouts, header and footer behavior, page templates, structural styles, content conventions, and the minimal scaffold required to create a project.

## Recommended Structure

```text
templates/<id>/
├── package.json
├── template.config.ts
├── src/
│   ├── layouts/
│   ├── page-templates/
│   ├── components/
│   ├── sections/
│   ├── styles/template.css
│   └── index.ts
└── scaffold/
    ├── astro.config.mjs
    ├── package.json.template
    ├── tsconfig.json
    ├── webfactory.config.ts
    └── src/
```

Add a README only when the template has meaningful, location-specific instructions. Do not create an empty placeholder README.

## Required Contracts

- Use kebab-case for the directory name and configuration `id`.
- Name the package `@webfactory/template-<id>`.
- Make `template.config.ts` satisfy `TemplateConfig`, including at least `id`, `name`, and a public `style` entry.
- Expose stable layouts, page templates, and `./styles` through `package.json#exports`.
- Keep template CSS structural; final visual branding belongs to the Theme.
- Copy only minimal project files from the scaffold, never the shared component library.

## Connect It to the Current System

Current discovery has two parts:

1. The CLI lists templates by checking the standard package name in `templates/<id>/package.json`.
2. The Astro style runtime resolves template styles through the static catalog in each scaffold or application's `astro.config.mjs`.

After adding a template, update the relevant Astro catalogs and ensure generated projects depend on the template package. Creating the directory alone does not make the build load it.

## Page Templates and Overrides

A page template may import shared sections directly or accept a section registry to support layered overrides. Prefer inputs and slots; do not import from a customer project's internal paths.

## Validation

- `pnpm wf list templates` lists the new ID.
- The template package check passes.
- Creating a temporary project with the template succeeds.
- The temporary project's check and build pass.
- Switching Theme does not require changing the template's page structure.
