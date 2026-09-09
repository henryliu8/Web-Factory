# ADR 0003: Resolve Template and Theme Styles Statically at Build Time

- Status: Accepted
- Scope: Astro/Vite style loading

## Context

A project selects a template and theme in `webfactory.config.ts`. Production builds must not rely on runtime filesystem scanning or send every theme's CSS to the browser.

## Decision

During configuration, each Astro application supplies a static template and theme catalog to `createStyleRuntime()`. Core returns a Vite pre-plugin that replaces virtual template and theme imports in the application's `global.css` with the selected packages' public style entries.

```text
webfactory.config.ts
  → static catalog lookup
  → virtual import replacement
  → Tailwind/Vite processing
  → selected CSS only
```

An unknown ID fails during configuration and lists the available entries.

## Consequences

- Builds are deterministic and do not depend on a production runtime filesystem.
- Unselected themes do not enter the final CSS.
- A single application entry makes CSS order straightforward to inspect and test.
- Adding a template or theme requires updating the scaffold and existing application catalogs; CLI directory discovery does not perform this step automatically.

## Future Evolution

The CLI may eventually generate the static catalog during creation or a safe `sync`, reducing manual maintenance. The generated result should remain an explicit mapping that can be validated at build time, without introducing browser-time discovery.
