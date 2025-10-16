// src/components/CustomHeader.jsx
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react/index.js';
import { ensureConfig, getConfig } from '@edx/frontend-platform';

import {
  primaryNav as defaultPrimary,
  secondaryNav as defaultSecondary,
  ctuLogo as defaultLogo,
} from '../brand';

ensureConfig(
  ['LMS_BASE_URL','LOGIN_URL','LOGOUT_URL','SITE_NAME','ACCOUNT_PROFILE_URL','ACCOUNT_SETTINGS_URL','ORDER_HISTORY_URL'],
  'CustomHeader',
);

/* ========= HEIGHT constants để offset body ========= */
const H_DESKTOP = 64; // chiều cao thực tế thanh header desktop
const H_MOBILE  = 56; // chiều cao thực tế thanh header mobile

/* ========= BIẾN THEME (chỉnh ở đây) ========= */
const THEME_CSS_VARS = `
:root{
  --light-dark:#475569;
  --dark:#0f172a;
  --primary:#0d6efd;
  --primary-light:#e7f1ff;

  --body-bg-d:#0f1115;
  --text-color-d:#e5e7eb;
  --primary-d:#144aa3;
  --btn-color-d:#ffffff;
  --light-overlay-d:#1b2433;
  --text-color-primary:#c7d2fe;

  --dark-theme-switch-bg-color:#1f2937;
  --light-theme-switch-bg-color:#e5e7eb;

  --cusc-blue:#0056A1;
  --cusc-blue-hover:#0F59C9;
  --accent:#10B981;
  --accent-strong:#059669;
  --line:#e5e7eb;
  --txt:#1f2937;
  --sub:#6b7280;

  --h-pad-sm:8px;
  --h-pad-md:12px;
  --h-pad-lg:16px;
  --ctrl-h:40px;
  --ctrl-radius:10px;
  --gap:12px;
  --discover-gap:54px;
}
`;

/* =========================
   CUSC Header (lean & same UI)
   ========================= */
const HEADER_CSS = `
/* Ẩn header legacy của edX nếu còn trong DOM (để tránh đè UI) */
header.global-header:not(.custom-header){ display:none !important; }

/* Shell */
header.global-header.custom-header{
  position:fixed !important;
  top:0; left:0; right:0; z-index:1100; /* tăng z-index để hơn các overlay khác */
  background:#fff !important;
  border-bottom:0 !important;
  box-shadow:0 6px 20px rgba(0,0,0,.03) !important;
  backdrop-filter:none !important;
  -webkit-backdrop-filter:none !important;
  transition:background .25s ease, backdrop-filter .25s ease, box-shadow .25s ease;
}
header.global-header.custom-header.scrolled{
  background:rgba(255,255,255,0.72) !important;
  backdrop-filter:saturate(160%) blur(12px) !important;
  -webkit-backdrop-filter:saturate(160%) blur(12px) !important;
  box-shadow:0 8px 24px rgba(0,0,0,.08) !important;
}
header.global-header.custom-header.scrolled::after{
  content:""; position:absolute; left:0; right:0; bottom:0; height:2px; pointer-events:none;
  background:linear-gradient(90deg,#0F59C9,#10B981); opacity:.35;
}

header.global-header.custom-header .header-container{ width:100% !important; max-width:none !important; padding:0 !important; margin:0 !important; }
header.global-header.custom-header .bar{ padding:0 16px; }
@media (max-width: 991.98px){ header.global-header.custom-header .bar{ padding:0 16px; } }

/* Utilities (scoped) */
header.global-header.custom-header .d-flex{ display:flex !important; }
header.global-header.custom-header .align-center{ align-items:center !important; }
header.global-header.custom-header .justify-between{ justify-content:space-between !important; }
header.global-header.custom-header .gap-2{ gap:.5rem !important; }
header.global-header.custom-header .ms-2{ margin-left:.5rem !important; }
header.global-header.custom-header .p-2{ padding:.5rem !important; }
header.global-header.custom-header .mt-2{ margin-top:.5rem !important; }
header.global-header.custom-header .mt-3{ margin-top:.75rem !important; }
header.global-header.custom-header .fw-semibold{ font-weight:600 !important; }

/* Thanh chính (auto height theo giá trị JavaScript ở spacer) */
header.global-header.custom-header > .bar{
  display:flex !important; align-items:center !important; justify-content:space-between !important;
  min-height:${H_DESKTOP}px !important;
}
@media (max-width:991px){
  header.global-header.custom-header > .bar{ min-height:${H_MOBILE}px !important; }
}

/* Brand */
header.global-header.custom-header .brand{ display:inline-flex; align-items:center; gap:.5rem; text-decoration:none; color:inherit; }
header.global-header.custom-header .brand-title{ font-weight:800; color:var(--cusc-blue); letter-spacing:.2px; }
header.global-header.custom-header .brand:hover .brand-title{ color:var(--cusc-blue-hover); }

/* Main menu */
header.global-header.custom-header .main-nav{ margin-left:var(--discover-gap) !important; }
header.global-header.custom-header .nav-list{ display:flex; gap:1rem; list-style:none; margin:0; padding:0; }
header.global-header.custom-header .nav-item{ position:relative; }
header.global-header.custom-header .nav-link{
  text-decoration:none; color:var(--light-dark) !important; padding:20px 0 !important;
  display:inline-flex; align-items:center; gap:6px;
  border-bottom:2px solid transparent !important; box-shadow:none !important; background:transparent !important;
}
header.global-header.custom-header .nav-link:hover,
header.global-header.custom-header .nav-link.active{
  color:var(--dark) !important; border-bottom-color:var(--primary) !important;
}

/* Dropdown desktop */
header.global-header.custom-header .btn-reset{ background:none; border:0; padding:0; cursor:pointer; }
header.global-header.custom-header .has-dropdown .dropdown{
  display:none; position:absolute; top:calc(100% + 6px); left:0;
  min-width:220px; background:#fff; border:1px solid var(--line);
  border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.08); padding:.5rem; z-index:2000;
}
header.global-header.custom-header .has-dropdown.open .dropdown{ display:block; }

/* Dropdown item */
header.global-header.custom-header .dropdown-item{ display:block; padding:.5rem .75rem; border-radius:6px; color:inherit; text-decoration:none; }
header.global-header.custom-header .dropdown-item:hover{ background:#f3f4f6; }

/* Secondary */
header.global-header.custom-header .secondary-nav .nav-list{ gap:12px; }
header.global-header.custom-header .secondary-nav .nav-link{ padding:10px 0 !important; }

/* User dropdown (desktop) */
header.global-header.custom-header .user-area{ position:relative; }
header.global-header.custom-header .user-area .dropdown{
  display:none; position:absolute; right:0; top:calc(100% + 8px);
  min-width:220px; background:#fff; border:1px solid var(--line);
  border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,.08); padding:.5rem; z-index:2000;
}
header.global-header.custom-header .user-area .dropdown.show{ display:block; }

/* Buttons */
header.global-header.custom-header .btn{
  display:inline-block; padding:.375rem .75rem; border:1px solid #cbd5e1; border-radius:8px; text-decoration:none;
}
header.global-header.custom-header .btn-sm{ padding:.25rem .5rem; font-size:.875rem; }
header.global-header.custom-header .btn-outline-primary{ color:#0d6efd; border-color:#0d6efd; }
header.global-header.custom-header .btn-outline-primary:hover{ background:#0d6efd; color:#fff; }
header.global-header.custom-header .btn-light{ background:#f8fafc; border-color:#e5e7eb; }

/* ===== MOBILE SHEET (đẹp hơn) ===== */
/* Backdrop */
.cusc-mobile-overlay{
  position:fixed; inset:0; background:rgba(15,23,42,.35);
  backdrop-filter:saturate(120%) blur(2px);
  animation:cusc-fade-in .18s ease-out; z-index:2150;
}
/* Sheet trượt từ phải */
.cusc-mobile-sheet{
  position:fixed; right:0; top:${H_MOBILE}px; bottom:0; width:min(92vw, 360px);
  background:#fff; border-left:1px solid #e5e7eb; box-shadow: -20px 0 40px rgba(0,0,0,.12);
  border-top-left-radius:14px; z-index:2200; display:flex; flex-direction:column;
  animation:cusc-slide-in .22s ease-out;
}
/* Header của sheet */
.cusc-mobile-sheet .sheet-head{
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 14px; border-bottom:1px solid #eef2f7;
}
.cusc-mobile-sheet .sheet-title{ font-weight:800; color:var(--cusc-blue); }
.cusc-mobile-sheet .sheet-close{ background:none; border:0; padding:8px; border-radius:10px; }
.cusc-mobile-sheet .sheet-close:active{ transform:scale(.98); }
/* Nội dung */
.cusc-mobile-sheet .sheet-body{ padding:10px; overflow:auto; }
.cusc-mobile-sheet .group{ margin-top:10px; }
.cusc-mobile-sheet .group-title{ font-size:.85rem; color:#64748b; padding:8px 10px; }

/* Các link trong sheet */
.cusc-mobile-sheet .m-item{
  display:flex; align-items:center; gap:10px; padding:12px 12px; border-radius:10px;
  text-decoration:none; color:#1f2937; border:1px solid transparent;
}
.cusc-mobile-sheet .m-item:hover{ background:#F3F6FB; border-color:#e5e7eb; }
.cusc-mobile-sheet .m-item:active{ transform:translateY(1px); }
.cusc-mobile-sheet .m-btn{
  display:block; width:100%; text-align:center; padding:12px; border-radius:10px; text-decoration:none;
  background:#F8FAFC; border:1px solid #e5e7eb; color:#0f172a;
}
.cusc-mobile-sheet .m-btn + .m-btn{ margin-top:8px; }

/* Icon chung (mask SVG) */
.cusc-ic{ width:18px; height:18px; background:currentColor; opacity:.9; }
.cusc-ic.person{
  -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000' d='M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-3.33 0-10 1.34-10 4v2h20v-2c0-2.66-6.67-4-10-4'/></svg>") no-repeat center/contain;
          mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000' d='M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-3.33 0-10 1.34-10 4v2h20v-2c0-2.66-6.67-4-10-4'/></svg>") no-repeat center/contain;
}
.cusc-ic.link{
  -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000' d='M10.59 13.41a1 1 0 0 1 0-1.41l2-2a1 1 0 1 1 1.41 1.41l-2 2a1 1 0 0 1-1.41 0M13 7h5v5h-2V9.41l-7.29 7.3a1 1 0 0 1-1.42-1.42L14.59 8H13Z'/></svg>") no-repeat center/contain;
          mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23000' d='M10.59 13.41a1 1 0 0 1 0-1.41l2-2a1 1 0 1 1 1.41 1.41l-2 2a1 1 0 0 1-1.41 0M13 7h5v5h-2V9.41l-7.29 7.3a1 1 0 0 1-1.42-1.42L14.59 8H13Z'/></svg>") no-repeat center/contain;
}

/* Animation */
@keyframes cusc-fade-in{ from{opacity:0} to{opacity:1} }
@keyframes cusc-slide-in{ from{ transform:translateX(20px); opacity:.6 } to{ transform:translateX(0); opacity:1 } }

/* Mobile: bỏ khoảng Discover */
@media (max-width:991px){ header.global-header.custom-header .main-nav{ margin-left:0 !important; } }

/* Dropdown thành panel cố định ở mobile nhỏ để không bị cắt và canh về bên phải */
@media (max-width:575.98px){
  header.global-header.custom-header .has-dropdown .dropdown,
  header.global-header.custom-header .user-area .dropdown{
    position:fixed !important;
    top: calc(${H_MOBILE}px + 8px) !important; /* nằm dưới header */
    right: 8px !important;
    left: auto !important;
    width: calc(100vw - 16px) !important;
    max-height: 70vh !important;
    overflow:auto !important;
    z-index: 2200 !important;
  }
}
`;


/* ===== utils, menus, component … y như bạn đang dùng (không đổi) ===== */
function InlineIcon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true };
  if (name === 'person') return (<svg {...common}><path fill="currentColor" d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5m0 2c-3.33 0-10 1.34-10 4v2h20v-2c0-2.66-6.67-4-10-4"/></svg>);
  if (name === 'menu')   return (<svg {...common}><path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2"/></svg>);
  if (name === 'chevron')return (<svg {...common}><path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6l1.41-1.42Z"/></svg>);
  return null;
}
function classNames(...xs) { return xs.filter(Boolean).join(' '); }

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
              <li key={key} className={classNames('nav-item','has-dropdown', isOpen && 'open')}>
                <button
                  type="button"
                  className="nav-link btn-reset d-inline-flex align-center"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenKey(isOpen ? null : key)}
                  onBlur={(e) => { if (!e.currentTarget.closest('li').contains(e.relatedTarget)) setOpenKey(null); }}
                >
                  <span>{item.content}</span>
                  <InlineIcon name="chevron" size={18} />
                </button>
                <ul className="dropdown" role="menu">
                  {item.items.map((sub) => (
                    <li key={sub.href} role="none">
                      <a className="dropdown-item" role="menuitem" href={sub.href}>{sub.content}</a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }
          const isDiscover = (item.content || item.label || '').toLowerCase().includes('discover');
          return (
            <li key={item.href} className="nav-item">
              <a className={classNames('nav-link', isDiscover && 'nav-discover')} href={item.href}>
                {item.content || item.label}
              </a>
            </li>
          );
        })}
      </ul>
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

  const loggedOut = useMemo(() => ([
    { href: config?.LOGIN_URL, label: 'Log in' },
    { href: `${config?.LMS_BASE_URL}/register`, label: 'Register' },
  ]), [config]);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const onEsc = (e) => e.key === 'Escape' && setMobileOpen(false);
      window.addEventListener('keydown', onEsc);
      return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onEsc); };
    }
  }, [mobileOpen]);

  const userMenu = useMemo(() => {
    if (!authenticatedUser) return [];
    return [
      { href: `${config.LMS_BASE_URL}/dashboard`, label: 'Dashboard' },
      { href: `${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`, label: 'Profile' },
      ...(config.ORDER_HISTORY_URL ? [{ href: config.ORDER_HISTORY_URL, label: 'Order history' }] : []),
      { href: config.ACCOUNT_SETTINGS_URL, label: 'Account settings' },
      { href: config.LOGOUT_URL, label: 'Log out' },
    ];
  }, [authenticatedUser, config]);

  const Brand = (
    <a href={`${config?.LMS_BASE_URL}/dashboard`} className="brand d-inline-flex align-center">
      <img src={config?.LOGO_URL || logo || defaultLogo} alt={config?.SITE_NAME || 'Site'} height={28}/>
      <span className="brand-title">{config?.SITE_NAME || 'Site'}</span>
    </a>
  );

  function Secondary() {
    if (minimal || brandSecond.length === 0) return null;
    return (
      <nav className="secondary-nav" aria-label="Secondary">
        <ul className="nav-list">
          {brandSecond.map((item) => (
            <li key={item.href} className="nav-item">
              <a className="nav-link" href={item.href}>{item.content || item.label}</a>
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
            onBlur={(e) => { if (!e.currentTarget.closest('.user-area').contains(e.relatedTarget)) setUserOpen(false); }}
          >
            {authenticatedUser.avatar
              ? <img src={authenticatedUser.avatar} alt="avatar" width={28} height={28} style={{ borderRadius: 999 }} />
              : <InlineIcon name="person" />
            }
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
        </div>
      );
    }
    if (minimal) return null;
    return (
      <div className="auth-buttons d-flex gap-2">
        {loggedOut.map((i) => (
          <a key={i.href} className="btn btn-sm btn-outline-primary" href={i.href}>{i.label}</a>
        ))}
      </div>
    );
  }

  const Desktop = () => (
    <header className="custom-header global-header">
      <div className="bar">
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

  const Mobile = () => (
    <header className="custom-header global-header">
      <div className="bar d-flex align-center justify-between">
        {Brand}
        {!minimal && (
          <button
            type="button"
            className="btn-reset p-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <InlineIcon name="menu" />
          </button>
        )}
      </div>

      {/* Slide-over menu */}
      {!minimal && mobileOpen && (
        <>
          <div className="cusc-mobile-overlay" onClick={() => setMobileOpen(false)} />

          <aside className="cusc-mobile-sheet" role="dialog" aria-modal="true" aria-label="Main menu">
            <div className="sheet-head">
              <div className="sheet-title">Menu</div>
              <button className="sheet-close" onClick={() => setMobileOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="sheet-body">
              {/* Primary (links thường) */}
              <div className="group">
                <div className="group-title">Browse</div>
                <nav aria-label="Mobile Main">
                  {(brandMain || []).filter(i => i.type !== 'menu').map(i => (
                    <a key={i.href} className="m-item" href={i.href} onClick={() => setMobileOpen(false)}>
                      <span className="cusc-ic link" aria-hidden="true"></span>
                      <span>{i.content || i.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Primary groups (dropdown) */}
              {(brandMain || []).filter(i => i.type === 'menu').map(menu => (
                <div key={menu.content} className="group">
                  <div className="group-title">{menu.content}</div>
                  {(menu.items || []).map(sub => (
                    <a key={sub.href} className="m-item" href={sub.href} onClick={() => setMobileOpen(false)}>
                      <span className="cusc-ic link" aria-hidden="true"></span>
                      <span>{sub.content}</span>
                    </a>
                  ))}
                </div>
              ))}

              {/* Secondary */}
              {brandSecond.length > 0 && (
                <div className="group">
                  <div className="group-title">More</div>
                  {brandSecond.map(i => (
                    <a key={i.href} className="m-item" href={i.href} onClick={() => setMobileOpen(false)}>
                      <span className="cusc-ic link" aria-hidden="true"></span>
                      <span>{i.content || i.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* User/Auth */}
              <div className="group" style={{marginTop: 12}}>
                {authenticatedUser ? (
                  <>
                    {userMenu.map(i => (
                      <a key={i.href} className="m-btn" href={i.href} onClick={() => setMobileOpen(false)}>{i.label}</a>
                    ))}
                  </>
                ) : (
                  <>
                    {loggedOut.map(i => (
                      <a key={i.href} className="m-btn" href={i.href} onClick={() => setMobileOpen(false)}>{i.label}</a>
                    ))}
                  </>
                )}
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );

  return (
    <>
      {/* CSS inline: biến + style */}
      <style>{THEME_CSS_VARS + HEADER_CSS}</style>

      {isMobile ? <Mobile /> : <Desktop />}

      {/* Spacer đẩy nội dung xuống, tránh header đè body */}
      <div
        className="cusc-header-offset"
        aria-hidden="true"
        style={{ height: isDesktop ? H_DESKTOP : H_MOBILE }}
      />
    </>
  );
}
