import { expect } from "@jest/globals";
import { it } from "@jest/globals";
import { describe } from "@jest/globals";
import { leaf } from "../../src/path";

describe("path.leaf", () => {
  it("return the last part of the path", () => {
    expect(leaf("foo/bar")).toBe("bar");
  });

  it("return the path itself if it is not a path", () => {
    expect(leaf("foobar")).toBe("foobar");
  });

  it("return the last part with extname", () => {
    expect(leaf("foo/bar.jpg")).toBe("bar.jpg");
  });
});
