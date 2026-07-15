import { renderHook } from "@testing-library/react";
import { useScroll } from "../../src";
import { vi } from "vitest";

describe("useScroll", () => {
  it("returns a cleanup function", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useScroll(callback));
    const cleanup = result.current;

    expect(typeof cleanup).toBe("function");
  });

  it("adds scroll listener on mount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const callback = vi.fn();

    renderHook(() => useScroll(callback));

    expect(addEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it("removes scroll listener on cleanup call", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const callback = vi.fn();

    const { result } = renderHook(() => useScroll(callback));
    result.current();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it("calls callback on scroll event", () => {
    const callback = vi.fn();
    renderHook(() => useScroll(callback));

    window.dispatchEvent(new Event("scroll"));

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
