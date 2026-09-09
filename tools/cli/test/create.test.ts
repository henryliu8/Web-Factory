import { afterEach, describe, expect, it } from 'vitest';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import { createProject, normalizePageName } from '../src/create';
import { listTemplates, listThemes } from '../src/catalog';
import { syncProject } from '../src/commands';
import { normalizeProjectSlug, repositoryRoot } from '../src/paths';

const roots: string[] = [];

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('createProject', () => {
  it('creates scaffold and project files without copying shared packages', async () => {
    const root = await createFixture();
    const path = await createProject(
      'forest-flooring',
      { template: 'stardrive', theme: 'luxury', pages: 'home,about' },
      root,
    );

    expect(JSON.parse(await readFile(join(path, 'package.json'), 'utf8')).name)
      .toBe('@webfactory/app-forest-flooring');
    expect(await readFile(join(path, 'webfactory.config.ts'), 'utf8')).toContain("theme: 'luxury'");
    expect(await readFile(join(path, 'src/pages/about.astro'), 'utf8'))
      .toContain('@webfactory/template-stardrive/page-templates/StandardPageTemplate');
    expect(existsSync(join(path, 'packages'))).toBe(false);
  });

  it('rejects duplicate projects without modifying them', async () => {
    const root = await createFixture();
    const existing = join(root, 'apps/existing');
    await mkdir(existing, { recursive: true });
    await writeFile(join(existing, 'keep.txt'), 'keep');

    await expect(createProject('existing', { template: 'stardrive', theme: 'luxury' }, root))
      .rejects.toThrow('already exists');
    expect(await readFile(join(existing, 'keep.txt'), 'utf8')).toBe('keep');
  });

  it('fails cleanly when a scaffold placeholder is unresolved', async () => {
    const root = await createFixture();
    await writeFile(join(root, 'templates/stardrive/scaffold/broken.txt'), '{{unknownValue}}');

    await expect(createProject('broken-site', { template: 'stardrive', theme: 'default', pages: 'home' }, root))
      .rejects.toThrow('Unresolved scaffold placeholder in:\n- broken.txt');
    expect(existsSync(join(root, 'apps/broken-site'))).toBe(false);
    expect((await readdir(join(root, 'apps'))).some((name) => name.startsWith('.wf-broken-site-')))
      .toBe(false);
  });

  it('rejects unknown templates and themes with available choices', async () => {
    const root = await createFixture();
    await expect(createProject('unknown-template', { template: 'missing', theme: 'default', pages: 'home' }, root))
      .rejects.toThrow('Available templates:\n- stardrive');
    await expect(createProject('unknown-theme', { template: 'stardrive', theme: 'missing', pages: 'home' }, root))
      .rejects.toThrow('Available themes:\n- default\n- luxury');
  });

  it('reports sync as unimplemented without claiming a false success', async () => {
    const root = await createFixture();
    await mkdir(join(root, 'apps/existing'), { recursive: true });
    await expect(syncProject('existing', root)).rejects.toThrow(
      'Web Factory sync is not implemented yet for "existing". No project files were changed.',
    );
  });
});

describe('real Stardrive scaffold generation', () => {
  it('processes the actual scaffold into a structurally valid project', async () => {
    const root = await createFixture(true);
    const path = await createProject(
      'My New Website',
      { template: 'stardrive', theme: 'luxury', pages: 'About Us,contact' },
      root,
    );
    const generatedFiles = await filesUnder(path);
    const text = (await Promise.all(
      generatedFiles
        .filter((file) => ['.astro', '.css', '.json', '.md', '.mjs', '.ts', '.txt'].includes(extname(file)))
        .map((file) => readFile(file, 'utf8')),
    )).join('\n');

    const manifest = JSON.parse(await readFile(join(path, 'package.json'), 'utf8')) as {
      name: string;
      dependencies: Record<string, string>;
    };
    const config = await readFile(join(path, 'webfactory.config.ts'), 'utf8');
    const homePage = await readFile(join(path, 'src/pages/index.astro'), 'utf8');
    const aboutPage = await readFile(join(path, 'src/pages/about-us.astro'), 'utf8');

    expect(basename(path)).toBe('my-new-website');
    expect(manifest.name).toBe('@webfactory/app-my-new-website');
    expect(manifest.dependencies['@webfactory/template-stardrive']).toBe('workspace:*');
    expect(manifest.dependencies['@webfactory/theme-luxury']).toBe('workspace:*');
    expect(manifest.dependencies['@webfactory/theme-default']).toBeUndefined();
    expect(existsSync(join(path, 'package.json.template'))).toBe(false);
    expect(generatedFiles.filter((file) => basename(file) === 'webfactory.config.ts')).toHaveLength(1);
    expect(config).toContain("name: 'My New Website'");
    expect(config).toContain("slug: 'my-new-website'");
    expect(config).toContain("template: 'stardrive'");
    expect(config).toContain("theme: 'luxury'");
    expect(config).toContain('pages: ["home","about-us","contact"]');
    expect(await readFile(join(path, 'src/config/site.ts'), 'utf8')).toContain("name: 'My New Website'");
    expect(homePage).toContain('@webfactory/core/page-builder/PageBuilder.astro');
    expect(homePage).toContain('@webfactory/template-stardrive/layouts/SiteLayout');
    expect(homePage).not.toContain('BaseLayout.astro');
    expect(aboutPage).toContain('@webfactory/template-stardrive/page-templates/StandardPageTemplate');
    expect(aboutPage).not.toContain('BaseLayout.astro');
    expect(text).not.toMatch(/{{[A-Za-z][A-Za-z0-9]*}}/);
    expect(text).not.toMatch(/(?:\.\.\/)+packages\//);
    expect(text).not.toContain(repositoryRoot());
    expect(text).not.toContain('ui/src/navigation/Header.astro');

    const globalStyles = await readFile(join(path, 'src/styles/global.css'), 'utf8');
    expect(globalStyles.match(/@import/g)).toHaveLength(4);
    expect(globalStyles.indexOf("@import '@webfactory/tokens'")).toBeLessThan(
      globalStyles.indexOf("@import 'virtual:webfactory-template-style'"),
    );
    expect(globalStyles.indexOf("@import 'virtual:webfactory-template-style'")).toBeLessThan(
      globalStyles.indexOf("@import 'virtual:webfactory-theme-style'"),
    );
    expect(globalStyles.indexOf("@import 'virtual:webfactory-theme-style'")).toBeLessThan(
      globalStyles.indexOf("@import './project.css'"),
    );
    expect(await readFile(join(path, 'astro.config.mjs'), 'utf8'))
      .toContain('createStyleRuntime');
  });

  it('selects only the default theme package in a generated default project', async () => {
    const root = await createFixture(true);
    const path = await createProject(
      'Default Website',
      { template: 'stardrive', theme: 'default', pages: 'home' },
      root,
    );
    const manifest = JSON.parse(await readFile(join(path, 'package.json'), 'utf8')) as {
      dependencies: Record<string, string>;
    };

    expect(await readFile(join(path, 'webfactory.config.ts'), 'utf8')).toContain("theme: 'default'");
    expect(manifest.dependencies['@webfactory/theme-default']).toBe('workspace:*');
    expect(manifest.dependencies['@webfactory/theme-luxury']).toBeUndefined();
    expect((await readFile(join(path, 'src/styles/global.css'), 'utf8')).trimEnd())
      .toMatch(/@import '\.\/project\.css';[\s\S]*@source/);
  });
});

describe('safe naming and repository discovery', () => {
  it('normalizes display-style project and page names', () => {
    expect(normalizeProjectSlug('My New Website')).toBe('my-new-website');
    expect(normalizePageName('About Us')).toBe('about-us');
    expect(normalizePageName('index')).toBe('home');
  });

  it.each(['../escape', '/absolute', 'nested/project', '..'])('rejects unsafe project name %s', (name) => {
    expect(() => normalizeProjectSlug(name)).toThrow('Project names cannot be paths');
  });

  it.each(['../escape', 'nested/page', '..'])('rejects unsafe page name %s', (name) => {
    expect(() => normalizePageName(name)).toThrow('Page names cannot be paths');
  });

  it('discovers the repository from a nested CLI directory and catalogs package manifests', async () => {
    const actualRoot = repositoryRoot(join(process.cwd(), 'src'));
    expect(actualRoot).toBe(repositoryRoot());
    expect(listTemplates(actualRoot)).toContain('stardrive');
    expect(listThemes(actualRoot)).toEqual(['default', 'luxury']);

    const fixture = await createFixture();
    await mkdir(join(fixture, 'templates/not-a-package'), { recursive: true });
    expect(listTemplates(join(fixture, 'tools/cli'))).toEqual(['stardrive']);
  });
});

async function createFixture(realScaffold = false): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'webfactory-cli-'));
  roots.push(root);
  await Promise.all([
    mkdir(join(root, 'apps'), { recursive: true }),
    mkdir(join(root, 'templates/stardrive'), { recursive: true }),
    mkdir(join(root, 'themes/default'), { recursive: true }),
    mkdir(join(root, 'themes/luxury'), { recursive: true }),
    mkdir(join(root, 'tools/cli'), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(join(root, 'package.json'), '{"name":"web-factory"}'),
    writeFile(join(root, 'pnpm-workspace.yaml'), 'packages: []\n'),
    writeFile(join(root, 'templates/stardrive/package.json'), '{"name":"@webfactory/template-stardrive"}'),
    writeFile(join(root, 'themes/default/package.json'), '{"name":"@webfactory/theme-default"}'),
    writeFile(join(root, 'themes/luxury/package.json'), '{"name":"@webfactory/theme-luxury"}'),
  ]);

  const scaffold = join(root, 'templates/stardrive/scaffold');
  if (realScaffold) {
    await cp(join(repositoryRoot(), 'templates/stardrive/scaffold'), scaffold, { recursive: true });
  } else {
    await mkdir(join(scaffold, 'src/config'), { recursive: true });
    await Promise.all([
      writeFile(join(scaffold, 'package.json.template'), '{"name":"@webfactory/app-{{project}}"}'),
      writeFile(join(scaffold, 'webfactory.config.ts'), "template: '{{template}}'; theme: '{{theme}}'; pages: {{pages}};"),
      writeFile(join(scaffold, 'src/config/site.ts'), "name: '{{projectName}}';"),
    ]);
  }

  return root;
}

async function filesUnder(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(path));
    else files.push(path);
  }
  return files;
}
