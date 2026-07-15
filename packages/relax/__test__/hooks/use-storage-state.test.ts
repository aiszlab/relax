import { renderHook, act } from "@testing-library/react";
import { useStorageState } from "../../src/hooks/use-storage-state";

describe("useStorageState", () => {
  const createMockStorage = () => {
    const store: Record<string, string> = {};
    const storage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: vi.fn((key: string) => { delete store[key]; }),
      get length() { return Object.keys(store).length; },
      key: vi.fn(),
      clear: vi.fn(),
    };
    return { storage, store };
  };

  it("returns null for non-existent key", () => {
    const { storage } = createMockStorage();
    const { result } = renderHook(() => useStorageState("test-key", storage));
    expect(result.current[0]).toBeNull();
  });

  it("sets and gets value", () => {
    const { storage } = createMockStorage();
    const { result } = renderHook(() => useStorageState("test-key", storage));

    act(() => {
      result.current[1]("hello");
    });

    expect(result.current[0]).toBe("hello");
    expect(storage.setItem).toHaveBeenCalledWith("test-key", "hello");
  });

  it("removes value when set to null", () => {
    const { storage } = createMockStorage();
    const { result } = renderHook(() => useStorageState("test-key", storage));

    act(() => {
      result.current[1]("hello");
    });
    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith("test-key");
  });

  it("can run with listen disabled", () => {
    const { storage } = createMockStorage();
    const { result } = renderHook(() =>
      useStorageState("test-key", storage, { listen: false }),
    );

    expect(result.current[0]).toBeNull();
    act(() => {
      result.current[1]("data");
    });
    expect(result.current[0]).toBe("data");
  });

  it("handles storage event via window localStorage", () => {
    const key = "storage-evt-key-1";
    localStorage.removeItem(key);

    const { result } = renderHook(() =>
      useStorageState(key, localStorage, { listen: true }),
    );

    expect(result.current[0]).toBeNull();

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: "from-event",
          storageArea: localStorage,
        }),
      );
    });

    expect(result.current[0]).toBe("from-event");
  });

  it("ignores storage event with different key", () => {
    const key = "storage-evt-key-2";
    localStorage.removeItem(key);

    const { result } = renderHook(() =>
      useStorageState(key, localStorage, { listen: true }),
    );

    act(() => {
      result.current[1]("my-value");
    });

    // Dispatch event with different key — should be ignored
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "different-key",
          newValue: "should-not-update",
          storageArea: localStorage,
        }),
      );
    });

    expect(result.current[0]).toBe("my-value");
  });

  it("ignores storage event with different storage", () => {
    const key = "storage-evt-key-3";
    localStorage.removeItem(key);

    const { result } = renderHook(() =>
      useStorageState(key, localStorage, { listen: true }),
    );

    act(() => {
      result.current[1]("my-value");
    });

    // Dispatch event with same key but different storage (sessionStorage)
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: "should-not-update",
          storageArea: sessionStorage,
        }),
      );
    });

    expect(result.current[0]).toBe("my-value");
  });
});
