import { toPaths } from "../../src/utils/to-paths";

describe("`toPaths` util", () => {
  it("dot notation", () => {
    expect(toPaths("a.b.c")).toEqual(["a", "b", "c"]);
  });

  it("bracket notation", () => {
    expect(toPaths("a[b][c]")).toEqual(["a", "b", "c"]);
  });

  it("leading dot", () => {
    expect(toPaths(".a.b.c")).toEqual(["", "a", "b", "c"]);
  });

  it("quoted keys in brackets", () => {
    expect(toPaths('a["b.c"].d')).toEqual(["a", "b.c", "d"]);
  });

  it("empty string", () => {
    expect(toPaths("")).toEqual([]);
  });

  it("complex path", () => {
    expect(toPaths('.a[b].c.d[e]["f.g"].h')).toEqual([
      "",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f.g",
      "h",
    ]);
  });

  it("single key", () => {
    expect(toPaths("a")).toEqual(["a"]);
  });

  it("escaped character in quotes", () => {
    expect(toPaths('a["b\\"c"]')).toEqual(["a", 'b"c']);
  });

  it("single quotes in brackets", () => {
    expect(toPaths("a['b.c']")).toEqual(["a", "b.c"]);
  });

  it("num key in brackets", () => {
    expect(toPaths("a[0][1]")).toEqual(["a", "0", "1"]);
  });

  it("bracket without preceding key", () => {
    expect(toPaths("[0][1]")).toEqual(["0", "1"]);
  });
});
