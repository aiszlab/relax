import { get } from "../../src";

describe("`get` util", () => {
  it("get value by simple key", () => {
    expect(get({ a: 1 }, "a")).toBe(1);
  });

  it("get nested value by dot path", () => {
    expect(get({ a: { b: { c: 3 } } }, "a.b.c")).toBe(3);
  });

  it("get nested value by bracket path", () => {
    expect(get({ a: { b: { c: 3 } } }, "a[b][c]")).toBe(3);
  });

  it("get nested value by array path", () => {
    expect(get({ a: { b: { c: 3 } } }, ["a", "b", "c"])).toBe(3);
  });

  it("return default value for undefined result", () => {
    expect(get({ a: 1 }, "b", "default")).toBe("default");
  });

  it("return undefined for missing key without default", () => {
    expect(get({ a: 1 }, "b")).toBeUndefined();
  });

  it("null object returns default", () => {
    expect(get(null, "a", "default")).toBe("default");
  });

  it("undefined object returns default", () => {
    expect(get(undefined, "a", "default")).toBe("default");
  });

  it("null object returns undefined without default", () => {
    expect(get(null, "a")).toBeUndefined();
  });

  it("get by numeric key", () => {
    expect(get(["a", "b", "c"], 1)).toBe("b");
  });

  it("get by symbol key", () => {
    const sym = Symbol("test");
    const obj = { [sym]: "value" };
    expect(get(obj, sym)).toBe("value");
  });

  it("get with deep path part way null", () => {
    expect(get({ a: null }, "a.b.c", "default")).toBe("default");
  });

  it("get array-path with empty path returns default", () => {
    expect(get({ a: 1 }, [], "default")).toBe("default");
  });

  it("get by tuple path [K1, K2]", () => {
    const obj = { a: { b: 2 } };
    expect(get(obj, ["a", "b"] as const)).toBe(2);
  });

  it("get by -0 number key", () => {
    const obj = { "-0": "negative zero" };
    expect(get(obj, -0)).toBe("negative zero");
  });

  it("get shallow key containing dots via array path", () => {
    expect(get({ a: { "b.c": 1 } }, ["a", "b.c"])).toBe(1);
  });

  it("get numeric index from record", () => {
    const obj: Record<number, string> = { 0: "a", 1: "b" };
    expect(get(obj, 0)).toBe("a");
  });

  it("get with undefined existing value returns undefined", () => {
    expect(get({ a: 1 }, "b")).toBeUndefined();
  });

  it("get handles deep path where intermediate is string", () => {
    expect(get({ a: "hello" }, "a.b")).toBeUndefined();
  });

  it("get with object path that converts via String()", () => {
    const pathObj = {
      toString: () => "hello",
    };
    expect(get({ hello: "world" }, pathObj as unknown as PropertyKey)).toBe("world");
  });

  it("get with object path valueOf returning -0", () => {
    const obj = { "-0": "negative zero" };
    const pathObj = {
      valueOf: () => -0,
    };
    expect(get(obj, pathObj as unknown as PropertyKey)).toBe("negative zero");
  });

  it("get numeric path where result is undefined returns default", () => {
    expect(get(["a", "b"] as unknown as object, 5 as PropertyKey, "default")).toBe("default");
  });

  it("get object-path result undefined returns default", () => {
    const pathObj = { toString: () => "nonexistent" };
    expect(get({ hello: "world" }, pathObj as unknown as PropertyKey, "default")).toBe(
      "default",
    );
  });
});
