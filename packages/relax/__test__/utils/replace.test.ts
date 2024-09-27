import { describe, expect, it } from "@jest/globals";
import { replace } from "../../src";

describe("`replace` util", () => {
  it("repalce string", () => {
    const value = replace("hello world", {
      searchValue: "hello",
      replaceValue: "hi",
    });

    expect(value).toBe("hi world");
  });

  it("repalce array", () => {
    const value = replace(["hello", "world"], {
      index: 0,
      replaceValue: "hi",
    });

    expect(value).toEqual(["hi", "world"]);
  });
});
