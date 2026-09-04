export type { ComponentRegistry, LayerName, RegistryLayer, SectionRegistry } from './registry/types';
export { createComponentRegistry } from './registry/createComponentRegistry';
export { createSectionRegistry } from './registry/createSectionRegistry';
export { createRegistry, registryFromGlob } from './registry/createRegistry';
export { requireEntry, resolveEntry } from './registry/resolveEntry';
export { mergeConfig } from './config/mergeConfig';
export { defineProject } from './config/defineProject';
export { parseProjectConfig, projectConfigSchema } from './config/projectSchema';
export type { ProjectConfig } from './config/projectSchema';
export { resolveStyleOrder } from './styles/styleOrder';
export { default as PageBuilder } from './page-builder/PageBuilder.astro';
export { resolveSection, resolveSections } from './page-builder/resolveSection';
export type { PageBuilderProps, ResolvedSectionRegistry, SectionComponent } from './page-builder/types';
export { pageContentSchema, parseSections, sectionDefinitionSchema, sectionsSchema } from './content';
export type { PageContent, SectionDefinition } from './content';

export interface WebFactoryLayer {
  name: string;
  entries: Record<string, unknown>;
}

export type ResolutionOrder = readonly ['project', 'theme', 'template', 'shared'];
