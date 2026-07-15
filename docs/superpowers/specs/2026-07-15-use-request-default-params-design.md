# useRequest `defaultParams` — Design

**Date:** 2026-07-15
**Scope:** `packages/relax/src/hooks/use-request.ts`

## Motivation

When `useRequest` is configured with `auto: true`, there is no way to pass initial arguments to the request function. Additionally, if a request function declares formal parameters, auto-executing without arguments is likely a bug — the function expects inputs that aren't provided.

## Design

### New option: `defaultParams`

| Field | Type | Description |
|---|---|---|
| `defaultParams` | `any[] \| (() => any[])` | Default parameters passed on auto execution and deps-triggered re-execution. Array or factory. |

### Execution logic

1. **Resolve** `defaultParams` via `toFunction()`. If a factory, call it to get the array; if an array, use as-is; if `undefined`, resolves to `undefined`.

2. **Guard**: If `request.length > 0` (function declares formal parameters) AND resolved params is falsy (`undefined` / empty), skip execution — the function needs arguments that aren't available yet.

3. **Auto (mount)**: Guard passes → `_execute(...params ?? [])`. Guard fails → no-op.

4. **Deps change**: Same guard + execution logic. `defaultParams` is resolved fresh each time the effect runs, so a factory always reflects current state.

5. **Manual `run()`**: Unaffected. `defaultParams` is never implicitly applied to manual calls.

### Type

```typescript
defaultParams?: any[] | (() => any[]);
```

Uses `any[]` to match the existing `run: (...args: any[]) => Promise<void>` pattern.

### Resolution utility

Reuses the existing `toFunction()` from `src/utils/to-function.ts` — same pattern as `useDefault` and `using()`.

## Tests to add

1. `defaultParams` as array — auto executes with params
2. `defaultParams` as factory — auto executes with resolved params
3. `request.length > 0` without `defaultParams` — auto skips execution
4. `request.length === 0` with `auto: true` — executes without params (existing behavior preserved)
5. Deps change re-executes with `defaultParams`
6. Manual `run()` does not use `defaultParams`
7. `defaultParams` factory reflects latest state on deps change
