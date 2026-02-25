# Decoupled Shell & Micro-Frontend Architecture

![Architecture](https://img.shields.io/badge/architecture-micro--frontend-blue)
![React](https://img.shields.io/badge/react-version--independent-61dafb)
![Status](https://img.shields.io/badge/status-architecture--proposal-green)

------------------------------------------------------------------------

## Table of Contents

-   [Overview](#overview)
-   [Problem Statement](#problem-statement)
-   [Target Architecture](#target-architecture)
-   [Micro-Frontend Contract](#micro-frontend-contract)
-   [Routing Strategy](#routing-strategy)
-   [React Runtime Isolation](#react-runtime-isolation)
-   [Implementation Plan](#implementation-plan)
-   [Proof of Concept](#proof-of-concept)
-   [Upgrade Strategy](#upgrade-strategy)
-   [Risks & Mitigations](#risks--mitigations)
-   [Migration Plan](#migration-plan)
-   [Conclusion](#conclusion)

------------------------------------------------------------------------

## Overview

This document outlines a strategy to decouple the application shell and
Micro-Frontends (MFEs) from a shared React runtime and router
implementation.

The objective is to enable:

-   Independent React upgrades
-   Reduced cross-team coordination
-   Lower regression risk
-   Long-term architectural flexibility

------------------------------------------------------------------------

## Problem Statement

Current architecture tightly couples:

-   React runtime across shell and MFEs
-   Router instances shared across boundaries
-   Shared context assumptions

This forces synchronized releases when upgrading React or routing
libraries.

------------------------------------------------------------------------

## Target Architecture

Key principles:

-   Framework-agnostic integration contract
-   Router isolation per MFE
-   Explicit service injection
-   Runtime independence

The shell becomes an orchestrator, not a framework provider.

------------------------------------------------------------------------

## Micro-Frontend Contract

Each MFE must expose:

``` ts
export interface MicroFrontend {
  mount(
    el: HTMLElement,
    options: {
      services: {
        auth: AuthService
        telemetry: TelemetryService
        config: ConfigService
      },
      navigation: {
        initialPath: string
        onNavigate: (path: string) => void
      }
    }
  ): void

  unmount(): void
}
```

Rules:

-   No shared React context
-   No shared router instance
-   No implicit global dependencies

------------------------------------------------------------------------

## Routing Strategy

-   Shell owns browser URL
-   MFEs use `MemoryRouter` internally
-   Navigation adapter synchronizes route changes
-   Supports deep linking and browser back/forward

Routing becomes an implementation detail within each boundary.

------------------------------------------------------------------------

## React Runtime Isolation

### Options

**Option A --- Shared Singleton React**\
Tight coupling, smaller bundle.

**Option B --- Per-MFE React Bundle**\
True isolation, independent upgrades.

**Option C --- Hybrid Migration Model**\
Shared initially, isolate during upgrade.

Recommended: Per-MFE bundling during modernization.

------------------------------------------------------------------------

## Implementation Plan

1.  Define MFE contract
2.  Introduce navigation adapter
3.  Inject shared services explicitly
4.  Remove router coupling
5.  Validate version skew between MFEs

------------------------------------------------------------------------

## Proof of Concept

Validate coexistence of:

-   Shell → React 18
-   MFE A → React 17
-   MFE B → React 18
-   MFE C → React 19

Success criteria:

-   No runtime conflicts
-   Deep linking works
-   Navigation sync works
-   Independent upgrades succeed

------------------------------------------------------------------------

## Upgrade Strategy

To validate independence:

1.  Upgrade one MFE's React version
2.  Do not modify shell
3.  Do not modify other MFEs
4.  Verify no regressions

Contract-based isolation ensures compatibility.

------------------------------------------------------------------------

## Risks & Mitigations

  Risk                          Mitigation
  ----------------------------- ----------------------------------
  Duplicate React bundle size   HTTP caching, long-term chunking
  Navigation edge cases         Contract-based integration tests
  Shared dependency drift       Version governance policy
  Developer complexity          Templates + documentation

------------------------------------------------------------------------

## Migration Plan

**Phase 1:** Introduce adapter layer\
**Phase 2:** Convert pilot MFE\
**Phase 3:** Validate version skew\
**Phase 4:** Gradual rollout\
**Phase 5:** Remove shared runtime

Avoid big-bang rewrites.

------------------------------------------------------------------------

## Conclusion

Decoupling enables:

-   Faster modernization
-   Reduced operational risk
-   Independent team velocity
-   Framework flexibility

This is a platform-level investment in long-term scalability.

------------------------------------------------------------------------
