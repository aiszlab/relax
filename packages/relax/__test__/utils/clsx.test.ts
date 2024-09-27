import { describe, expect, it } from "@jest/globals";
import { clsx } from "../../src";

describe("`clsx` util", () => {
  it("should return empty string when no arguments are passed", () => {
    expect(clsx()).toBe("");
  });

  it("should return empty string when null or undefined are passed", () => {
    expect(clsx(null, undefined)).toBe("");
  });

  it("should return the same string when a single string argument is passed", () => {
    expect(clsx("foo")).toBe("foo");
  });

  it("should return the same string when a single object argument with a single key is passed", () => {
    expect(clsx({ foo: true })).toBe("foo");
  });

  it("should return the same string when a single object argument with a single key and a value of `false` is passed", () => {
    expect(clsx({ foo: false })).toBe("");
  });

  it("should return the same string when a single object argument with multiple keys and values is passed", () => {
    expect(clsx({ foo: true, bar: false })).toBe("foo");
  });

  it("should return the same string when a single object argument with multiple keys and values is passed", () => {
    expect(clsx({ foo: true, bar: true })).toBe("foo bar");
  });

  it("should concat array string", () => {
    expect(clsx("foo", "bar")).toBe("foo bar");
    expect(clsx("foo", ["bar"])).toBe("foo bar");
    expect(clsx(["foo"], "bar")).toBe("foo bar");
    expect(clsx(["foo"], ["bar"])).toBe("foo bar");
    expect(clsx(["foo", "bar"])).toBe("foo bar");
  });
});
