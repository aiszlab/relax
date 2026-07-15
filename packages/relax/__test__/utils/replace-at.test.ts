import { replaceAt } from "../../src";

describe("`replaceAt` util", () => {
  it("replace element at index", () => {
    const value = replaceAt([1, 2, 3, 4, 5], 2, 10);
    expect(value).toEqual([1, 2, 10, 4, 5]);
  });

  it("replace first element", () => {
    const value = replaceAt([1, 2, 3], 0, 99);
    expect(value).toEqual([99, 2, 3]);
  });

  it("replace last element", () => {
    const value = replaceAt([1, 2, 3], 2, 99);
    expect(value).toEqual([1, 2, 99]);
  });
});
