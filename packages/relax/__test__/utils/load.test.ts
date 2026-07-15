import { load } from "../../src";

describe("`load`", () => {
  it("load script returns a promise", () => {
    const result = load("script", "https://example.com/script.js");
    expect(result).toBeInstanceOf(Promise);
  });

  it("load link returns a promise", () => {
    const result = load("link", "https://example.com/style.css");
    expect(result).toBeInstanceOf(Promise);
  });

  it("unknown type returns resolved promise", async () => {
    const result = await load("invalid" as "script", "https://example.com/test.js");
    expect(result).toBeUndefined();
  });

  it("load script with defer option", () => {
    const result = load("script", "https://example.com/script.js", { defer: true });
    expect(result).toBeInstanceOf(Promise);
  });

  it("load script appends script element to head", () => {
    load("script", "https://example.com/script.js");
    const script = document.head.querySelector('script[src="https://example.com/script.js"]');
    expect(script).not.toBeNull();
  });

  it("load link appends link element to head", () => {
    load("link", "https://example.com/style.css");
    const link = document.head.querySelector('link[href="https://example.com/style.css"]');
    expect(link).not.toBeNull();
  });

  it("script element has correct attributes", () => {
    load("script", "https://example.com/test.js");
    const script = document.head.querySelector(
      'script[src="https://example.com/test.js"]',
    ) as HTMLScriptElement;
    expect(script).not.toBeNull();
    expect(script.async).toBe(true);
    expect(script.crossOrigin).toBe("anonymous");
    expect(script.defer).toBe(false);
  });

  it("script element with defer option", () => {
    load("script", "https://example.com/defer.js", { defer: true });
    const script = document.head.querySelector(
      'script[src="https://example.com/defer.js"]',
    ) as HTMLScriptElement;
    expect(script.defer).toBe(true);
  });

  it("script resolves on load event", async () => {
    const promise = load("script", "https://example.com/load-script.js");
    const script = document.head.querySelector(
      'script[src="https://example.com/load-script.js"]',
    ) as HTMLScriptElement;
    expect(script).not.toBeNull();

    // Dispatch load event
    script.dispatchEvent(new Event("load"));

    await expect(promise).resolves.toBeUndefined();
  });

  it("script rejects on error event", async () => {
    const promise = load("script", "https://example.com/error-script.js");
    const script = document.head.querySelector(
      'script[src="https://example.com/error-script.js"]',
    ) as HTMLScriptElement;
    expect(script).not.toBeNull();

    // Dispatch error event
    script.dispatchEvent(new Event("error"));

    await expect(promise).rejects.toBeUndefined();
  });

  it("link resolves on load event", async () => {
    const promise = load("link", "https://example.com/load-link.css");
    const link = document.head.querySelector(
      'link[href="https://example.com/load-link.css"]',
    ) as HTMLLinkElement;
    expect(link).not.toBeNull();

    link.dispatchEvent(new Event("load"));

    await expect(promise).resolves.toBeUndefined();
  });

  it("link rejects on error event", async () => {
    const promise = load("link", "https://example.com/error-link.css");
    const link = document.head.querySelector(
      'link[href="https://example.com/error-link.css"]',
    ) as HTMLLinkElement;
    expect(link).not.toBeNull();

    link.dispatchEvent(new Event("error"));

    await expect(promise).rejects.toBeUndefined();
  });
});
