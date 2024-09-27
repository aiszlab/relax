import { throttle } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";

describe("`throttle` util", () => {
  it("throttle callback", () => {
    jest.useFakeTimers();
    const fn = jest.fn();

    const { next: throttled } = throttle((value: string) => {
      fn();
      return value;
    }, 32);

    throttled("0");
    throttled("1");
    throttled("2");

    expect(fn).toBeCalledTimes(1);
    jest.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(1);

    throttled("3");
    throttled("4");
    throttled("5");

    expect(fn).toBeCalledTimes(2);
    jest.runOnlyPendingTimers();
    expect(fn).toBeCalledTimes(2);
  });

  it("timer could be completed by flush or cancel by abort", () => {
    const _callback = jest.fn();
    const _pipe = jest.fn();

    const { next, flush, abort } = throttle(
      {
        callback: (value: string) => {
          _callback();
          return value;
        },
        pipe: (value: string) => {
          _pipe();
          return [value] as const;
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
