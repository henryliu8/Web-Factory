import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveSection, resolveStyleComposition } from '@webfactory/core';
import project from '../webfactory.config';
import { createDemoSectionRegistry } from '../src/config/createDemoSectionRegistry';

const root = resolve(import.meta.dirname, '..');
const catalog = {
  templates: { stardrive: { style: '@webfactory/template-stardrive/styles' } },
  themes: {
    default: { style: '@webfactory/theme-default/styles' },
    luxury: { style: '@webfactory/theme-luxury/styles' },
  },
};

describe('demo-site integration architecture', () => {
  it('uses the real generated project configuration and five routes', () => {
    expect(project).toMatchObject({
      slug: 'demo-site',
      template: 'stardrive',
      theme: 'default',
      pages: ['home', 'about', 'services', 'projects', 'contact'],
    });
    for (const page of ['index', 'about', 'services', 'projects', 'contact']) {
      expect(existsSync(resolve(root, `src/pages/${page}.astro`))).toBe(true);
    }
  });

  it('resolves the Project Hero and Shared fallbacks through the runtime registry factory', () => {
    const registry = createDemoSectionRegistry({
      sharedHeader: 'shared-header',
      sharedHero: 'shared-hero',
      sharedFeatures: 'shared-features',
      sharedCTA: 'shared-cta',
      projectHero: 'project-hero',
    });

    expect(resolveSection(registry, { type: 'hero/HeroFullscreen' })).toBe('project-hero');
    expect(resolveSection(registry, { type: 'header/Header' })).toBe('shared-header');
    expect(resolveSection(registry, { type: 'features/FeatureGrid' })).toBe('shared-features');
    expect(resolveSection(registry, { type: 'cta/CTA' })).toBe('shared-cta');
    expect(() => resolveSection(registry, { type: 'missing/Section' }))
      .toThrow('Unknown Web Factory section "missing/Section".');
  });

  it('keeps the runtime CSS imports in Shared → Template → Theme → Project order', () => {
    const source = readFileSync(resolve(root, 'src/styles/global.css'), 'utf8');
    const imports = [...source.matchAll(/@import '([^']+)'/g)].map((match) => match[1]);
    expect(imports).toEqual([
      '@webfactory/tokens',
      'virtual:webfactory-template-style',
      'virtual:webfactory-theme-style',
      './project.css',
    ]);
    expect(readFileSync(resolve(root, 'src/styles/project.css'), 'utf8'))
      .toContain('--wf-radius-lg: 1.5rem');
  });

  it('switches one selected theme while preserving Project CSS last', () => {
    const defaultStyles = resolveStyleComposition(project, catalog);
    const luxuryStyles = resolveStyleComposition({ ...project, theme: 'luxury' }, catalog);

    expect(defaultStyles).toContain('@webfactory/theme-default/styles');
    expect(defaultStyles).not.toContain('@webfactory/theme-luxury/styles');
    expect(luxuryStyles).toContain('@webfactory/theme-luxury/styles');
    expect(luxuryStyles).not.toContain('@webfactory/theme-default/styles');
    expect(defaultStyles.at(-1)).toBe('./project.css');
    expect(luxuryStyles.at(-1)).toBe('./project.css');
  });
});
