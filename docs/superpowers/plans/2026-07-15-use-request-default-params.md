# useRequest `defaultParams` Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `defaultParams` option to `useRequest` so auto-execution and deps-triggered re-execution pass through default arguments; skip execution when the request function expects parameters but none are provided.

**Architecture:** Single-file change to `use-request.ts` — add one option field, resolve it via existing `toFunction()` utility, and guard the effect's `_execute()` calls. Tests added to existing test file.

**Tech Stack:** React, TypeScript, Jest + @testing-library/react

## Global Constraints

- Follow existing patterns: `useEvent` for stabilized callbacks, `toFunction()` for `State<T>` resolution
- No new dependencies
- All existing tests must continue to pass

---

### Task 1: Add `defaultParams` option and modify effect logic

**Files:**
- Modify: `packages/relax/src/hooks/use-request.ts`

**Interfaces:**
- Consumes: `toFunction` from `../../src/utils/to-function`
- Produces: `defaultParams?: any[] | (() => any[])` on `UsingRequest<T>`

- [ ] **Step 1: Add import for `toFunction`**

At line 1, add `toFunction` to the existing utils import (it doesn't have one yet, so add a new import line):

```typescript
import { type DependencyList, useEffect, useRef, useState } from "react";
import { useEvent } from "./use-event";
import { useDebounceCallback } from "./use-debounce-callback";
import { toFunction } from "../utils/to-function";
```

- [ ] **Step 2: Add `defaultParams` to `UsingRequest<T>` type**

After the `deps` field (line 42), add:

```typescript
  /**
   * default parameters passed to the request on auto execution or
   * deps-triggered re-execution. accepts an array or a factory that
   * returns an array.
   *
   * when the request function declares formal parameters (fn.length > 0)
   * and defaultParams is not provided, auto execution is skipped.
   *
   * @zh 默认参数，在自动执行或依赖触发的重新执行时传递给请求函数。
   * 接受数组或返回数组的工厂函数。
   */
  defaultParams?: any[] | (() => any[]);
```

- [ ] **Step 3: Destructure `defaultParams` in the function signature**

At line 79-86, add `defaultParams` to the destructured options:

```typescript
export const useRequest = <T>(
  request: (...args: any[]) => Promise<T>,
  {
    auto = false,
    then: thenCallback,
    catch: catchCallback,
    finally: finallyCallback,
    debounceWait,
    deps,
    defaultParams,
  }: UsingRequest<T> = {},
): UsedRequest<T> => {
```

- [ ] **Step 4: Replace the `useEffect` block (lines 135-145)**

Replace the existing effect with the new logic that resolves `defaultParams`, applies the guard, and passes params:

```typescript
  useEffect(() => {
    const params = toFunction(defaultParams)?.();

    if (!isMountedRef.current) {
      isMountedRef.current = true;

      if (!auto) return;
      if (_request.length && !params) return;
      _execute(...(params ?? []));
      return;
    }

    if (_request.length && !params) return;
    _execute(...(params ?? []));
  }, deps ?? []);
```

**Explanation:**
- `toFunction(defaultParams)` — if `defaultParams` is a function, returns it as-is; if `undefined`, returns `() => undefined`; if an array, returns `() => array` (wraps in a getter).
- `?.()` — calls the getter. If `defaultParams` was `undefined`, returns `undefined`. If it was an array, returns the array. If it was a factory, calls the factory.
- `_request.length` — the number of formal parameters the request function declares. If `> 0`, the function expects arguments.
- Guard: `_request.length && !params` — function needs args but none provided → skip.
- `_execute(...(params ?? []))` — spread params (or empty if nullish).

- [ ] **Step 5: Verify the file looks correct after edits**

Read the full file to confirm all changes are consistent.

- [ ] **Step 6: Run existing tests to confirm no regressions**

```bash
cd /Users/tutu/workspace/relax/packages/relax && npx jest --testPathPattern="use-request" --no-coverage
```

Expected: all 28 existing tests pass.

---

### Task 2: Add tests for `defaultParams`

**Files:**
- Modify: `packages/relax/__test__/hooks/use-request.test.ts`

**Interfaces:**
- Consumes: `useRequest` with new `defaultParams` option

- [ ] **Step 1: Add test — auto executes with `defaultParams` as array**

Add a new `describe("useRequest — defaultParams", () => { ... })` block before the closing of the file (after line 774). Insert at end of file:

```typescript
describe("useRequest — defaultParams", () => {
  it("auto executes with defaultParams as array", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result } = renderHook(() =>
      useRequest(fn, { auto: true, defaultParams: [42] }),
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 42 });
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it("auto executes with defaultParams as factory", async () => {
    const fn = jest.fn(async (id: number, name: string) => ({ id, name }));
    const { result } = renderHook(() =>
      useRequest(fn, {
        auto: true,
        defaultParams: () => [1, "alice"],
      }),
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1, name: "alice" });
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1, "alice");
  });

  it("skips auto execution when fn expects params but defaultParams is missing", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result } = renderHook(() => useRequest(fn, { auto: true }));

    // fn expects a param but none provided — should not execute
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("auto executes without params when fn takes no args (existing behavior)", async () => {
    const fn = jest.fn(async () => "no-params");
    const { result } = renderHook(() => useRequest(fn, { auto: true }));

    await waitFor(() => {
      expect(result.current.data).toBe("no-params");
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("deps change re-executes with defaultParams", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result, rerender } = renderHook(
      ({ id }) => useRequest(fn, { deps: [id], defaultParams: [id] }),
      { initialProps: { id: 1 } },
    );

    // auto is false, defaultParams is set but deps haven't changed yet
    expect(fn).toHaveBeenCalledTimes(0);

    // trigger deps change
    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("manual run does not use defaultParams", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result } = renderHook(() =>
      useRequest(fn, { defaultParams: [1] }),
    );

    await act(async () => {
      await result.current.run(99);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(99);
    expect(result.current.data).toEqual({ id: 99 });
  });

  it("defaultParams factory reflects latest state on deps change", async () => {
    let currentId = 0;
    const fn = jest.fn(async (id: number) => ({ id }));
    const { rerender } = renderHook(
      ({ id }) => {
        currentId = id;
        return useRequest(fn, {
          deps: [id],
          defaultParams: () => [currentId],
        });
      },
      { initialProps: { id: 1 } },
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 2 });

    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(1);
    });
    expect(fn).toHaveBeenCalledWith(2);

    rerender({ id: 3 });

    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    });
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it("defaultParams with auto and deps together", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result, rerender } = renderHook(
      ({ id }) => useRequest(fn, { auto: true, deps: [id], defaultParams: [id] }),
      { initialProps: { id: 1 } },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1 });
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(2);
  });

  it("skips deps re-execution when fn expects params but defaultParams is missing", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { rerender } = renderHook(
      ({ id }) => useRequest(fn, { deps: [id] }),
      { initialProps: { id: 1 } },
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 2 });

    // fn expects a param, no defaultParams → should not execute
    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 3 });
    expect(fn).toHaveBeenCalledTimes(0);
  });
});
```

- [ ] **Step 2: Run the new tests to verify they pass**

```bash
cd /Users/tutu/workspace/relax/packages/relax && npx jest --testPathPattern="use-request" --no-coverage
```

Expected: all 28 existing + 9 new tests pass.

- [ ] **Step 3: Run the full test suite**

```bash
cd /Users/tutu/workspace/relax/packages/relax && npx jest --no-coverage
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/relax/src/hooks/use-request.ts packages/relax/__test__/hooks/use-request.test.ts
git commit -m "feat(use-request): add defaultParams option for auto and deps-driven execution"
```
