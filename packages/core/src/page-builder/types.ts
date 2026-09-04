import type { SectionDefinition } from '../content/schema';

export type SectionComponent = unknown;
export type ResolvedSectionRegistry = Readonly<Record<string, SectionComponent>>;

export interface PageBuilderProps {
  sections: SectionDefinition[];
  sectionRegistry: ResolvedSectionRegistry;
}
