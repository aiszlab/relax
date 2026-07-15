import { renderHook } from "@testing-library/react";
import { useResize } from "../../src";

describe("useResize", () => {
  it("adds resize listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const callback = vi.fn();

    renderHook(() => useResize(callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it("calls callback on window resize", () => {
    const callback = vi.fn();
    renderHook(() => useResize(callback));

    window.dispatchEvent(new Event("resize"));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("removes listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const callback = vi.fn();

    const { unmount } = renderHook(() => useResize(callback));
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
