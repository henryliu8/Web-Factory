export type StyleLayer = 'shared' | 'template' | 'theme' | 'project';
export type StyleSources = Partial<Record<StyleLayer, readonly string[]>>;

const styleOrder: readonly StyleLayer[] = ['shared', 'template', 'theme', 'project'];

/** Return stylesheet references in CSS cascade order; consumers perform imports. */
export function resolveStyleOrder(styles: StyleSources): string[] {
  return styleOrder.flatMap((layer) => [...(styles[layer] ?? [])]);
}
