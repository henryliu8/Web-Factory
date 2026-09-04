import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createProject } from '../src/create';

const roots: string[] = [];
afterEach(async () => { await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true }))); });

describe('createProject', () => {
  it('creates only scaffold and project files without shared package copies', async () => {
    const root = await mkdtemp(join(tmpdir(), 'webfactory-cli-'));
    roots.push(root);
    await Promise.all([
      (await import('node:fs/promises')).mkdir(join(root, 'templates/stardrive/scaffold'), { recursive: true }),
      (await import('node:fs/promises')).mkdir(join(root, 'themes/luxury'), { recursive: true }),
    ]);
    await (await import('node:fs/promises')).writeFile(join(root, 'templates/stardrive/scaffold/package.json.template'), '{}');
    const path = await createProject('forest-flooring', { template: 'stardrive', theme: 'luxury', pages: 'home,about' }, root);
    expect(await readFile(join(path, 'package.json'), 'utf8')).toBe('{}');
    expect(await readFile(join(path, 'webfactory.config.ts'), 'utf8')).toContain("theme: 'luxury'");
    expect(await readFile(join(path, 'src/pages/about.astro'), 'utf8')).toContain('PageBuilder');
  });

  it('rejects duplicate projects', async () => {
    const root = await mkdtemp(join(tmpdir(), 'webfactory-cli-'));
    roots.push(root);
    await (await import('node:fs/promises')).mkdir(join(root, 'apps/existing'), { recursive: true });
    await expect(createProject('existing', { template: 'stardrive', theme: 'luxury' }, root)).rejects.toThrow('already exists');
  });
});
