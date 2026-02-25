// Type declarations for Module Federation remote modules.
// These let TypeScript understand `import('mfeA/MicroFrontend')` etc.

declare module 'mfeA/MicroFrontend' {
  import type { MicroFrontend } from '@decouple-mfe/contracts';
  const mfe: MicroFrontend;
  export default mfe;
}

declare module 'mfeB/MicroFrontend' {
  import type { MicroFrontend } from '@decouple-mfe/contracts';
  const mfe: MicroFrontend;
  export default mfe;
}

declare module 'mfeC/MicroFrontend' {
  import type { MicroFrontend } from '@decouple-mfe/contracts';
  const mfe: MicroFrontend;
  export default mfe;
}
