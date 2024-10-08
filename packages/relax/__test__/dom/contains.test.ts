/**
 * @jest-environment jsdom
 */
import { describe, expect, it } from "@jest/globals";
import { contains } from "../../src/dom";

describe("dom/contains", () => {
  it("should return true if node is contained in root", () => {
    const root = document.createElement("div");
    const child = document.createElement("span");
    root.appendChild(child);
    expect(contains(root, child)).toBe(true);
  });

  it("should return false if node is not contained in root", () => {
    const root = document.createElement("div");
    const child = document.createElement("span");
    expect(contains(root, child)).toBe(false);
  });

  it("should return false if root is null", () => {
    const root = null;
    const child = document.createElement("span");
    expect(contains(root, child)).toBe(false);
  });

  it("should return false if node is null", () => {
    const root = document.createElement("div");
    const child = null;
    expect(contains(root, child)).toBe(false);
  });

  it("use custom contains if native not support", () => {
    const root = document.createElement("div");
    const parent = document.createElement("div");
    const child = document.createElement("span");
    parent.appendChild(child);
    root.appendChild(parent);

    Object.assign(root, { contains: null });

    expect(contains(root, child)).toBe(true);
  });

  it("should return false if custom contains check false", () => {
    const root = document.createElement("div");
    const child = document.createElement("span");
    Object.assign(root, { contains: null });

    expect(contains(root, child)).toBe(false);
  });

  it("should return true in node tree", () => {
    const root = document.createElement("div");
    const parent = document.createElement("div");
    const child = document.createElement("span");

    parent.appendChild(child);
    root.appendChild(parent);

    expect(contains(root, child)).toBe(true);
  });

  it("should return false if node is not support", () => {
    const root = document.createElement("div");
    expect(contains(root)).toBe(false);
  });
});
