// ── Service contracts ────────────────────────────────────────────────

export interface AuthService {
  getToken(): Promise<string>;
  isAuthenticated(): boolean;
  onAuthChange(cb: (authenticated: boolean) => void): () => void;
}

export interface TelemetryService {
  track(event: string, properties?: Record<string, unknown>): void;
}

export interface ConfigService {
  get<T = unknown>(key: string): T | undefined;
}

// ── Navigation contract ──────────────────────────────────────────────

export interface NavigationOptions {
  /** Path the MFE should start on (supports deep links). */
  initialPath: string;
  /** Called by the MFE whenever its internal route changes. */
  onNavigate: (path: string) => void;
}

// ── Mount options ────────────────────────────────────────────────────

export interface MountOptions {
  services: {
    auth: AuthService;
    telemetry: TelemetryService;
    config: ConfigService;
  };
  navigation: NavigationOptions;
}

// ── MFE lifecycle contract ───────────────────────────────────────────

export interface MicroFrontend {
  mount(el: HTMLElement, options: MountOptions): void;
  unmount(): void;
}
