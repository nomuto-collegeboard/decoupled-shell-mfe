import mfe from './entry';

const el = document.getElementById('root');
if (el) {
  mfe.mount(el, {
    services: {
      auth: {
        getToken: async () => 'mock-token',
        isAuthenticated: () => true,
        onAuthChange: () => () => {},
      },
      telemetry: { track: (e, p) => console.log('[telemetry]', e, p) },
      config: { get: () => undefined },
    },
    navigation: {
      initialPath: window.location.pathname,
      onNavigate: (path) => {
        window.history.pushState({}, '', path);
        document.title = `MFE A — ${path}`;
      },
    },
  });
}
