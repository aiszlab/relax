import { renderHook } from "@testing-library/react";
import { useMounted } from "../../src";

describe("useMount", () => {
  it("mounted", async () => {
    const fn = vi.fn<VoidFunction>();
    const hook = renderHook(() => useMounted(fn));
    expect(fn).toHaveBeenCalledTimes(1);
    hook.rerender();
    expect(fn).toHaveBeenCalledTimes(1);
    hook.unmount();
    expect(fn).toHaveBeenCalledTimes(1);

    renderHook(() => useMounted(fn)).unmount();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("unmounted", () => {
    const runner = vi.fn();
    const cleaner = vi.fn<VoidFunction>();
    const hook = renderHook(() =>
      useMounted(() => {
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

  it("async unmounted", () => {
    const runner = vi.fn();
    const cleaner = vi.fn<VoidFunction>();
    const hook = renderHook(() =>
      useMounted(async () => {
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
