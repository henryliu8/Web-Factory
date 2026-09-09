export type LayerName = 'shared' | 'template' | 'theme' | 'project';

export interface RegistryLayer<T> {
  name: LayerName;
  entries: Readonly<Record<string, T>>;
}

export type ComponentRegistry<T> = Readonly<Record<string, T>>;
export type SectionRegistry<T> = ComponentRegistry<T>;
