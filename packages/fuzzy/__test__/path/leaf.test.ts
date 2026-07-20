import { leaf } from "../../src/path";

describe("leaf", () => {
  describe("basic functionality", () => {
    it("returns the last part of the path", () => {
      expect(leaf("foo/bar")).toBe("bar");
    });

    it("returns the path itself if there is no slash", () => {
      expect(leaf("foobar")).toBe("foobar");
    });

    it("returns the last part with extname", () => {
      expect(leaf("foo/bar.jpg")).toBe("bar.jpg");
    });
  });

  describe("edge cases", () => {
    it("returns empty string for empty input", () => {
      expect(leaf("")).toBe("");
    });

    it("handles root path (single slash)", () => {
      expect(leaf("/")).toBe("");
    });

    it("handles path with only a slash prefix", () => {
      expect(leaf("/foo")).toBe("foo");
    });

    it("handles trailing slash", () => {
      expect(leaf("foo/bar/")).toBe("");
    });

    it("handles nested path", () => {
      expect(leaf("a/b/c/d/e")).toBe("e");
    });

    it("handles nested path with trailing slash", () => {
      expect(leaf("a/b/c/")).toBe("");
    });

    it("handles deeply nested path", () => {
      expect(leaf("very/deeply/nested/path/file.txt")).toBe("file.txt");
    });

    it("handles single character path", () => {
      expect(leaf("/a")).toBe("a");
    });

    it("handles path with consecutive slashes", () => {
      // charCodeAt(47) = '/', scanning from end finds the last slash
      expect(leaf("foo//bar")).toBe("bar");
    });

    it("handles path starting with dot", () => {
      expect(leaf("some/.hidden")).toBe(".hidden");
    });
  });
});
