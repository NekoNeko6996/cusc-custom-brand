export const primaryNav = [
  { href: '/courses', content: 'Courses' },
  {
    type: 'menu',
    content: 'More',
    items: [
      { href: '/about', content: 'About' },
      { href: '/contact', content: 'Contact' },
    ],
  },
];

export const secondaryNav = [
  { href: '/help', content: 'Help' },
];
// import ctuLogo from '../assets/ctu-logo.png';
// import cuscLogo from '../assets/cusc-logo.png';

const ctuLogo = "http://local.openedx.io:8000/static/tutor-edx-mytheme/images/ctu-logo.png";
const cuscLogo = "http://local.openedx.io:8000/static/tutor-edx-mytheme/images/cusc-logo.png";

export { ctuLogo, cuscLogo };
