import { update } from "../../src/utils/update";

describe("`update` util", () => {
  it("update simple property", () => {
    const obj = { a: 1 };
    update(obj, "a", (v) => (v as number) + 1);
    expect(obj.a).toBe(2);
  });

  it("update nested property via dot path", () => {
    const obj = { a: { b: { c: 3 } } };
    update(obj, "a.b.c", (v) => (v as number) + 1);
    expect(obj.a.b.c).toBe(4);
  });

  it("create non-existent path with object", () => {
    const obj = {} as Record<string, unknown>;
    update(obj, "a.b.c", () => 4);
    expect(obj).toEqual({ a: { b: { c: 4 } } });
  });

  it("return target for null/undefined", () => {
    expect(update(null, "a", () => 1)).toBeNull();
    expect(update(undefined, "a", () => 1)).toBeUndefined();
  });

  it("update via array path", () => {
    const obj = { a: { b: { c: 3 } } };
    update(obj, ["a", "b", "c"], (v) => (v as number) * 2);
    expect(obj.a.b.c).toBe(6);
  });

  it("create array for numeric index path segment", () => {
    const obj = {} as Record<string, unknown>;
    update(obj, "items[0].name", () => "hello");
    expect(obj).toEqual({ items: [{ name: "hello" }] });
  });

  it("update with bracket notation deep path", () => {
    const obj = { a: { b: 1 } };
    update(obj, "a[b]", (v) => (v as number) + 1);
    expect(obj.a.b).toBe(2);
  });

  it("update with numeric key in path", () => {
    const obj = { list: [1, 2, 3] } as Record<string, unknown>;
    update(obj, "list[1]", () => 99);
    expect(obj).toEqual({ list: [1, 99, 3] });
  });

  it("returns the modified object", () => {
    const obj = { a: 1 };
    const result = update(obj, "a", (v) => (v as number) + 1);
    expect(result).toBe(obj);
  });

  it("update where intermediate value is object (preserves existing)", () => {
    const obj = { a: { b: 2, c: 3 } };
    update(obj, "a.d", () => 4);
    expect(obj).toEqual({ a: { b: 2, c: 3, d: 4 } });
  });

  it("update with non-string non-array non-key path (object path)", () => {
    // This covers line 32 falsy branch: isKey returns false (objects are not
    // plain keys), Array.isArray is false, typeof path !== "string", so the
    // code falls through to the [path] fallback.
    const obj = {} as Record<string, unknown>;
    const key = {};
    update(obj, key as any, () => "updated");
    // An object path gets converted by toKey -> String({}) -> "[object Object]"
    expect(obj["[object Object]"]).toBe("updated");
  });

  it("update with non-string non-array non-key path (object with toString)", () => {
    const obj = {} as Record<string, unknown>;
    const key = { toString: () => "custom" };
    update(obj, key as any, () => "custom-value");
    expect(obj.custom).toBe("custom-value");
  });
});
