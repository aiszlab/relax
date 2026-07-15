import { renderHook } from "@testing-library/react";
import { useUnmount } from "../../src";

describe("useMount", () => {
  it("unmount", () => {
    const runner = vi.fn();
    const hook = renderHook(() =>
      useUnmount(() => {
        runner();
      }),
    );

    expect(runner).toHaveBeenCalledTimes(0);
    hook.unmount();
    expect(runner).toHaveBeenCalledTimes(1);
  });
});
