# Design Token Reference

Semantic design tokens form the stable visual contract between Shared, Theme, and Project. Defaults live in `packages/tokens/src/base.css`; themes and projects redefine values through the cascade.

## Naming

Framework tokens use the `--wf-` prefix and describe purpose rather than a brand-specific value:

```css
--wf-color-primary
--wf-color-background
--wf-color-surface
--wf-color-text
--wf-font-heading
--wf-space-6
--wf-container-max
--wf-section-space
--wf-radius-lg
--wf-motion-normal
```

Avoid theme- or customer-specific names such as `--luxury-gold` and `--forest-green`.

## Ownership

| Layer         | Responsibility                                                        |
| ------------- | --------------------------------------------------------------------- |
| Shared tokens | Define names, semantics, and safe defaults                            |
| Theme         | Redefine token values for a complete visual direction                 |
| Project       | Apply final brand adjustments and a small number of special overrides |
| Component     | Consume tokens without deciding customer branding                     |

## Add a Token

Before adding a token, confirm that it describes a reusable design decision. Then:

1. Provide a reasonable default in the base tokens.
2. Override it in themes that genuinely need a different value.
3. Consume it from components through `var(--wf-name)`.
4. Check both the Default and Luxury themes.
5. Document a fallback or compatibility strategy so older themes do not fail when the token is absent.

A component may provide a CSS fallback:

```css
color: var(--wf-color-emphasis, var(--wf-color-text));
```

Stable tokens should ultimately become part of the base contract.

## Responsive Tokens

Prefer fluid CSS values with `clamp()`. The repository includes `packages/tokens/src/breakpoints.ts`, but `@webfactory/tokens` does not currently expose that TypeScript subpath. Consumers must not bypass `package.json#exports` to import it. If shared breakpoint APIs are required, add a formal public export and tests before replacing duplicated values.

## Override Example

```css
/* apps/example-site/src/styles/project.css */
:root {
  --wf-color-primary: #513d2d;
  --wf-font-heading: "Example Sans", sans-serif;
}
```

A project overrides only its differences; all other values continue to inherit from the selected Theme and Shared defaults.
