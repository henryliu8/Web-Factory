# Manage Project Content

Project content primarily lives in `apps/<project>/src/content`, while public images live in `public/images`. Editing content should not require modifying shared components.

## Page Markdown

A content-driven page can look like this:

```md
---
title: Home
description: Example home page.
sections:
  - type: hero/HeroFullscreen
    title: A reusable website foundation
    description: Content remains independent from presentation.
    primaryCTA:
      label: Contact us
      href: /contact
---
```

The `type` must be a registered logical path included in the shared Zod union. Invalid fields surface during Astro content synchronization, check, or build.

## Read Content in a Page

```astro
---
import { getEntry } from 'astro:content';

const entry = await getEntry('pages', 'home');
if (!entry) throw new Error('Missing content entry: home');
---
```

Do not silently ignore missing content, because that could allow an empty generated page to reach production.

## Site-Level Data

Put navigation, site name, default language, company contact details, and other cross-page data in `src/config/site.ts` or `src/data/`. Keep page-specific body copy in Content Collections.

## Images

- `public/images/...`: Reference as `/images/...`; suitable for stable CMS-style paths and resources that do not require imports.
- `src/assets/...`: Import through Astro `Image` or `Picture`; suitable for resources that need build-time optimization.
- Give every informative image accurate alt text. Use empty alt text for decorative images.

## Validate Changes

```sh
pnpm wf check <project>
pnpm wf build <project>
```

When changing a content schema, also run Core tests and the end-to-end integration gate.
