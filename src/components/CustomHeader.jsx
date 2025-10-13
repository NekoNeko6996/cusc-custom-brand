// src/components/CustomHeader.jsx
import React, { useContext, useMemo, useState } from 'react';
import Responsive from 'react-responsive';
import { AppContext } from '@edx/frontend-platform/react/index.js';
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import {
  Navbar, NavbarBrand, Nav, NavItem, NavLink,
  NavDropdown, Container, IconButton, Icon,
} from '@openedx/paragon';

// dữ liệu mặc định từ brand (có thể override bằng props)
import { primaryNav as defaultPrimary, secondaryNav as defaultSecondary, ctuLogo as defaultLogo } from '../brand';

ensureConfig(
  ['LMS_BASE_URL', 'LOGIN_URL', 'LOGOUT_URL', 'SITE_NAME',
   'ACCOUNT_PROFILE_URL', 'ACCOUNT_SETTINGS_URL', 'ORDER_HISTORY_URL'],
  'CustomHeader',
);

function MainMenu({ items }) {
  return (
    <Nav className="ms-4 gap-4" aria-label="Main">
      {items.map((item) => {
        if (item.type === 'menu' && Array.isArray(item.items)) {
          return (
            <NavDropdown key={item.content} title={item.content}>
              {item.items.map((sub) => (
                <NavDropdown.Item key={sub.href} as="a" href={sub.href}>
                  {sub.content}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          );
        }
        return (
          <NavItem key={item.href}>
            <NavLink href={item.href}>{item.content || item.label}</NavLink>
          </NavItem>
        );
      })}
    </Nav>
  );
}

/**
 * Props (tùy chọn):
 * - primaryNav, secondaryNav: mảng điều hướng để override brand default
 * - logo: đường dẫn logo để override brand default
 */
export default function CustomHeader({
  primaryNav,
  secondaryNav,
  logo,
}) {
  const { authenticatedUser, config } = useContext(AppContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const minimal = getConfig().AUTHN_MINIMAL_HEADER;

  const brandMain = useMemo(() => primaryNav ?? defaultPrimary ?? [], [primaryNav]);
  const brandSecond = useMemo(() => secondaryNav ?? defaultSecondary ?? [], [secondaryNav]);

  const loggedOut = useMemo(() => ([
    { href: config.LOGIN_URL, label: 'Log in' },
    { href: `${config.LMS_BASE_URL}/register`, label: 'Register' },
  ]), [config]);

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
    <NavbarBrand href={`${config.LMS_BASE_URL}/dashboard`} className="gap-2">
      <img
        src={config.LOGO_URL || logo || defaultLogo}
        alt={config.SITE_NAME || 'Site'}
        height={28}
      />
      <span className="fw-semibold">{config.SITE_NAME || 'Site'}</span>
    </NavbarBrand>
  );

  const Desktop = (
    <Navbar className="bg-white border-bottom container" style={{ minHeight: 64 }}>
      <Container fluid className="d-flex align-items-center justify-content-between">
        {/* Left: logo + main menu */}
        <div className="d-flex align-items-center">
          {Brand}
          {!minimal && <MainMenu items={brandMain} />}
        </div>

        {/* Right: secondary + user */}
        <div className="d-flex align-items-center gap-3">
          {!minimal && brandSecond.length > 0 && (
            <Nav className="me-1 gap-3" aria-label="Secondary">
              {brandSecond.map((item) => (
                <NavItem key={item.href}>
                  <NavLink href={item.href}>{item.content || item.label}</NavLink>
                </NavItem>
              ))}
            </Nav>
          )}

          {authenticatedUser ? (
            <NavDropdown
              align="end"
              title={
                <span className="d-inline-flex align-items-center">
                  {authenticatedUser.avatar
                    ? <img src={authenticatedUser.avatar} alt="avatar" width={28} height={28} style={{ borderRadius: 999 }} />
                    : <Icon src="user" />
                  }
                  <span className="ms-2">{authenticatedUser.username}</span>
                </span>
              }
            >
              {userMenu.map((i) => (
                <NavDropdown.Item key={i.href} as="a" href={i.href}>
                  {i.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          ) : (
            !minimal && (
              <div className="d-flex gap-2">
                {loggedOut.map((i) => (
                  <a key={i.href} className="btn btn-sm btn-outline-primary" href={i.href}>
                    {i.label}
                  </a>
                ))}
              </div>
            )
          )}
        </div>
      </Container>
    </Navbar>
  );

  const Mobile = (
    <Navbar className="bg-white border-bottom" style={{ minHeight: 56 }}>
      <Container fluid className="d-flex align-items-center justify-content-between">
        {Brand}
        {!minimal && (
          <IconButton aria-label="Open menu" onClick={() => setMobileOpen((v) => !v)}>
            <Icon src="menu" />
          </IconButton>
        )}
      </Container>

      {!minimal && mobileOpen && (
        <div className="px-3 pb-3">
          <MainMenu items={brandMain.filter((i) => i.type !== 'menu')} />
          {brandMain.filter((i) => i.type === 'menu').map((menu) => (
            <div key={menu.content} className="mt-2">
              <div className="fw-semibold mb-1">{menu.content}</div>
              {(menu.items || []).map((sub) => (
                <a key={sub.href} href={sub.href} className="btn w-100 btn-light mb-2">{sub.content}</a>
              ))}
            </div>
          ))}

          <div className="mt-3">
            {authenticatedUser
              ? userMenu.map((i) => <a key={i.href} href={i.href} className="btn w-100 btn-light mb-2">{i.label}</a>)
              : loggedOut.map((i) => <a key={i.href} href={i.href} className="btn w-100 btn-light mb-2">{i.label}</a>)
            }
          </div>
        </div>
      )}
    </Navbar>
  );

  return (
    <>
      <Responsive maxWidth={991}>{Mobile}</Responsive>
      <Responsive minWidth={992}>{Desktop}</Responsive>
    </>
  );
}
