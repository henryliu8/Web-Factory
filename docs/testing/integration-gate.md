# End-to-End Integration Gate

Root command:

```sh
pnpm test:integration
```

This is the current broadest cross-layer validation and executes the following sequence:

```text
demo-site Vitest
  → pnpm wf check demo-site
  → pnpm wf build demo-site
  → verifyDemoBuild.ts inspects build output
```

## What the Gate Proves

- The real `webfactory.config.ts` selects the expected template, theme, and five pages.
- The Project Hero overrides the Shared Hero.
- Header, FeatureGrid, and CTA fall back to Shared.
- An unknown logical section produces a controlled error.
- CSS import order is Shared, Template, Theme, Project.
- The Default theme is present and the Luxury theme does not leak into the Default build.
- The Project token override appears in the final CSS.
- Tailwind scans classes from monorepo dependencies.
- Five routes and their navigation links exist in the static output.

## What the Gate Does Not Prove

The current gate is not complete browser QA. It does not cover pixel-level visual differences, real keyboard flows, screen-reader behavior, performance budgets, external-link availability, or deployment-platform behavior. Add dedicated gates when those capabilities are implemented instead of assuming an Astro build covers them.

## When It Must Run

- Changes to inheritance, registries, PageBuilder, or content schemas.
- Changes to the style runtime, theme catalog, Tailwind sources, or tokens.
- Changes to CLI create/check/build behavior.
- Changes to the demo-site override or routes that prove the architecture.

Do not continue toward release or the next implementation phase when the gate fails. Run the smallest command in the failing chain to locate the issue, then rerun the complete gate.
