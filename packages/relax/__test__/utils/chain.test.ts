import { chain } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`chain` util", () => {
  it("chain value", () => {
    const value = chain(
      (v: number) => 1,
      (v: number) => v + 1,
    );

    expect(typeof value === "function").toBeTruthy();
  });
});
