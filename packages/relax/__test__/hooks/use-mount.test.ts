/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useMount } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";
import type { ThenableEffectCallback } from "../../src/types";

describe("useMount", () => {
  it("mount", async () => {
    const fn = jest.fn<ThenableEffectCallback>();
    const hook = renderHook(() => useMount(fn));
    expect(fn).toHaveBeenCalledTimes(1);
    hook.rerender();
    expect(fn).toHaveBeenCalledTimes(1);
    hook.unmount();
    expect(fn).toHaveBeenCalledTimes(1);

    renderHook(() => useMount(fn)).unmount();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("unmount", () => {
    const runner = jest.fn();
    const cleaner = jest.fn<VoidFunction>();
    const hook = renderHook(() =>
      useMount(() => {
        runner();
        return cleaner;
      }),
    );
    expect(runner).toHaveBeenCalledTimes(1);
    expect(cleaner).toHaveBeenCalledTimes(0);

    hook.unmount();
    expect(runner).toHaveBeenCalledTimes(1);
    expect(cleaner).toHaveBeenCalledTimes(1);
  });

  it("async unmount", () => {
    const runner = jest.fn();
    const cleaner = jest.fn<VoidFunction>();
    const hook = renderHook(() =>
      useMount(async () => {
        runner();
        return cleaner;
      }),
    );
    expect(runner).toHaveBeenCalledTimes(1);
    expect(cleaner).toHaveBeenCalledTimes(0);

    hook.unmount();
    expect(runner).toHaveBeenCalledTimes(1);
    expect(cleaner).toHaveBeenCalledTimes(0);
  });
});
