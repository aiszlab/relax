import { isIndex } from "../../src/utils/is-index";

describe("`isIndex` util", () => {
  it("number as valid index", () => {
    expect(isIndex(0)).toBe(true);
    expect(isIndex(1)).toBe(true);
    expect(isIndex(100)).toBe(true);
  });

  it("number out of range", () => {
    expect(isIndex(-1)).toBe(false);
    expect(isIndex(1.5)).toBe(false);
    expect(isIndex(Number.MAX_SAFE_INTEGER)).toBe(false);
    expect(isIndex(10, 5)).toBe(false);
  });

  it("string as unsigned integer", () => {
    expect(isIndex("0")).toBe(true);
    expect(isIndex("123")).toBe(true);
  });

  it("string as invalid index", () => {
    expect(isIndex("-1")).toBe(false);
    expect(isIndex("01")).toBe(false);
    expect(isIndex("abc")).toBe(false);
  });

  it("symbol returns false", () => {
    expect(isIndex(Symbol("test"))).toBe(false);
  });

  it("default length check", () => {
    expect(isIndex(0)).toBe(true);
    expect(isIndex(Number.MAX_SAFE_INTEGER - 1)).toBe(true);
  });

  it("boolean returns false", () => {
    expect(isIndex(true as unknown as PropertyKey)).toBe(false);
  });

  it("bigint returns false", () => {
    expect(isIndex(BigInt(0) as unknown as PropertyKey)).toBe(false);
  });
});
