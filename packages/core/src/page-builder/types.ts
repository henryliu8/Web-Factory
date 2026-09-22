export interface RegisteredSectionDefinition {
  type: string;
  [key: string]: unknown;
}

export type SectionParser = (input: unknown) => RegisteredSectionDefinition[];

export type SectionComponent = unknown;
export type ResolvedSectionRegistry = Readonly<
  Record<string, SectionComponent>
>;

export interface PageBuilderProps {
  sections: RegisteredSectionDefinition[];
  sectionRegistry: ResolvedSectionRegistry;
  sectionParser?: SectionParser;
}

export interface ResolvedSection {
  component: SectionComponent;
  definition: RegisteredSectionDefinition;
}
