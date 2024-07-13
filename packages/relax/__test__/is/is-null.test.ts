import { isNull } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("isNull", () => {
  it("check null", () => {
    expect(isNull(null)).toBeTruthy();
  });

  it("check string", () => {
    expect(isNull("string")).toBeFalsy();
  });

  it("check number", () => {
    expect(isNull(0)).toBeFalsy();
  });

  it("check boolean", () => {
    expect(isNull(true)).toBeFalsy();
  });

  it("check array", () => {
    expect(isNull([0])).toBeFalsy();
  });

  it("check object", () => {
    expect(isNull({})).toBeFalsy();
  });

  it("check promise", () => {
    expect(isNull(Promise.resolve())).toBeFalsy();
  });
});
