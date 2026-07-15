import { isClassComponent } from "../../src/react/is-class-component";

describe("isClassComponent", () => {
  it("returns false", () => {
    expect(isClassComponent()).toBe(false);
  });
});
