---
name: create-theme
description: Create a reusable visual theme for Web Factory. Use when adding a new theme under themes with semantic tokens, typography, motion, metadata, styles, and optional visual overrides.
---

# Create a theme

Inspect existing themes and the selected template before creating files. A theme controls visual direction, not page structure or project content.

Create the smallest complete package under `themes/<theme>` using the established theme layout and public style export. Define visual values through semantic `--wf-*` tokens and preserve the shared > template > theme > project stylesheet order.

Prefer tokens, typography, theme CSS, and motion CSS over replacing component markup. Add component or section overrides only when CSS cannot express the required visual treatment, and keep the same logical registry path.

Do not place customer branding, content, or one-project exceptions in a reusable theme. Preserve `prefers-reduced-motion` handling and Tailwind CSS v4 compatibility.

Verify the theme appears in `pnpm wf list themes`, then run its check and build an affected project with the theme selected. Use the integration gate when catalog or style-runtime behavior changes.
