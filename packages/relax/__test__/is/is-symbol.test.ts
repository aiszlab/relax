import { isSymbol } from "../../src/is/is-symbol";

describe("`isSymbol` util", () => {
  it("symbol value", () => {
    expect(isSymbol(Symbol.iterator)).toBe(true);
    expect(isSymbol(Symbol("test"))).toBe(true);
  });

  it("non-symbol value", () => {
    expect(isSymbol("abc")).toBe(false);
    expect(isSymbol(123)).toBe(false);
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
    expect(isSymbol({})).toBe(false);
    expect(isSymbol([])).toBe(false);
    expect(isSymbol(true)).toBe(false);
  });

  it("Symbol instance", () => {
    expect(isSymbol(Object(Symbol("test")))).toBe(true);
  });
});
