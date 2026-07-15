import { isKey } from "../../src/is/is-key";

describe("`isKey` util", () => {
  it("simple string key", () => {
    expect(isKey("a", { a: 1 })).toBe(true);
  });

  it("deep path string is not a key", () => {
    expect(isKey("a.b", { a: { b: 2 } })).toBe(false);
  });

  it("number is a key", () => {
    expect(isKey(123)).toBe(true);
  });

  it("boolean is a key", () => {
    expect(isKey(true)).toBe(true);
    expect(isKey(false)).toBe(true);
  });

  it("null is a key", () => {
    expect(isKey(null)).toBe(true);
  });

  it("symbol is a key", () => {
    expect(isKey(Symbol("test"))).toBe(true);
  });

  it("array is not a key", () => {
    expect(isKey([1, 2])).toBe(false);
  });

  it("object is not a key", () => {
    expect(isKey({ a: 1 })).toBe(false);
  });

  it("key exists in object via Object.hasOwn", () => {
    expect(isKey("a.b", { "a.b": 1 })).toBe(true);
  });

  it("bracket notation path is not a key", () => {
    expect(isKey("a[b]", { a: { b: 1 } })).toBe(false);
  });

  it("plain word string returns true", () => {
    expect(isKey("hello")).toBe(true);
  });

  it("string with special chars (not deep) returns true", () => {
    expect(isKey("hello_world")).toBe(true);
  });
});
