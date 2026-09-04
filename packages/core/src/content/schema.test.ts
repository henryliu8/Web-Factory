import { describe, expect, it } from 'vitest';
import { parseSections, pageContentSchema } from './schema';

describe('content schemas', () => {
  it('accepts PageBuilder section definitions', () => {
    expect(pageContentSchema.parse({
      title: 'Home',
      sections: [{ type: 'hero/HeroFullscreen', title: 'Welcome' }],
    }).sections[0].type).toBe('hero/HeroFullscreen');
  });

  it('rejects sections without a logical type', () => {
    expect(() => parseSections([{ title: 'Missing type' }])).toThrow();
  });
});
