import type { ComponentRegistry, LayerName, RegistryLayer } from './types';

const layerOrder: readonly LayerName[] = ['shared', 'template', 'theme', 'project'];

/** Merge layers from lowest to highest precedence. */
export function createRegistry<T>(layers: readonly RegistryLayer<T>[]): ComponentRegistry<T> {
  const ordered = [...layers].sort((a, b) => layerOrder.indexOf(a.name) - layerOrder.indexOf(b.name));
  const registry: Record<string, T> = {};

  for (const layer of ordered) {
    Object.assign(registry, layer.entries);
  }

  return registry;
}

/** Convert import.meta.glob results into logical relative registry keys. */
export function registryFromGlob<T>(
  modules: Record<string, T>,
  rootSegment: string,
): Record<string, T> {
  return Object.fromEntries(
    Object.entries(modules).map(([path, module]) => {
      const marker = `${rootSegment}/`;
      const start = path.lastIndexOf(marker);
      const logicalPath = (start >= 0 ? path.slice(start + marker.length) : path)
        .replace(/\.(astro|tsx?|jsx?)$/, '')
        .replace(/\\/g, '/');
      return [logicalPath, module];
    }),
  );
}
