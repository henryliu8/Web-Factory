import { parseSections, type SectionDefinition } from '../content/schema';
import { requireEntry } from '../registry/resolveEntry';
import type { ResolvedSectionRegistry } from './types';

export function resolveSection(
  registry: ResolvedSectionRegistry,
  definition: SectionDefinition | { type: string },
): unknown {
  try {
    return requireEntry(registry, definition.type);
  } catch {
    const available = Object.keys(registry).sort();
    const suffix = available.length ? ` Available sections: ${available.join(', ')}.` : ' No sections are registered.';
    throw new Error(`Unknown Web Factory section "${definition.type}".${suffix}`);
  }
}

export function resolveSections(
  registry: ResolvedSectionRegistry,
  sections: unknown,
): Array<{ component: unknown; definition: SectionDefinition }> {
  return parseSections(sections).map((definition) => ({
    component: resolveSection(registry, definition),
    definition,
  }));
}
