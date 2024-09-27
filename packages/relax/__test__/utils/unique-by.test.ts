import { describe, expect, it } from "@jest/globals";
import { unique, uniqueBy } from "../../src";

describe("`uniqueBy` util", () => {
  it("use callback to convert value to key", () => {
    expect(
      uniqueBy(
        [
          { id: 1, value: "jack" },
          { id: 1, value: "bob" },
          { id: 3, value: "tom" },
        ],
        ({ id }) => id,
      ),
    ).toEqual([
      { id: 1, value: "jack" },
      { id: 3, value: "tom" },
    ]);
  });

  it("be same as `unique` when no callback", () => {
    const _value = [1, 3, 5, 3, 5, 2, 2];
    expect(uniqueBy(_value)).toEqual(unique(_value));
  });
});
