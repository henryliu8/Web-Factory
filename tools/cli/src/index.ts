#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { createProject } from './create';
import { listTemplates, listThemes } from './catalog';
import { runProjectCommand, syncProject } from './commands';

const program = new Command();

program
  .name('webfactory')
  .description('Create and manage Web Factory Astro projects.')
  .version('0.1.0');

program.command('create <project>')
  .description('Create a project from a template scaffold.')
  .option('--template <template>', 'Template name')
  .option('--theme <theme>', 'Theme name')
  .option('--pages <pages>', 'Comma-separated page names')
  .action(async (project, options) => run(() => createProject(project, options)));

for (const command of ['dev', 'build', 'check'] as const) {
  program.command(`${command} <project>`)
    .description(`${command[0].toUpperCase()}${command.slice(1)} a project.`)
    .action(async (project) => run(() => runProjectCommand(command, project)));
}

program.command('sync <project>')
  .description('Refresh project metadata without overwriting custom files.')
  .action(async (project) => run(() => syncProject(project)));

const list = program.command('list').description('List available Web Factory resources.');
list.command('templates').action(() => listTemplates().forEach((item) => console.log(item)));
list.command('themes').action(() => listThemes().forEach((item) => console.log(item)));

await program.parseAsync();

async function run(action: () => Promise<unknown>): Promise<void> {
  try {
    await action();
  } catch (error) {
    console.error(pc.red(error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
  }
}
