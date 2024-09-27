/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "@jest/globals";
import { setStyle } from "../../src";

describe("`setStyle` util", () => {
  it("styles will be set correctly", () => {
    const target = document.createElement("div");

    setStyle(target, {
      backgroundColor: "red",
      color: "blue",
    });

    expect(target.style.backgroundColor).toBe("red");
    expect(target.style.color).toBe("blue");

    setStyle(target, {
      backgroundColor: "green",
    });

    expect(target.style.backgroundColor).toBe("green");
    expect(target.style.color).toBe("blue");
  });

  it("styles could be copied", () => {
    const target = document.createElement("div");

    setStyle(target, {
      backgroundColor: "red",
      color: "blue",
    });

    expect(target.style.backgroundColor).toBe("red");
    expect(target.style.color).toBe("blue");

    const _styles = setStyle(target, {
      backgroundColor: "green",
    });

    expect(target.style.backgroundColor).toBe("green");
    expect(target.style.color).toBe("blue");

    expect(_styles).toEqual({
      backgroundColor: "red",
    });
  });

  it("do nothing when styles is null or undefined", () => {
    const target = document.createElement("div");

    setStyle(target, null);

    expect(target.style.backgroundColor).toBe("");
  });
});
