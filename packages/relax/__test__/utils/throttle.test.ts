import { throttle } from "../../src";

describe("`throttle` util", () => {
  it("throttle callback", () => {
    vi.useFakeTimers();
    const fn = vi.fn();

    const { next: throttled } = throttle((value: string) => {
      fn();
      return value;
    }, 32);

    throttled("0");
    throttled("1");
    throttled("2");

    expect(fn).toBeCalledTimes(1);
    vi.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(1);

    throttled("3");
    throttled("4");
    throttled("5");

    expect(fn).toBeCalledTimes(2);
    vi.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(2);
  });

  it("timer could be completed by flush or cancel by abort", () => {
    const _callback = vi.fn();
    const _pipe = vi.fn();

    const { next, flush, abort } = throttle(
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

    next("0");
    expect(_pipe).toBeCalledTimes(1);
    flush();
    next("1");
    expect(_pipe).toBeCalledTimes(2);
    abort();
    next("2");
    expect(_pipe).toBeCalledTimes(3);
  });
});
