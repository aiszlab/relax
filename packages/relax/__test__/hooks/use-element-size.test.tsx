import { renderHook, act, render } from "@testing-library/react";
import React from "react";
import { useElementSize } from "../../src";

describe("useElementSize", () => {
  it("returns ref and initial size object", () => {
    class MockResizeObserver {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    const { result } = renderHook(() => useElementSize());
    const [ref, size] = result.current;

    expect(ref).toBeDefined();
    expect(ref.current).toBeNull();
    expect(size).toEqual({ width: 0, height: 0 });
  });

  it("disconnects ResizeObserver on unmount", () => {
    const disconnectMock = vi.fn();
    class MockResizeObserver {
      observe = vi.fn();
      disconnect = disconnectMock;
      unobserve = vi.fn();
      constructor(_callback: ResizeObserverCallback) {}
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    const { unmount } = renderHook(() => useElementSize());
    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it("creates ResizeObserver with callback that handles entries", () => {
    vi.useFakeTimers();
    let storedCallback: ResizeObserverCallback | null = null;
    class MockResizeObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(callback: ResizeObserverCallback) {
        storedCallback = callback;
      }
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    renderHook(() => useElementSize());

    expect(storedCallback).not.toBeNull();

    act(() => {
      storedCallback!(
        [
          { contentRect: { width: 800, height: 600 } } as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      );
    });

    // Also test with entry without contentRect to cover ?? {} fallback (line 30)
    act(() => {
      storedCallback!(
        [{} as ResizeObserverEntry],
        {} as ResizeObserver,
      );
    });

    vi.advanceTimersByTime(100);
    vi.useRealTimers();
  });

  it("calls resizer.observe when elementRef has a current value", () => {
    const observeMock = vi.fn();
    class MockResizeObserver {
      observe = observeMock;
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(_callback: ResizeObserverCallback) {}
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    function TestComponent() {
      const [ref] = useElementSize<HTMLDivElement>();
      return <div ref={ref} data-testid="target" />;
    }

    render(<TestComponent />);

    // The ref is assigned to a real div element before the effect runs,
    // so resizer.observe should be called with that element
    expect(observeMock).toHaveBeenCalledTimes(1);
    expect(observeMock.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });
});
