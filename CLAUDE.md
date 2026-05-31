# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (requires Node >=22, pnpm >=9)
pnpm install

# Build all packages
pnpm run -r build

# Build a single package
cd packages/relax && pnpm build

# Watch mode (per package)
cd packages/relax && pnpm dev

# Run all tests (fuzzy + relax only; bee and wasp have no tests)
pnpm run -r test

# Run tests for a single package
cd packages/relax && pnpm test

# Run a single test file
cd packages/relax && pnpm test -- --testPathPattern="useBoolean"

# Test with coverage
cd packages/relax && pnpm test:coverage

# Versioning via changesets
pnpm run changesets    # Interactive changeset creation (alias: z cs)
pnpm run version       # Version bump (alias: z cs version)
```

There is no lint or format script; Prettier is configured (`.prettierrc`) but not wired into CI. The project uses a custom CLI `@aiszlab/jarvis` (invoked as `z`) for housekeeping: `z rm <path>` (like `rm -rf`) and `z cs` (changesets wrapper).

## Architecture

This is a **pnpm monorepo** of 4 packages under `packages/`, all versioned together via Changesets:

| Package | npm name | Purpose | Build | Tests |
|---|---|---|---|---|
| `relax` | `@aiszlab/relax` | Core: React hooks, type guards (`is/*`), general utils (`utils/*`), DOM helpers, SSE client | Rollup + Babel → ESM + CJS | Jest + jsdom + `@testing-library/react` |
| `bee` | `@aiszlab/bee` | CSR app bootstrap (mounts React app with optional react-router) | Rollup + Babel → ESM + CJS | None |
| `fuzzy` | `@aiszlab/fuzzy` | Misc utilities (avatar, color, crypto, path) | Rollup + Babel → ESM + CJS | Jest |
| `wasp` | `@aiszlab/wasp` | CLI tool wrapping Vite + Tailwind CSS + React | `tsc` only | None |

**Dependency graph:** `bee` → `relax` (workspace); `fuzzy` → `relax` (workspace); `wasp` is standalone.

### Build system (bee, fuzzy, relax)

Rollup with `@rollup/plugin-babel` + `@rollup/plugin-typescript` + `@rollup/plugin-node-resolve`. Each package outputs **dual ESM (`.mjs`) and CJS (`.cjs`)** with `preserveModules: true` so the submodule structure is kept in `dist/`. Babel handles transpilation (preset-env, preset-typescript, preset-react, plugin-transform-runtime). External dependencies are matched by regex to allow deep imports like `@aiszlab/relax/dom`.

### Build system (wasp)

Plain `tsc` — no bundler. The CLI entry point is `bin/index.js`.

### relax package structure

- `src/hooks/` — ~45 React hooks (useBoolean, useDebounceCallback, useMount, useHover, useDrag, useMediaQuery, useEventSource, useInfiniteScroll, useReactive, useElementSize, useScale, useLazyMemo, useControlledState, etc.)
- `src/is/` — Type-narrowing predicates (isEmpty, isNull, isUndefined, isArray, isFunction, isHTMLElement, etc.)
- `src/utils/` — General utilities (debounce, throttle, clone, merge, chain, clamp, toggle, pick, get, set, etc.)
- `src/dom/`, `src/react/`, `src/class-name/`, `src/fetch-event-source/`, `src/decimal/`, `src/types/` — Smaller domain modules

Exports map: `.` (main barrel), `./*` (submodules like `@aiszlab/relax/dom`), `./types`.

### Testing conventions

- **Framework:** Jest 29 with `@jest/globals` (describe, it, expect, jest). Import everything from `@jest/globals` — do not rely on Jest globals.
- **React hook tests:** Use `renderHook` from `@testing-library/react` + `act` from `react`. Any test that touches React/DOM needs the docblock `/** @jest-environment jsdom */` at the top of the file.
- **Test location:** `__test__/` directory at the package root, mirroring the source structure. Files are named `<thing>.test.ts` or `.test.tsx`.
- **bee and wasp have no tests** — if adding features there, add tests.

### CI/CD

GitHub Actions (`.github/workflows/npm-publish.yml`) triggers on release: installs deps, builds all packages, runs all tests, then publishes to npm. Dependabot is configured for daily npm updates.
