# Web Factory Agent Instructions

Always read:

1. WEB_FACTORY_REQUIREMENTS.md
2. README.md
3. The relevant package README, when one exists
4. Existing code before modifying files

Documentation policy:

- Keep the root README.md as the repository-wide introduction.
- Do not add or retain unnecessary placeholder README.md files in packages, apps, templates, themes, tools or other subdirectories.
- Add a subdirectory README.md only when it contains meaningful, location-specific documentation that cannot reasonably live in the root README.md.

Core architecture:

Project > Theme > Template > Shared

Never bypass this inheritance model.

Rules:

- Use pnpm.
- Use TypeScript.
- Use Astro.
- Use Tailwind CSS v4.
- Use semantic Web Factory design tokens.
- Do not hard-code project branding in shared components.
- Do not duplicate shared components into projects.
- Prefer reusable components.
- Keep content separate from presentation.
- Project-specific customization belongs inside apps/<project>.
- Do not introduce unnecessary dependencies.
- Do not implement AI agents unless explicitly requested.
- Never proceed to another implementation phase while the current phase has build or test failures.
- Run relevant checks after changes.
- Explain major architecture deviations before implementing them.