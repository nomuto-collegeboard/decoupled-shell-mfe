import React, { useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import type { MountOptions } from '@decouple-mfe/contracts';

// ── Navigation sync ──────────────────────────────────────────────────
// Watches MemoryRouter location and propagates changes to the shell
// via the onNavigate callback. Skips the initial render (shell already
// knows the path it passed as `initialPath`).

function NavigationSync({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    onNavigate(pathname);
  }, [pathname, onNavigate]);

  return null;
}

// ── Pages ────────────────────────────────────────────────────────────

function Home({ auth }: { auth: MountOptions['services']['auth'] }) {
  return (
    <div>
      <h3>Dashboard Home</h3>
      <p>Authenticated: <strong>{String(auth.isAuthenticated())}</strong></p>
    </div>
  );
}

function About() {
  return <div><h3>About Dashboard</h3><p>This is MFE A running React 17.</p></div>;
}

function Settings() {
  return (
    <div>
      <h3>Settings</h3>
      <p>General settings page. Try <Link to="/settings/profile">Profile</Link>.</p>
    </div>
  );
}

function Profile() {
  return <div><h3>Profile</h3><p>Deep-linked profile page inside MFE A.</p></div>;
}

// ── Root ──────────────────────────────────────────────────────────────

interface AppProps {
  onNavigate: (path: string) => void;
  services: MountOptions['services'];
}

export default function App({ onNavigate, services }: AppProps) {
  useEffect(() => { services.telemetry.track('mfe-a:mounted'); }, []);

  return (
    <div style={{ border: '2px solid #2196F3', borderRadius: 8, padding: 16, margin: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>MFE A — Dashboard</h2>
        <span style={{ background: '#2196F3', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 12 }}>
          React {React.version}
        </span>
      </div>

      <NavigationSync onNavigate={onNavigate} />

      <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/settings/profile">Profile</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home auth={services.auth} />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}
