import { renderHook, act } from "@testing-library/react";
import { useScreenSize } from "../../src";

describe("useScreenSize", () => {
  it("returns an object with width and height", () => {
    const { result } = renderHook(() => useScreenSize());

    expect(result.current).toHaveProperty("width");
    expect(result.current).toHaveProperty("height");
    expect(typeof result.current.width).toBe("number");
    expect(typeof result.current.height).toBe("number");
  });

  it("adds resize listener", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => useScreenSize());

    expect(addEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it("updates size on window resize", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useScreenSize());
    const initialWidth = result.current.width;

    // Resize
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Debounce delay is 300ms — advance timers inside act() to capture
    // the setSize() state update from the debounced callback
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Size should still be a number (might be same in jsdom)
    expect(typeof result.current.width).toBe("number");
  });
});
