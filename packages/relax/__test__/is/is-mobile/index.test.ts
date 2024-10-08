/**
 * @jest-environment jsdom
 */

import { isMobile } from "../../../src";
import { describe, expect, it } from "@jest/globals";

describe("`isMobile`", () => {
  it("normal browser environment", () => {
    expect(isMobile()).toBe(false);
  });

  it("mobile environment", () => {
    Object.defineProperty(window.navigator, "userAgent", { value: "iPhone" });
    expect(isMobile()).toBe(true);
  });

  it("mock mobile userAgent", () => {
    Object.defineProperty(globalThis, "navigator", { value: { userAgent: "iPhone" } });
    expect(isMobile()).toBe(true);
  });

  it("mock mobile vendor", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: { userAgent: undefined, vendor: "iPhone" },
    });
    expect(isMobile()).toBe(true);
  });

  it("mock mobile empty ua", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {},
    });
    expect(isMobile()).toBe(false);
  });
});
