import { clone } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`clone` util", () => {
  it("primitive value", () => {
    const number = 3;
    expect(clone(number)).toBe(number);

    const string = "string";
    expect(clone(string)).toBe(string);

    const boolean = true;
    expect(clone(boolean)).toBe(boolean);

    const symbol = Symbol("symbol");
    expect(clone(symbol)).toBe(symbol);
  });
});
