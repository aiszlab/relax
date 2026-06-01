/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest } from "@jest/globals";
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
    const { result } = renderHook(() =>
      useRequest(fn, { then: thenFn }),
    );

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
    const { result } = renderHook(() =>
      useRequest(fn, { catch: catchFn }),
    );

    await act(async () => {
      await result.current.run();
    });

    expect(catchFn).toHaveBeenCalledTimes(1);
    expect(catchFn).toHaveBeenCalledWith(err);
  });

  it("calls finally callback on success", async () => {
    const finallyFn = jest.fn();
    const fn = jest.fn(async () => "ok");
    const { result } = renderHook(() =>
      useRequest(fn, { finally: finallyFn }),
    );

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
    const { result } = renderHook(() =>
      useRequest(fn, { finally: finallyFn }),
    );

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
    const { result } = renderHook(() =>
      useRequest(fn, { then: thenFn }),
    );

    await act(async () => {
      await result.current.run();
    });

    expect(thenFn).toHaveBeenCalledTimes(1);
    expect(thenFn).toHaveBeenCalledWith(null);
  });
});
