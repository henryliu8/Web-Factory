# `webfactory.config.ts` Reference

Every application uses its root-level `webfactory.config.ts` as the Web Factory project configuration entry.

```ts
import { defineProject } from '@webfactory/core';

export default defineProject({
  name: 'Example Site',
  slug: 'example-site',
  template: 'stardrive',
  theme: 'default',
  pages: ['home', 'about'],
  site: {
    url: 'https://example.com',
    language: 'en-AU',
  },
  deploy: {
    provider: 'cloudflare',
  },
});
```

## Fields

| Field | Required | Constraint |
| --- | --- | --- |
| `name` | Yes | Non-empty string |
| `slug` | Yes | Lowercase kebab-case |
| `template` | Yes | Non-empty ID; the CLI additionally confirms it exists in the catalog |
| `theme` | Yes | Non-empty ID; the CLI additionally confirms it exists in the catalog |
| `pages` | Yes | At least one non-empty ID |
| `site.url` | No | Valid URL |
| `site.language` | No | Non-empty string |
| `deploy.provider` | No | Non-empty string |

The schema uses `.passthrough()`, so a project may carry additional fields. Their presence does not mean Core or the CLI currently consumes them.

## Consumers

- CLI `dev`, `build`, and `check` dynamically import the file and call `parseProjectConfig()`.
- The application's `astro.config.mjs` imports it and uses `template` and `theme` to select styles.
- Tests may import it directly to validate the real project configuration.

The configuration file executes in the Node/Astro configuration environment. It should not access browser APIs or contain secrets that the public website does not need.

## Configuration Merge

Core provides `mergeConfig()`, but current applications do not automatically deep-merge every template, theme, and project configuration. When a caller needs composition, it should explicitly pass layers in `shared, template, theme, project` order. Arrays replace earlier arrays rather than concatenating.
