import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { modules } from '../data/modules';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem('of-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function SunIcon() {
  return (
    <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
        fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14.5 3.2c-1.3.4-2.4 1.2-3.3 2.3-2.9 3.6-2.3 8.9 1.3 11.8 2.5 2 5.9 2.3 8.7 1-.5 1.1-1.2 2.1-2.2 2.9-3.8 3.1-9.4 2.5-12.5-1.3-3.1-3.8-2.5-9.4 1.3-12.5 1.9-1.6 4.3-2.2 6.7-2.1z"
        fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Layout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('of-theme', theme);
  }, [theme]);

  return (
    <div className="app-layout">
      {navOpen && <div className="mobile-backdrop" onClick={() => setNavOpen(false)} aria-hidden="true" />}
      <aside className={`sidebar${navOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <h1>Design 101</h1>
          <span>Design for non-designers</span>
        </div>
        <nav className="sidebar-nav" aria-label="Navigation" onClick={() => setNavOpen(false)}>
          <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="module-num">⌂</span>
            Home
          </NavLink>
          {modules.map((m) => (
            <NavLink
              key={m.id}
              to={`/modules/${m.id}`}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span className="module-num">{m.number}</span>
              {m.title}
            </NavLink>
          ))}
          <NavLink to="/about" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="module-num">?</span>
            About
          </NavLink>
          <hr className="sidebar-divider" />
          <NavLink to="/community" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="module-num">✦</span>
            Community
          </NavLink>
          <NavLink to="/share" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="module-num">↑</span>
            Share your teaching
          </NavLink>
          <NavLink to="/suggest" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <span className="module-num">+</span>
            Suggest a resource
          </NavLink>
          <hr className="sidebar-divider" />
          <NavLink to="/admin" className={({ isActive }) => `sidebar-link sidebar-admin-link${isActive ? ' active' : ''}`}>
            <span className="module-num">⚙</span>
            Admin
          </NavLink>
        </nav>
      </aside>
      <main className="main-content">
        <div className="theme-toggle-row">
          <button
            type="button"
            className="mobile-nav-btn"
            onClick={() => setNavOpen((o) => !o)}
            aria-label="Open navigation"
            aria-expanded={navOpen}
          >
            <span /><span /><span />
          </button>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setTheme((c) => (c === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
