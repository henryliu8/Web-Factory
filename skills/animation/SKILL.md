---
name: animation
description: Design, implement, or diagnose web motion in Web Factory using CSS, semantic motion tokens, and reduced-motion support. Use for transitions, keyframes, reveals, hover motion, scroll effects, and animation performance.
---

# Animation

Use motion only when it communicates state, hierarchy, or continuity. Prefer CSS transitions and keyframes over client-side JavaScript, and reuse `--wf-duration-*`, `--wf-ease-*`, or `--wf-motion-normal` tokens.

Choose the smallest mechanism that fits:

- CSS transitions for state changes and hover or focus feedback.
- CSS keyframes for self-contained sequences.
- A small native observer only when animation depends on entering the viewport.
- Client-side libraries only when an installed library provides required sequencing or interaction that native features cannot express.

Theme-wide motion belongs in `themes/<theme>/src/styles/motion.css`. Component-specific motion stays with the component; project-only effects stay in the project layer. Do not place brand-specific motion in shared packages.

Animate `transform` and `opacity` when practical. Avoid layout-triggering animation, continuous decorative motion, and animation that delays access to content or controls.

Every meaningful effect must degrade safely under `prefers-reduced-motion: reduce`; do not remove information along with the animation. Verify both normal and reduced-motion modes, then run the affected project check and build.
