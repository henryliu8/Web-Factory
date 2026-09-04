import { resolve } from 'node:path';

export function repositoryRoot(cwd = process.cwd()): string {
  return resolve(cwd);
}

export function projectPath(project: string, cwd = process.cwd()): string {
  return resolve(repositoryRoot(cwd), 'apps', project);
}
