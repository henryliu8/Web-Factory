export interface WebFactoryLayer {
  name: string;
  entries: Record<string, unknown>;
}

export type ResolutionOrder = readonly ['project', 'theme', 'template', 'shared'];
