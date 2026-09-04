import type { ComponentRegistry, RegistryEntry } from './types';

export function resolveEntry<T>(registry: ComponentRegistry<T>, logicalPath: string): RegistryEntry<T> | undefined {
  return registry[normalizeLogicalPath(logicalPath)];
}

export function requireEntry<T>(registry: ComponentRegistry<T>, logicalPath: string): RegistryEntry<T> {
  const entry = resolveEntry(registry, logicalPath);
  if (!entry) {
    throw new Error(`Web Factory could not resolve entry "${logicalPath}".`);
  }
  return entry;
}

function normalizeLogicalPath(path: string): string {
  return path.replace(/\\/g, '/').replace(/^\/+|\.(astro|tsx?|jsx?)$/g, '');
}
