# Validation Strategy

Validation scope should match change risk and follow the repository rule that no implementation phase proceeds while the current phase has failures.

## Common Commands

```sh
pnpm check
pnpm build
pnpm test:integration
```

Turbo schedules `pnpm check` and `pnpm build` across workspaces that define the corresponding script. Minimal package shells without a script do not execute that task.

## Targeted Validation

| Change | Minimum recommended validation |
| --- | --- |
| Core configuration, registry, schema, or style runtime | Core check/test plus integration gate |
| UI component | UI check plus direct consumer checks |
| Section | Sections check, content/schema tests, and application check |
| Template | Template check plus a build of one consuming application |
| Theme CSS | Theme check, at least one application build, and theme-isolation validation |
| CLI | CLI check/test; create changes also require a temporary-project flow |
| Project content only | `pnpm wf check <project>` plus build |
| Documentation | Link and path checks; no build output is necessary |

Package-level examples:

```sh
pnpm --filter @webfactory/core check
pnpm --filter @webfactory/core test
pnpm --filter @webfactory/ui check
pnpm --filter @webfactory/cli test
```

## Handling Failures

- Record the first root cause instead of letting downstream errors obscure it.
- Rerun the smallest failing command after the fix, then run the higher-level integration check.
- Do not create a green result by deleting tests, weakening schemas, or skipping checks.
- Do not clean or reset user changes unrelated to the current task.

## Status Claims in Documentation

Describe a capability as “implemented” only when current code or tests prove it. Mark planned behavior as a “specification target” or “not implemented,” especially for `wf sync`, automatic registry scanning, agent and skill orchestration, and the showcase application.
