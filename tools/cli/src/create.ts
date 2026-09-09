import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, extname, relative, resolve } from 'node:path';
import * as prompts from '@clack/prompts';
import pc from 'picocolors';
import { defineProject } from '@webfactory/core';
import { listTemplates, listThemes } from './catalog';
import { normalizeProjectSlug, projectPath, repositoryRoot } from './paths';
import type { CreateOptions } from './types';

const defaultPages = ['home', 'about', 'services', 'projects', 'contact'];
const textExtensions = new Set(['.astro', '.css', '.json', '.md', '.mjs', '.ts', '.txt']);
const placeholderPattern = /{{([A-Za-z][A-Za-z0-9]*)}}/g;

export async function createProject(name: string, options: CreateOptions, start = process.cwd()): Promise<string> {
  const root = repositoryRoot(start);
  const slug = normalizeProjectSlug(name);
  const projectName = displayName(name, slug);
  const destination = projectPath(slug, root);
  if (existsSync(destination)) {
    throw new Error(`Project "${slug}" already exists at ${destination}. Choose another name.`);
  }

  const template = options.template ?? await selectTemplate(root);
  const theme = options.theme ?? await selectTheme(root);
  const pages = normalizePages(options.pages ? parsePages(options.pages) : await selectPages());
  validateChoice('template', template, listTemplates(root));
  validateChoice('theme', theme, listThemes(root));
  defineProject({ name: projectName, slug, template, theme, pages });

  const scaffold = resolve(root, 'templates', template, 'scaffold');
  if (!existsSync(scaffold)) throw new Error(`Web Factory could not find template "${template}" scaffold.`);

  const appsDirectory = resolve(root, 'apps');
  await mkdir(appsDirectory, { recursive: true });
  const stagingDirectory = await mkdtemp(resolve(appsDirectory, `.wf-${slug}-`));

  try {
    await copyScaffold(scaffold, stagingDirectory);
    await writePageFiles(stagingDirectory, pages, projectName);
    await writeProjectDocs(stagingDirectory, projectName);
    await processPlaceholders(stagingDirectory, {
      project: slug,
      projectName,
      template,
      theme,
      pages: JSON.stringify(pages),
    });
    await validateGeneratedProject(stagingDirectory);
    await rename(stagingDirectory, destination);
  } catch (error) {
    await rm(stagingDirectory, { recursive: true, force: true });
    throw error;
  }

  console.log(`${pc.green('Created')} ${pc.bold(destination)}`);
  return destination;
}

function validateChoice(label: string, value: string, choices: string[]): void {
  if (!choices.includes(value)) {
    throw new Error(`Web Factory could not find ${label} "${value}".\n\nAvailable ${label}s:\n${choices.map((item) => `- ${item}`).join('\n')}`);
  }
}

export function parsePages(value: string): string[] {
  const pages = value.split(',').map((page) => page.trim()).filter(Boolean);
  if (!pages.length) throw new Error('The --pages option must contain at least one page.');
  return pages;
}

async function selectTemplate(cwd: string): Promise<string> {
  const result = await prompts.select({ message: 'Select template', options: listTemplates(cwd).map((value) => ({ value, label: value })) });
  if (prompts.isCancel(result)) {
    prompts.cancel('Project creation cancelled.');
    throw new Error('Project creation cancelled.');
  }
  return result as string;
}

async function selectTheme(cwd: string): Promise<string> {
  const result = await prompts.select({ message: 'Select theme', options: listThemes(cwd).map((value) => ({ value, label: value })) });
  if (prompts.isCancel(result)) {
    prompts.cancel('Project creation cancelled.');
    throw new Error('Project creation cancelled.');
  }
  return result as string;
}

async function selectPages(): Promise<string[]> {
  const result = await prompts.multiselect({ message: 'Select pages', options: defaultPages.map((value) => ({ value, label: value, hint: value === 'home' ? 'required' : undefined })), initialValues: defaultPages });
  if (prompts.isCancel(result)) {
    prompts.cancel('Project creation cancelled.');
    throw new Error('Project creation cancelled.');
  }
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

async function writePageFiles(destination: string, pages: string[], projectName: string): Promise<void> {
  const pagesDir = resolve(destination, 'src/pages');
  const contentDir = resolve(destination, 'src/content');
  await mkdir(pagesDir, { recursive: true });
  await mkdir(contentDir, { recursive: true });
  for (const page of pages) {
    const route = page === 'home' ? 'index' : page;
    const contentPath = resolve(contentDir, `${page}.md`);
    const pagePath = resolve(pagesDir, `${route}.astro`);
    const title = titleFromSlug(page);
    if (!existsSync(contentPath)) {
      await writeFile(contentPath, `---\ntitle: ${title}\ndescription: ${title} page for ${projectName}.\nsections: []\n---\n`, { flag: 'wx' });
    }
    if (!existsSync(pagePath)) {
      await writeFile(pagePath, `---\nimport { getEntry } from 'astro:content';\nimport StandardPageTemplate from '@webfactory/template-stardrive/page-templates/StandardPageTemplate';\nimport { site } from '../config/site';\n\nconst entry = await getEntry('pages', '${page}');\nif (!entry) throw new Error('Missing content entry: ${page}');\n---\n\n<StandardPageTemplate\n  metadata={{ title: entry.data.title, description: entry.data.description, lang: site.language }}\n  header={{ brand: site.name }}\n  heading={entry.data.title}\n/>\n`, { flag: 'wx' });
    }
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

async function processPlaceholders(directory: string, replacements: Record<string, string>): Promise<void> {
  for (const path of await generatedTextFiles(directory)) {
    const source = await readFile(path, 'utf8');
    const output = source.replace(placeholderPattern, (placeholder, key: string) => {
      return Object.hasOwn(replacements, key) ? replacements[key] : placeholder;
    });
    if (output !== source) await writeFile(path, output);
  }
}

async function validateGeneratedProject(directory: string): Promise<void> {
  const textFiles = await generatedTextFiles(directory);
  const unresolved: string[] = [];
  for (const path of textFiles) {
    if (placeholderPattern.test(await readFile(path, 'utf8'))) unresolved.push(relative(directory, path));
    placeholderPattern.lastIndex = 0;
  }
  if (unresolved.length) {
    throw new Error(`Unresolved scaffold placeholder in:\n${unresolved.map((path) => `- ${path}`).join('\n')}`);
  }

  const packagePath = resolve(directory, 'package.json');
  if (!existsSync(packagePath)) throw new Error('Generated project is missing package.json.');
  if (existsSync(resolve(directory, 'package.json.template'))) {
    throw new Error('Generated project still contains package.json.template.');
  }
  const configFiles = textFiles.filter((path) => basename(path) === 'webfactory.config.ts');
  if (configFiles.length !== 1) {
    throw new Error(`Generated project must contain exactly one webfactory.config.ts; found ${configFiles.length}.`);
  }
  JSON.parse(await readFile(packagePath, 'utf8'));
}

async function generatedTextFiles(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await generatedTextFiles(path));
    else if (textExtensions.has(extname(entry.name))) files.push(path);
  }
  return files;
}

export function normalizePageName(value: string): string {
  const input = value.trim();
  if (!input || input === '.' || input === '..' || /[\\/]/.test(input)) {
    throw new Error(`Invalid page name "${value}". Page names cannot be paths.`);
  }
  const slug = input.toLowerCase().replace(/[\s_]+/g, '-');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid page name "${value}". Use letters, numbers, spaces, underscores, or hyphens.`);
  }
  return slug === 'index' ? 'home' : slug;
}

function normalizePages(pages: string[]): string[] {
  return [...new Set(['home', ...pages.map(normalizePageName)])];
}

function displayName(input: string, slug: string): string {
  return /[\s_]/.test(input.trim())
    ? input.trim().replace(/[_\s]+/g, ' ')
    : titleFromSlug(slug);
}

function titleFromSlug(value: string): string {
  return value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}
