# Create a theme

Use this workflow for a reusable visual direction under `themes/`. Read [`create-theme`](../../skills/webfactory/create-theme/SKILL.md) first.

## Flow

1. Inspect existing themes, shared tokens, and the target template.
2. Create the smallest complete theme package with metadata and a public style export.
3. Define semantic token values, typography, theme styles, and reduced-motion behavior.
4. Add markup overrides only when styling cannot achieve the required result.
5. Confirm `pnpm wf list themes` includes the theme.
6. Select it in an affected project, then run that project's check and build.

## Complete when

The theme changes visual identity without owning project content or template structure, and a consuming project builds successfully.
