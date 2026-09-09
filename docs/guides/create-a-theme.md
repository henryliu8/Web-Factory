# Create a Theme

A Theme is a switchable visual layer. It should change design direction through semantic tokens and general styles, providing component or section overrides only when tokens cannot express the required difference.

## Recommended Structure

```text
themes/<id>/
├── package.json
├── theme.config.ts
├── THEME.md
├── sections.json
└── src/
    ├── config/theme.ts
    └── styles/
        ├── index.css
        ├── tokens.css
        ├── typography.css
        ├── motion.css
        └── theme.css
```

`THEME.md` should explain design intent, suitable use cases, typography strategy, motion, and special constraints. It must not be an empty placeholder.

## Configuration and Exports

- The directory name and `theme.config.ts#id` must match.
- Name the package `@webfactory/theme-<id>`.
- Point `ThemeConfig.style` to the package's public style subpath.
- Export at least `.` and `./styles` from `package.json#exports`.
- Import the theme's internal styles in an intentional order from `src/styles/index.css`.

## Design Rules

- Override existing `--wf-*` tokens, or propose a new reusable semantic token.
- Avoid brand-named global tokens.
- Provide reduced-motion behavior for all motion.
- Do not put content, customer images, or page structure into a Theme.
- Markup overrides are exceptional; when required, preserve the same logical path and compatible props.

## Connect It to the Current System

The CLI lists a correctly named theme package automatically, but Astro does not load it automatically. Add a new theme to the static catalog in the scaffold and existing applications' `astro.config.mjs`, and add the theme package as a project dependency. The build injects only the theme selected by `webfactory.config.ts`.

## Validate Theme Isolation

1. Build once with the new theme and once with an existing theme.
2. Confirm that the final CSS contains the selected theme's tokens.
3. Confirm that distinctive tokens or fonts from an unselected theme are absent.
4. Confirm that `project.css` still loads last and can override theme values.
