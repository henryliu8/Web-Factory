---
name: performance
description: Diagnose and improve Web Factory page performance, bundle size, image delivery, rendering, and loading behavior. Use when addressing Core Web Vitals, slow builds, excessive JavaScript, or heavy assets.
---

# Performance

Measure or identify the actual bottleneck before changing architecture. Prefer the smallest fix that improves the observed path.

Keep pages server-rendered or static by default. Avoid client hydration unless interaction requires it; when it does, hydrate the smallest component at the latest suitable time. Reuse installed packages and browser capabilities instead of adding performance libraries.

Size images to their rendered use, provide width and height, use appropriate formats, and avoid eager-loading below-the-fold media. Keep critical above-the-fold content discoverable without JavaScript. Limit font families, weights, and render-blocking resources.

Preserve the Web Factory style order and inheritance model when reducing CSS. Do not bypass registries, public exports, integration tests, or theme/template boundaries for a benchmark gain.

Compare the same route and build mode before and after. Run the affected project check and build; use the integration gate when changing shared loading, styles, or package contracts.
