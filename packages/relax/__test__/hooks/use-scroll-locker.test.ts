/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "@jest/globals";
import { isOverflow, useScrollLocker } from "../../src";

describe("`useScrollLocker`", () => {
  it("render scroll", () => {
    const root = document.createElement("div");
    root.style.height = "100px";
    root.style.width = "100px";
    root.style.overflow = "auto";
    const child = document.createElement("div");
    child.style.height = "200px";
    child.style.width = "200px";

    root.appendChild(child);
    document.body.append(root);
  });
});
