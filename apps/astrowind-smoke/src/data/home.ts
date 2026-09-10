export const home = {
  hero: {
    title: 'Astrowind Smoke',
    tagline: 'Clear structure. Flexible identity.',
    subtitle:
      'A production-ready Astro site assembled from reusable Web Factory sections and semantic design tokens.',
    actions: [
      { variant: 'primary' as const, text: 'Get started', href: '/contact' },
      { text: 'Learn more', href: '#features' },
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80',
      alt: 'A bright modern workspace',
    },
  },
  features: {
    id: 'features',
    title: 'A strong foundation for your next site',
    subtitle: 'Reusable sections stay in the template while content and branding remain project-owned.',
    columns: 3,
    items: [
      { title: 'Composable sections', description: 'Build pages from typed Astro sections.', icon: 'tabler:components' },
      { title: 'Theme-ready', description: 'Semantic tokens keep visual identity replaceable.', icon: 'tabler:palette' },
      { title: 'Project overrides', description: 'Customize without duplicating shared code.', icon: 'tabler:layers-subtract' },
    ],
  },
  callToAction: {
    title: 'Ready to shape this site?',
    subtitle: 'Replace the starter content and let your selected theme define the visual direction.',
    actions: [{ variant: 'primary' as const, text: 'Contact us', href: '/contact' }],
  },
};
