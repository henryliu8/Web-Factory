# Animations

`@webfactory/animations` provides isolated Motion and GSAP entry points while keeping accessibility policy shared.

Use the lightest mechanism that fits: CSS transitions first, then `motion/mini`, full Motion for advanced DOM animation, and GSAP for timelines or plugin-driven effects.

```ts
import { prefersReducedMotion } from "@webfactory/animations";
import { animate } from "@webfactory/animations/motion/mini";

animate(
  element,
  { opacity: [0, 1] },
  {
    duration: prefersReducedMotion() ? 0 : 0.3,
  },
);
```

Full Motion and GSAP are separate imports, so consumers only load the engine they use:

```ts
import { animate, scroll } from "@webfactory/animations/motion";
import { gsap } from "@webfactory/animations/gsap";
```

In Astro, place browser animation imports inside a component `<script>` rather than frontmatter. Animate `transform` and `opacity` where possible. Every effect must handle `prefers-reduced-motion`; use an immediate state change or omit decorative motion.

GSAP plugins are intentionally not registered globally. Import and register only the plugin required by a real component so unused plugins remain outside other bundles.
