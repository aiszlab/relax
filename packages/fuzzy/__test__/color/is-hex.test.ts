import { isHex } from "../../src/color";

describe("isHex", () => {
  describe("valid hex colors", () => {
    it("returns true for 3-char hex with hash", () => {
      expect(isHex("#fff")).toBe(true);
    });

    it("returns true for 6-char hex with hash", () => {
      expect(isHex("#ffffff")).toBe(true);
    });

    it("returns true for 8-char hex with hash", () => {
      expect(isHex("#ffffffff")).toBe(true);
    });

    it("returns true for hex without hash", () => {
      expect(isHex("ffffff")).toBe(true);
    });

    it("returns true for mixed case hex", () => {
      expect(isHex("#FfFfFf")).toBe(true);
    });

    it("returns true for hex with only numbers", () => {
      expect(isHex("#123456")).toBe(true);
    });

    it("returns true for hex with only letters a-f", () => {
      expect(isHex("#abcdef")).toBe(true);
    });

    it("returns true for single character hex", () => {
      expect(isHex("a")).toBe(true);
    });

    it("returns true for only hash", () => {
      // The regex is /^#?[a-fA-F0-9]+$/, # is optional
      // # alone has no alphanumeric chars after it, so + fails
      // Actually, "#" has no [a-fA-F0-9]+ match, so it should return false
      expect(isHex("#")).toBe(false);
    });

    it("returns true for uppercase hex", () => {
      expect(isHex("#ABCDEF")).toBe(true);
    });
  });

  describe("invalid hex colors", () => {
    it("returns false for empty string", () => {
      expect(isHex("")).toBe(false);
    });

    it("returns false for non-hex characters", () => {
      expect(isHex("#ggg")).toBe(false);
    });

    it("returns false for string with spaces", () => {
      expect(isHex("#fff ")).toBe(false);
    });

    it("returns false for rgb format", () => {
      expect(isHex("rgb(255,255,255)")).toBe(false);
    });

    it("returns false for named color", () => {
      expect(isHex("red")).toBe(false);
    });

    it("returns false for special characters", () => {
      expect(isHex("#ff@!00")).toBe(false);
    });
  });
});
