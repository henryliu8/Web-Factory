# Web Factory Documentation

This documentation describes the repository's current implementation, stable architectural contracts, and everyday development workflows. The root `README.md` provides the project introduction and quick start, while `WEB_FACTORY_REQUIREMENTS.md` is the initial requirements specification. The documents here explain how the code works today.

## Start Here

- [Architecture Overview](architecture/overview.md): Learn the four-layer Shared, Template, Theme, and Project model.
- [Create a Project](guides/create-a-project.md): Create and run an Astro application with the CLI.
- [Component and Section Resolution](architecture/component-resolution.md): Understand logical paths, registries, and override precedence.
- [Style Runtime](architecture/style-runtime.md): Understand theme selection and CSS load order.
- [Validation and Testing](testing/validation.md): Choose the appropriate validation commands.

## Documentation Map

### Architecture

- [Architecture Overview](architecture/overview.md)
- [Inheritance Model](architecture/inheritance-model.md)
- [Component and Section Resolution](architecture/component-resolution.md)
- [Style Runtime](architecture/style-runtime.md)
- [Content Model](architecture/content-model.md)

### Development Guides

- [Create a Project](guides/create-a-project.md)
- [Author UI Components](guides/author-components.md)
- [Author Page Sections](guides/author-sections.md)
- [Create a Template](guides/create-a-template.md)
- [Create a Theme](guides/create-a-theme.md)
- [Project Overrides](guides/project-overrides.md)
- [Project Content](guides/project-content.md)

### Reference

- [CLI Commands](reference/cli.md)
- [`webfactory.config.ts`](reference/webfactory-config.md)
- [Workspace Packages and Public Exports](reference/package-exports.md)
- [Design Tokens](reference/design-tokens.md)
- [Registry API](reference/registries.md)

### Quality and Decisions

- [Validation Strategy](testing/validation.md)
- [End-to-End Integration Gate](testing/integration-gate.md)
- [ADR 0001: pnpm/Turbo Monorepo](decisions/0001-pnpm-turbo-monorepo.md)
- [ADR 0002: Template and Theme Separation](decisions/0002-template-theme-separation.md)
- [ADR 0003: Static Build-Time Theme Resolution](decisions/0003-static-theme-resolution.md)

## Documentation Conventions

- “Current implementation” means behavior supported by existing repository code and automated validation.
- “Specification target” means a requirement in `WEB_FACTORY_REQUIREMENTS.md` that may not yet be fully implemented.
- Examples use public package exports whenever possible and do not depend on another workspace's internal source paths.
- Architectural precedence is always written as `Project > Theme > Template > Shared`; the corresponding merge order is `Shared → Template → Theme → Project`.
