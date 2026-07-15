import { debounce } from "../../src";

describe("`debounce` util", () => {
  it("debounce callback", () => {
    vi.useFakeTimers();

    const fn = vi.fn();

    const { next: debounced } = debounce((value: string) => {
      fn();
      return value;
    }, 32);

    debounced("0");
    debounced("1");
    debounced("2");
    expect(fn).toBeCalledTimes(0);

    vi.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(1);

    debounced("3");
    debounced("4");
    debounced("5");

    expect(fn).toBeCalledTimes(1);
    vi.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(2);
  });

  it("debounce pipe", () => {
    vi.useFakeTimers();

    const _pipe = vi.fn();
    const _callback = vi.fn();

    const { next: debounced } = debounce(
      {
        callback: (value: string) => {
          _callback();
          return value;
        },
        pipe: (value: string) => {
          _pipe();
          return value;
        },
      },
      32,
    );

    debounced("0");
    debounced("1");
    debounced("2");

    expect(_pipe).toBeCalledTimes(0);
    expect(_callback).toBeCalledTimes(0);
    vi.runOnlyPendingTimers();
    expect(_pipe).toBeCalledTimes(1);
    expect(_callback).toBeCalledTimes(1);

    debounced("3");
    debounced("4");
    debounced("5");

    expect(_pipe).toBeCalledTimes(1);
    expect(_callback).toBeCalledTimes(1);
    vi.runOnlyPendingTimers();
    expect(_pipe).toBeCalledTimes(2);
    expect(_callback).toBeCalledTimes(2);
  });

  it("debounce flush", () => {
    vi.useFakeTimers();
    const fn = vi.fn();

    const { flush, next } = debounce((value: string) => {
      fn();
      return value;
    }, 32);

    next("0");
    next("1");
    next("2");
    expect(fn).toBeCalledTimes(0);
    flush();
    expect(fn).toBeCalledTimes(1);
  });

  it("debounce abort", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { abort, next, flush } = debounce((value: string) => {
      fn();
      return value;
    }, 32);

    next("0");
    next("1");
    next("2");

    expect(fn).toBeCalledTimes(0);
    abort();
    expect(fn).toBeCalledTimes(0);

    vi.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(0);

    next("3");
    expect(fn).toBeCalledTimes(0);
    flush();
    expect(fn).toBeCalledTimes(1);
  });

  it("debounce promise pipe", (done) => {
    vi.useRealTimers();

    const callback = vi.fn<(value: number) => void>();
    const pipe = (value: number) => Promise.resolve(value);

    const { next } = debounce(
      {
        pipe,
        callback,
      },
      32,
    );

    next(1);
    next(2);

    setTimeout(() => {
      expect(callback).toBeCalledTimes(1);
      expect(callback).lastCalledWith(2);
      done();
    }, 100);
  });
});
