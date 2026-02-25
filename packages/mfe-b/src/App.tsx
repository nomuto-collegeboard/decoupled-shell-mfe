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

function Overview() {
  return <div><h3>Analytics Overview</h3><p>Charts and graphs would live here.</p></div>;
}

function Reports() {
  return <div><h3>Reports</h3><p>Generated reports list.</p></div>;
}

function ReportDetail() {
  return <div><h3>Report Detail</h3><p>Deep-linked report detail page inside MFE B.</p></div>;
}

// ── Root ──────────────────────────────────────────────────────────────

interface AppProps {
  onNavigate: (path: string) => void;
  services: MountOptions['services'];
}

export default function App({ onNavigate, services }: AppProps) {
  useEffect(() => { services.telemetry.track('mfe-b:mounted'); }, []);

  return (
    <div style={{ border: '2px solid #4CAF50', borderRadius: 8, padding: 16, margin: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>MFE B — Analytics</h2>
        <span style={{ background: '#4CAF50', color: '#fff', padding: '2px 10px', borderRadius: 4, fontSize: 12 }}>
          React {React.version}
        </span>
      </div>

      <NavigationSync onNavigate={onNavigate} />

      <nav style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <Link to="/">Overview</Link>
        <Link to="/reports">Reports</Link>
        <Link to="/reports/detail">Report Detail</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/detail" element={<ReportDetail />} />
      </Routes>
    </div>
  );
}
