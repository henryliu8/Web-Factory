import { getPermalink } from '@webfactory/template-astrowind/utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'About', href: getPermalink('/about') },
    { text: 'Services', href: getPermalink('/services') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  actions: [{ text: 'Get started', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'Explore',
      links: headerData.links,
    },
  ],
  secondaryLinks: [],
  socialLinks: [],
  footNote: `Built with Web Factory.`,
};
