import { isDeepKey } from "../../src";

describe("`isDeepKey` util", () => {
  it("dot notation returns true", () => {
    expect(isDeepKey("a.b")).toBe(true);
    expect(isDeepKey("a.b.c")).toBe(true);
  });

  it("bracket notation returns true", () => {
    expect(isDeepKey("a[b]")).toBe(true);
    expect(isDeepKey("a[b][c]")).toBe(true);
  });

  it("simple key returns false", () => {
    expect(isDeepKey("a")).toBe(false);
    expect(isDeepKey("abc")).toBe(false);
  });

  it("number key returns false", () => {
    expect(isDeepKey(123)).toBe(false);
    expect(isDeepKey(0)).toBe(false);
  });

  it("symbol key returns false", () => {
    expect(isDeepKey(Symbol("test"))).toBe(false);
  });

  it("empty string returns false", () => {
    expect(isDeepKey("")).toBe(false);
  });

  it("boolean returns false", () => {
    expect(isDeepKey(true as unknown as PropertyKey)).toBe(false);
  });

  it("bigint returns false", () => {
    expect(isDeepKey(BigInt(1) as unknown as PropertyKey)).toBe(false);
  });
});
