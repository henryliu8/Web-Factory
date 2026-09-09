import { createRegistry } from './createRegistry';
import type { RegistryLayer, SectionRegistry } from './types';

export function createSectionRegistry<T>(layers: readonly RegistryLayer<T>[]): SectionRegistry<T> {
  return createRegistry(layers);
}
