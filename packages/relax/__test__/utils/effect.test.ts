import { effect } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`effect` util", () => {
  it("call effect", () => {
    expect(effect(async () => () => {})).toBe(void 0);
    expect(typeof effect(() => () => {}) === "function").toBeTruthy();
  });
});
