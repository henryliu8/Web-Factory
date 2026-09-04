import { describe, expect, it } from 'vitest';
import { createRegistry } from './createRegistry';
import { resolveEntry } from './resolveEntry';
import type { RegistryLayer } from './types';

const layers = (project?: string): RegistryLayer<string>[] => [
  { name: 'shared' as const, entries: { 'components/navigation/Header': 'shared', 'sections/hero/HeroFullscreen': 'shared' } },
  { name: 'template' as const, entries: { 'sections/hero/HeroFullscreen': 'template' } },
  { name: 'theme' as const, entries: { 'sections/hero/HeroFullscreen': 'theme' } },
  ...(project ? [{ name: 'project' as const, entries: { 'sections/hero/HeroFullscreen': project } }] : []),
];

describe('Web Factory registry resolution', () => {
  it('uses the shared fallback', () => {
    expect(resolveEntry(createRegistry(layers('project')), 'components/navigation/Header')).toBe('shared');
  });

  it('allows a template to override shared', () => {
    const registry = createRegistry([
      { name: 'shared', entries: { 'sections/hero/HeroFullscreen': 'shared' } },
      { name: 'template', entries: { 'sections/hero/HeroFullscreen': 'template' } },
    ]);
    expect(resolveEntry(registry, 'sections/hero/HeroFullscreen')).toBe('template');
  });

  it('allows a theme to override a template', () => {
    expect(resolveEntry(createRegistry(layers(undefined)), 'sections/hero/HeroFullscreen')).toBe('theme');
  });

  it('allows a project to override a theme', () => {
    expect(resolveEntry(createRegistry(layers('project')), 'sections/hero/HeroFullscreen')).toBe('project');
  });

  it('falls back to the theme when a project override is removed', () => {
    expect(resolveEntry(createRegistry(layers(undefined)), 'sections/hero/HeroFullscreen')).toBe('theme');
  });
});
