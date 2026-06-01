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

**Note:** The root `package.json` has a `preinstall` hook that enforces the allowed package manager version (pnpm >=9, Node >=22). If `pnpm test` fails with an `ELIFECYCLE` error, run tests directly with `npx jest` from the package directory instead.

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

Babel config lives in `.babelrc.cjs` per package — tsc is used only for type declaration emit (`emitDeclarationOnly: true`), not for JS/JSX transpilation.

### Build system (wasp)

Plain `tsc` — no bundler. The CLI entry point is `bin/index.js`. Uses its own independent tsconfig with `moduleResolution: "NodeNext"`.

### relax package structure

- `src/hooks/` — ~45 React hooks (useBoolean, useDebounceCallback, useMount, useHover, useDrag, useMediaQuery, useEventSource, useInfiniteScroll, useReactive, useElementSize, useScale, useLazyMemo, useControlledState, etc.)
- `src/is/` — Type-narrowing predicates (isEmpty, isNull, isUndefined, isArray, isFunction, isHTMLElement, etc.)
- `src/utils/` — General utilities (debounce, throttle, clone, merge, chain, clamp, toggle, pick, get, set, etc.)
- `src/dom/`, `src/react/`, `src/class-name/`, `src/fetch-event-source/`, `src/decimal/`, `src/types/` — Smaller domain modules

Exports map: `.` (main barrel), `./*` (submodules like `@aiszlab/relax/dom`), `./types`.

### Core patterns used across hooks

**`useEvent` (stabilized callback)** — The most important internal hook. Wraps a callback so the returned function reference is stable (empty deps `[]`) but always calls the latest version via a ref. Used by nearly every hook that accepts user callbacks (useDebounceCallback, useTimeout, useControlledState, useRequest, etc.). Always import from `./use-event` when writing new hooks that accept callbacks.

**`effect()` utility** (`src/utils/effect.ts`) — Safely wraps effect callbacks for `useEffect`/`useLayoutEffect`. If the callback returns a Promise/thenable, the effect returns `void 0` (no cleanup); otherwise it returns the cleanup function to React. Used by `useMounted`, `useMount`, `useUpdateEffect`.

**`State<T>` type** — A union `T | (() => T)` used for parameters that accept either a direct value or a getter function. Resolved via `toFunction()` from utils. Common for initial-value params (useBoolean, useCounter, useDefault).

**Hook return shape** — Most stateful hooks return a tuple: `[value, controlsObject]`. Examples:
- `useBoolean` → `[boolean, { turnOn, turnOff, toggle, setBoolean }]`
- `useCounter` → `[number, { add, subtract, first, last, reset, setCount }]`
- `useHover` → `[boolean, { onPointerEnter, onPointerLeave, ... }]`

### Hook conventions

- Every hook file starts with `/** @author murukal */` and includes a `@description` JSDoc tag.
- Callbacks passed to hooks should be wrapped in `useEvent` to avoid stale closures without re-triggering effects.
- Hooks that fire side-effects on mount use `useMounted` (via `useEffect`) or `useMount` (via `useLayoutEffect`).
- `useIsMounted` returns a getter `() => boolean` and is used to guard against state updates after unmount.

### Testing conventions

- **Framework:** Jest 29 with `@jest/globals` (describe, it, expect, jest). Import everything from `@jest/globals` — do not rely on Jest globals.
- **No jest.config file** — Jest runs with default config; Babel handles `.ts`/`.tsx` transpilation. There is no global test environment set.
- **React hook tests:** Use `renderHook` from `@testing-library/react` + `act` from `react`. Any test that touches React/DOM needs the docblock `/** @jest-environment jsdom */` at the top of the file.
- **Test location:** `__test__/` directory at the package root, mirroring the source structure. Files are named `<thing>.test.ts` or `.test.tsx`.
- **bee and wasp have no tests** — if adding features there, add tests.

### Changesets

Config at `.changeset/config.json`: `commit: false` (no auto-commit), `access: "restricted"` (overridden per-package with `publishConfig.access: "public"`), `baseBranch: "main"`. Packages are versioned independently (nothing in `fixed` or `linked`). Use `pnpm run changesets` to create a changeset, then `pnpm run version` to bump versions.

### CI/CD

GitHub Actions (`.github/workflows/npm-publish.yml`) triggers on release: installs deps, builds all packages, runs all tests, then publishes to npm. Dependabot is configured for daily npm updates.
