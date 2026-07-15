import { set } from "../../src";

describe("`set` util", () => {
  it("set simple property", () => {
    const obj = { a: 1 };
    set(obj, "a", 2);
    expect(obj.a).toBe(2);
  });

  it("set nested property via dot path", () => {
    const obj = { a: { b: { c: 3 } } };
    set(obj, "a.b.c", 4);
    expect(obj.a.b.c).toBe(4);
  });

  it("create non-existent nested path", () => {
    const obj = {} as Record<string, unknown>;
    set(obj, "a.b.c", 4);
    expect(obj).toEqual({ a: { b: { c: 4 } } });
  });

  it("set via array path", () => {
    const obj = { a: { b: { c: 3 } } };
    set(obj, ["a", "b", "c"], 4);
    expect(obj.a.b.c).toBe(4);
  });

  it("returns the modified object", () => {
    const obj = { a: 1 };
    const result = set(obj, "a", 2);
    expect(result).toBe(obj);
  });

  it("set bracket notation path", () => {
    const obj = {} as Record<string, unknown>;
    set(obj, "a[0].b", 42);
    expect(obj).toEqual({ a: [{ b: 42 }] });
  });

  it("set array index", () => {
    const obj = [1, 2, 3] as unknown as object;
    set(obj, 1, 99);
    expect(obj).toEqual([1, 99, 3]);
  });
});
