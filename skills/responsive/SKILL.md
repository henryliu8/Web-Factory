---
name: responsive
description: Implement and diagnose responsive layouts in Web Factory Astro components and pages. Use when adapting navigation, grids, typography, media, spacing, or overflow across viewport sizes.
---

# Responsive layout

Make the base layout work on narrow screens, then add breakpoints only where the content visibly needs them. Prefer intrinsic CSS:

- `grid`, flex wrapping, `minmax()`, `auto-fit`, and `clamp()` over viewport-specific JavaScript.
- Fluid semantic spacing and typography tokens over repeated hard-coded media queries.
- `max-inline-size`, responsive images, and natural document flow over fixed dimensions.

Keep responsive behavior with the component that owns the layout. Put brand-level sizing changes in theme or project styles without changing shared structure unless the structure itself is reusable.

Check for horizontal overflow, clipped focus indicators, readable line lengths, touch-target usability, image distortion, and navigation access at narrow and wide widths. Respect zoom and text resizing; do not disable viewport scaling.

Run the affected project's Astro check and build after changes.
