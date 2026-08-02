import { toFunction } from "../../src";

describe("`toFunction` util", () => {
  it("returns the same function when value is a function", () => {
    const fn = () => 42;
    expect(toFunction(fn)).toBe(fn);
  });

  it("wraps non-function value in a getter", () => {
    const getter = toFunction(42);
    expect(typeof getter === "function").toBeTruthy();
    expect(getter()).toBe(42);
  });

  it("handles string value", () => {
    const getter = toFunction("hello");
    expect(getter()).toBe("hello");
  });

  it("handles null value", () => {
    const getter = toFunction(null);
    expect(getter()).toBe(null);
  });

  it("handles undefined value", () => {
    const getter = toFunction(undefined);
    expect(getter()).toBe(undefined);
  });

  it("handles array value", () => {
    const getter = toFunction([1, 2, 3]);
    expect(getter()).toEqual([1, 2, 3]);
  });

  it("handles object value", () => {
    const obj = { a: 1 };
    const getter = toFunction(obj);
    expect(getter()).toBe(obj);
  });

  it("returns the same function reference each call", () => {
    const fn = vi.fn(() => "called");
    const result = toFunction(fn);
    expect(result).toBe(fn);
    result();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("factory function: toFunction returns it as-is, caller decides when to invoke", () => {
    let current = 1;
    const factory = () => current;
    const result = toFunction(factory);

    // result is the factory itself, not wrapped
    expect(result).toBe(factory);
    expect(result()).toBe(1);

    current = 2;
    // factory reads latest value on each call
    expect(result()).toBe(2);
  });
});
