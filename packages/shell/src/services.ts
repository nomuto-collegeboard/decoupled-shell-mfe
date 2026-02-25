import type { AuthService, TelemetryService, ConfigService } from '@decouple-mfe/contracts';

/**
 * Creates the service bag that gets passed into every MFE.
 * In production these would be real implementations shared
 * across the shell — MFEs never instantiate their own services.
 */
export function createServices() {
  const auth: AuthService = {
    getToken: async () => 'mock-jwt-token',
    isAuthenticated: () => true,
    onAuthChange: () => () => {},
  };

  const telemetry: TelemetryService = {
    track: (event, properties) => {
      console.log(`[telemetry] ${event}`, properties);
    },
  };

  const config: ConfigService = {
    get: <T,>(key: string) => {
      const store: Record<string, unknown> = {
        apiUrl: 'http://localhost:8080',
        env: 'development',
      };
      return store[key] as T | undefined;
    },
  };

  return { auth, telemetry, config };
}
