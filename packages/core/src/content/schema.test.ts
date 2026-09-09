import { describe, expect, it } from 'vitest';
import { pageContentSchema, parseSections } from './schema';

describe('content schemas', () => {
  it('accepts the section data used by the Stardrive scaffold', () => {
    const page = pageContentSchema.parse({
      title: 'Home',
      sections: [
        { type: 'hero/HeroFullscreen', title: 'Welcome' },
        { type: 'features/FeatureGrid', items: [{ title: 'Fast', description: 'Reusable.' }] },
        { type: 'cta/CTA', title: 'Start', button: { label: 'Contact', href: '/contact' } },
      ],
    });

    expect(page.sections).toHaveLength(3);
  });

  it('rejects a section without a logical type', () => {
    expect(() => parseSections([{ title: 'Missing type' }])).toThrow();
  });
});
