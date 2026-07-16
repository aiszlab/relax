import { isVoid } from "../../src";

describe("isVoid", () => {
  it("returns true for null", () => {
    expect(isVoid(null)).toBe(true);
  });

  it("returns true for undefined", () => {
    expect(isVoid(undefined)).toBe(true);
  });

  it("returns false for string", () => {
    expect(isVoid("hello")).toBe(false);
  });

  it("returns false for number", () => {
    expect(isVoid(0)).toBe(false);
    expect(isVoid(42)).toBe(false);
  });

  it("returns false for boolean", () => {
    expect(isVoid(false)).toBe(false);
    expect(isVoid(true)).toBe(false);
  });

  it("returns false for object", () => {
    expect(isVoid({})).toBe(false);
  });

  it("returns false for array", () => {
    expect(isVoid([])).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isVoid("")).toBe(false);
  });
});
