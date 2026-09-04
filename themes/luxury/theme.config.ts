export interface WebFactoryThemeConfig {
  id: string;
  name: string;
  description: string;
  styles: string[];
}

const theme: WebFactoryThemeConfig = {
  id: 'luxury',
  name: 'Luxury',
  description: 'A clean, spacious, and architectural visual direction.',
  styles: [
    './src/styles/tokens.css',
    './src/styles/theme.css',
    './src/styles/typography.css',
    './src/styles/motion.css',
  ],
};

export default theme;
