# Add a project override

Use this workflow when one project must replace shared, template, or theme behavior. Read [`project-override`](../../skills/webfactory/project-override/SKILL.md) first.

## Flow

1. Confirm the change is project-specific and cannot be expressed through content or existing semantic tokens.
2. Find the upstream component, public props, logical path, and registry callers.
3. Add the override only inside `apps/<project>` while preserving the logical path and public contract.
4. Register the project entry through the existing registry composition.
5. Verify the project override wins and the upstream fallback still works.
6. Run the project check, build, and integration gate when precedence or fallback behavior changed.

## Complete when

The project customization works without modifying or duplicating unrelated upstream code.
