# Create a template

Use this workflow for reusable site structure under `templates/`. Read [`create-template`](../../skills/webfactory/create-template/SKILL.md) first.

## Flow

1. Inspect existing templates, CLI creation behavior, registries, and style composition.
2. Create the template package, structural source, public exports, and minimal scaffold.
3. Reuse shared packages and keep project content out of the template.
4. Confirm `pnpm wf list templates` includes the template.
5. Create a project from the template using the normal CLI path.
6. Run the generated project's check and build, then the integration gate if a shared contract changed.

## Complete when

The CLI can discover the template and create a runnable project without copying shared libraries or embedding final branding.
