import { renderHook } from "@testing-library/react";
import { useEventSource } from "../../src";

describe("useEventSource", () => {
  it("creates an EventSource on mount", () => {
    const closeMock = vi.fn();
    const urlSpy = vi.fn();
    class MockEventSource {
      close = closeMock;
      url: string;
      onmessage: ((ev: MessageEvent) => void) | null = null;
      onerror: ((ev: Event) => void) | null = null;
      onopen: ((ev: Event) => void) | null = null;
      readyState = 1;
      constructor(url: string) {
        this.url = url;
        urlSpy(url);
      }
    }
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource;

    renderHook(() => useEventSource("https://example.com/events"));

    expect(urlSpy).toHaveBeenCalledWith("https://example.com/events");
  });

  it("closes EventSource on unmount", () => {
    const closeMock = vi.fn();
    class MockEventSource {
      close = closeMock;
      url = "";
      onmessage = null;
      onerror = null;
      onopen = null;
      readyState = 1;
      constructor(_url: string) {}
    }
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource;

    const { unmount } = renderHook(() =>
      useEventSource("https://example.com/events"),
    );

    unmount();

    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
