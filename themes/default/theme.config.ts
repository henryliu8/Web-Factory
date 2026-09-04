export interface WebFactoryThemeConfig {
  id: string;
  name: string;
  description: string;
  styles: string[];
}

const theme: WebFactoryThemeConfig = {
  id: 'default',
  name: 'Default',
  description: 'A neutral foundation for Web Factory projects.',
  styles: [
    './src/styles/tokens.css',
    './src/styles/theme.css',
    './src/styles/typography.css',
    './src/styles/motion.css',
  ],
};

export default theme;
