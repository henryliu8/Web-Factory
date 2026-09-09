import type { ComponentRegistry, LayerName, RegistryLayer } from './types';

const layerOrder: readonly LayerName[] = ['shared', 'template', 'theme', 'project'];

/** Merge explicit registry layers from lowest to highest precedence. */
export function createRegistry<T>(layers: readonly RegistryLayer<T>[]): ComponentRegistry<T> {
  const registry: Record<string, T> = {};
  const orderedLayers = [...layers].sort(
    (left, right) => layerOrder.indexOf(left.name) - layerOrder.indexOf(right.name),
  );

  for (const layer of orderedLayers) {
    for (const [logicalPath, entry] of Object.entries(layer.entries)) {
      registry[normalizeLogicalPath(logicalPath)] = entry;
    }
  }

  return Object.freeze(registry);
}

function normalizeLogicalPath(path: string): string {
  const normalized = path.trim().replace(/\\/g, '/').replace(/^\/+/, '').replace(/\.(astro|tsx?|jsx?)$/, '');
  if (!normalized || !normalized.includes('/')) {
    throw new Error(`Invalid Web Factory logical path "${path}". Use a relative path such as "hero/HeroFullscreen".`);
  }
  return normalized;
}

export { normalizeLogicalPath };
