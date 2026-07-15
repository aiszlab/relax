import { renderHook } from "@testing-library/react";
import { useAsyncEffect } from "../../src";

describe("useAsyncEffect", () => {
  it("runs async effect", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    renderHook(() => useAsyncEffect(fn, []));

    // Wait for the promise to resolve
    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
  });

  it("runs effect when deps change", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const { rerender } = renderHook(({ dep }) => useAsyncEffect(fn, [dep]), {
      initialProps: { dep: 1 },
    });

    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(1));

    rerender({ dep: 2 });
    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
  });
});
