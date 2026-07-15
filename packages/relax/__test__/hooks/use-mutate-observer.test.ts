import { renderHook } from "@testing-library/react";
import { useMutateObserver } from "../../src";

describe("useMutateObserver", () => {
  it("does not create observer when elements is null", () => {
    const callback = vi.fn();
    const MutationObserverSpy = vi.fn();
    globalThis.MutationObserver = MutationObserverSpy as unknown as typeof MutationObserver;

    renderHook(() => useMutateObserver(null, callback));

    expect(MutationObserverSpy).not.toHaveBeenCalled();
  });

  it("creates MutationObserver for single element", () => {
    const callback = vi.fn();
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();
    const takeRecordsMock = vi.fn();

    class MockMutationObserver {
      observe = observeMock;
      disconnect = disconnectMock;
      takeRecords = takeRecordsMock;
      constructor(cb: MutationCallback) {}
    }
    globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

    const element = document.createElement("div");
    const { unmount } = renderHook(() => useMutateObserver(element, callback));

    expect(observeMock).toHaveBeenCalledWith(element, {
      subtree: true,
      childList: true,
      attributeFilter: ["style", "class"],
    });

    unmount();
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("creates MutationObserver for array of elements", () => {
    const callback = vi.fn();
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();
    const takeRecordsMock = vi.fn();

    class MockMutationObserver {
      observe = observeMock;
      disconnect = disconnectMock;
      takeRecords = takeRecordsMock;
      constructor(cb: MutationCallback) {}
    }
    globalThis.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

    const elements = [document.createElement("div"), document.createElement("span")];
    renderHook(() => useMutateObserver(elements, callback));

    expect(observeMock).toHaveBeenCalledTimes(2);
  });
});
