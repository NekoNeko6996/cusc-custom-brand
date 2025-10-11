// Link thường
export const primaryNav = [
  { href: '/dashboard', content: 'Dashboard' },
  { href: '/catalog',   content: 'Catalog' },
  // Dropdown (tuỳ chọn)
  {
    type: 'menu',
    content: 'Programs',
    items: [
      { href: '/programs/all',  content: 'All Programs' },
      { href: '/programs/pro',  content: 'Professional' },
    ],
  },
];

export const secondaryNav = [
  { href: '/help',    content: 'Help' },
  { href: '/contact', content: 'Contact' },
];
