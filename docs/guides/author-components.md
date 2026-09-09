# Author UI Components

Put low-level Astro components that are reusable across projects in `packages/ui`. Put components that serve only one customer in `apps/<project>/src/components`.

## Shared Component Guidelines

- Use TypeScript props and provide clear exports for public types.
- Use semantic `--wf-*` tokens rather than customer names, logos, exclusive colors, or copy.
- Keep a single responsibility. Page-level compositions usually belong in `packages/sections`.
- Provide keyboard behavior, semantic HTML, visible focus, and reduced-motion support by default.
- Allow limited composition through props, slots, and `class` rather than requiring source duplication.
- Expose stable entry points through the package's `package.json#exports` only.

## Minimal Structure

```text
packages/ui/
├── package.json
├── src/
│   ├── component-types.ts
│   ├── index.ts
│   └── primitives/NewComponent.astro
└── tsconfig.json
```

After adding a component, update `src/index.ts` and `package.json`:

```json
{
  "exports": {
    "./primitives/NewComponent": "./src/primitives/NewComponent.astro"
  }
}
```

Consumers should use:

```ts
import NewComponent from '@webfactory/ui/primitives/NewComponent';
```

Do not use `../../packages/ui/src/...` or depend on unexported internal paths.

## Styling Choices

- Use Tailwind v4 for layout and responsive composition.
- Use Astro scoped CSS for complex rules internal to a component.
- Use design tokens for brand values.
- If a directory containing new Tailwind classes is outside the application's `@source` coverage, update the style composition entry as well.

## Validation

Run at least:

```sh
pnpm --filter @webfactory/ui check
```

If a section, template, or demo consumes the component, run checks for those consumers as well. Run `pnpm test:integration` when the change affects cross-layer behavior.
