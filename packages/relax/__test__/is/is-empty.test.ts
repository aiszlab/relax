import { describe, expect, it } from "@jest/globals";
import { isEmpty } from "../../src";

describe("`isEmpty` util", () => {
  it("object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("array", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  it("undefined", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it("string", () => {
    expect(isEmpty("")).toBe(true);
  });
});
