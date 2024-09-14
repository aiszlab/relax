/**
 * @jest-environment jsdom
 */

import { isHTMLElement } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("isHTMLElement", () => {
  it("check null", () => {
    expect(isHTMLElement(null)).toBeFalsy();
  });

  it("check string", () => {
    expect(isHTMLElement("string")).toBeFalsy();
  });

  it("check number", () => {
    expect(isHTMLElement(0)).toBeFalsy();
  });

  it("check boolean", () => {
    expect(isHTMLElement(true)).toBeFalsy();
  });

  it("check array", () => {
    expect(isHTMLElement([0])).toBeFalsy();
  });

  it("check object", () => {
    expect(isHTMLElement({})).toBeFalsy();
  });

  it("check promise", () => {
    expect(isHTMLElement(Promise.resolve())).toBeFalsy();
  });

  it("check function", () => {
    expect(isHTMLElement(() => {})).toBeFalsy();
  });

  it("check html element", () => {
    expect(isHTMLElement(document.createElement("div"))).toBeTruthy();
  });
});
