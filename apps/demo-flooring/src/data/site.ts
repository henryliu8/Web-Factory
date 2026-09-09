export const site = {
  name: 'Grain & Ground',
  descriptor: 'Flooring Studio',
  language: 'en-AU',
  navigation: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ],
  primaryAction: { label: 'Book a consultation', href: '/contact' },
  contact: {
    phone: '(02) 5550 1842',
    phoneHref: 'tel:+61255501842',
    email: 'studio@grainandground.example',
    address: ['18 Tanner Lane', 'Alexandria NSW 2015'],
  },
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Pinterest', href: 'https://www.pinterest.com/' },
  ],
} as const;
