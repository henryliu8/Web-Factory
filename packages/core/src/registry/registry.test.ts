import { describe, expect, it } from 'vitest';
import { createRegistry } from './createRegistry';
import { requireEntry, resolveEntry } from './resolveEntry';
import type { RegistryLayer } from './types';

const key = 'hero/HeroFullscreen';

function layers(include: Partial<Record<'template' | 'theme' | 'project', boolean>> = {}): RegistryLayer<string>[] {
  return [
    { name: 'shared', entries: { [key]: 'shared', 'header/Header': 'shared-header' } },
    ...(include.template ? [{ name: 'template' as const, entries: { [key]: 'template' } }] : []),
    ...(include.theme ? [{ name: 'theme' as const, entries: { [key]: 'theme' } }] : []),
    ...(include.project ? [{ name: 'project' as const, entries: { [key]: 'project' } }] : []),
  ];
}

describe('layered registry', () => {
  it('resolves a shared-only entry', () => {
    expect(resolveEntry(createRegistry(layers()), key)).toBe('shared');
  });

  it('lets Template override Shared', () => {
    expect(resolveEntry(createRegistry(layers({ template: true })), key)).toBe('template');
  });

  it('lets Theme override Template', () => {
    expect(resolveEntry(createRegistry(layers({ template: true, theme: true })), key)).toBe('theme');
  });

  it('directly proves Project > Theme > Template > Shared', () => {
    expect(resolveEntry(createRegistry(layers({ template: true, theme: true, project: true })), key)).toBe('project');
  });

  it('falls back through every missing higher layer', () => {
    expect(resolveEntry(createRegistry(layers({ template: true, theme: true })), key)).toBe('theme');
    expect(resolveEntry(createRegistry(layers({ template: true })), key)).toBe('template');
    expect(resolveEntry(createRegistry(layers()), key)).toBe('shared');
  });

  it('returns undefined or a controlled error for an unknown logical key', () => {
    const registry = createRegistry(layers());
    expect(resolveEntry(registry, 'missing/Section')).toBeUndefined();
    expect(() => requireEntry(registry, 'missing/Section')).toThrow(
      'Web Factory could not resolve entry "missing/Section".',
    );
  });

  it('does not mutate registry inputs', () => {
    const input = [...layers({ template: true, theme: true, project: true })].reverse();
    const snapshot = structuredClone(input);
    createRegistry(input);
    expect(input).toEqual(snapshot);
  });

  it('uses full logical paths rather than basenames', () => {
    const registry = createRegistry([
      { name: 'shared', entries: { 'hero/Card': 'hero', 'features/Card': 'feature' } },
    ]);
    expect(resolveEntry(registry, 'hero/Card')).toBe('hero');
    expect(resolveEntry(registry, 'features/Card')).toBe('feature');
  });
});
