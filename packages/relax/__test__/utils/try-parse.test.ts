import { tryParse } from "../../src";

describe("`tryParse` util", () => {
  it("parse valid JSON string", () => {
    expect(tryParse('{"a":1}')).toEqual({ a: 1 });
    expect(tryParse("[1,2,3]")).toEqual([1, 2, 3]);
    expect(tryParse('"hello"')).toBe("hello");
    expect(tryParse("123")).toBe(123);
    expect(tryParse("true")).toBe(true);
    expect(tryParse("null")).toBe(null);
  });

  it("return original for invalid JSON", () => {
    expect(tryParse("not json")).toBe("not json");
    expect(tryParse("{invalid}")).toBe("{invalid}");
  });

  it("return non-string as-is", () => {
    expect(tryParse(123)).toBe(123);
    expect(tryParse(null)).toBe(null);
    expect(tryParse(undefined)).toBe(undefined);
    expect(tryParse({ a: 1 })).toEqual({ a: 1 });
    expect(tryParse(true)).toBe(true);
  });
});
