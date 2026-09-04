export type RegistryEntry<T> = T;

export type LayerName = 'shared' | 'template' | 'theme' | 'project';

export type RegistryLayer<T> = {
  name: LayerName;
  entries: Record<string, RegistryEntry<T>>;
};

export type ComponentRegistry<T> = Readonly<Record<string, RegistryEntry<T>>>;
export type SectionRegistry<T> = ComponentRegistry<T>;
