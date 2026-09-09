# Project Overrides

Project overrides express behavior or appearance that is genuinely unique to one website while preserving the upgrade path from shared layers. Try content, props, slots, and tokens before replacing an implementation.

## Section Overrides

Create an implementation with the same logical identity inside the project, for example:

```text
apps/example-site/src/overrides/sections/hero/HeroFullscreen.astro
```

Then add it to the registry's `project` layer:

```ts
{ name: 'project', entries: {
  'hero/HeroFullscreen': ProjectHero,
} }
```

The project may organize physical directories according to its own convention. The registry key, not automatic filesystem scanning, establishes the override relationship. An override should preserve the shared implementation's props contract wherever possible so template calls remain valid.

## Style Overrides

For brand color, typography, spacing, and radius, prefer redefining semantic tokens in `src/styles/project.css`:

```css
:root {
  --wf-color-primary: #513d2d;
  --wf-radius-lg: 1.5rem;
}
```

Do not edit theme files or copy the entire theme stylesheet. Project styles already occupy the final position in the cascade.

## Configuration Overrides

When configuration from multiple layers must be composed, use:

```ts
mergeConfig(sharedDefaults, templateConfig, themeConfig, projectConfig)
```

Plain objects merge recursively, while arrays are replaced as a whole. Do not assume arrays concatenate.

## Validate Fallback

Every override should have a demonstrable fallback path:

1. Register the Project override and confirm that it renders.
2. Remove that key from a test registry.
3. Confirm that resolution selects the next available Theme, Template, or Shared implementation.

Automated tests should manipulate registry data; real validation should not temporarily rename or delete user files.

## Cases That Do Not Need an Override

- Only copy or images differ: change content.
- Only color or typography differs: change project tokens.
- Multiple projects need the same capability: promote it to a shared component or section.
- Only page arrangement differs: use template slots, page composition, or an appropriate Template.
