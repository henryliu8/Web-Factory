# Create a Project

## Prepare the Environment

The repository requires Node.js `>=22.12.0` and pnpm 10. Install dependencies the first time with:

```sh
pnpm install --frozen-lockfile
```

List available resources:

```sh
pnpm wf list templates
pnpm wf list themes
```

The current catalog should include at least the `stardrive` template and the `default` and `luxury` themes.

## Create the Project

Interactive creation:

```sh
pnpm wf create example-site
```

Non-interactive creation:

```sh
pnpm wf create example-site \
  --template stardrive \
  --theme luxury \
  --pages home,about,services,projects,contact
```

The CLI normalizes the project name to kebab-case, ensures that `home` exists, copies the template scaffold, generates pages and project documentation, replaces placeholders, and atomically moves the result into `apps/example-site`. If creation fails, the staging directory is cleaned up and an existing project is never overwritten.

## Run and Validate

```sh
pnpm wf dev example-site
pnpm wf check example-site
pnpm wf build example-site
```

These commands first load and validate `webfactory.config.ts`, confirm that the selected template and theme exist, and then run Astro in the project directory.

## Primary Work Areas After Creation

- `project/`: Business context, design decisions, site map, plan, references, and project-level agent instructions.
- `src/content/`: Page content.
- `public/images/`: Project static images.
- `src/config/site.ts`: Cross-page site data.
- `src/styles/project.css`: Brand token overrides and project styles.
- `src/components/` and `src/sections/`: Only the project overrides that are genuinely required.

## Known Limitations

- Generated standard pages use Stardrive's `StandardPageTemplate`; the template import is currently fixed to Stardrive's public export.
- `pnpm wf sync <project>` explicitly reports that it is not implemented and does not modify project files.
- Adding a template or theme to the repository still requires maintaining the static style catalog in the scaffold and Astro configuration.
