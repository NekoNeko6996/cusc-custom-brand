// src/components/CustomHeader.jsx
import React, { useContext, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react/index.js';
import { ensureConfig, getConfig } from '@edx/frontend-platform';

// Dữ liệu mặc định từ brand (có thể override bằng props)
import {
  primaryNav as defaultPrimary,
  secondaryNav as defaultSecondary,
  ctuLogo as defaultLogo,
} from '../brand';

ensureConfig(
  [
    'LMS_BASE_URL',
    'LOGIN_URL',
    'LOGOUT_URL',
    'SITE_NAME',
    'ACCOUNT_PROFILE_URL',
    'ACCOUNT_SETTINGS_URL',
    'ORDER_HISTORY_URL',
  ],
  'CustomHeader',
);

function InlineIcon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true };
  if (name === 'person') {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-3.33 0-10 1.34-10 4v2h20v-2c0-2.66-6.67-4-10-4" />
      </svg>
    );
  }
  if (name === 'menu') {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2" />
      </svg>
    );
  }
  if (name === 'chevron') {
    return (
      <svg {...common}>
        <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z" />
      </svg>
    );
  }
  return null;
}

function classNames(...xs) {
  return xs.filter(Boolean).join(' ');
}

function MainMenu({ items }) {
  const [openKey, setOpenKey] = useState(null);

  return (
    <nav className="main-nav" aria-label="Main">
      <ul className="nav-list">
        {items.map((item) => {
          if (item.type === 'menu' && Array.isArray(item.items)) {
            const key = `menu-${item.content}`;
            const isOpen = openKey === key;
            return (
              <li key={key} className={classNames('nav-item', 'has-dropdown', isOpen && 'open')}>
                <button
                  type="button"
                  className="nav-link btn-reset d-inline-flex align-center"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? null : key)}
                  onBlur={(e) => {
                    // Đóng nếu focus ra ngoài dropdown
                    if (!e.currentTarget.closest('li').contains(e.relatedTarget)) setOpenKey(null);
                  }}
                >
                  <span>{item.content}</span>
                  <InlineIcon name="chevron" size={18} />
                </button>
                <ul className="dropdown" role="menu">
                  {item.items.map((sub) => (
                    <li key={sub.href} role="none">
                      <a className="dropdown-item" role="menuitem" href={sub.href}>
                        {sub.content}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }
          return (
            <li key={item.href} className="nav-item">
              <a className="nav-link" href={item.href}>
                {item.content || item.label}
              </a>
            </li>
          );
        })}
      </ul>
      <style>{`
        .main-nav { margin-left: 1rem; }
        .nav-list { display:flex; gap:1rem; list-style:none; margin:0; padding:0; }
        .nav-item { position:relative; }
        .btn-reset { background:none; border:none; padding:0; cursor:pointer; }
        .has-dropdown .dropdown { display:none; position:absolute; top:100%; left:0; min-width:220px; background:#fff; border:1px solid #e5e7eb; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.08); padding:.5rem; z-index:50; }
        .has-dropdown.open .dropdown { display:block; }
        .dropdown-item { display:block; padding:.5rem .75rem; border-radius:6px; color:inherit; text-decoration:none; }
        .dropdown-item:hover { background:#f3f4f6; }
      `}</style>
    </nav>
  );
}

export default function CustomHeader({ primaryNav, secondaryNav, logo }) {
  const { authenticatedUser, config } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const minimal = getConfig().AUTHN_MINIMAL_HEADER;

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isMobile = !isDesktop;

  const brandMain = useMemo(() => primaryNav ?? defaultPrimary ?? [], [primaryNav]);
  const brandSecond = useMemo(() => secondaryNav ?? defaultSecondary ?? [], [secondaryNav]);

  const loggedOut = useMemo(
    () => [
      { href: config?.LOGIN_URL, label: 'Log in' },
      { href: `${config?.LMS_BASE_URL}/register`, label: 'Register' },
    ],
    [config],
  );

  const userMenu = useMemo(() => {
    if (!authenticatedUser) return [];
    const items = [
      { href: `${config.LMS_BASE_URL}/dashboard`, label: 'Dashboard' },
      { href: `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`, label: 'Profile' },
      ...(config.ORDER_HISTORY_URL ? [{ href: config.ORDER_HISTORY_URL, label: 'Order history' }] : []),
      { href: config.ACCOUNT_SETTINGS_URL, label: 'Account settings' },
      { href: config.LOGOUT_URL, label: 'Log out' },
    ];
    return items;
  }, [authenticatedUser, config]);

  const Brand = (
    <a href={`${config?.LMS_BASE_URL}/dashboard`} className="brand d-inline-flex align-center">
      <img
        src={config?.LOGO_URL || logo || defaultLogo}
        alt={config?.SITE_NAME || 'Site'}
        height={28}
      />
      <span className="brand-title">{config?.SITE_NAME || 'Site'}</span>
      <style>{`
        .brand { gap:.5rem; text-decoration:none; color:inherit; }
        .brand-title { font-weight:600; }
      `}</style>
    </a>
  );

  function Secondary() {
    if (minimal || brandSecond.length === 0) return null;
    return (
      <nav className="secondary-nav" aria-label="Secondary">
        <ul className="nav-list">
          {brandSecond.map((item) => (
            <li key={item.href} className="nav-item">
              <a className="nav-link" href={item.href}>
                {item.content || item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  function UserArea() {
    if (authenticatedUser) {
      return (
        <div className="user-area">
          <button
            type="button"
            className="btn-reset d-inline-flex align-center"
            onClick={() => setUserOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={userOpen}
            onBlur={(e) => {
              if (!e.currentTarget.closest('.user-area').contains(e.relatedTarget)) setUserOpen(false);
            }}
          >
            {authenticatedUser.avatar ? (
              <img src={authenticatedUser.avatar} alt="avatar" width={28} height={28} style={{ borderRadius: 999 }} />
            ) : (
              <InlineIcon name="person" />
            )}
            <span className="ms-2">{authenticatedUser.username}</span>
            <InlineIcon name="chevron" size={18} />
          </button>
          <ul className={classNames('dropdown', userOpen && 'show')} role="menu">
            {userMenu.map((i) => (
              <li key={i.href} role="none">
                <a className="dropdown-item" role="menuitem" href={i.href}>{i.label}</a>
              </li>
            ))}
          </ul>
          <style>{`
            .user-area { position:relative; }
            .user-area .dropdown { display:none; position:absolute; right:0; top:calc(100% + 8px); min-width:220px; background:#fff; border:1px solid #e5e7eb; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.08); padding:.5rem; }
            .user-area .dropdown.show { display:block; }
          `}</style>
        </div>
      );
    }

    if (minimal) return null;

    return (
      <div className="auth-buttons d-flex gap-2">
        {loggedOut.map((i) => (
          <a key={i.href} className="btn btn-sm btn-outline-primary" href={i.href}>
            {i.label}
          </a>
        ))}
      </div>
    );
  }

  function Desktop() {
    return (
      <header className="custom-header border-bottom bg-white">
        <div className="container d-flex align-center justify-between" style={{ minHeight: 64 }}>
          <div className="d-flex align-center">
            {Brand}
            {!minimal && <MainMenu items={brandMain} />}
          </div>
          <div className="d-flex align-center" style={{ gap: '12px' }}>
            <Secondary />
            <UserArea />
          </div>
        </div>
      </header>
    );
  }

  function Mobile() {
    return (
      <header className="custom-header border-bottom bg-white">
        <div className="container d-flex align-center justify-between" style={{ minHeight: 56 }}>
          {Brand}
          {!minimal && (
            <button
              type="button"
              className="btn-reset p-2"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <InlineIcon name="menu" />
            </button>
          )}
        </div>
        {!minimal && mobileOpen && (
          <div className="container py-2">
            {/* Main (không dropdown) */}
            <nav aria-label="Mobile Main">
              <ul className="mobile-list">
                {brandMain.filter((i) => i.type !== 'menu').map((i) => (
                  <li key={i.href}><a className="mobile-link" href={i.href}>{i.content || i.label}</a></li>
                ))}
              </ul>
            </nav>
            {/* Dropdown groups */}
            {brandMain.filter((i) => i.type === 'menu').map((menu) => (
              <div key={menu.content} className="mt-2">
                <div className="fw-semibold mb-1">{menu.content}</div>
                <div className="d-flex flex-column gap-2">
                  {(menu.items || []).map((sub) => (
                    <a key={sub.href} href={sub.href} className="btn w-100 btn-light">{sub.content}</a>
                  ))}
                </div>
              </div>
            ))}

            {/* Secondary */}
            {brandSecond.length > 0 && (
              <div className="mt-3">
                <ul className="mobile-list">
                  {brandSecond.map((i) => (
                    <li key={i.href}><a className="mobile-link" href={i.href}>{i.content || i.label}</a></li>
                  ))}
                </ul>
              </div>
            )}

            {/* User/Auth */}
            <div className="mt-3 d-flex flex-column gap-2">
              {authenticatedUser
                ? userMenu.map((i) => (
                    <a key={i.href} href={i.href} className="btn w-100 btn-light">{i.label}</a>
                  ))
                : loggedOut.map((i) => (
                    <a key={i.href} href={i.href} className="btn w-100 btn-light">{i.label}</a>
                  ))}
            </div>
          </div>
        )}
        <style>{`
          .mobile-list { list-style:none; padding:0; margin:0; }
          .mobile-link { display:block; padding:.625rem .75rem; border-radius:8px; text-decoration:none; color:inherit; }
          .mobile-link:hover { background:#f3f4f6; }
        `}</style>
      </header>
    );
  }

  return (
    <>
      {isMobile && <Mobile />}
      {isDesktop && <Desktop />}
      <style>{`
        .custom-header .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .d-flex { display:flex; }
        .align-center { align-items:center; }
        .justify-between { justify-content:space-between; }
        .gap-2 { gap:.5rem; }
        .border-bottom { border-bottom:1px solid #e5e7eb; }
        .bg-white { background:#fff; }
        .btn { display:inline-block; padding:.375rem .75rem; border:1px solid #cbd5e1; border-radius:8px; text-decoration:none; }
        .btn-sm { padding:.25rem .5rem; font-size:.875rem; }
        .btn-outline-primary { color:#0d6efd; border-color:#0d6efd; }
        .btn-outline-primary:hover { background:#0d6efd; color:#fff; }
        .btn-light { background:#f8fafc; border-color:#e5e7eb; }
        .ms-2 { margin-left:.5rem; }
        .p-2 { padding:.5rem; }
        .fw-semibold { font-weight:600; }
        .mt-2 { margin-top:.5rem; }
        .mt-3 { margin-top:.75rem; }
      `}</style>
    </>
  );
}
