import { describe, expect, it } from "@jest/globals";
import { stringify } from "../../src/class-name";

describe("stringify", () => {
  it("should return empty string when no arguments are passed", () => {
    expect(stringify()).toBe("");
  });

  it("should return empty string when null or undefined are passed", () => {
    expect(stringify(null, undefined)).toBe("");
  });

  it("should return the same string when a single string argument is passed", () => {
    expect(stringify("foo")).toBe("foo");
  });

  it("should return the same string when a single object argument with a single key is passed", () => {
    expect(stringify({ foo: true })).toBe("foo");
  });

  it("should return the same string when a single object argument with a single key and a value of `false` is passed", () => {
    expect(stringify({ foo: false })).toBe("");
  });

  it("should return the same string when a single object argument with multiple keys and values is passed", () => {
    expect(stringify({ foo: true, bar: false })).toBe("foo");
  });

  it("should return the same string when a single object argument with multiple keys and values is passed", () => {
    expect(stringify({ foo: true, bar: true })).toBe("foo bar");
  });

  it("should concat array string", () => {
    expect(stringify("foo", "bar")).toBe("foo bar");
    expect(stringify("foo", ["bar"])).toBe("foo bar");
    expect(stringify(["foo"], "bar", "bar")).toBe("foo bar");
    expect(stringify(["foo"], ["bar"])).toBe("foo bar");
    expect(stringify(["foo", "bar"])).toBe("foo bar");
  });
});
