import { throttle } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`throttle` util", () => {
  it("throttle callback", (done) => {
    let callCount = 0;

    const { next: throttled } = throttle((value: string) => {
      callCount = callCount + 1;
      return value;
    }, 32);

    throttled("0");
    throttled("1");
    throttled("2");

    expect(callCount).toBe(1);

    setTimeout(() => {
      expect(callCount).toBe(1);

      throttled("3");
      throttled("4");
      throttled("5");

      expect(callCount).toBe(2);
    }, 128);

    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    }, 256);
  });
});
