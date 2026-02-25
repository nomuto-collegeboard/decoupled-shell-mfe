import React from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import type { MicroFrontend, MountOptions } from '@decouple-mfe/contracts';

let root: ReturnType<typeof createRoot> | null = null;

const microFrontend: MicroFrontend = {
  mount(el: HTMLElement, options: MountOptions) {
    root = createRoot(el);
    root.render(
      <MemoryRouter initialEntries={[options.navigation.initialPath]}>
        <App
          onNavigate={options.navigation.onNavigate}
          services={options.services}
        />
      </MemoryRouter>,
    );
  },

  unmount() {
    root?.unmount();
    root = null;
  },
};

export default microFrontend;
