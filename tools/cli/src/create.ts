import { cp, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import * as prompts from '@clack/prompts';
import pc from 'picocolors';
import { listTemplates, listThemes } from './catalog';
import { projectPath } from './paths';
import type { CreateOptions } from './types';

const defaultPages = ['home', 'about', 'services', 'projects', 'contact'];

export async function createProject(name: string, options: CreateOptions, cwd = process.cwd()): Promise<string> {
  validateName(name);
  const destination = projectPath(name, cwd);
  if (existsSync(destination)) {
    throw new Error(`Project "${name}" already exists at ${destination}. Choose another name.`);
  }

  const template = options.template ?? await selectTemplate(cwd);
  const theme = options.theme ?? await selectTheme(cwd);
  const pages = options.pages ? parsePages(options.pages) : await selectPages();
  validateChoice('template', template, listTemplates(cwd));
  validateChoice('theme', theme, listThemes(cwd));

  const scaffold = resolve(cwd, 'templates', template, 'scaffold');
  if (!existsSync(scaffold)) throw new Error(`Web Factory could not find template "${template}" scaffold.`);

  await copyScaffold(scaffold, destination);
  await writeProjectConfig(destination, name, template, theme, pages);
  await writePageFiles(destination, pages);
  await writeProjectDocs(destination, name);
  console.log(`${pc.green('Created')} ${pc.bold(destination)}`);
  return destination;
}

function validateName(name: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`Invalid project name "${name}". Use lowercase kebab-case, for example "forest-flooring".`);
  }
}

function validateChoice(label: string, value: string, choices: string[]): void {
  if (!choices.includes(value)) {
    throw new Error(`Web Factory could not find ${label} "${value}".\n\nAvailable ${label}s:\n${choices.map((item) => `- ${item}`).join('\n')}`);
  }
}

function parsePages(value: string): string[] {
  const pages = value.split(',').map((page) => page.trim()).filter(Boolean);
  if (!pages.length) throw new Error('The --pages option must contain at least one page.');
  return pages;
}

async function selectTemplate(cwd: string): Promise<string> {
  const result = await prompts.select({ message: 'Select template', options: listTemplates(cwd).map((value) => ({ value, label: value })) });
  if (prompts.isCancel(result)) prompts.cancel('Project creation cancelled.');
  return result as string;
}

async function selectTheme(cwd: string): Promise<string> {
  const result = await prompts.select({ message: 'Select theme', options: listThemes(cwd).map((value) => ({ value, label: value })) });
  if (prompts.isCancel(result)) prompts.cancel('Project creation cancelled.');
  return result as string;
}

async function selectPages(): Promise<string[]> {
  const result = await prompts.multiselect({ message: 'Select pages', options: defaultPages.map((value) => ({ value, label: value, hint: value === 'home' ? 'required' : undefined })), initialValues: defaultPages });
  if (prompts.isCancel(result)) prompts.cancel('Project creation cancelled.');
  return result as string[];
}

async function copyScaffold(source: string, destination: string): Promise<void> {
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source)) {
    if (entry === 'package.json.template') {
      await cp(resolve(source, entry), resolve(destination, 'package.json'));
    } else {
      await cp(resolve(source, entry), resolve(destination, entry), { recursive: true, errorOnExist: true });
    }
  }
}

async function writeProjectConfig(destination: string, name: string, template: string, theme: string, pages: string[]): Promise<void> {
  const content = `import { defineProject } from '@webfactory/core';\n\nexport default defineProject({\n  name: '${name}',\n  slug: '${name}',\n  template: '${template}',\n  theme: '${theme}',\n  pages: ${JSON.stringify(pages)},\n});\n`;
  await writeFile(resolve(destination, 'webfactory.config.ts'), content, { flag: 'wx' });
}

async function writePageFiles(destination: string, pages: string[]): Promise<void> {
  const pagesDir = resolve(destination, 'src/pages');
  const contentDir = resolve(destination, 'src/content');
  await mkdir(pagesDir, { recursive: true });
  await mkdir(contentDir, { recursive: true });
  for (const page of pages) {
    const route = page === 'home' ? 'index' : page;
    const contentPath = resolve(contentDir, `${page}.md`);
    const pagePath = resolve(pagesDir, `${route}.astro`);
    if (!existsSync(contentPath)) await writeFile(contentPath, `---\ntitle: ${capitalize(page)}\nsections: []\n---\n`, { flag: 'wx' });
    if (!existsSync(pagePath)) await writeFile(pagePath, `---\nimport { getEntry } from 'astro:content';\nimport PageBuilder from '@webfactory/core/page-builder/PageBuilder.astro';\nimport BaseLayout from '../layouts/BaseLayout.astro';\nimport { sectionRegistry } from '../config/sectionRegistry';\n\nconst entry = await getEntry('pages', '${page}');\nif (!entry) throw new Error('Missing content entry: ${page}');\n---\n\n<BaseLayout title={entry.data.title} description={entry.data.description}>\n  <PageBuilder sections={entry.data.sections} sectionRegistry={sectionRegistry} />\n</BaseLayout>\n`, { flag: 'wx' });
  }
}

async function writeProjectDocs(destination: string, name: string): Promise<void> {
  const docs = ['PROJECT', 'DESIGN', 'SITE', 'PLAN', 'REFERENCES', 'AGENTS'];
  await mkdir(resolve(destination, 'project'), { recursive: true });
  for (const doc of docs) {
    const path = resolve(destination, 'project', `${doc}.md`);
    if (!existsSync(path)) await writeFile(path, `# ${doc}\n\nProject: ${name}\n`, { flag: 'wx' });
  }
  await mkdir(resolve(destination, 'public/images'), { recursive: true });
  await mkdir(resolve(destination, 'src/components'), { recursive: true });
  await mkdir(resolve(destination, 'src/sections'), { recursive: true });
  await mkdir(resolve(destination, 'src/styles'), { recursive: true });
}

function capitalize(value: string): string { return value.charAt(0).toUpperCase() + value.slice(1); }
