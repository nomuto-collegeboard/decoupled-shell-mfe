import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import MfeLoader from './components/MfeLoader';

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Micro-Frontend Architecture Demo</h2>
      <p style={{ margin: '12px 0', lineHeight: 1.6 }}>
        This shell (<strong>React {React.version}</strong>) hosts three
        independently deployed micro-frontends, each running its own React
        runtime:
      </p>
      <ul style={{ lineHeight: 2 }}>
        <li><Link to="/mfe-a">MFE A</Link> — React 17 (Dashboard)</li>
        <li><Link to="/mfe-b">MFE B</Link> — React 18 (Analytics)</li>
        <li><Link to="/mfe-c">MFE C</Link> — React 19 (Admin)</li>
      </ul>
      <p style={{ marginTop: 16, color: '#666' }}>
        Click a link above or use the nav bar. Try deep links such as{' '}
        <Link to="/mfe-a/settings/profile">/mfe-a/settings/profile</Link>.
      </p>
    </div>
  );
}

function CurrentPath() {
  const { pathname } = useLocation();
  return (
    <span style={{ fontSize: 12, opacity: 0.7, fontFamily: 'monospace' }}>
      {pathname}
    </span>
  );
}

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* ── Shell header ──────────────────────────────────────── */}
      <header
        style={{
          background: '#1a1a2e',
          color: '#fff',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 16, fontWeight: 600 }}>
            Shell <span style={{ fontWeight: 400, opacity: 0.6 }}>React {React.version}</span>
          </h1>
          <CurrentPath />
        </div>
        <nav style={{ display: 'flex', gap: 16 }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
          <Link to="/mfe-a" style={{ color: '#64B5F6', textDecoration: 'none' }}>MFE A</Link>
          <Link to="/mfe-b" style={{ color: '#81C784', textDecoration: 'none' }}>MFE B</Link>
          <Link to="/mfe-c" style={{ color: '#CE93D8', textDecoration: 'none' }}>MFE C</Link>
        </nav>
      </header>

      {/* ── Route-based MFE mounting ──────────────────────────── */}
      <main style={{ padding: '16px 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mfe-a/*" element={<MfeLoader name="mfeA" basePath="/mfe-a" />} />
          <Route path="/mfe-b/*" element={<MfeLoader name="mfeB" basePath="/mfe-b" />} />
          <Route path="/mfe-c/*" element={<MfeLoader name="mfeC" basePath="/mfe-c" />} />
        </Routes>
      </main>
    </div>
  );
}
