# Registry API Reference

A registry is a read-only mapping from logical paths to implementations. The related APIs are exported from `@webfactory/core`.

## Types

```ts
type LayerName = "shared" | "template" | "theme" | "project";

interface RegistryLayer<T> {
  name: LayerName;
  entries: Readonly<Record<string, T>>;
}

type ComponentRegistry<T> = Readonly<Record<string, T>>;
type SectionRegistry<T> = ComponentRegistry<T>;
```

## Creation

```ts
createRegistry<T>(layers);
createComponentRegistry<T>(layers);
createSectionRegistry<T>(layers);
```

All three functions use the same merge logic. Core sorts layers into Shared, Template, Theme, Project order, normalizes keys, and freezes the final top-level object. A matching key in a later layer replaces the earlier value.

## Lookup

```ts
resolveEntry(registry, logicalPath); // T | undefined
requireEntry(registry, logicalPath); // T; throws when missing
resolveSection(registry, definition); // SectionComponent
resolveSections(registry, unknownSections); // ResolvedSection[]
```

`resolveSection()` lists currently available sections in its error, which helps diagnose content and registry mismatches during development. `resolveSections()` first validates the array with the shared content schema.

## Key Normalization

These inputs normalize to the same key:

```text
hero/HeroFullscreen
/hero/HeroFullscreen.astro
hero\HeroFullscreen.astro
```

After extension removal, a key must still contain `/`. Empty strings and single basenames throw an error.

## Notes

- The top-level result is frozen, but the component values themselves are not deeply frozen.
- Applications currently construct registries explicitly; directories are not scanned automatically.
- The current PageBuilder boundary types component implementations as `unknown`, so a template often needs to narrow a resolved value to a concrete Astro component type.
- Once a logical path appears in content, treat it as a long-term compatibility contract.
