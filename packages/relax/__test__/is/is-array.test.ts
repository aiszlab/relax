import { isArray } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("isArray", () => {
  it("check null", () => {
    expect(isArray(null)).toBeFalsy();
  });

  it("check string", () => {
    expect(isArray("string")).toBeFalsy();
  });

  it("check number", () => {
    expect(isArray(0)).toBeFalsy();
  });

  it("check boolean", () => {
    expect(isArray(true)).toBeFalsy();
  });

  it("check array", () => {
    expect(isArray([0])).toBeTruthy();
  });

  it("check object", () => {
    expect(isArray({})).toBeFalsy();
  });

  it("check promise", () => {
    expect(isArray(Promise.resolve())).toBeFalsy();
  });
});
