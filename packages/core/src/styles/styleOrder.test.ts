import { describe, expect, it } from 'vitest';
import { resolveStyleOrder } from './styleOrder';

describe('resolveStyleOrder', () => {
  it('loads styles from shared through project', () => {
    expect(resolveStyleOrder({
      project: ['project.css'],
      theme: ['theme.css'],
      shared: ['tokens.css'],
      template: ['template.css'],
    })).toEqual(['tokens.css', 'template.css', 'theme.css', 'project.css']);
  });
});
