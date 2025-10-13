// src/components/CustomFooter.jsx
import React from 'react';
import tutorLogoDefault from '../assets/tutor-logo.png';
import openedxLogoDefault from '../assets/openedx-logo.png';

export default function CustomFooter({
  openedxLink,
  tutorLogoSrc = tutorLogoDefault,
  openedxLogoSrc = openedxLogoDefault,
  hideOpenedxLink,
  bidi,
  includeLanguageSelector,
  icp,
  aboutHtml,
  quickLinks,
  contactLines,
  dark = true,
}) {
  const year = new Date().getFullYear();

  return (
    <div className="wrapper wrapper-footer">
      <footer
        id="footer"
        className="tutor-container p-3"
        {...(bidi ? { dir: bidi } : {})}
        style={dark ? { backgroundColor: '#0f172a', color: '#c9d2e3' } : null}
      >
        <div className="footer-top">
          <div className="powered-area" style={{ marginBottom: 16 }}>
            {!hideOpenedxLink && (
              <ul className="logo-list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: 12, alignItems: 'center' }}>
                <li><strong>Powered by:</strong></li>
                <li>
                  <a href="https://docs.tutor.edly.io" rel="noopener" target="_blank">
                    <img src={tutorLogoSrc} alt="Runs on Tutor" width="80" />
                  </a>
                </li>
                <li>
                  <a href={openedxLink.url} rel="noopener" target="_blank">
                    <img src={openedxLogoSrc} alt={openedxLink.title} width="79" />
                  </a>
                </li>
              </ul>
            )}
          </div>

          <div
            className="footer-grid"
            style={{
              maxWidth: 1200,
              margin: '2rem auto 0',
              display: 'grid',
              gap: '2rem',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
            }}
          >
            <div className="footer-col">
              <h4 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>About CUSC</h4>
              <p dangerouslySetInnerHTML={{ __html: aboutHtml }} />
            </div>

            <div className="footer-col">
              <h4 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Quick Links</h4>
              {quickLinks.map((l) => (
                <a key={l.href} href={l.href} style={{ display: 'block', margin: '.35rem 0', textDecoration: 'none', color: '#c0c9dc' }}>
                  {l.label}
                </a>
              ))}
            </div>

            <div className="footer-col">
              <h4 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Contact</h4>
              {contactLines.map((line, i) => (
                <p key={i} style={{ margin: '.35rem 0', color: '#aab3c5', lineHeight: 1.6 }}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <span className="copyright-site" style={{ display: 'block', marginTop: 16 }}>
          Copyrights ©{year}. All Rights Reserved.
        </span>

        <div className="colophon" style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: '1rem', textAlign: 'center' }}>
          {includeLanguageSelector && (
            <p style={{ opacity: 0.8, marginBottom: 8 }}>Language: English</p>
          )}
          <p className="copyright" style={{ color: '#aab3c5', fontSize: '0.875rem', margin: 0, padding: '10px' }}>
            © {year} CUSC Learning Platform
            {icp?.icp_license ? (
              <>
                {' '}| {icp.text}{' '}
                <a href={icp.icp_license_link || '#'}>{icp.icp_license}</a>
              </>
            ) : null}
          </p>
        </div>
      </footer>
    </div>
  );
}

CustomFooter.defaultProps = {
  openedxLink: { url: 'https://openedx.org', title: 'Open edX' },
  hideOpenedxLink: false,
  bidi: undefined,
  includeLanguageSelector: false,
  icp: undefined,
  aboutHtml:
    'The Can Tho University Software Center provides online learning solutions and professional courses in programming, data science, and design.',
  quickLinks: [
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About' },
    { href: '/tos', label: 'Terms' },
    { href: '/privacy', label: 'Privacy' },
  ],
  contactLines: [
    'Email: info@cusc.vn',
    'Phone: +84 292 3835 579',
    'Address: 1 Ly Tu Trong St, Ninh Kieu, Can Tho, Vietnam',
  ],
};
