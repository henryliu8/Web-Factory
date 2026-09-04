import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export function listTemplates(cwd = process.cwd()): string[] {
  return listDirectories(resolve(cwd, 'templates'));
}

export function listThemes(cwd = process.cwd()): string[] {
  return listDirectories(resolve(cwd, 'themes'));
}

function listDirectories(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}
