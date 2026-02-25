import React, { useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import type { MountOptions } from '@decouple-mfe/contracts';

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

function Users() {
  return <div><h3>User Management</h3><p>Admin user list.</p></div>;
}

function Roles() {
  return <div><h3>Roles</h3><p>Role configuration.</p></div>;
}

function AuditLog() {
  return <div><h3>Audit Log</h3><p>Deep-linked audit trail inside MFE C.</p></div>;
}

// ── Root ──────────────────────────────────────────────────────────────

interface AppProps {
  onNavigate: (path: string) => void;
  services: MountOptions['services'];
}

export default function App({ onNavigate, services }: AppProps) {
  useEffect(() => { services.telemetry.track('mfe-c:mounted'); }, []);

  return (
    <div style={{ border: '2px solid #9C27B0', borderRadius: 8, padding: 16, margin: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>MFE C — Admin</h2>
        <span style={{ background: '#9C27B0', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 12 }}>
          React {React.version}
        </span>
      </div>

      <NavigationSync onNavigate={onNavigate} />

      <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Link to="/">Users</Link>
        <Link to="/roles">Roles</Link>
        <Link to="/audit">Audit Log</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/audit" element={<AuditLog />} />
      </Routes>
    </div>
  );
}
