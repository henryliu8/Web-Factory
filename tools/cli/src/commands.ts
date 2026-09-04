import { execa } from 'execa';
import { existsSync } from 'node:fs';
import pc from 'picocolors';
import { projectPath } from './paths';

export async function runProjectCommand(command: 'dev' | 'build' | 'check', project: string, cwd = process.cwd()): Promise<void> {
  const directory = projectPath(project, cwd);
  if (!existsSync(directory)) throw new Error(`Web Factory could not find project "${project}" at ${directory}.`);
  console.log(`${pc.cyan(command)} ${pc.dim(project)}`);
  await execa('pnpm', ['exec', 'astro', command === 'dev' ? 'dev' : command === 'check' ? 'check' : 'build'], { cwd: directory, stdio: 'inherit' });
}

export async function syncProject(project: string, cwd = process.cwd()): Promise<void> {
  const directory = projectPath(project, cwd);
  if (!existsSync(directory)) throw new Error(`Web Factory could not find project "${project}" at ${directory}.`);
  console.log(`${pc.green('Synced')} ${pc.bold(project)}. Project files were not overwritten.`);
}
