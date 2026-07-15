/**
 * @jest-environment jsdom
 */

import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { useRequest } from "../../src";
import { act } from "react";

describe("useRequest", () => {
  it("initial state", () => {
    const fn = jest.fn(async () => "data");
    const { result } = renderHook(() => useRequest(fn));

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("manual run", async () => {
    const fn = jest.fn(async () => "result");
    const { result } = renderHook(() => useRequest(fn));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.data).toBe("result");
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("auto run on mount", async () => {
    const fn = jest.fn(async () => "auto-data");
    const { result } = renderHook(() => useRequest(fn, { auto: true }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toBe("auto-data");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("error handling", async () => {
    const err = new Error("boom");
    const fn = jest.fn(async () => {
      throw err;
    });
    const { result } = renderHook(() => useRequest(fn));

    await act(async () => {
      await result.current.run();
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(err);
    expect(result.current.loading).toBe(false);
  });

  it("passes arguments through run", async () => {
    const fn = jest.fn(async (id: number, name: string) => ({ id, name }));
    const { result } = renderHook(() => useRequest(fn));

    await act(async () => {
      await result.current.run(1, "test");
    });

    expect(fn).toHaveBeenCalledWith(1, "test");
    expect(result.current.data).toEqual({ id: 1, name: "test" });
  });

  it("loading is true while request is in flight", async () => {
    let resolve: (value: string) => void;
    const promise = new Promise<string>((r) => {
      resolve = r;
    });
    const fn = jest.fn(() => promise);
    const { result } = renderHook(() => useRequest(fn));

    let promiseFromRun: Promise<void>;
    act(() => {
      promiseFromRun = result.current.run();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await act(async () => {
      resolve!("done");
      await promiseFromRun!;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("done");
  });

  it("resets error on subsequent successful run", async () => {
    const err = new Error("fail");
    let shouldFail = true;
    const fn = jest.fn(async () => {
      if (shouldFail) throw err;
      return "ok";
    });
    const { result } = renderHook(() => useRequest(fn));

    await act(async () => {
      await result.current.run();
    });
    expect(result.current.error).toBe(err);

    shouldFail = false;
    await act(async () => {
      await result.current.run();
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe("ok");
  });

  it("calls then callback on success", async () => {
    const thenFn = jest.fn();
    const fn = jest.fn(async () => "data");
    const { result } = renderHook(() => useRequest(fn, { then: thenFn }));

    await act(async () => {
      await result.current.run();
    });

    expect(thenFn).toHaveBeenCalledTimes(1);
    expect(thenFn).toHaveBeenCalledWith("data");
  });

  it("calls catch callback on error", async () => {
    const err = new Error("boom");
    const catchFn = jest.fn();
    const fn = jest.fn(async () => {
      throw err;
    });
    const { result } = renderHook(() => useRequest(fn, { catch: catchFn }));

    await act(async () => {
      await result.current.run();
    });

    expect(catchFn).toHaveBeenCalledTimes(1);
    expect(catchFn).toHaveBeenCalledWith(err);
  });

  it("calls finally callback on success", async () => {
    const finallyFn = jest.fn();
    const fn = jest.fn(async () => "ok");
    const { result } = renderHook(() => useRequest(fn, { finally: finallyFn }));

    await act(async () => {
      await result.current.run();
    });

    expect(finallyFn).toHaveBeenCalledTimes(1);
  });

  it("calls finally callback on error", async () => {
    const finallyFn = jest.fn();
    const fn = jest.fn(async () => {
      throw new Error("fail");
    });
    const { result } = renderHook(() => useRequest(fn, { finally: finallyFn }));

    await act(async () => {
      await result.current.run();
    });

    expect(finallyFn).toHaveBeenCalledTimes(1);
  });

  it("callbacks fire in order: then → finally on success", async () => {
    const order: string[] = [];
    const fn = jest.fn(async () => "data");
    const { result } = renderHook(() =>
      useRequest(fn, {
        then: () => order.push("then"),
        finally: () => order.push("finally"),
      }),
    );

    await act(async () => {
      await result.current.run();
    });

    expect(order).toEqual(["then", "finally"]);
  });

  it("callbacks fire in order: catch → finally on error", async () => {
    const order: string[] = [];
    const fn = jest.fn(async () => {
      throw new Error("fail");
    });
    const { result } = renderHook(() =>
      useRequest(fn, {
        catch: () => order.push("catch"),
        finally: () => order.push("finally"),
      }),
    );

    await act(async () => {
      await result.current.run();
    });

    expect(order).toEqual(["catch", "finally"]);
  });

  it("then receives null when request returns null", async () => {
    const thenFn = jest.fn();
    const fn = jest.fn(async () => null);
    const { result } = renderHook(() => useRequest(fn, { then: thenFn }));

    await act(async () => {
      await result.current.run();
    });

    expect(thenFn).toHaveBeenCalledTimes(1);
    expect(thenFn).toHaveBeenCalledWith(null);
  });
});

describe("useRequest — debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("coalesces calls within the wait window", async () => {
    const fn = jest.fn(async (x: number) => x);
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 300 }));

    // fire three rapid calls
    let p1: Promise<void>, p2: Promise<void>, p3: Promise<void>;
    await act(async () => {
      p1 = result.current.run(1);
      p2 = result.current.run(2);
      p3 = result.current.run(3);
    });

    // nothing should have fired yet
    expect(fn).toHaveBeenCalledTimes(0);

    // fast-forward past the wait window
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // only the last call should have executed
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
    expect(result.current.data).toBe(3);

    // the last call's promise resolves
    await expect(p3!).resolves.toBeUndefined();
  });

  it("debounce only affects manual run(), auto runs fire immediately", async () => {
    const fn = jest.fn(async () => "auto-data");
    const { result } = renderHook(() => useRequest(fn, { auto: true, debounceWait: 300 }));

    // auto request fires immediately despite debounce
    expect(fn).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.data).toBe("auto-data");
  });

  it("resolves only the promise of the actually-executed call", async () => {
    const fn = jest.fn(async (x: number) => x);
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 300 }));

    let p1: Promise<void>, p2: Promise<void>;

    await act(async () => {
      p1 = result.current.run(1);
      p2 = result.current.run(2);
    });

    expect(fn).toHaveBeenCalledTimes(0);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);

    // p2 should resolve (it's the last call that executed)
    await expect(p2!).resolves.toBeUndefined();
  });

  it("passes the latest arguments through debounce", async () => {
    const fn = jest.fn(async (id: number, name: string) => ({ id, name }));
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200 }));

    await act(async () => {
      result.current.run(1, "alice");
      result.current.run(2, "bob");
      result.current.run(3, "charlie");
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3, "charlie");
    expect(result.current.data).toEqual({ id: 3, name: "charlie" });
  });

  it("supports dynamic update of debounceWait", async () => {
    const fn = jest.fn(async (x: number) => x);
    const { result, rerender } = renderHook(({ wait }) => useRequest(fn, { debounceWait: wait }), {
      initialProps: { wait: 300 },
    });

    await act(async () => {
      result.current.run(1);
    });

    expect(fn).toHaveBeenCalledTimes(0);

    // dynamically shorten the wait
    rerender({ wait: 100 });

    await act(async () => {
      result.current.run(2);
      jest.advanceTimersByTime(100);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("handles errors within debounced execution", async () => {
    const err = new Error("debounced-fail");
    const fn = jest.fn(async () => {
      throw err;
    });
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200 }));

    await act(async () => {
      result.current.run();
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBe(err);
    expect(result.current.loading).toBe(false);
  });

  it("fires then/catch/finally callbacks in debounce mode", async () => {
    const thenFn = jest.fn();
    const finallyFn = jest.fn();
    const fn = jest.fn(async () => "ok");
    const { result } = renderHook(() =>
      useRequest(fn, {
        debounceWait: 200,
        then: thenFn,
        finally: finallyFn,
      }),
    );

    await act(async () => {
      result.current.run();
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(thenFn).toHaveBeenCalledWith("ok");
    expect(finallyFn).toHaveBeenCalledTimes(1);
  });

  it("loading stays false during debounce wait, true only during execution", async () => {
    let resolve: (value: string) => void;
    const promise = new Promise<string>((r) => {
      resolve = r;
    });
    const fn = jest.fn(() => promise);
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 300 }));

    // trigger debounced run
    await act(async () => {
      result.current.run();
    });

    // loading is still false during debounce wait
    expect(result.current.loading).toBe(false);

    // advance past the debounce wait — now the request fires
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    // loading is true while request is in flight
    expect(result.current.loading).toBe(true);

    // resolve the request
    await act(async () => {
      resolve!("done");
    });

    // loading goes back to false
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("done");
  });

  it("resolves the returned promise immediately (trigger, not execution)", async () => {
    const fn = jest.fn(async (x: number) => x);
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 300 }));

    let resolved = false;
    await act(async () => {
      const p = result.current.run(42);
      p.then(() => {
        resolved = true;
      });
    });

    // promise resolves immediately (it only triggers the debounced call)
    expect(resolved).toBe(true);

    // but the actual request has not fired yet
    expect(fn).toHaveBeenCalledTimes(0);

    // advance timers to let the debounced call execute
    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("handles sequential debounce batches", async () => {
    const fn = jest.fn(async (x: number) => x);
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200 }));

    // first batch
    await act(async () => {
      result.current.run(1);
      result.current.run(2);
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
    expect(result.current.data).toBe(2);

    // second batch (after first completed)
    await act(async () => {
      result.current.run(3);
      result.current.run(4);
    });

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(4);
    expect(result.current.data).toBe(4);
  });

  it("recovers from error on subsequent debounced run", async () => {
    const err = new Error("first-fail");
    let shouldFail = true;
    const fn = jest.fn(async (x: number) => {
      if (shouldFail) throw err;
      return x;
    });
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200 }));

    // first debounced run — fails
    await act(async () => {
      result.current.run(1);
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current.error).toBe(err);
    expect(result.current.data).toBe(null);

    // second debounced run — succeeds
    shouldFail = false;
    await act(async () => {
      result.current.run(2);
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(2);
  });

  it("calls catch callback on debounced error", async () => {
    const err = new Error("debounced-boom");
    const catchFn = jest.fn();
    const fn = jest.fn(async () => {
      throw err;
    });
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200, catch: catchFn }));

    await act(async () => {
      result.current.run();
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(catchFn).toHaveBeenCalledTimes(1);
    expect(catchFn).toHaveBeenCalledWith(err);
  });

  it("debounce with async request respects timing", async () => {
    let resolve1: (value: string) => void;
    const promise1 = new Promise<string>((r) => {
      resolve1 = r;
    });
    let resolve2: (value: string) => void;
    const promise2 = new Promise<string>((r) => {
      resolve2 = r;
    });

    let callCount = 0;
    const fn = jest.fn(async () => {
      callCount++;
      return callCount === 1 ? promise1 : promise2;
    });

    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200 }));

    // first debounced call
    await act(async () => {
      result.current.run("a");
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(true);

    // resolve first request
    await act(async () => {
      resolve1!("first");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe("first");

    // second debounced call
    await act(async () => {
      result.current.run("b");
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve2!("second");
    });

    expect(result.current.data).toBe("second");
    expect(result.current.loading).toBe(false);
  });

  it("does not coalesce calls spaced beyond the wait window", async () => {
    const fn = jest.fn(async (x: number) => x);
    const { result } = renderHook(() => useRequest(fn, { debounceWait: 200 }));

    await act(async () => {
      result.current.run(1);
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    // second call after the first has settled
    await act(async () => {
      result.current.run(2);
    });
    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(2);
    expect(result.current.data).toBe(2);
  });
});

describe("useRequest — deps", () => {
  it("re-executes when deps change", async () => {
    let currentId = 0;
    const fn = jest.fn(async () => ({ id: currentId }));
    const { result, rerender } = renderHook(
      ({ id }) => {
        currentId = id;
        return useRequest(fn, { deps: [id] });
      },
      { initialProps: { id: 1 } },
    );

    // auto is false by default — no request on initial mount
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.data).toBe(null);

    // change deps — should trigger first execution
    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });
    expect(fn).toHaveBeenCalledTimes(1);

    // change deps again — should trigger second execution
    rerender({ id: 3 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 3 });
    });
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not re-execute when deps are unchanged", async () => {
    let currentId = 0;
    const fn = jest.fn(async () => ({ id: currentId }));
    const { rerender } = renderHook(
      ({ id }) => {
        currentId = id;
        return useRequest(fn, { deps: [id] });
      },
      { initialProps: { id: 1 } },
    );

    // auto is false — no request on mount
    expect(fn).toHaveBeenCalledTimes(0);

    // first dep change triggers request
    rerender({ id: 2 });
    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(1);
    });

    // rerender with the same deps — should NOT re-execute
    rerender({ id: 2 });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("re-executes on mount when auto is true with deps", async () => {
    const fn = jest.fn(async () => "auto-data");
    const { result, rerender } = renderHook(
      ({ id }) => useRequest(fn, { auto: true, deps: [id] }),
      { initialProps: { id: 1 } },
    );

    // auto is true — request fires on mount
    await waitFor(() => {
      expect(result.current.data).toBe("auto-data");
    });
    expect(fn).toHaveBeenCalledTimes(1);

    // change deps — should re-execute
    rerender({ id: 2 });

    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  it("does not fire on mount when auto is false with deps", async () => {
    let currentId = 0;
    const fn = jest.fn(async () => ({ id: currentId }));
    const { result, rerender } = renderHook(
      ({ id }) => {
        currentId = id;
        return useRequest(fn, { deps: [id] });
      },
      { initialProps: { id: 1 } },
    );

    // auto is false — request should NOT fire on mount
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.data).toBe(null);

    // change deps — now the request fires
    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("multiple deps changes trigger multiple re-fetches", async () => {
    const fn = jest.fn(async () => "data");
    const { rerender } = renderHook(({ id }) => useRequest(fn, { deps: [id] }), {
      initialProps: { id: 1 },
    });

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 2 });
    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(1);
    });

    rerender({ id: 3 });
    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    });

    rerender({ id: 4 });
    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  it("works with debounceWait and deps together", async () => {
    jest.useFakeTimers();

    const fn = jest.fn(async () => "data");
    const { rerender } = renderHook(
      ({ id }) => useRequest(fn, { debounceWait: 300, deps: [id] }),
      { initialProps: { id: 1 } },
    );

    // auto is false — no request on mount even after debounce wait
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(fn).toHaveBeenCalledTimes(0);

    // change deps — should trigger debounced execution
    rerender({ id: 2 });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    expect(fn).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});

describe("useRequest — defaultParams", () => {
  it("auto executes with defaultParams as array", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result } = renderHook(() =>
      useRequest(fn, { auto: true, defaultParams: [42] }),
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 42 });
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it("auto executes with defaultParams as factory", async () => {
    const fn = jest.fn(async (id: number, name: string) => ({ id, name }));
    const { result } = renderHook(() =>
      useRequest(fn, {
        auto: true,
        defaultParams: () => [1, "alice"],
      }),
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1, name: "alice" });
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1, "alice");
  });

  it("skips auto execution when fn expects params but defaultParams is missing", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result } = renderHook(() => useRequest(fn, { auto: true }));

    // fn expects a param but none provided — should not execute
    expect(fn).toHaveBeenCalledTimes(0);
    expect(result.current.data).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("auto executes without params when fn takes no args (existing behavior)", async () => {
    const fn = jest.fn(async () => "no-params");
    const { result } = renderHook(() => useRequest(fn, { auto: true }));

    await waitFor(() => {
      expect(result.current.data).toBe("no-params");
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("deps change re-executes with defaultParams", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result, rerender } = renderHook(
      ({ id }) => useRequest(fn, { deps: [id], defaultParams: [id] }),
      { initialProps: { id: 1 } },
    );

    // auto is false, defaultParams is set but deps haven't changed yet
    expect(fn).toHaveBeenCalledTimes(0);

    // trigger deps change
    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(2);
  });

  it("manual run does not use defaultParams", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result } = renderHook(() =>
      useRequest(fn, { defaultParams: [1] }),
    );

    await act(async () => {
      await result.current.run(99);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(99);
    expect(result.current.data).toEqual({ id: 99 });
  });

  it("defaultParams factory reflects latest state on deps change", async () => {
    let currentId = 0;
    const fn = jest.fn(async (id: number) => ({ id }));
    const { rerender } = renderHook(
      ({ id }) => {
        currentId = id;
        return useRequest(fn, {
          deps: [id],
          defaultParams: () => [currentId],
        });
      },
      { initialProps: { id: 1 } },
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 2 });

    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(1);
    });
    expect(fn).toHaveBeenCalledWith(2);

    rerender({ id: 3 });

    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(2);
    });
    expect(fn).toHaveBeenLastCalledWith(3);
  });

  it("defaultParams with auto and deps together", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { result, rerender } = renderHook(
      ({ id }) => useRequest(fn, { auto: true, deps: [id], defaultParams: [id] }),
      { initialProps: { id: 1 } },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 1 });
    });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);

    rerender({ id: 2 });

    await waitFor(() => {
      expect(result.current.data).toEqual({ id: 2 });
    });
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(2);
  });

  it("skips deps re-execution when fn expects params but defaultParams is missing", async () => {
    const fn = jest.fn(async (id: number) => ({ id }));
    const { rerender } = renderHook(
      ({ id }) => useRequest(fn, { deps: [id] }),
      { initialProps: { id: 1 } },
    );

    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 2 });

    // fn expects a param, no defaultParams — should not execute
    expect(fn).toHaveBeenCalledTimes(0);

    rerender({ id: 3 });
    expect(fn).toHaveBeenCalledTimes(0);
  });
});
