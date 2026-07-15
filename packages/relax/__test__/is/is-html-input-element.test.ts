import { isHTMLInputElement } from "../../src";

describe("isHTMLInputElement", () => {
  it("check null", () => {
    expect(isHTMLInputElement(null)).toBeFalsy();
  });

  it("check string", () => {
    expect(isHTMLInputElement("string")).toBeFalsy();
  });

  it("check number", () => {
    expect(isHTMLInputElement(0)).toBeFalsy();
  });

  it("check boolean", () => {
    expect(isHTMLInputElement(true)).toBeFalsy();
  });

  it("check array", () => {
    expect(isHTMLInputElement([0])).toBeFalsy();
  });

  it("check object", () => {
    expect(isHTMLInputElement({})).toBeFalsy();
  });

  it("check promise", () => {
    expect(isHTMLInputElement(Promise.resolve())).toBeFalsy();
  });

  it("check function", () => {
    expect(isHTMLInputElement(() => {})).toBeFalsy();
  });

  it("check html element", () => {
    expect(isHTMLInputElement(document.createElement("div"))).toBeFalsy();
  });

  it("check html input element", () => {
    expect(isHTMLInputElement(document.createElement("input"))).toBeTruthy();
  });
});
