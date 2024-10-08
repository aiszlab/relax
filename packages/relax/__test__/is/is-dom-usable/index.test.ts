/**
 * @jest-environment jsdom
 */

import { isDomUsable } from "../../../src";
import { describe, expect, it } from "@jest/globals";

describe("`isDomUsable`", () => {
  it("should return true when document is defined", () => {
    expect(isDomUsable()).toBe(true);
  });

  it("should return false when document.createElement is not valid", () => {
    Object.assign(globalThis.window.document, { createElement: null });
    expect(isDomUsable()).toBe(false);
  });
});
