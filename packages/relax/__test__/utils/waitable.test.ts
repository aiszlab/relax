import { Waitable } from "../../src/utils/waitable";
import { debounceTime, throttleTime } from "rxjs";

describe("`Waitable`", () => {
  it("creates a waitable instance", () => {
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: debounceTime(100),
    });

    expect(waiter).toBeInstanceOf(Waitable);
  });

  it("calls callback after debounce", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: debounceTime(100),
    });

    waiter.next("a");
    waiter.next("b");
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("b");
  });

  it("calls callback with pipe transformation", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const pipe = vi.fn((value: string) => value.toUpperCase());
    const waiter = new Waitable<string[], string>({
      callback,
      pipe,
      timer: debounceTime(100),
    });

    waiter.next("hello");
    expect(pipe).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(pipe).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("HELLO");
  });

  it("flush triggers callback immediately", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: debounceTime(1000),
    });

    waiter.next("x");
    expect(callback).not.toHaveBeenCalled();

    waiter.flush();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("abort cancels pending callbacks", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: debounceTime(100),
    });

    waiter.next("x");
    waiter.abort();

    vi.advanceTimersByTime(200);
    expect(callback).not.toHaveBeenCalled();
  });

  it("can receive more values after abort", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: debounceTime(100),
    });

    waiter.next("old");
    waiter.abort();
    vi.advanceTimersByTime(200);

    waiter.next("new");
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("new");
  });

  it("can receive more values after flush", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: debounceTime(100),
    });

    waiter.next("batch1");
    waiter.flush();
    expect(callback).toHaveBeenCalledTimes(1);

    waiter.next("batch2");
    vi.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("works with throttleTime", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const waiter = new Waitable({
      callback,
      pipe: undefined,
      timer: throttleTime(100, undefined, { leading: true, trailing: true }),
    });

    waiter.next("first");
    // throttleTime with leading:true passes through immediately
    expect(callback).toHaveBeenCalledTimes(1);

    waiter.next("second");
    // second should be throttled (not emitted immediately)
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    // After throttle period, trailing value emits
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("handle pipe returning promise", async () => {
    vi.useRealTimers();
    const callback = vi.fn();
    const pipe = (value: number) => Promise.resolve(value * 2);
    const waiter = new Waitable<number[], number>({
      callback,
      pipe,
      timer: debounceTime(10),
    });

    waiter.next(5);

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(10);
  });
});
