export type { ComponentRegistry, LayerName, RegistryLayer, SectionRegistry } from './registry/types';
export { createComponentRegistry } from './registry/createComponentRegistry';
export { createSectionRegistry } from './registry/createSectionRegistry';
export { createRegistry, registryFromGlob } from './registry/createRegistry';
export { requireEntry, resolveEntry } from './registry/resolveEntry';
export { mergeConfig } from './config/mergeConfig';
export { resolveStyleOrder } from './styles/styleOrder';

export interface WebFactoryLayer {
  name: string;
  entries: Record<string, unknown>;
}

export type ResolutionOrder = readonly ['project', 'theme', 'template', 'shared'];
