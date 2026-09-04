import { describe, expect, it } from 'vitest';
import { mergeConfig } from './mergeConfig';

describe('mergeConfig', () => {
  it('deep merges nested configuration', () => {
    expect(mergeConfig(
      { site: { title: 'Base', language: 'en' }, seo: { robots: true } },
      { site: { title: 'Project' }, seo: { image: '/image.jpg' } },
    )).toEqual({
      site: { title: 'Project', language: 'en' },
      seo: { robots: true, image: '/image.jpg' },
    });
  });

  it('replaces arrays instead of concatenating them', () => {
    expect(mergeConfig({ pages: ['home', 'about'], nested: { values: [1, 2] } }, { pages: ['contact'], nested: { values: [3] } }))
      .toEqual({ pages: ['contact'], nested: { values: [3] } });
  });
});
