export { defineProject } from "./config/defineProject";
export { mergeConfig } from "./config/mergeConfig";
export {
  parseProjectConfig,
  projectConfigSchema,
} from "./config/projectSchema";
export type { ProjectConfig } from "./config/projectSchema";
export {
  pageContentSchema,
  parseSections,
  sectionDefinitionSchema,
  sectionsSchema,
} from "./content";
export type { PageContent, SectionDefinition } from "./content";
export { createComponentRegistry } from "./registry/createComponentRegistry";
export { createRegistry } from "./registry/createRegistry";
export { createSectionRegistry } from "./registry/createSectionRegistry";
export { requireEntry, resolveEntry } from "./registry/resolveEntry";
export type {
  ComponentRegistry,
  LayerName,
  RegistryLayer,
  SectionRegistry,
} from "./registry/types";
export { resolveSection, resolveSections } from "./page-builder/resolveSection";
export type {
  PageBuilderProps,
  ResolvedSection,
  ResolvedSectionRegistry,
  SectionComponent,
} from "./page-builder/types";
export { resolveStyleOrder } from "./styles/styleOrder";
export type { StyleLayer, StyleSources } from "./styles/styleOrder";
export {
  createStyleRuntime,
  renderStyleComposition,
  resolveStyleComposition,
  WEB_FACTORY_STYLE_ENTRY,
  WEB_FACTORY_TEMPLATE_STYLE,
  WEB_FACTORY_THEME_STYLE,
} from "./styles/styleRuntime";
export type {
  StyleCatalog,
  StyleRuntimeOptions,
  StylesheetResolverPlugin,
} from "./styles/styleRuntime";
export type {
  ActionLink,
  ImageSource,
  Link,
  MediaSource,
  NavigationItem,
  SectionContainerProps,
  TemplateConfig,
  ThemeConfig,
} from "./types";
