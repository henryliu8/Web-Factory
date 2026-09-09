import { createRegistry } from './createRegistry';
import type { ComponentRegistry, RegistryLayer } from './types';

export function createComponentRegistry<T>(layers: readonly RegistryLayer<T>[]): ComponentRegistry<T> {
  return createRegistry(layers);
}
