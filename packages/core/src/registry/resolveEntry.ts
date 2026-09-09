import { normalizeLogicalPath } from './createRegistry';
import type { ComponentRegistry } from './types';

export function resolveEntry<T>(registry: ComponentRegistry<T>, logicalPath: string): T | undefined {
  return registry[normalizeLogicalPath(logicalPath)];
}

export function requireEntry<T>(registry: ComponentRegistry<T>, logicalPath: string): T {
  const entry = resolveEntry(registry, logicalPath);
  if (entry === undefined) {
    throw new Error(`Web Factory could not resolve entry "${logicalPath}".`);
  }
  return entry;
}
