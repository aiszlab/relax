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

  it("array value", () => {
    const array = [1, 2, { value: "3" }];
    const _cloned = clone(array);

    expect(_cloned).not.toBe(array);
    expect(_cloned).toEqual(array);
    expect(_cloned[2]).not.toBe(array[2]);
    expect(_cloned[2]).toEqual(array[2]);
  });

  it("map value", () => {
    const map = new Map([
      ["key1", "value1"],
      ["key2", "value2"],
    ]);

    const _cloned = clone(map);
    expect(_cloned).not.toBe(map);
    expect(_cloned).toEqual(map);
  });

  it("set value", () => {
    const set = new Set([1, 2, 3]);
    const _cloned = clone(set);

    expect(_cloned).not.toBe(set);
    expect(_cloned).toEqual(set);
  });
});
