import { describe, expect, it } from 'vitest';
import { resolveSection } from './resolveSection';

describe('PageBuilder section resolution', () => {
  it('reports an actionable error for unknown sections', () => {
    expect(() => resolveSection({ 'hero/HeroFullscreen': 'Hero' }, { type: 'missing/Section' }))
      .toThrow('Unknown Web Factory section "missing/Section". Available sections: hero/HeroFullscreen.');
  });
});
