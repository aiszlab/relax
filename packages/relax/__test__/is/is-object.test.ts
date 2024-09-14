import { isObject } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("isObject", () => {
  it("check null", () => {
    expect(isObject(null)).toBeFalsy();
  });

  it("check string", () => {
    expect(isObject("string")).toBeFalsy();
  });

  it("check number", () => {
    expect(isObject(0)).toBeFalsy();
  });

  it("check boolean", () => {
    expect(isObject(true)).toBeFalsy();
  });

  it("check array", () => {
    expect(isObject([0])).toBeTruthy();
  });

  it("check object", () => {
    expect(isObject({})).toBeTruthy();
  });

  it("check promise", () => {
    expect(isObject(Promise.resolve())).toBeTruthy();
  });
});
