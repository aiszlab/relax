import { isStyleElement } from "../../src";

describe("`isStyleElement`", () => {
  it("returns true for style element", () => {
    const style = document.createElement("style");
    expect(isStyleElement(style)).toBe(true);
  });

  it("returns false for non-style element", () => {
    const div = document.createElement("div");
    expect(isStyleElement(div)).toBe(false);
  });

  it("returns false for non-style element types", () => {
    const span = document.createElement("span");
    expect(isStyleElement(span)).toBe(false);

    const link = document.createElement("link");
    expect(isStyleElement(link)).toBe(false);
  });
});
