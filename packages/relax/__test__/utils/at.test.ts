import { at } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("Util `at`", () => {
  it("Get Index Value In `String`", () => {
    const _char = at("abcdefg", 2);
    expect(_char).toBe("c");
  });

  it("Get Out Of Index Value In `String`", () => {
    const _char = at("abcdefg", 10);
    expect(_char).toBe(void 0);
  });

  it("Get Index Value In `Array`", () => {
    const _item = at([1, true, false, "test"], 3);
    expect(_item).toBe("test");
  });

  it("Get Out Of Index Value In `Array`", () => {
    const _item = at([1, true, "c"], 10);
    expect(_item).toBe(void 0);
  });

  it("Mock In Low Version", () => {
    const _items = [1, true, "c"];
    _items.at = void 0 as any;

    const _item = at(_items, 10);
    expect(_item).toBe(void 0);
  });

  it("Empty Value", () => {
    const _item = at(undefined, 10);
    expect(_item).toBe(void 0);
  });
});
