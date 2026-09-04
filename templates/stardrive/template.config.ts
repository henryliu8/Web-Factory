export interface StardriveTemplateConfig {
  id: 'stardrive';
  name: string;
  description: string;
  layouts: {
    default: string;
  };
  styles: string[];
}

const template: StardriveTemplateConfig = {
  id: 'stardrive',
  name: 'Stardrive',
  description: 'A flexible, content-first Astro website structure.',
  layouts: {
    default: './src/layouts/BaseLayout.astro',
  },
  styles: ['@webfactory/tokens', './src/styles/template.css'],
};

export default template;
