import { toKey } from "../../src/utils/to-key";

describe("`toKey` util", () => {
  it("string returns as-is", () => {
    expect(toKey("hello")).toBe("hello");
    expect(toKey("")).toBe("");
  });

  it("symbol returns as-is", () => {
    const sym = Symbol("test");
    expect(toKey(sym)).toBe(sym);
  });

  it("negative zero returns '-0'", () => {
    expect(toKey(-0)).toBe("-0");
  });

  it("number converts to string", () => {
    expect(toKey(0)).toBe("0");
    expect(toKey(123)).toBe("123");
    expect(toKey(-1)).toBe("-1");
  });

  it("other values convert to string", () => {
    expect(toKey(true)).toBe("true");
    expect(toKey(false)).toBe("false");
    expect(toKey(null)).toBe("null");
    expect(toKey(undefined)).toBe("undefined");
  });

  it("object with valueOf returning -0", () => {
    const obj = { valueOf: () => -0 };
    expect(toKey(obj)).toBe("-0");
  });
});
