import { normalize } from "../../src/class-name/normalize";

describe("`normalize` util", () => {
  it("deduplicates class names", () => {
    expect(normalize("a", "a", "b")).toEqual(["a", "b"]);
  });

  it("splits whitespace-separated classes", () => {
    expect(normalize("a b c")).toEqual(["a", "b", "c"]);
  });

  it("filters out non-string values", () => {
    expect(normalize("a", undefined, "b", null)).toEqual(["a", "b"]);
  });

  it("handles extra whitespace", () => {
    expect(normalize("a  b   c")).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for no valid classes", () => {
    expect(normalize(undefined, null)).toEqual([]);
  });

  it("handles mixed whitespace and duplicates", () => {
    expect(normalize("a b", "b c", "c d")).toEqual(["a", "b", "c", "d"]);
  });
});
