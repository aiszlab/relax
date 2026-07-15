import { pick } from "../../src";

describe("`pick` util", () => {
  it("pick specified keys from object", () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("pick nested value by simple key", () => {
    const obj = { a: { b: { c: 3 } } };
    expect(pick(obj, ["a"])).toEqual({ a: { b: { c: 3 } } });
  });

  it("return empty object for no keys", () => {
    const obj = { a: 1 };
    expect(pick(obj, [])).toEqual({});
  });

  it("pick non-existent keys returns undefined", () => {
    const obj = { a: 1 } as Record<string, unknown>;
    expect(pick(obj, ["b"])).toEqual({ b: undefined });
  });
});
