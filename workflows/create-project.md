# Create Project Workflow

## 1. Discover resources

pnpm wf list templates
pnpm wf list themes

## 2. Create

pnpm wf create <project> \
  --template <template> \
  --theme <theme>

## 3. Install

pnpm install

## 4. Verify baseline

pnpm wf check <project>

## 5. Define site data

Create/update:
src/data/site.ts

## 6. Define content data

For example:
src/data/services.ts

## 7. Compose pages

Prefer:
Template > Shared Sections > Project Components

## 8. Project-specific components

Place under:
src/components/

## 9. Project override

Use resolver architecture:
Project > Theme > Template > Shared

## 10. Development

pnpm wf dev <project>

## 11. Validation

pnpm wf check <project>
pnpm wf build <project>

## 12. Production preview

pnpm preview