# Web Factory AI Development Guide

This file defines how to use `agents/`, `skills/`, `workflows/`, and `tools/` inside Web Factory.

The goal is to make Codex predictable: architecture decisions stay consistent, reusable tasks follow repeatable instructions, and deterministic checks are automated instead of re-reasoned every time.

---

## 1. Core model

Use the four folders for different purposes:

- `agents/` = **who is responsible**
- `skills/` = **how a repeatable task is performed**
- `workflows/` = **the end-to-end sequence for completing a larger goal**
- `tools/` = **the code or commands that actually perform deterministic work**

The relationship is:

```text
AGENTS.md
   ↓
Workflow
   ↓
Agent(s)
   ↓
Skill(s)
   ↓
Tool(s)
   ↓
Repository
```

Web Factory architecture remains:

```text
Project > Theme > Template > Shared
```

CSS load order remains:

```text
Shared → Template → Theme → Project
```

Do not simplify away these architecture boundaries merely to reduce file count.

---

## 2. AGENTS.md

`AGENTS.md` is the repository constitution.

It should contain only high-level, stable rules:

- Web Factory architecture
- package boundaries
- naming conventions
- task routing
- validation expectations
- forbidden practices
- where to find Agents, Skills and Workflows

Do not put every implementation detail into `AGENTS.md`.

Example routing section:

```md
## Task routing

External Astro component:
- Agent: agents/migration.md
- Skill: skills/astro/component-import/SKILL.md
- Workflow: workflows/import-component.md

New Theme:
- Agent: agents/frontend.md
- Skill: skills/webfactory/create-theme/SKILL.md
- Workflow: workflows/create-theme.md

New Template:
- Agent: agents/architect.md
- Agent: agents/migration.md
- Skill: skills/webfactory/create-template/SKILL.md
- Workflow: workflows/import-template.md

Deployment:
- Agent: agents/deployment.md
- Skill: skills/deploy/cloudflare/SKILL.md
- Workflow: workflows/deploy-project.md
```

---

## 3. Agents

Agents define responsibilities and decision boundaries.

Recommended first set:

```text
agents/
├── architect.md
├── frontend.md
├── migration.md
├── qa.md
└── deployment.md
```

### architect.md

Responsible for:

- Project / Theme / Template / Shared classification
- package boundaries
- dependency direction
- public APIs
- registry / override architecture
- deciding where new code belongs

The Architect should make the structural decision before implementation begins.

### frontend.md

Responsible for:

- Astro components
- responsive layout
- accessibility
- Tailwind CSS v4
- semantic `--wf-*` tokens
- component composition
- animation implementation

Rules:

- reuse `@webfactory/ui` and `@webfactory/sections` first
- do not modify Shared solely for one client
- do not add React/Vue/Svelte unless required
- prefer CSS/native browser APIs before third-party libraries

### migration.md

Responsible for:

- importing external Astro components
- adapting external themes/templates
- dependency and license audits
- replacing external assumptions with Web Factory contracts
- removing cross-package relative imports

### qa.md

Responsible for:

- `astro check`
- production build
- integration tests
- browser validation
- responsive checks
- package export validation
- override/fallback validation

### deployment.md

Responsible for:

- Cloudflare
- Vercel
- CI/CD
- environment variables
- production build/deploy configuration
- custom domains

---

## 4. Skills

A Skill is a reusable SOP for one repeatable class of work.

Preferred structure:

```text
skills/
├── README.md
├── astro/
│   ├── component-import/
│   │   └── SKILL.md
│   ├── component-create/
│   │   └── SKILL.md
│   └── animation/
│       ├── scroll-reveal/
│       │   └── SKILL.md
│       └── hero-slider/
│           └── SKILL.md
├── webfactory/
│   ├── create-theme/
│   │   └── SKILL.md
│   ├── create-template/
│   │   └── SKILL.md
│   └── project-override/
│       └── SKILL.md
└── deploy/
    ├── cloudflare/
    │   └── SKILL.md
    └── vercel/
        └── SKILL.md
```

Use `SKILL.md` as the entry file for each real Skill.

A Skill may also contain:

```text
component-import/
├── SKILL.md
├── checklist.md
├── examples/
├── references/
└── scripts/
```

### A good Skill should define

1. When to use it
2. Inputs
3. Destination/classification rules
4. Step-by-step procedure
5. Forbidden practices
6. Output expectations
7. Validation commands

### Example use in Codex

```text
Read:
AGENTS.md
agents/migration.md
skills/astro/component-import/SKILL.md

Then adapt the supplied Astro component into Web Factory.

Do not modify files until architecture classification is complete.
```

---

## 5. Workflows

A Workflow coordinates multiple Agents, Skills and Tools to complete a larger goal.

Recommended first workflows:

```text
workflows/
├── create-project.md
├── import-component.md
├── import-template.md
├── import-theme.md
└── deploy-project.md
```

### Example: create-project.md

```text
1. Architect
   - select Template
   - select Theme
   - define page/content architecture

2. Create project
   - wf create

3. Frontend
   - compose pages
   - use Shared components
   - add Project-specific components only where required

4. Content
   - site data
   - services/projects/content data

5. Project overrides
   - CSS overrides
   - component overrides if necessary

6. QA
   - wf check
   - dev browser test
   - build
   - preview

7. Deployment
   - Cloudflare or Vercel
```

### Example use in Codex

```text
Follow workflows/create-project.md for project "demo-flooring".

Use:
- agents/architect.md
- agents/frontend.md
- agents/qa.md

Follow relevant Skills referenced by the workflow.
```

---

## 6. Tools

Tools are deterministic executable code.

Current important tool:

```text
tools/cli/
```

Public workflow should increasingly be exposed through:

```bash
pnpm wf create
pnpm wf dev
pnpm wf check
pnpm wf build
pnpm wf list
```

Future candidates:

```text
tools/scripts/
├── audit-workspace.ts
├── check-exports.ts
├── validate-project.ts
├── validate-template.ts
├── validate-theme.ts
└── audit-components.ts
```

Rule:

> If a check can be deterministic, implement it as a Tool rather than asking AI to reason through it every time.

Examples:

- validate package exports
- detect unresolved placeholders
- detect cross-package relative imports
- validate project config
- validate theme/template catalog entries

AI should decide **what to change**.
Tools should determine **whether the repository is valid**.

---

## 7. Daily development pattern

Use this sequence for substantial work:

```text
1. Read AGENTS.md
2. Select Agent
3. Select relevant Skill
4. Follow Workflow when the task spans multiple steps
5. Use Tools for deterministic checks
6. Run Ponytail review when appropriate
7. Run Web Factory validation
8. Browser-test visible changes
```

Example:

```text
Requirement:
Import an external Astro slider.

↓
Architect:
Project-specific or Shared?

↓
Migration Agent

↓
skills/astro/component-import/SKILL.md

↓
Frontend Agent

↓
Tools / checks

↓
@ponytail-review

↓
pnpm wf check <project>
pnpm wf build <project>
```

---

## 8. Ponytail

Ponytail is developer tooling for Codex, not a Web Factory runtime dependency.

Use it to reduce unnecessary complexity.

Recommended default:

```text
@ponytail full
```

Useful review commands:

```text
@ponytail-review
@ponytail-audit
```

Ponytail may:

- remove unnecessary abstractions
- prefer native browser APIs
- reduce dependencies
- reuse existing code

Ponytail must NOT remove intentional Web Factory architecture such as:

- Project / Theme / Template / Shared boundaries
- public package contracts
- registry/resolution behavior
- Style Runtime
- integration tests

Prefer:

> the smallest implementation that preserves the documented architecture and public API.

---

## 9. Maintenance rules

### Agents

Update only when responsibilities or architecture change.

Avoid creating many narrow Agents.

### Skills

Promote real successful procedures into Skills.

Statuses can be tracked in `skills/README.md`:

- Draft
- Stable
- Deprecated

### Workflows

Update when the end-to-end process changes.

Workflows should reference Skills instead of duplicating Skill instructions.

### Tools

Keep deterministic and testable.

Do not bury architecture policy inside scripts when it belongs in `AGENTS.md`.

---

## 10. Anti-duplication rule

Do not write the same instructions in Agent, Skill and Workflow files.

Use this separation:

```text
Agent
= who / responsibility

Skill
= how to perform one reusable task

Workflow
= order of multiple tasks

Tool
= executable implementation / validation
```

---

## 11. Recommended initial Web Factory knowledge set

### Agents

```text
architect
frontend
migration
qa
deployment
```

### Skills

```text
astro/component-import
astro/component-create
webfactory/create-theme
webfactory/create-template
webfactory/project-override
deploy/cloudflare
deploy/vercel
```

### Workflows

```text
create-project
import-component
import-template
import-theme
deploy-project
```

Start small. Add new Skills only after a task has been performed successfully and is likely to repeat.
