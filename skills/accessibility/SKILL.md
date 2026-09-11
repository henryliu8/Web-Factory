---
name: accessibility
description: Review or improve accessibility in Web Factory Astro pages, components, forms, and interactions. Use for semantic markup, keyboard access, focus, accessible names, contrast, reduced motion, and content structure.
---

# Accessibility

Use native HTML semantics before ARIA. Preserve a logical heading structure, landmarks, labels, alternative text, link purpose, and source order. Use buttons for actions and links for navigation.

For interactive UI, ensure keyboard operation, visible focus, an accessible name, and understandable state. Add ARIA only when native semantics cannot express the behavior, and keep ARIA state synchronized with the UI.

Use Web Factory semantic color tokens while maintaining readable contrast. Do not convey meaning through color alone. Preserve the existing `prefers-reduced-motion` behavior and avoid motion that blocks reading or interaction.

For forms, associate every control with a label, expose errors near the field and in text, preserve submitted values after validation, and use appropriate native input types and autocomplete attributes.

Test the changed flow with keyboard-only navigation and inspect the rendered accessibility tree when browser tooling is available. Run the affected project's Astro check and build.
