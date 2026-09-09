import { existsSync, readFileSync } from 'node:fs';
import { dirname, isAbsolute, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const cliModuleDirectory = dirname(fileURLToPath(import.meta.url));

export function repositoryRoot(start = process.cwd()): string {
  for (const candidate of [resolve(start), cliModuleDirectory]) {
    const root = findRootFrom(candidate);
    if (root) return root;
  }

  throw new Error(
    `Web Factory could not locate its repository root from "${start}". `
    + 'Expected pnpm-workspace.yaml, the web-factory root package, templates, and themes.',
  );
}

export function projectPath(project: string, start = process.cwd()): string {
  return resolve(repositoryRoot(start), 'apps', normalizeProjectSlug(project));
}

export function normalizeProjectSlug(value: string): string {
  const input = value.trim();
  if (!input || input === '.' || input === '..' || isAbsolute(input) || /[\\/]/.test(input)) {
    throw new Error(`Invalid project name "${value}". Project names cannot be paths.`);
  }

  const slug = input.toLowerCase().replace(/[\s_]+/g, '-');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      `Invalid project name "${value}". Use letters, numbers, spaces, underscores, or hyphens.`,
    );
  }

  return slug;
}

function findRootFrom(start: string): string | undefined {
  let directory = start;

  while (true) {
    if (isWebFactoryRoot(directory)) return directory;
    const parent = dirname(directory);
    if (parent === directory || directory === parse(directory).root) return undefined;
    directory = parent;
  }
}

function isWebFactoryRoot(directory: string): boolean {
  const manifestPath = resolve(directory, 'package.json');
  if (
    !existsSync(resolve(directory, 'pnpm-workspace.yaml'))
    || !existsSync(resolve(directory, 'templates'))
    || !existsSync(resolve(directory, 'themes'))
    || !existsSync(manifestPath)
  ) return false;

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { name?: unknown };
    return manifest.name === 'web-factory';
  } catch {
    return false;
  }
}
