# Create a project

Use this workflow to create a new site under `apps/` from an existing template and theme.

## Inputs

- Project name
- Template
- Theme
- Pages
- Project content and assets, when available

## Flow

1. Read the selected template README and relevant project requirements.
2. List valid choices with `pnpm wf list templates` and `pnpm wf list themes`.
3. Create the project:

   ```sh
   pnpm wf create <project> --template <template> --theme <theme> --pages <pages>
   ```

4. Update project-owned content, settings, documentation, and assets inside `apps/<project>`.
5. Use [project overrides](../webfactory/project-override.md) only for custom behavior that content and tokens cannot express.
6. Run [project validation](../quality/validate-project.md).

## Complete when

The requested routes exist, content is project-owned, the selected template and theme resolve, and both check and build pass.
