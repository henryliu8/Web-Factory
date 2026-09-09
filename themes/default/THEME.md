# Default theme

The Default theme is the neutral Web Factory foundation. It provides semantic token values, typography defaults, predictable spacing, and reduced-motion behavior without imposing project branding.

The public `@webfactory/theme-default/styles` entry loads the theme files in this order:

1. `tokens.css`
2. `theme.css`
3. `typography.css`
4. `motion.css`

Application composition loads this entry after Shared and Template styles. Projects may override its values with the final Project stylesheet.
