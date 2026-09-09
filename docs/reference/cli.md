# CLI Reference

Root command:

```sh
pnpm wf <command>
```

## Commands

| Command | Status | Description |
| --- | --- | --- |
| `create <project>` | Implemented | Create a project from a template scaffold |
| `dev <project>` | Implemented | Validate configuration, then run `astro dev` |
| `build <project>` | Implemented | Validate configuration, then run `astro build` |
| `check <project>` | Implemented | Validate configuration, then run `astro check` |
| `sync <project>` | Not implemented | Currently fails safely and explicitly reports that no files were changed |
| `list templates` | Implemented | List template packages that follow the naming convention |
| `list themes` | Implemented | List theme packages that follow the naming convention |

## `create`

```sh
pnpm wf create <project> \
  [--template <id>] \
  [--theme <id>] \
  [--pages <comma-separated>]
```

Missing options are selected interactively. Project and page names are normalized to kebab-case. Paths, absolute paths, `.`, and `..` are rejected. `home` is always included and generates `src/pages/index.astro`.

Creation uses a staging directory. The CLI moves it to the final destination only after copying, generation, placeholder processing, and basic manifest validation all succeed. Existing projects are never overwritten.

## Resource Discovery

`list` discovers resources when they meet these conditions:

- They are direct children of the repository's `templates/` or `themes/` directory.
- The child directory contains a valid `package.json`.
- The package name exactly matches `@webfactory/template-<folder>` or `@webfactory/theme-<folder>`.

## Current Validation Scope

`dev`, `build`, and `check` validate the project directory, `webfactory.config.ts`, the Project Zod schema, template ID, and theme ID. Astro commands perform deeper content and Astro validation.

## Error Behavior

The CLI writes concise known errors to stderr and sets a nonzero exit code. Invalid templates and themes include the currently available values in their error messages.
