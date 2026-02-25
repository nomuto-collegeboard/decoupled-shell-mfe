import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MicroFrontend } from '@decouple-mfe/contracts';
import { createServices } from '../services';

// ── Remote import map ────────────────────────────────────────────────
// Each function triggers a Module Federation dynamic import.
// The remote entry JS is fetched on first call, then cached by webpack.
const mfeModules: Record<string, () => Promise<{ default: MicroFrontend }>> = {
  mfeA: () => import('mfeA/MicroFrontend'),
  mfeB: () => import('mfeB/MicroFrontend'),
  mfeC: () => import('mfeC/MicroFrontend'),
};

// ── Component ────────────────────────────────────────────────────────

interface Props {
  /** Key into `mfeModules` */
  name: string;
  /** Shell route prefix, e.g. "/mfe-a" */
  basePath: string;
}

export default function MfeLoader({ name, basePath }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mfeRef = useRef<MicroFrontend | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Derive the sub-path the MFE should start on ────────────────
  // /mfe-a/settings/profile  →  /settings/profile
  const subPath = location.pathname.startsWith(basePath)
    ? location.pathname.slice(basePath.length) || '/'
    : '/';

  // Refs keep the latest values accessible inside the stable mount closure
  const subPathRef = useRef(subPath);
  subPathRef.current = subPath;

  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  // ── Mount / unmount effect (runs once per `name` + `basePath`) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    setLoading(true);
    setError('');

    const importFn = mfeModules[name];
    if (!importFn) {
      setError(`Unknown MFE "${name}"`);
      setLoading(false);
      return;
    }

    importFn()
      .then((mod) => {
        if (cancelled) return;

        const mfe = mod.default;
        mfeRef.current = mfe;

        mfe.mount(el, {
          services: createServices(),
          navigation: {
            // Deep-link: pass current sub-path so MFE's MemoryRouter
            // starts on the right page.
            initialPath: subPathRef.current,

            // MFE → Shell: when the MFE navigates internally it calls
            // this callback so the shell URL stays in sync.
            onNavigate: (path: string) => {
              const full = path === '/' ? basePath : `${basePath}${path}`;
              navigateRef.current(full);
            },
          },
        });

        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load micro-frontend');
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      mfeRef.current?.unmount();
      mfeRef.current = null;
    };
  }, [name, basePath]);

  // ── Render ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ color: '#d32f2f', padding: 16, border: '1px solid #d32f2f', borderRadius: 8, margin: 8 }}>
        <strong>Error loading {name}:</strong> {error}
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div style={{ padding: 24, color: '#888' }}>Loading {name}…</div>
      )}
      <div ref={containerRef} />
    </>
  );
}
