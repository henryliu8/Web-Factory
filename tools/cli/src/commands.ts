import { execa } from 'execa';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import pc from 'picocolors';
import { parseProjectConfig } from '@webfactory/core';
import { listTemplates, listThemes } from './catalog';
import { projectPath } from './paths';

export async function runProjectCommand(command: 'dev' | 'build' | 'check', project: string, start = process.cwd()): Promise<void> {
  const directory = projectPath(project, start);
  if (!existsSync(directory)) throw new Error(`Web Factory could not find project "${project}" at ${directory}.`);
  await validateProject(directory, start);
  console.log(`${pc.cyan(command)} ${pc.dim(project)}`);
  await execa('pnpm', ['exec', 'astro', command === 'dev' ? 'dev' : command === 'check' ? 'check' : 'build'], { cwd: directory, stdio: 'inherit' });
}

async function validateProject(directory: string, start: string): Promise<void> {
  const configPath = resolve(directory, 'webfactory.config.ts');
  if (!existsSync(configPath)) throw new Error(`Web Factory project is missing ${configPath}.`);
  const module = await import(`${pathToFileURL(configPath).href}?wf=${Date.now()}`) as { default?: unknown };
  const config = parseProjectConfig(module.default);
  validateCatalogEntry('template', config.template, listTemplates(start));
  validateCatalogEntry('theme', config.theme, listThemes(start));
}

function validateCatalogEntry(kind: 'template' | 'theme', value: string, available: string[]): void {
  if (available.includes(value)) return;
  throw new Error(
    `Unknown Web Factory ${kind}: ${value}\n\nAvailable ${kind}s:\n${available.map((item) => `- ${item}`).join('\n')}`,
  );
}

export async function syncProject(project: string, start = process.cwd()): Promise<void> {
  const directory = projectPath(project, start);
  if (!existsSync(directory)) throw new Error(`Web Factory could not find project "${project}" at ${directory}.`);
  throw new Error(`Web Factory sync is not implemented yet for "${project}". No project files were changed.`);
}
