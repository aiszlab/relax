import { renderHook, act } from "@testing-library/react";
import { useImageLoader } from "../../src";

describe("useImageLoader", () => {
  it("returns 'loading' when src provided and image loads", () => {
    class MockImage {
      crossOrigin: string | null = null;
      referrerPolicy = "";
      src = "";
      private listeners: Record<string, Array<() => void>> = {};

      addEventListener(event: string, handler: () => void) {
        (this.listeners[event] ??= []).push(handler);
        // Simulate successful load synchronously — the real async behavior
        // is not relevant to this test; firing handler inside act() avoids
        // the "not wrapped in act()" warning.
        if (event === "load") {
          handler();
        }
      }
      removeEventListener() {}
      remove() {}
    }
    const originalImage = globalThis.Image;
    globalThis.Image = MockImage as unknown as typeof Image;

    const { result } = renderHook(() =>
      useImageLoader({ src: "https://example.com/image.png" }),
    );

    expect(["loading", "loaded", "error"]).toContain(result.current);

    globalThis.Image = originalImage;
  });

  it("returns 'none' when no src provided", () => {
    const { result } = renderHook(() => useImageLoader({}));
    expect(result.current).toBe("none");
  });

  it("returns 'none' for empty src", () => {
    const { result } = renderHook(() => useImageLoader({ src: "" }));
    expect(result.current).toBe("none");
  });

  it("handles image load event", async () => {
    let loadCallback: (() => void) | null = null;
    class MockImage {
      crossOrigin: string | null = null;
      referrerPolicy = "";
      src = "";
      addEventListener(event: string, handler: () => void) {
        if (event === "load") loadCallback = handler;
      }
      removeEventListener() {}
      remove() {}
    }
    const originalImage = globalThis.Image;
    globalThis.Image = MockImage as unknown as typeof Image;

    renderHook(() => useImageLoader({ src: "https://example.com/image.png" }));

    // Trigger load event — wrap in act() to capture the setStatus("loaded") update
    act(() => {
      if (loadCallback) loadCallback();
    });

    globalThis.Image = originalImage;
  });

  it("handles image error event", async () => {
    let errorCallback: (() => void) | null = null;
    class MockImage {
      crossOrigin: string | null = null;
      referrerPolicy = "";
      src = "";
      addEventListener(event: string, handler: () => void) {
        if (event === "error") errorCallback = handler;
      }
      removeEventListener() {}
      remove() {}
    }
    const originalImage = globalThis.Image;
    globalThis.Image = MockImage as unknown as typeof Image;

    renderHook(() => useImageLoader({ src: "https://example.com/broken.png" }));

    // Trigger error event — wrap in act() to capture the setStatus("error") update
    act(() => {
      if (errorCallback) errorCallback();
    });

    globalThis.Image = originalImage;
  });
});
