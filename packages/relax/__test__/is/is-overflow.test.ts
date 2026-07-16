import { isOverflow } from "../../src";

describe("isOverflow", () => {
  it("returns false for empty body by default", () => {
    expect(isOverflow()).toBe(false);
  });

  it("detects overflow on custom element", () => {
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "auto";

    const child = document.createElement("div");
    child.style.width = "200px";
    child.style.height = "200px";
    div.appendChild(child);

    document.body.appendChild(div);

    expect(isOverflow(div)).toBe(div.scrollHeight > div.clientHeight);

    document.body.removeChild(div);
  });

  it("returns false for non-overflowing element", () => {
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";

    const child = document.createElement("div");
    child.style.width = "50px";
    child.style.height = "50px";
    div.appendChild(child);

    document.body.appendChild(div);

    expect(isOverflow(div)).toBe(false);

    document.body.removeChild(div);
  });

  it("detects body overflow when body is scrollable and narrower than window", () => {
    // To hit the body-specific path (line 8) truthy branch:
    // scrollHeight > clientHeight AND innerWidth > offsetWidth
    const tallContent = document.createElement("div");
    tallContent.style.height = "10000px";
    document.body.appendChild(tallContent);

    // Mock offsetWidth to be smaller than innerWidth
    Object.defineProperty(document.body, "offsetWidth", {
      configurable: true,
      value: 100,
    });

    // Ensure scrollHeight exceeds viewport height
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 10000,
    });

    expect(isOverflow(document.body)).toBe(true);

    document.body.removeChild(tallContent);
  });

  it("returns false for body when vertically overflowing but not narrower than window", () => {
    // scrollHeight > innerHeight is TRUE, but innerWidth > offsetWidth is FALSE
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 10000,
    });

    // offsetWidth >= innerWidth means body is NOT narrower than window
    Object.defineProperty(document.body, "offsetWidth", {
      configurable: true,
      value: window.innerWidth + 100,
    });

    expect(isOverflow(document.body)).toBe(false);
  });

  it("falls back to documentElement.clientHeight when innerHeight is falsy", () => {
    const originalInnerHeight = window.innerHeight;

    // Set innerHeight to 0 (falsy), triggering the || fallback
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 0,
    });

    // Ensure scrollHeight exceeds clientHeight so we exercise the full expression
    Object.defineProperty(document.body, "scrollHeight", {
      configurable: true,
      value: 10000,
    });

    Object.defineProperty(document.body, "offsetWidth", {
      configurable: true,
      value: 100,
    });

    expect(isOverflow(document.body)).toBe(true);

    // Restore
    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: originalInnerHeight,
    });
  });
});
