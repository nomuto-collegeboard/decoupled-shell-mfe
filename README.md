# Decoupled Micro-Frontend Architecture

A working example of a micro-frontend architecture where **each MFE bundles its own React version** — no shared React singleton, no shared router.

## Architecture at a Glance

```
┌─────────────────────────────────────────────────┐
│  Shell (React 18)  —  BrowserRouter  :3000      │
│  ┌───────────┬───────────┬───────────┐          │
│  │ /mfe-a/*  │ /mfe-b/*  │ /mfe-c/*  │          │
│  └─────┬─────┴─────┬─────┴─────┬─────┘          │
│        │           │           │                 │
│   ┌────▼────┐ ┌────▼────┐ ┌────▼────┐           │
│   │  MFE A  │ │  MFE B  │ │  MFE C  │           │
│   │React 17 │ │React 18 │ │React 19 │           │
│   │Memory   │ │Memory   │ │Memory   │           │
│   │Router   │ │Router   │ │Router   │           │
│   │  :3001  │ │  :3002  │ │  :3003  │           │
│   └─────────┘ └─────────┘ └─────────┘           │
└─────────────────────────────────────────────────┘
```

| Package | React | Router | Port |
|---------|-------|--------|------|
| Shell   | 18.2  | react-router-dom 6 (BrowserRouter) | 3000 |
| MFE A   | 17.0  | react-router-dom 6.3 (MemoryRouter) | 3001 |
| MFE B   | 18.2  | react-router-dom 6 (MemoryRouter) | 3002 |
| MFE C   | 19.0  | react-router-dom 7 (MemoryRouter) | 3003 |

---

## Quick Start

```bash
# 1. Install all workspace dependencies
npm install

# 2. Start all dev servers concurrently
npm start
```

Open **http://localhost:3000**. All four dev servers must be running.

### Run a single MFE in isolation

```bash
npm start -w packages/mfe-a   # http://localhost:3001
```

Each MFE has a standalone bootstrap that mounts itself with mock services — useful for independent development.

---

## Folder Structure

```
decouple-mfe/
├── package.json                  # npm workspaces root
├── packages/
│   ├── contracts/                # Shared TS interfaces (types only, no runtime)
│   │   └── src/index.ts
│   ├── shell/                    # Host application
│   │   ├── webpack.config.js     # Module Federation host
│   │   └── src/
│   │       ├── bootstrap.tsx     # React 18 createRoot
│   │       ├── App.tsx           # BrowserRouter + route-per-MFE
│   │       ├── components/
│   │       │   └── MfeLoader.tsx # Dynamic import + mount/unmount lifecycle
│   │       ├── services.ts       # Service factories injected into MFEs
│   │       └── remotes.d.ts      # TS declarations for MF remotes
│   ├── mfe-a/                    # React 17 — Dashboard
│   │   ├── webpack.config.js     # Module Federation remote
│   │   └── src/
│   │       ├── entry.tsx         # mount/unmount contract (ReactDOM.render)
│   │       ├── App.tsx           # MemoryRouter + NavigationSync
│   │       └── bootstrap.tsx     # Standalone dev mounting
│   ├── mfe-b/                    # React 18 — Analytics
│   └── mfe-c/                    # React 19 — Admin
```

---

## How Routing Sync Works

The shell and MFEs use **completely separate router instances**. Synchronisation happens through a thin adapter layer:

### Deep Linking (Shell → MFE)

1. User navigates to `http://localhost:3000/mfe-a/settings/profile`
2. Shell's `<Route path="/mfe-a/*">` matches, renders `<MfeLoader>`
3. `MfeLoader` strips the base path: `/mfe-a/settings/profile` → `/settings/profile`
4. MFE is mounted with `initialPath: "/settings/profile"`
5. MFE's `MemoryRouter` starts on `/settings/profile` — correct page renders

### MFE → Shell Sync

1. User clicks a `<Link>` inside MFE A (e.g. "Profile")
2. MFE A's MemoryRouter navigates to `/settings/profile`
3. `NavigationSync` component detects the pathname change
4. Calls `onNavigate("/settings/profile")`
5. Shell's `MfeLoader` translates: `navigate("/mfe-a/settings/profile")`
6. Browser URL updates — bookmarkable, shareable

### Why `NavigationSync` skips the first render

The first render's pathname already matches `initialPath` (which the shell set). Firing `onNavigate` on mount would trigger a redundant `navigate()` call in the shell.

---

## How React Version Conflicts Are Avoided

### 1. No shared React in Module Federation

```js
// webpack.config.js (every package)
new ModuleFederationPlugin({
  // ...
  // ⚠️ NO `shared` config — each build bundles its own React
})
```

The `shared` option in Module Federation is what creates a singleton. By **omitting it entirely**, each MFE's webpack build bundles `react` and `react-dom` into its own chunks.

### 2. Webpack `resolve.alias` pins each build's React

```js
resolve: {
  alias: {
    react: path.dirname(require.resolve('react/package.json')),
    'react-dom': path.dirname(require.resolve('react-dom/package.json')),
  },
}
```

`require.resolve` runs from each package's directory, so it resolves to whichever React version is in that package's `node_modules`. This prevents npm workspace hoisting from accidentally leaking the wrong version.

### 3. MFEs expose plain JS — not React components

The contract between shell and MFE is:

```ts
interface MicroFrontend {
  mount(el: HTMLElement, options: MountOptions): void
  unmount(): void
}
```

The shell never `import`s a React component from an MFE. It only calls `mount(el, opts)` — a framework-agnostic function. This means:

- The shell's React never renders MFE components
- Each MFE creates its own React root (`createRoot` or `ReactDOM.render`)
- Multiple React versions coexist in the same page without conflict

### 4. Upgrading an MFE's React doesn't touch the shell

To upgrade MFE A from React 17 → 18:

1. Change `react` and `react-dom` versions in `packages/mfe-a/package.json`
2. Replace `ReactDOM.render()` with `createRoot()` in `entry.tsx`
3. Run `npm install`
4. Done — shell and other MFEs are untouched

The shell only depends on the **contract interface**, not on any MFE's internal implementation.

---

## MFE Contract

Every MFE must default-export an object implementing:

```ts
export interface MicroFrontend {
  mount(el: HTMLElement, options: {
    services: {
      auth: AuthService
      telemetry: TelemetryService
      config: ConfigService
    }
    navigation: {
      initialPath: string
      onNavigate: (path: string) => void
    }
  }): void

  unmount(): void
}
```

Services are instantiated by the shell and injected — MFEs never create their own auth/telemetry/config instances.

---

## Known Limitations & Production Considerations

- **Shell → already-mounted MFE navigation**: The current contract doesn't expose a `navigate()` method on the MFE. If the shell needs to push a route change to an already-mounted MFE (e.g. sidebar link), extend the contract with `navigate?(path: string): void` or use a pub/sub event bus.
- **Bundle size**: Each MFE ships its own React (~40 KB gzipped). For teams that can coordinate React versions, enabling `shared` in Module Federation reduces total download size.
- **CSS isolation**: This demo uses inline styles. Production setups should use Shadow DOM, CSS Modules, or a naming convention to prevent style leaks.
- **Error boundaries**: Wrap `<MfeLoader>` in a React error boundary for graceful degradation when a remote is unreachable.
