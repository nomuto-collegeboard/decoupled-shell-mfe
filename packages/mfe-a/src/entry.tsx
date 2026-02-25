import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import type { MicroFrontend, MountOptions } from '@decouple-mfe/contracts';

let mountedContainer: HTMLElement | null = null;

const microFrontend: MicroFrontend = {
  mount(el: HTMLElement, options: MountOptions) {
    mountedContainer = el;

    // React 17 — legacy render API
    ReactDOM.render(
      <MemoryRouter initialEntries={[options.navigation.initialPath]}>
        <App
          onNavigate={options.navigation.onNavigate}
          services={options.services}
        />
      </MemoryRouter>,
      el,
    );
  },

  unmount() {
    if (mountedContainer) {
      ReactDOM.unmountComponentAtNode(mountedContainer);
      mountedContainer = null;
    }
  },
};

export default microFrontend;
