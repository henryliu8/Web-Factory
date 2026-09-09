import { readFileSync } from 'node:fs';
import type { ProjectConfig } from '../config/projectSchema';
import type { TemplateConfig, ThemeConfig } from '../types';
import { resolveStyleOrder } from './styleOrder';

export const WEB_FACTORY_STYLE_ENTRY = 'virtual:webfactory-styles';
export const WEB_FACTORY_TEMPLATE_STYLE = 'virtual:webfactory-template-style';
export const WEB_FACTORY_THEME_STYLE = 'virtual:webfactory-theme-style';

export interface StyleCatalog {
  templates: Readonly<Record<string, Pick<TemplateConfig, 'style'>>>;
  themes: Readonly<Record<string, Pick<ThemeConfig, 'style'>>>;
}

export interface StyleRuntimeOptions {
  applicationStyle: string;
  catalog: StyleCatalog;
  project: Pick<ProjectConfig, 'template' | 'theme'>;
}

export interface StylesheetResolverPlugin {
  name: string;
  enforce: 'pre';
  resolveId(id: string): string | null;
  transform(source: string, id: string): string | null;
}

export function resolveStyleComposition(
  project: Pick<ProjectConfig, 'template' | 'theme'>,
  catalog: StyleCatalog,
): string[] {
  const template = resolveCatalogStyle('template', project.template, catalog.templates);
  const theme = resolveCatalogStyle('theme', project.theme, catalog.themes);

  return resolveStyleOrder({
    shared: ['@webfactory/tokens'],
    template: [template],
    theme: [theme],
    project: ['./project.css'],
  });
}

export function createStyleRuntime(options: StyleRuntimeOptions): {
  styles: string[];
  vitePlugin: StylesheetResolverPlugin;
} {
  const styles = resolveStyleComposition(options.project, options.catalog);
  const [, templateStyle, themeStyle] = styles;
  return {
    styles,
    vitePlugin: {
      name: 'webfactory-style-runtime',
      enforce: 'pre',
      resolveId(id) {
        return id === WEB_FACTORY_STYLE_ENTRY ? options.applicationStyle : null;
      },
      transform(source, id) {
        if (id.split('?', 1)[0] !== options.applicationStyle) return null;
        return renderStyleComposition(
          source || readFileSync(options.applicationStyle, 'utf8'),
          templateStyle,
          themeStyle,
        );
      },
    },
  };
}

export function renderStyleComposition(
  source: string,
  templateStyle: string,
  themeStyle: string,
): string {
  return source
    .replaceAll(WEB_FACTORY_TEMPLATE_STYLE, templateStyle)
    .replaceAll(WEB_FACTORY_THEME_STYLE, themeStyle);
}

function resolveCatalogStyle(
  kind: 'template' | 'theme',
  id: string,
  entries: Readonly<Record<string, { style: string }>>,
): string {
  const entry = entries[id];
  if (entry) return entry.style;

  const available = Object.keys(entries).sort();
  throw new Error(
    `Unknown Web Factory ${kind}: ${id}\n\nAvailable ${kind}s:\n${available.map((value) => `- ${value}`).join('\n')}`,
  );
}
