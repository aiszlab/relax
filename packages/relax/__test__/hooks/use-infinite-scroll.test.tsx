import { renderHook, act, render, fireEvent } from "@testing-library/react";
import React from "react";
import { useInfiniteScroll } from "../../src";

describe("useInfiniteScroll", () => {
  it("returns sentinelRef and viewportRef", () => {
    const { result } = renderHook(() => useInfiniteScroll());

    expect(result.current.sentinelRef).toBeDefined();
    expect(result.current.viewportRef).toBeDefined();
  });

  it("does not set up observer when hasMore is false", () => {
    const onLoadMore = vi.fn();
    renderHook(() => useInfiniteScroll({ hasMore: false, onLoadMore }));
    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it("sets up IntersectionObserver when hasMore is true", () => {
    class MockIntersectionObserver {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(_callback: IntersectionObserverCallback) {}
    }
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    renderHook(() => useInfiniteScroll({ hasMore: true }));
  });

  it("accepts custom distance option", () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ hasMore: true, distance: 100 }),
    );

    expect(result.current.sentinelRef).toBeDefined();
  });

  it("sets up scroll listener on viewport when sentinel is null and triggers loadMore", () => {
    vi.useFakeTimers();
    const onLoadMore = vi.fn();

    function TestViewportOnly() {
      const { viewportRef } = useInfiniteScroll({ onLoadMore });
      return <div ref={viewportRef} data-testid="viewport" style={{ height: 200 }} />;
    }

    const { getByTestId } = render(<TestViewportOnly />);
    const viewport = getByTestId("viewport");

    // sentinelRef is never attached, so sentinelRef.current is null.
    // viewportRef is attached to a real div, so viewportRef.current is set.
    // This triggers the scroll listener path (lines 64-77).

    // Dispatch scroll event on the viewport
    fireEvent.scroll(viewport);

    // Advance timers past the 200ms debounce so the debounced callback fires
    vi.advanceTimersByTime(300);

    // onLoadMore?.() (line 48) should have been called since
    // scrollHeight - scrollTop <= clientHeight + distance by default in jsdom
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("calls loadMore via IntersectionObserver when sentinel intersects", () => {
    let observerCallback: IntersectionObserverCallback | null = null;
    const observeMock = vi.fn();
    const unobserveMock = vi.fn();
    const disconnectMock = vi.fn();

    class MockIntersectionObserver {
      observe = observeMock;
      disconnect = disconnectMock;
      unobserve = unobserveMock;
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    const onLoadMore = vi.fn();

    function TestWithSentinel() {
      const { sentinelRef, viewportRef } = useInfiniteScroll({ onLoadMore });
      return (
        <div ref={viewportRef} data-testid="viewport" style={{ height: 200, overflow: "auto" }}>
          <div ref={sentinelRef} data-testid="sentinel">
            sentinel
          </div>
          <div style={{ height: 500 }}>scroll content</div>
        </div>
      );
    }

    const { unmount } = render(<TestWithSentinel />);

    // IntersectionObserver should have been created and called observe on the sentinel
    // (lines 81-93)
    expect(observeMock).toHaveBeenCalledTimes(1);

    // Trigger the IntersectionObserver callback with an intersecting entry
    // This should call loadMore() -> onLoadMore() (line 48)
    act(() => {
      observerCallback!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    // Also test with empty entries array to cover !_element guard (line 84)
    act(() => {
      observerCallback!(
        [] as unknown as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      );
    });

    // Should still only have been called once from the previous entry
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // Cleanup on unmount should call unobserve and disconnect (lines 95-97)
    unmount();
    expect(unobserveMock).toHaveBeenCalled();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("cleans up scroll listener on unmount when sentinel is null", () => {
    vi.useFakeTimers();
    const onLoadMore = vi.fn();

    function TestViewportOnly() {
      const { viewportRef } = useInfiniteScroll({ onLoadMore });
      return <div ref={viewportRef} data-testid="viewport" style={{ height: 200 }} />;
    }

    const { unmount, getByTestId } = render(<TestViewportOnly />);
    const viewport = getByTestId("viewport");

    // Trigger a scroll first to make sure the scroll path is active
    fireEvent.scroll(viewport);
    vi.advanceTimersByTime(300);
    expect(onLoadMore).toHaveBeenCalledTimes(1);

    // Spy on removeEventListener to verify cleanup (line 76)
    const removeEventListenerSpy = vi.spyOn(viewport, "removeEventListener");

    // Unmount triggers cleanup: abort() and removeEventListener("scroll", next)
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

    removeEventListenerSpy.mockRestore();
    vi.useRealTimers();
  });

  it("does not call loadMore when scroll position is above threshold", () => {
    vi.useFakeTimers();
    const onLoadMore = vi.fn();

    function TestViewportOnly() {
      const { viewportRef } = useInfiniteScroll({ onLoadMore, distance: 0 });
      return <div ref={viewportRef} data-testid="viewport" style={{ height: 200 }} />;
    }

    const { getByTestId } = render(<TestViewportOnly />);
    const viewport = getByTestId("viewport");

    // Mock scrollHeight > scrollTop + clientHeight so the guard returns early
    Object.defineProperty(viewport, "scrollHeight", { value: 500, configurable: true });
    Object.defineProperty(viewport, "scrollTop", { value: 0, configurable: true, writable: true });
    Object.defineProperty(viewport, "clientHeight", { value: 200, configurable: true });

    // Dispatch scroll event — the guard should return early
    fireEvent.scroll(viewport);
    vi.advanceTimersByTime(300);

    // onLoadMore should NOT be called because scroll is above threshold
    expect(onLoadMore).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("does not call loadMore when IntersectionObserver entry is not intersecting", () => {
    let observerCallback: IntersectionObserverCallback | null = null;
    const observeMock = vi.fn();

    class MockIntersectionObserver {
      observe = observeMock;
      disconnect = vi.fn();
      unobserve = vi.fn();
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
    }
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    const onLoadMore = vi.fn();

    function TestWithSentinel() {
      const { sentinelRef, viewportRef } = useInfiniteScroll({ onLoadMore });
      return (
        <div ref={viewportRef} data-testid="viewport">
          <div ref={sentinelRef} data-testid="sentinel">
            sentinel
          </div>
        </div>
      );
    }

    render(<TestWithSentinel />);
    expect(observeMock).toHaveBeenCalledTimes(1);

    // Trigger callback with a non-intersecting entry
    act(() => {
      observerCallback!(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    // loadMore should NOT be called because the entry is not intersecting
    expect(onLoadMore).not.toHaveBeenCalled();
  });
});
