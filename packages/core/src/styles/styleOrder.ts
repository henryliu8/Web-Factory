export type StyleLayer = 'shared' | 'template' | 'theme' | 'project';

/** Return styles in the cascade order required by Web Factory. */
export function resolveStyleOrder(styles: Partial<Record<StyleLayer, readonly string[]>>): string[] {
  return (['shared', 'template', 'theme', 'project'] as const).flatMap((layer) => [...(styles[layer] ?? [])]);
}
