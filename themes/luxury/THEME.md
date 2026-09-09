# Luxury theme

Luxury is a clean, premium, spacious, and architectural theme for Web Factory. It establishes visual direction through semantic token overrides, typography, generous section spacing, and restrained motion. Shared components remain unchanged and consume the same Web Factory token contract.

The public `@webfactory/theme-luxury/styles` entry loads the theme files in this order:

1. `tokens.css`
2. `theme.css`
3. `typography.css`
4. `motion.css`

Application composition loads this entry after Shared and Template styles. Projects can override any semantic token in the final Project stylesheet without modifying this theme.
