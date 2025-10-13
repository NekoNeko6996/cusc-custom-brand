export { primaryNav, secondaryNav } from './navigation.js';
export { footerLinks } from './footers.js';

export { default as Header } from './components/CustomHeader.js';
export { default as Footer } from './components/CustomFooter.js';

// Kèm export đường dẫn SCSS để MFE có thể `import '@edx/brand/paragon/build/scss/core.scss'` như cũ
export { default as tutorLogo } from './assets/tutor-logo.png';
export { default as openedxLogo } from './assets/openedx-logo.png';
export { default as ctuLogo } from './assets/ctu-logo.png';
export { default as cuscLogo } from './assets/cusc-logo.png';

export * from './brand';
// import './styles/index.scss';